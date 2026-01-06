const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const { createPoll,getPolls,votePoll} = require("../controllers/pollController");



router.post("/spaces/:spaceId/polls", auth, createPoll);
router.get("/spaces/:spaceId/polls", auth,getPolls);
router.post("/:pollId/vote", auth, votePoll);

module.exports = router