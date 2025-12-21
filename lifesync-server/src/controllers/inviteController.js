const Invite = require("../models/Invite");
const MemberShip = require("../models/MemberShip");
const activityLogger = require("../utils/activityLogger");

/**
 * SEND INVITE
 */
const sendInvite = async (req, res) => {
  try {
    const { email, role } = req.body;
    const spaceId = req.space.spaceId;

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

    // Activity log (never break main flow)
    try {
      await activityLogger({
        space: spaceId,
        user: req.user._id,
        action: "invite_sent",
        entityType: "invite",
        entityId: invite._id,
        meta: { email: normalizedEmail, role },
      });
    } catch (e) {
      console.error("invite_sent log failed:", e.message);
    }

    res.status(201).json(invite);
  } catch (err) {
    console.error("sendInvite error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * ACCEPT INVITE
 */
const acceptInvite = async (req, res) => {
  try {
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

    try {
      await activityLogger({
        space: invite.spaceId,
        user: req.user._id,
        action: "invite_accepted",
        entityType: "invite",
        entityId: invite._id,
      });
    } catch (e) {
      console.error("invite_accepted log failed:", e.message);
    }

    res.json({ message: "Invite accepted" });
  } catch (err) {
    console.error("acceptInvite error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * REJECT INVITE
 */
const rejectInvite = async (req, res) => {
  try {
    const invite = await Invite.findById(req.params.inviteId);

    if (!invite || invite.status !== "pending") {
      return res.status(400).json({ message: "Invalid invite" });
    }

    invite.status = "rejected";
    await invite.save();

    try {
      await activityLogger({
        space: invite.spaceId,
        user: req.user._id,
        action: "invite_rejected",
        entityType: "invite",
        entityId: invite._id,
      });
    } catch (e) {
      console.error("invite_rejected log failed:", e.message);
    }

    res.json({ message: "Invite rejected" });
  } catch (err) {
    console.error("rejectInvite error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET MY INVITES (NO ACTIVITY LOG HERE)
 */
const getMyInvites = async (req, res) => {
  try {
    const invites = await Invite.find({
      email: req.user.email.trim().toLowerCase(),
      status: "pending",
    })
      .populate("spaceId", "name createdBy")
      .populate("invitedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(invites);
  } catch (err) {
    console.error("getMyInvites error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  sendInvite,
  acceptInvite,
  rejectInvite,
  getMyInvites,
};
