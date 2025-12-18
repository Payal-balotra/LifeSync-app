
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // safety check
    if (!req.space || !req.space.role) {
      return res
        .status(500)
        .json({ message: "Space role not found in request" });
    }

    // permission check
    if (!allowedRoles.includes(req.space.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};

module.exports = requireRole;
