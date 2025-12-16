const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const authRoutes = require("./routes/authRoutes");

const connectDB = require("./config/db");
//connect db
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);

app.get("/", (req, res) => {
  res.send("LifeSync API running");
});

module.exports = app;
