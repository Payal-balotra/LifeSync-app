const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware")

const checkSpaceAccess = require("../middlewares/checkSpaceAccess")
const {createSpace , getMySpaces,getSpaceMembers,updateMemberRole,removeMember,getSpaceById} = require("../controllers/spaceController");



// router.delete("/:spaceId",auth,checkSpaceAccess,allowRoles("owner"),deleteSpace)
router.post("/",auth,createSpace);
router.get("/",auth,getMySpaces);
router.get("/:spaceId", auth, getSpaceById);
router.get("/:spaceId/members",auth,getSpaceMembers);
router.patch("/:spaceId/memebers/:memberId",auth,updateMemberRole);
router.delete("/:spaceId/members/:memberId",auth,removeMember)






module.exports = router;