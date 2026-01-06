const mongoose = require("mongoose");


const VoteSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    optionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
VoteSchema.index({ pollId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Vote",VoteSchema);