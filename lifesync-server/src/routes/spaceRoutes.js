const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware")

const checkSpaceAccess = require("../middlewares/checkSpaceAccess")
const {createSpace , getMySpaces,getSpaceMembers,updateMemberRole,removeMember,getSpaceById,deleteSpace} = require("../controllers/spaceController");
const requireRole = require("../middlewares/requireRole");



router.post("/",auth,createSpace);
router.get("/",auth,getMySpaces);
router.get("/:spaceId", auth, getSpaceById);
router.get("/:spaceId/members",auth,getSpaceMembers);
router.patch("/:spaceId/members/:memberId",auth,updateMemberRole);
router.delete("/:spaceId/members/:memberId",auth,removeMember)
router.delete("/:spaceId",auth,checkSpaceAccess,requireRole("owner"),deleteSpace)




module.exports = router;