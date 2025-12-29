const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const spaceRoutes = require("./routes/spaceRoutes")
const inviteRoutes = require("./routes/inviteRoutes");
const taskRoutes = require("./routes/taskRoutes")
require("dotenv").config();
const app = express();

const connectDB = require("./config/db");
//connect db
connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5176",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/spaces",spaceRoutes)
app.use("/api/invites",inviteRoutes);
app.use("/api",taskRoutes);


module.exports = app;
