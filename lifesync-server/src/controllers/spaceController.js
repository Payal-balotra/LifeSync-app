const Space = require("../models/Space");
const Membership = require("../models/MemberShip");
const Task = require("../models/Task");
const mongoose = require("mongoose");


const createSpace = async (req, res) => {
  const { name } = req.body;
  const space = await Space.create({
    name,
    createdBy: req.user._id,
  });

  await Membership.create({
    userId: req.user._id,
    spaceId: space._id,
    role: "owner",
  });

  res.status(200).json(space);
};

const getMySpaces = async (req, res) => {
   
  const memberships = await Membership.find({
    userId: req.user._id,
  }).populate("spaceId", " name createdAt");

  res.json(memberships);
};

const getTasks = async (req, res) => {
  const { spaceId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(spaceId)) {
   return res.status(400).json({ message: "Invalid space ID" });
 }

  const membership = await Membership.findOne({
    spaceId,
    userId: req.user._id,
  });

  if (!membership) {
    return res.status(403).json({ message: "Access denied" });
  }

  const tasks = await Task.find({ spaceId });
  res.json(tasks);
};

const getSpaceMembers = async (req, res) => {
  console.log("req.params:", req.params);
const spaceId = req.params.spaceId?.trim();
  if (!mongoose.Types.ObjectId.isValid(spaceId)) {
   return res.status(400).json({ message: "Invalid space ID" });
 }
  // check membership
  const isMember = await Membership.findOne({
    spaceId,
    userId: req.user._id,
  });

  if (!isMember) {
    return res.status(403).json({ message: "Access denied" });
  }

  const members = await Membership.find({ spaceId })
    .populate("userId", "name email")
    .sort({ createdAt: 1 });

  res.status(200).json(members);
};

const updateMemberRole = async (req, res) => {
  const { spaceId, memberId } = req.params;
  const { role } = req.body;
  if (!mongoose.Types.ObjectId.isValid(spaceId)) {
   return res.status(400).json({ message: "Invalid space ID" });
 }

  const owner = await Membership.findOne({
    spaceId,
    userId: req.user._id,
    role: "owner",
  });

  if (!owner) {
    return res.status(403).json({ message: "Only owner can change roles" });
  }

  const member = await Membership.findById(memberId);
  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  if (member.role === "owner") {
    return res.status(400).json({ message: "Owner role cannot be changed" });
  }

  member.role = role;
  await member.save();

  res.json({ message: "Role updated" });
};
const removeMember = async (req, res) => {
  const { spaceId, memberId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(spaceId)) {
   return res.status(400).json({ message: "Invalid space ID" });
 }

  const owner = await Membership.findOne({
    spaceId,
    userId: req.user._id,
    role: "owner",
  });

  if (!owner) {
    return res.status(403).json({ message: "Only owner can remove members" });
  }

  const member = await Membership.findById(memberId);
  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  if (member.role === "owner") {
    return res.status(400).json({ message: "Owner cannot be removed" });
  }

  await Membership.findByIdAndDelete(memberId);

  res.json({ message: "Member removed" });
};

module.exports = {
  createSpace,
  getMySpaces,
  getTasks,
  getSpaceMembers,
  updateMemberRole,
  removeMember,
};
