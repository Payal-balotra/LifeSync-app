const Invite = require("../models/Invite");
const MemberShip = require("../models/MemberShip");

const sendInvite = async (req, res) => {
  const { email, role } = req.body;
  const { spaceId } = req.params;

  if (!email || !role) {
    return res.status(400).json({ message: "Email and role required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingInvite = await Invite.findOne({
    email: normalizedEmail,
    spaceId,
    status: "pending",
  });

  if (existingInvite) {
    return res.status(400).json({ message: "Invite already sent" });
  }

  const invite = await Invite.create({
    email: normalizedEmail,
    spaceId,
    role,
    invitedBy: req.user._id,
  });

  res.status(201).json(invite);
};

const acceptInvite = async (req, res) => {
console.log("PARAMS:", req.params);
console.log("USER EMAIL:", req.user.email);

  const invite = await Invite.findOne({
    _id: req.params.inviteId,
    email: req.user.email.trim().toLowerCase(),
    status: "pending",
  });

  if (!invite) {
    return res.status(400).json({ message: "Invalid invite" });
  }

  const existingMember = await MemberShip.findOne({
    userId: req.user._id,
    spaceId: invite.spaceId,
  });

  if (existingMember) {
    return res.status(400).json({ message: "Already a member" });
  }

  await MemberShip.create({
    userId: req.user._id,
    spaceId: invite.spaceId,
    role: invite.role,
  });

  invite.status = "accepted";
  await invite.save();

  res.json({ message: "Invite accepted" });
};

const rejectInvite = async (req, res) => {
  const invite = await Invite.findById(req.params.inviteId);

  if (!invite || invite.status !== "pending") {
    return res.status(400).json({ message: "Invalid invite" });
  }

  invite.status = "rejected";
  await invite.save();

  res.json({ message: "Invite rejected" });
};

const getMyInvites = async (req, res) => {
  const invites = await Invite.find({
    email: req.user.email.trim().toLowerCase(),
    status: "pending",
  })
    .populate("spaceId", "name createdBy")
    .populate("invitedBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json(invites);
};

module.exports = {
  sendInvite,
  acceptInvite,
  rejectInvite,
  getMyInvites,
};
