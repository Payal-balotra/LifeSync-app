 const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const checkSpaceAccess = require("../middlewares/checkSpaceAccess");
const { getSpaceActivity } = require("../controllers/activityController");

/**
 * GET ACTIVITY FEED FOR A SPACE
 * /api/spaces/:spaceId/activity
 * Query params:
 *  - limit (optional)
 *  - cursor (optional)
 */
router.get(
  "/spaces/:spaceId/activity",
  auth,
  checkSpaceAccess,
  getSpaceActivity
);

module.exports = router;
