const Task = require("../models/Task");
const ActivityLog = require("../models/ActivityLog");
const activityLogger = require("../utils/activityLogger")
const mongoose = require("mongoose")
const createTask = async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const task = await Task.create({
    space: req.space.spaceId, 
    title,
    description,
    assignedTo,
    dueDate,
    createdBy: req.user._id,
  });
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

const getTasks = async (req, res) => {
  console.log("GET TASKS req.space:", req.space);
console.log("GET TASKS spaceId:", req.space?.spaceId);
  const tasks = await Task.find({
     space: new mongoose.Types.ObjectId(req.space.spaceId),
  isArchived: false,
  })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name");

  res.json(tasks);
};
const updateTask = async (req, res) => {
  const { taskId } = req.params;
const allowedUpdates = ["title", "description", "status", "assignedTo", "dueDate"];

Object.keys(req.body).forEach((key) => {
  if (!allowedUpdates.includes(key)) {
    delete req.body[key];
  }
});

  const task = await Task.findOne({
    _id: taskId,
    space: req.space.spaceId,
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  Object.assign(task, req.body);
  await task.save();
   await activityLogger({
    space: req.space.spaceId,
    user: req.user._id,
    action: "task_updated",
    entityType: "task",
    entityId: task._id,
    meta: req.body,
  });


  res.json(task);
};

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


const getActivityFeed = async (req, res) => {
  const logs = await ActivityLog.find({
    space: req.space.spaceId,
  })
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(logs);
};


module.exports = {createTask,updateTask,deleteTask,getTasks,getActivityFeed}


