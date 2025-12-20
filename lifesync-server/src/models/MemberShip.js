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
    required:true
  },
},{ timestamps: true })

module.exports = mongoose.model("Membership",memebershipSchema);