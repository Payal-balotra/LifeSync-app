const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware")
const {createSpace , getMySpaces,getTasks} = require("../controllers/spaceController");
const checkSpaceAccess = require("../middlewares/checkSpaceAccess")



// router.delete("/:spaceId",auth,checkSpaceAccess,allowRoles("owner"),deleteSpace)
router.get("/:spaceId/tasks",auth,checkSpaceAccess,getTasks);
router.post("/",auth,createSpace);
router.get("/",auth,getMySpaces);


module.exports = router;