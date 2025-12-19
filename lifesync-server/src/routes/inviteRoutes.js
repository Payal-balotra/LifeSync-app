const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const checkSpaceAccess = require("../middlewares/checkSpaceAccess");
const requireRole = require("../middlewares/requireRole");
const {sendInvite,acceptInvite,rejectInvite,getMyInvites} = require("../controllers/inviteController")


router.post("/:spaceId/invite",auth,checkSpaceAccess, requireRole("owner"), sendInvite);
router.post("/accept/:inviteId", auth, acceptInvite);
router.post("/reject/:inviteId", auth, rejectInvite);
router.get("/my",auth,getMyInvites)

module.exports = router;
