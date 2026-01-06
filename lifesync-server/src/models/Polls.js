  const mongoose = require("mongoose");



  const PollSchema = new mongoose.Schema(
    {
      spaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Space",
        required: true,
      },
      question: {
        type: String,
        required: true,
        trim: true,
      },
      options: [
        {
          _id: false,
          id: String,
          text: String,
        },
      ],
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      allowMultiple: {
        type: Boolean,
        default: false,
      },
      endsAt: Date,
    },
    { timestamps: true }
  );

  module.exports =  mongoose.model("Poll",PollSchema);