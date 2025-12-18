const Space = require("../models/Space");
const Membership = require("../models/MemberShip");
const Task = require("../models/Task");
const createSpace = async (req, res) => {
  const { name } = req.body;
  const space = await Space.create({
    name,
    createdBy: req.user.id,
  });

  await Membership.create({
    userId: req.user.id,
    spaceId: space._id,
    role: "owner",
  });

  res.status(200).json(space);
};

const getMySpaces = async (req, res) => {
  const memberships = await Membership.find({
    userId: req.user.id,
  }).populate("spaceId"," name createdAt");

  res.json(memberships);
};

const getTasks = async (req, res) => {
  const tasks = await Task.find({
    spaceId: req.space.spaceId,
  });

  res.json(tasks);
};

module.exports = { createSpace, getMySpaces, getTasks };
