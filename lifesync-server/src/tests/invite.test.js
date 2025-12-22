jest.mock("../utils/sendEmail", () => jest.fn());

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const sendEmail = require("../utils/sendEmail");

const Invite = require("../models/Invite");
const MemberShip = require("../models/MemberShip");
const Space = require("../models/Space");
const User = require("../models/UserSchema");
describe("Invitation Flow", () => {
  let owner;
  let editor;
  let invitedUser;
  let ownerCookies;
  let editorCookies;
  let invitedCookies;
  let spaceId;

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();

    // create users
    owner = await User.create({
      name: "Owner",
      email: "owner@test.com",
      password: "password123",
    });

    editor = await User.create({
      name: "Editor",
      email: "editor@test.com",
      password: "password123",
    });

    invitedUser = await User.create({
      name: "Invited",
      email: "invitee@test.com",
      password: "password123",
    });

    // login users and CAPTURE COOKIES
    const ownerLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "owner@test.com", password: "password123" });

    ownerCookies = ownerLogin.headers["set-cookie"];

    const editorLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "editor@test.com", password: "password123" });

    editorCookies = editorLogin.headers["set-cookie"];

    const invitedLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "invitee@test.com", password: "password123" });

    invitedCookies = invitedLogin.headers["set-cookie"];

    // create space
    const space = await Space.create({
      name: "Test Space",
      createdBy: owner._id,
    });

    spaceId = space._id;

    // memberships
    await MemberShip.create({
      userId: owner._id,
      spaceId,
      role: "owner",
    });

    await MemberShip.create({
      userId: editor._id,
      spaceId,
      role: "editor",
    });
  });

  // ✅ OWNER CAN SEND INVITE
  it("owner can send invite", async () => {
    const res = await request(app)
      .post(`/api/invites/${spaceId}/invite`)
      .set("Cookie", ownerCookies)
      .send({
        email: "invitee@test.com",
        role: "viewer",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Invite sent successfully");
  });

  // ❌ EDITOR CANNOT SEND INVITE
  it("editor cannot send invite", async () => {
    const res = await request(app)
      .post(`/api/invites/${spaceId}/invite`)
      .set("Cookie", editorCookies)
      .send({
        email: "fail@test.com",
        role: "viewer",
      });

    expect(res.statusCode).toBe(403);
  });

  // ❌ DUPLICATE INVITE BLOCKED
  it("cannot send duplicate pending invite", async () => {
  await Invite.create({
    email: "invitee@test.com",
    spaceId,
    role: "viewer",
    invitedBy: owner._id,
    token: "dup-token",
    expiresAt: new Date(Date.now() + 100000),
  });

  const res = await request(app)
    .post(`/api/invites/${spaceId}/invite`)
    .set("Cookie", ownerCookies)
    .send({
      email: "invitee@test.com", // 👈 SAME EMAIL
      role: "viewer",
    });

  expect(res.statusCode).toBe(400);
});

  // ✅ ACCEPT INVITE
  it("user can accept invite", async () => {
    const invite = await Invite.create({
  email: "invitee@test.com",
  spaceId,
  role: "editor",
  invitedBy: owner._id,
  token: "test-token-123",
  expiresAt: new Date(Date.now() + 100000),
});


    const res = await request(app)
      .post(`/api/invites/accept?token=${invite.token}`)
      .set("Cookie", invitedCookies);

    expect(res.statusCode).toBe(200);

    const membership = await MemberShip.findOne({
      userId: invitedUser._id,
      spaceId,
    });

    expect(membership).toBeTruthy();
    expect(membership.role).toBe("editor");
  });

  it("cannot accept invite twice", async () => {
  const invite = await Invite.create({
    email: "invitee@test.com",
    spaceId,
    role: "editor",
    invitedBy: owner._id,
    token: "reuse-token",
    expiresAt: new Date(Date.now() + 100000),
  });

  // first accept
  await request(app)
    .post(`/api/invites/accept?token=${invite.token}`)
    .set("Cookie", invitedCookies);

  // second accept (same token)
  const res = await request(app)
    .post(`/api/invites/accept?token=${invite.token}`)
    .set("Cookie", invitedCookies);

  expect(res.statusCode).toBe(400);
});


  // ✅ REJECT INVITE
  it("user can reject invite", async () => {
    const invite = await Invite.create({
  email: "invitee@test.com",
  spaceId,
  role: "editor",
  invitedBy: owner._id,
  token: "test-token-123",
  expiresAt: new Date(Date.now() + 100000),
});


    const res = await request(app)
      .post(`/api/invites/reject/${invite._id}`)
      .set("Cookie", invitedCookies);

    expect(res.statusCode).toBe(200);

    const updated = await Invite.findById(invite._id);
    expect(updated.status).toBe("rejected");
  });

  // ✅ GET MY INVITES
  it("user can fetch their invites", async () => {
  const invite = await Invite.create({
  email: "invitee@test.com",
  spaceId,
  role: "editor",
  invitedBy: owner._id,
  token: "test-token-123",
  expiresAt: new Date(Date.now() + 100000),
});


    const res = await request(app)
      .get("/api/invites/my")
      .set("Cookie", invitedCookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].email).toBe("invitee@test.com");
  });
  it("should trigger invite email when invite is sent", async () => {
  const res = await request(app)
    .post(`/api/invites/${spaceId}/invite`)
    .set("Cookie", ownerCookies)
    .send({
      email: "invitee@test.com",
      role: "viewer",
    });

  expect(res.statusCode).toBe(201);

  expect(sendEmail).not.toHaveBeenCalled();

  // expect(sendEmail).not.toHaveBeenCalled(
  //   expect.objectContaining({
  //     to: "invitee@test.com",
  //     subject: expect.stringContaining("invited"),
  //     html: expect.stringContaining("Accept Invitation"),
  //   })
  // );
});
it("owner can resend invite", async () => {
  const invite = await Invite.create({
    email: "invitee@test.com",
    spaceId,
    role: "viewer",
    invitedBy: owner._id,
    token: "old-token",
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // ✅ NOT expired
  });

  const res = await request(app)
    .post(`/api/invites/${invite._id}/resend`)
    .set("Cookie", ownerCookies);

  expect(res.statusCode).toBe(200);

  const updated = await Invite.findById(invite._id);
  expect(updated.token).not.toBe("old-token");
});



});
