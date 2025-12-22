const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const checkSpaceAccess = require("../middlewares/checkSpaceAccess");
const requireRole = require("../middlewares/requireRole");
const {sendInvite,acceptInvite,rejectInvite,getMyInvites,resendInvite} = require("../controllers/inviteController")


router.post("/:spaceId/invite",auth,checkSpaceAccess, requireRole("owner"), sendInvite);
router.post("/accept", auth, acceptInvite);
router.post("/:inviteId/resend",auth,resendInvite);
router.post("/reject/:inviteId", auth, rejectInvite);
router.get("/my",auth,getMyInvites)

module.exports = router;
