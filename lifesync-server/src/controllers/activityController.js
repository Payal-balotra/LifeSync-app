
const ActivityLog = require("../models/ActivityLog");
const mongoose = require("mongoose");

const getSpaceActivity = async (req, res) => {
  const { spaceId } = req.params;
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  const { cursor } = req.query;

  const query = { space: spaceId };

  // cursor logic
  if (cursor) {
    if (!mongoose.Types.ObjectId.isValid(cursor)) {
      return res.status(400).json({ message: "Invalid cursor" });
    }

    query._id = { $lt: cursor };
  }

  const activities = await ActivityLog.find(query)
    .sort({ _id: -1 }) // newest first
    .limit(limit + 1)
    .populate("user", "name email");

  const hasMore = activities.length > limit;

  const data = hasMore ? activities.slice(0, limit) : activities;

  const nextCursor = hasMore
    ? data[data.length - 1]._id
    : null;

  res.status(200).json({
    data,
    pageInfo: {
      hasMore,
      nextCursor,
    },
  });
};

module.exports = { getSpaceActivity };
