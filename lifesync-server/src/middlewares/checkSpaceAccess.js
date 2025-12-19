const Membership = require("../models/MemberShip");

const checkSpaceAccess = async (req, res, next) => {
  try {
    const { spaceId } = req.params;

    if (!spaceId) {
      return res.status(400).json({ message: "Space ID missing" });
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
    res.status(500).json({ message: "Space access check failed" });
  }
};

module.exports = checkSpaceAccess;
