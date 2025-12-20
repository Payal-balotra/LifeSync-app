const ActivityLog = require("../models/ActivityLog");

const logActivity = async ({space,user,action,entityType,entityId,meta = {},}) => {
  await ActivityLog.create({space,user,action,entityType,entityId,meta,})};

module.exports = logActivity;
