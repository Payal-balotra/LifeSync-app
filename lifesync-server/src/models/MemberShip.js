const mongoose = require("mongoose");


const memebershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  spaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Space",
    required: true,
  },
  role: {
    type: String,
    enum: ["owner", "editor", "viewer"],
    required: true
  },
}, { timestamps: true })


// Ensure a user can only be a member of a space once
memebershipSchema.index({ userId: 1, spaceId: 1 }, { unique: true });

module.exports = mongoose.model("Membership", memebershipSchema);