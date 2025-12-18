const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token expired" });
  }
};
module.exports = protect