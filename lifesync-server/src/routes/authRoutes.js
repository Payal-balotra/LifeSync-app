const express = require("express");
const router = express.Router();
const {handleLogin,handleSignUp,logout,refreshToken} = require("../controllers/authControllers");



router.post("/login", handleLogin);
router.post("/signup", handleSignUp);
router.post("/logout",logout);
router.post("/refersh",refreshToken);


module.exports = router;
