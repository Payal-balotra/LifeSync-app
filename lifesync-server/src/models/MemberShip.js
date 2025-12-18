const mongoose = require("mongoose");


const memebershipSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  spaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Space",
  },
  role: {
    type: String,
    enum: ["owner", "editor", "viewer"],
    required:true
  },
},{ timestamps: true })

module.exports = mongoose.model("Membership",memebershipSchema);