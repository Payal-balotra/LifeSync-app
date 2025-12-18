const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const checkSpaceAccess = require("../middlewares/checkSpaceAccess");
const requireRole = require("../middlewares/requireRole");
const {sendInvite,acceptInvite,rejectInvite} = require("../controllers/inviteController")


// OWNER sends invite
router.post("/:spaceId/invite",auth,checkSpaceAccess, requireRole("owner"), sendInvite);

// user accepts invite
router.post("/accept/:inviteId", auth, acceptInvite);

// user rejects invite
router.post("/reject/:inviteId", auth, rejectInvite);

module.exports = router;
