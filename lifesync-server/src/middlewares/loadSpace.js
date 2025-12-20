const Membership = require("../models/MemberShip");
const Space = require("../models/Space");
const mongoose = require("mongoose");

const loadSpace = async (req, res, next) => {
  const spaceId = req.params.spaceId;

  if (!spaceId) {
    return res.status(400).json({ message: "spaceId missing in URL" });
  }

  if (!mongoose.Types.ObjectId.isValid(spaceId)) {
    return res.status(400).json({ message: "Invalid space id" });
  }

  const space = await Space.findById(spaceId);
  if (!space) {
    return res.status(404).json({ message: "Space not found" });
  }

  const membership = await Membership.findOne({
    spaceId,
    userId: req.user._id,
  });

  if (!membership) {
    return res.status(403).json({ message: "Not a space member" });
  }

  req.space = {
    spaceId: space._id,
    role: membership.role,
  };

  next();
};

module.exports = loadSpace;
