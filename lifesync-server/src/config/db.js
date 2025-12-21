const mongoose = require("mongoose");

const connectDB = async () => {
  try {
      if (process.env.NODE_ENV === "test") return;

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully ");
  } catch (err) {
    console.error("MongoDB connection failed", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
