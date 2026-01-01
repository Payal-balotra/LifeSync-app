let io;

const setSocketInstance = (ioInstance) => {
  io = ioInstance;
};

const Activity = require("../models/ActivityLog");

async function activityLogger({
  space,
  user,
  action,
  entityType,
  entityId,
  meta = {},
}) {
  const activity = await Activity.create({
    space,
    user,
    action,
    entityType,
    entityId,
    meta,
  });

  // LIVE EMIT
  if (io) {
    io.to(space.toString()).emit("activity:new", activity);
  }

  return activity;
}

module.exports = { activityLogger, setSocketInstance };
