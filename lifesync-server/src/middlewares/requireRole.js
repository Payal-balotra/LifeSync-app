const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.space?.role;

    if (!role) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};

module.exports = requireRole;
