const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = require("../app");

const User = require("../models/UserSchema");
const Space = require("../models/Space");
const Membership = require("../models/MemberShip");
const Task = require("../models/Task");

// helper: create user + membership + auth cookie
const createUserWithRole = async (role, spaceId) => {
  const user = await User.create({
    name: "Test User",
    email: Math.random() + "@test.com",
    password: "password123",
  });

  await Membership.create({
    userId: user._id,
    spaceId,
    role, // owner | editor | viewer
  });

  const token = jwt.sign(
    { userId: user._id },
  process.env.ACCESS_TOKEN_SECRET
  );

  return { user, token };
};

describe("PATCH /spaces/:spaceId/tasks/:taskId (updateTask)", () => {
  let space;

  beforeEach(async () => {
    space = await Space.create({
      name: "Test Space",
      createdBy: new mongoose.Types.ObjectId(),
    });
  });

  /**
   * VIEWER (not assigned)
   */
  test("Viewer cannot update task", async () => {
    const { user, token } = await createUserWithRole("viewer", space._id);

    const task = await Task.create({
      space: space._id,
      title: "Task",
      createdBy: user._id,
    });

    const res = await request(app)
      .patch(`/api/spaces/${space._id}/tasks/${task._id}`)
      .set("Cookie", `accessToken=${token}`)
      .send({ status: "in_progress" });

    expect(res.status).toBe(403);
  });

  /**
   * ASSIGNED VIEWER (this is the "assigned user")
   */
  test("Assigned viewer can update status only", async () => {
    const { user, token } = await createUserWithRole("viewer", space._id);

    const task = await Task.create({
      space: space._id,
      title: "Task",
      status: "todo",
      createdBy: user._id,
      assignedTo: [user._id],
    });

    const res = await request(app)
      .patch(`/api/spaces/${space._id}/tasks/${task._id}`)
      .set("Cookie", `accessToken=${token}`)
      .send({ status: "in_progress" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("in_progress");
  });

  test("Assigned viewer cannot update title", async () => {
    const { user, token } = await createUserWithRole("viewer", space._id);

    const task = await Task.create({
      space: space._id,
      title: "Old Title",
      createdBy: user._id,
      assignedTo: [user._id],
    });

    const res = await request(app)
      .patch(`/api/spaces/${space._id}/tasks/${task._id}`)
      .set("Cookie", `accessToken=${token}`)
      .send({ title: "New Title" });

    expect(res.status).toBe(403);
  });

  /**
   * EDITOR
   */
  test("Editor can update any field", async () => {
    const { user, token } = await createUserWithRole("editor", space._id);

    const task = await Task.create({
      space: space._id,
      title: "Old",
      status: "todo",
      createdBy: user._id,
    });

    const res = await request(app)
      .patch(`/api/spaces/${space._id}/tasks/${task._id}`)
      .set("Cookie", `accessToken=${token}`)
      .send({
        title: "New",
        description: "Updated",
        status: "in_progress",
      });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("New");
    expect(res.body.status).toBe("in_progress");
  });

  /**
   * STATUS TRANSITION RULES
   */
  test("Cannot skip status from todo to done", async () => {
    const { user, token } = await createUserWithRole("editor", space._id);

    const task = await Task.create({
      space: space._id,
      title: "Task",
      status: "todo",
      createdBy: user._id,
    });

    const res = await request(app)
      .patch(`/api/spaces/${space._id}/tasks/${task._id}`)
      .set("Cookie", `accessToken=${token}`)
      .send({ status: "done" });

    expect(res.status).toBe(400);
  });

  test("Cannot move done task back to in_progress", async () => {
    const { user, token } = await createUserWithRole("editor", space._id);

    const task = await Task.create({
      space: space._id,
      title: "Task",
      status: "done",
      createdBy: user._id,
    });

    const res = await request(app)
      .patch(`/api/spaces/${space._id}/tasks/${task._id}`)
      .set("Cookie", `accessToken=${token}`)
      .send({ status: "in_progress" });

    expect(res.status).toBe(400);
  });
});
