const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
      // examples:
      // "task_created"
      // "task_updated"
      // "task_archived"
    },

    entityType: {
      type: String,
      required: true,
      enum: ["task"],
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    meta: {
      type: Object, // { title: "Buy groceries", status: "done" }
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
