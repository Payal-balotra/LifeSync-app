const Space = require("../models/Space");
const Membership = require("../models/MemberShip");

// GET flow (any member)
exports.getFlow = async (req, res) => {
  const { spaceId } = req.params;

  const space = await Space.findById(spaceId).select("flow");
  if (!space) {
    return res.status(404).json({ message: "Space not found" });
  }

  res.json(space.flow || { nodes: [], edges: [] });
};

// UPDATE flow (owner/editor only)
exports.updateFlow = async (req, res) => {
  const { spaceId } = req.params;
  const { nodes, edges } = req.body;

  // check role
  const membership = await Membership.findOne({
    spaceId,
    userId: req.user._id,
  });

  if (!membership || !["owner", "editor"].includes(membership.role)) {
    return res.status(403).json({ message: "Permission denied" });
  }

  await Space.findByIdAndUpdate(spaceId, {
    flow: {
      nodes,
      edges,
      updatedAt: new Date(),
      updatedBy: req.user._id,
    },
  });

  res.json({ success: true });
};
