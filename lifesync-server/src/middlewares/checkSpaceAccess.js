const Membership = require("../models/MemberShip");

const checkSpaceAccess = async (req, res, next) => {
  try {
    const spaceId = req.params.spaceId;

    // 🔒 Only run when spaceId exists
    if (!spaceId) {
      return next();
    }

    const membership = await Membership.findOne({
      userId: req.user._id,
      spaceId,
    });

    if (!membership) {
      return res.status(403).json({ message: "Access denied to this space" });
    }

    req.space = {
      spaceId,
      role: membership.role,
    };

    next();
  } catch (error) {
    console.error("checkSpaceAccess error:", error);
    res.status(500).json({ message: "Space access check failed" });
  }
};

module.exports = checkSpaceAccess;
