const express = require("express");
const router = express.Router();
const { handleLogin, handleSignUp, logout, refreshToken, forgotPassword, resetPassword, getMe } = require("../controllers/authControllers");



const protect = require("../middlewares/authMiddleware");

router.post("/login", handleLogin);
router.post("/signup", handleSignUp);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, getMe);

module.exports = router;
