const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware")
const {createSpace , getMySpaces,getTasks,getSpaceMembers,updateMemberRole,removeMember} = require("../controllers/spaceController");
const checkSpaceAccess = require("../middlewares/checkSpaceAccess")



// router.delete("/:spaceId",auth,checkSpaceAccess,allowRoles("owner"),deleteSpace)
router.post("/",auth,createSpace);
router.get("/",auth,getMySpaces);
router.get("/:spaceId/tasks",auth,checkSpaceAccess,getTasks);
router.get("/:spaceId/members",auth,getSpaceMembers);
router.patch("/:spaceId/memebers/:memberId",auth,updateMemberRole);
router.delete("/:spaceId/members/:memberId",auth,removeMember)



module.exports = router;