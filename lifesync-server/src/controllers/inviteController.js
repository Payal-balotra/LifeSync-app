const Invite = require("../models/Invite");
const MemberShip = require("../models/MemberShip");
const activityLogger = require("../utils/activityLogger");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
/**
 * SEND INVITE
 */
const sendInvite = async (req, res) => {
  try {
    const { email, role } = req.body;
    const spaceId = req.space.spaceId;
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
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
      token,
      expiresAt,
    });
    const acceptUrl = `${process.env.CLIENT_URL}/accept-invite/${token}`;
    if (process.env.NODE_ENV !== "test" || process.env.FORCE_EMAIL === "true") {
      try {
        await sendEmail({
          to: normalizedEmail,
          subject: "You’ve been invited to join a space on LifeSync",
          html: `
        <p>Hello,</p>
        <p>You have been invited to join a space on <b>LifeSync</b>.</p>
        <p>Please log in to your account to accept or reject the invitation.</p>
        <p>
        <a href="${acceptUrl}">
        Accept Invitation
        </a>
       </p>
        <p>This link expires in 24 hours.</p>
        <br />
        <p>— LifeSync Team</p>
      `,
        });
      } catch (err) {
        console.error("Invite email failed:", err.message);
      }
    }

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

    res.status(201).json({ message: "Invite sent successfully" });
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
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const invite = await Invite.findOne({
      token,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });

    if (!invite) {
      return res.status(400).json({ message: "Invalid or expired invite" });
    }

    if (invite.email !== req.user.email.trim().toLowerCase()) {
      return res.status(403).json({
        message: `This invite is for ${invite.email}, but you are logged in as ${req.user.email}. Please logout and login with the correct account.`
      });
    }

    const existingMember = await MemberShip.findOne({
      userId: req.user._id,
      spaceId: invite.spaceId,
    });
    if (existingMember) {
      invite.status = "accepted";
      invite.token = undefined;
      await invite.save();
      return res.json({
        message: "Already a member",
        spaceId: invite.spaceId
      });
    }


    await MemberShip.create({
      userId: req.user._id,
      spaceId: invite.spaceId,
      role: invite.role,
    });

    invite.status = "accepted";
    invite.token = undefined;
    await invite.save();

    res.json({
      message: "Invite accepted",
      spaceId: invite.spaceId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * REJECT INVITE
 */
const rejectInvite = async (req, res) => {
  try {
    const invite = await Invite.findOne({
      _id: req.params.inviteId,
      email: req.user.email.trim().toLowerCase(),
      status: "pending",
    });

    if (!invite) {
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

const resendInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;

    const invite = await Invite.findOne({
      _id: inviteId,
      status: "pending",
    });

    if (!invite) {
      return res.status(400).json({ message: "Invalid invite" });
    }

    // 🔐 OWNER CHECK (CORRECT PLACE)
    const isOwner = await MemberShip.findOne({
      userId: req.user._id,
      spaceId: invite.spaceId,
      role: "owner",
    });

    if (!isOwner) {
      return res.status(403).json({ message: "Access denied" });
    }

    // 🔄 Rotate token
    invite.token = crypto.randomBytes(32).toString("hex");
    invite.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await invite.save();

    const acceptUrl = `${process.env.CLIENT_URL}/accept-invite/${invite.token}`;

    if (process.env.NODE_ENV !== "test" || process.env.FORCE_EMAIL === "true") {
      await sendEmail({
        to: invite.email,
        subject: "Invitation reminder – LifeSync",
        html: `
          <p>Your invitation has been re-sent.</p>
          <p><a href="${acceptUrl}">Accept Invitation</a></p>
          <p>This link expires in 24 hours.</p>
        `,
      });
    }

    await activityLogger({
      space: invite.spaceId,
      user: req.user._id,
      action: "invite_resent",
      entityType: "invite",
      entityId: invite._id,
    });

    return res.json({ message: "Invite resent successfully" });
  } catch (err) {
    console.error("🔥 resendInvite error:", err);
    return res.status(500).json({ message: err.message });
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
  resendInvite
};
