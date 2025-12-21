const ActivityLog = require("../models/ActivityLog");

const activityLogger = async ({space,user,action,entityType,entityId,meta = {},}) => {
  await ActivityLog.create({space,user,action,entityType,entityId,meta,})};

module.exports = activityLogger;
