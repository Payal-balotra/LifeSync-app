const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");

const protect = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 🔥 Load full user from DB
    const user = await User.findById(decoded.userId).select("_id email name");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🔥 Attach full user
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};

module.exports = protect;
