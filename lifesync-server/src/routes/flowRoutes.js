
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware")
const flowController = require("../controllers/flowController");




router.get("/spaces/:spaceId/flow", auth, flowController.getFlow);
router.put("/spaces/:spaceId/flow", auth, flowController.updateFlow);

module.exports = router;