const Membership = require("../models/MemberShip");
const mongoose = require("mongoose");

const checkSpaceAccess = async (req, res, next) => {
  try {
    const { spaceId } = req.params;

    // 🚨 Explicit contract check
    if (!spaceId) {
      return res.status(400).json({
        message: "spaceId param is required for this route",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(spaceId)) {
      return res.status(400).json({
        message: "Invalid spaceId",
      });
    }

    const membership = await Membership.findOne({
      userId: req.user._id,
      spaceId,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You do not have access to this space",
      });
    }

    // ✅ Explicit, minimal attachment
    req.space = {
      spaceId,
      role: membership.role,
    };

    next();
  } catch (err) {
    console.error("checkSpaceAccess error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = checkSpaceAccess;
