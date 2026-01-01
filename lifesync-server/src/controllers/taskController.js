const Task = require("../models/Task");
const ActivityLog = require("../models/ActivityLog");
const {activityLogger} = require("../utils/activityLogger");
const mongoose = require("mongoose");

/**
 * CREATE TASK
 */
const createTask = async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }
  const assignees = Array.isArray(assignedTo)
  ? assignedTo
  : assignedTo
  ? [assignedTo]
  : [];

  const task = await Task.create({
    space: req.space.spaceId,
    title,
    description,
    assignedTo : assignees,
    dueDate,
    createdBy: req.user._id,
  });
  await task.populate("assignedTo", "name email");
   await task.populate("createdBy", "name");

  await activityLogger({
    space: req.space.spaceId,
    user: req.user._id,
    action: "task_created",
    entityType: "task",
    entityId: task._id,
    meta: { title: task.title },
  });

  res.status(201).json(task);
};

/**
 * GET TASKS
 */
const getTasks = async (req, res) => {
  const tasks = await Task.find({
    space: new mongoose.Types.ObjectId(req.space.spaceId),
    isArchived: false,
  })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name");

  res.json(tasks);
};

/**
 * UPDATE TASK
 */
const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user._id.toString();

  // 1️⃣ Allow only specific fields
  const allowedUpdates = [
    "title",
    "description",
    "status",
    "assignedTo",
    "dueDate",
  ];

  Object.keys(req.body).forEach((key) => {
    if (!allowedUpdates.includes(key)) {
      delete req.body[key];
    }
  });

  // 2️⃣ Fetch task
  const task = await Task.findOne({
    _id: taskId,
    space: req.space.spaceId,
    isArchived: false,
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // 3️⃣ Permission facts
  const role = req.space.role; // owner | editor | viewer
  const isOwner = role === "owner";
const isAssigned = task.assignedTo.some(
  (id) => id.toString() === req.user._id.toString()
);
  const updateKeys = Object.keys(req.body);
  const isOnlyStatus = updateKeys.length === 1 && updateKeys[0] === "status";

  /**
   * 🔐 PERMISSION RULES
   */

  // OWNER → full access
  if (isOwner) {
    // allowed  full access
  }
  // ASSIGNED USER → status only
  else if (isAssigned) {
    if (!isOnlyStatus) {
      return res.status(403).json({
        message: "Assigned user can only update task status",
      });
    }
  }
  // EVERYONE ELSE → blocked
  else {
    return res.status(403).json({
      message: "Only assigned user can update this task",
    });
  }

  /**
   * 4️⃣ Validate status value
   */
  if (
    req.body.status &&
    !["todo", "in_progress", "done"].includes(req.body.status)
  ) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  /**
   * 5️⃣ Status transition rules
   */
  const allowedStatusTransitions = {
    todo: ["in_progress"],
    in_progress: ["done"],
    done: [],
  };

  if (req.body.status) {
    const currentStatus = task.status;
    const nextStatus = req.body.status;

    if (!allowedStatusTransitions[currentStatus]?.includes(nextStatus)) {
      return res.status(400).json({
        message: `Invalid status transition from ${currentStatus} to ${nextStatus}`,
      });
    }
  }

  // 6️⃣ Snapshot before update
  const oldTask = task.toObject();

  // 7️⃣ Apply update
  Object.assign(task, req.body);
  await task.save();

  // 8️⃣ Build diff for activity log
  const changes = {};

  if (req.body.status && oldTask.status !== task.status) {
    changes.status = {
      from: oldTask.status,
      to: task.status,
    };
  }

  ["title", "description", "dueDate"].forEach((field) => {
    if (
      req.body[field] !== undefined &&
      String(oldTask[field]) !== String(task[field])
    ) {
      changes[field] = {
        from: oldTask[field],
        to: task[field],
      };
    }
  });

  if (
    req.body.assignedTo &&
    String(oldTask.assignedTo) !== String(task.assignedTo)
  ) {
    changes.assignedTo = {
      from: oldTask.assignedTo,
      to: task.assignedTo,
    };
  }

  // 9️⃣ Activity log
  if (Object.keys(changes).length > 0) {
    await activityLogger({
      space: req.space.spaceId,
      user: req.user._id,
      action: "task_updated",
      entityType: "task",
      entityId: task._id,
      meta: { changes },
    });
  }

  // 🔟 IMPORTANT: populate before returning
  await task.populate("assignedTo", "name email");
  await task.populate("createdBy", "name");

  res.json(task);
};
/**
 * DELETE (ARCHIVE) TASK
 */
const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findOne({
    _id: taskId,
    space: req.space.spaceId,
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.isArchived = true;
  await task.save();

  await activityLogger({
    space: req.space.spaceId,
    user: req.user._id,
    action: "task_archived",
    entityType: "task",
    entityId: task._id,
    meta: { title: task.title },
  });

  res.json({ message: "Task archived successfully" });
};

/**
 * ACTIVITY FEED
 */
const getActivityFeed = async (req, res) => {
  const logs = await ActivityLog.find({
    space: req.space.spaceId,
  })
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(logs);
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  getActivityFeed,
};
