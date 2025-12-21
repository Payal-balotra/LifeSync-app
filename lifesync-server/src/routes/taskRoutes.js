const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const loadSpace = require("../middlewares/loadSpace");
const requireRole = require("../middlewares/requireRole");

const {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  getActivityFeed,
} = require("../controllers/taskController");

// CREATE TASK
router.post(
  "/spaces/:spaceId/tasks",
  auth,
  loadSpace,
  requireRole("owner", "editor"),
  createTask
);

// GET TASKS
router.get(
  "/spaces/:spaceId/tasks",
  auth,
  loadSpace,
  requireRole("owner", "editor", "viewer"),
  getTasks
);

// UPDATE TASK
router.patch(
  "/spaces/:spaceId/tasks/:taskId",
  auth,
  loadSpace,
  requireRole("owner", "editor","viewer"),
  updateTask
);

// DELETE TASK
router.delete(
  "/spaces/:spaceId/tasks/:taskId",
  auth,
  loadSpace,
  requireRole("owner"),
  deleteTask
);

// ACTIVITY
router.get(
  "/spaces/:spaceId/activity",
  auth,
  loadSpace,
  requireRole("owner", "editor", "viewer"),
  getActivityFeed
);

module.exports = router;
