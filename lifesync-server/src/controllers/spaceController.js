const Space = require("../models/Space");
const Membership = require("../models/MemberShip");
const mongoose = require("mongoose");


const createSpace = async (req, res) => {
  const { name } = req.body;
  const space = await Space.create({
    name,
    createdBy: req.user._id,
  });

   const membership = await Membership.create({
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


const getSpaceMembers = async (req, res) => {
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

  if (!["owner", "editor", "viewer"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const owner = await Membership.findOne({
    spaceId,
    userId: req.user._id,
    role: "owner",
  });

  if (!owner) {
    return res.status(403).json({ message: "Only owner can change roles" });
  }

  const member = await Membership.findOne({ _id: memberId, spaceId });
  if (!member) {
    return res.status(404).json({ message: "Member not found in this space" });
  }

  // prevent self role change
  if (member.userId.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: "You cannot change your own role" });
  }

  // ownership transfer
  if (role === "owner") {
    owner.role = "editor";
    member.role = "owner";

    await owner.save();
    await member.save();
     await activityLogger({
      space: spaceId,
      user: req.user._id,
      action: "ownership_transferred",
      entityType: "membership",
      entityId: member._id,
      meta: {
        from: owner.userId,
        to: member.userId._id,
      },
    });

    return res.json({ message: "Ownership transferred successfully" });
  }

  member.role = role;
  await member.save();
   await activityLogger({
    space: spaceId,
    user: req.user._id,
    action: "member_role_changed",
    entityType: "membership",
    entityId: member._id,
    meta: {
      memberName: member.userId.name,
      from: previousRole,
      to: role,
    },
  });

  res.json({ message: "Role updated successfully" });
};

const removeMember = async (req, res) => {
  const { spaceId, memberId } = req.params;

  const owner = await Membership.findOne({
    spaceId,
    userId: req.user._id,
    role: "owner",
  });

  if (!owner) {
    return res.status(403).json({ message: "Only owner can remove members" });
  }

  const member = await Membership.findOne({ _id: memberId, spaceId });
  if (!member) {
    return res.status(404).json({ message: "Member not found in this space" });
  }

  // prevent removing self
  if (member.userId.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: "You cannot remove yourself" });
  }

  if (member.role === "owner") {
    return res.status(400).json({ message: "Owner cannot be removed" });
  }

  await member.deleteOne();
    await activityLogger({
    space: spaceId,
    user: req.user._id,
    action: "member_removed",
    entityType: "membership",
    entityId: memberId,
    meta: {
      memberName: member.userId.name,
    },
  });

  res.json({ message: "Member removed successfully" });
};


const getSpaceById = async (req, res) => {
  const { spaceId } = req.params;

  // validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(spaceId)) {
    return res.status(400).json({ message: "Invalid space ID" });
  }

  // check membership (important)
  const isMember = await Membership.findOne({
    spaceId,
    userId: req.user._id,
  });

  if (!isMember) {
    return res.status(403).json({ message: "Access denied" });
  }

  // fetch space
  const space = await Space.findById(spaceId).select("_id name createdAt");

  if (!space) {
    return res.status(404).json({ message: "Space not found" });
  }

  res.status(200).json(space);
};



module.exports = {
  createSpace,
  getMySpaces,
  getSpaceMembers,
  updateMemberRole,
  removeMember,
  getSpaceById
};
