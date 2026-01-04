  const mongoose = require("mongoose");

  const spaceSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      //FLOW LIVES INSIDE SPACE
      flow: {
        nodes: {
          type: Array,
          default: [],
        },
        edges: {
          type: Array,
          default: [],
        },
        updatedAt: {
          type: Date,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Space", spaceSchema);
