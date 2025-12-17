const express = require("express");
const router = express.Router();
const {handleLogin,handleSignUp,logout,refreshToken,forgotPassword,resetPassword} = require("../controllers/authControllers");



router.post("/login", handleLogin);
router.post("/signup", handleSignUp);
router.post("/logout",logout);
router.post("/refersh",refreshToken);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


module.exports = router;
