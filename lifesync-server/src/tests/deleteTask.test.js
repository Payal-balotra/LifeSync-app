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
    role,
  });

  const token = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET
  );

  return { user, token };
};

describe("DELETE /spaces/:spaceId/tasks/:taskId (deleteTask)", () => {
  let space;

  beforeEach(async () => {
    space = await Space.create({
      name: "Test Space",
      createdBy: new mongoose.Types.ObjectId(),
    });
  });

  /**
   * OWNER
   */
  test("Owner can delete (archive) a task", async () => {
    const { user, token } = await createUserWithRole("owner", space._id);

    const task = await Task.create({
      space: space._id,
      title: "Task to delete",
      createdBy: user._id,
    });

    const res = await request(app)
      .delete(`/api/spaces/${space._id}/tasks/${task._id}`)
      .set("Cookie", `accessToken=${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Task archived successfully");

    // 🔥 verify DB state
    const updatedTask = await Task.findById(task._id);
    expect(updatedTask.isArchived).toBe(true);
  });

  /**
   * EDITOR
   */
  test("Editor cannot delete task", async () => {
    const { user, token } = await createUserWithRole("editor", space._id);

    const task = await Task.create({
      space: space._id,
      title: "Task",
      createdBy: user._id,
    });

    const res = await request(app)
      .delete(`/api/spaces/${space._id}/tasks/${task._id}`)
      .set("Cookie", `accessToken=${token}`);

    expect(res.status).toBe(403);
  });

  /**
   * VIEWER
   */
  test("Viewer cannot delete task", async () => {
    const { user, token } = await createUserWithRole("viewer", space._id);

    const task = await Task.create({
      space: space._id,
      title: "Task",
      createdBy: user._id,
    });

    const res = await request(app)
      .delete(`/api/spaces/${space._id}/tasks/${task._id}`)
      .set("Cookie", `accessToken=${token}`);

    expect(res.status).toBe(403);
  });

  /**
   * TASK NOT FOUND
   */
  test("Deleting non-existing task returns 404", async () => {
    const { user, token } = await createUserWithRole("owner", space._id);

    const fakeTaskId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/spaces/${space._id}/tasks/${fakeTaskId}`)
      .set("Cookie", `accessToken=${token}`);

    expect(res.status).toBe(404);
  });
});
