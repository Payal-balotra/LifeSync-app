const Poll = require("../models/Polls");
const Vote = require("../models/Vote");
const Membership = require("../models/MemberShip");

// CREATE POLL
const createPoll = async (req, res) => {
  const { question, options, allowMultiple, endsAt } = req.body;
  const { spaceId } = req.params;

  if (!question || !options || options.length < 2) {
    return res.status(400).json({ message: "Invalid poll data" });
  }

  // permission check
  const membership = await Membership.findOne({
    spaceId,
    userId: req.user._id,
  });

  if (!membership || membership.role === "viewer") {
    return res.status(403).json({ message: "Not allowed to create poll" });
  }

  const poll = await Poll.create({
    spaceId,
    question,
    options,
    allowMultiple,
    endsAt,
    createdBy: req.user._id,
  });

  res.status(201).json(poll);
};
const votePoll = async (req, res) => {
  const { pollId } = req.params;
  const { optionId } = req.body;
      if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  if (!optionId) {
    return res.status(400).json({ message: "Option required" });
  }
  const poll = await Poll.findById(pollId);
  if (!poll) {
    return res.status(404).json({ message: "Poll not found" });
  }
  try {
    const vote = await Vote.create({
      pollId,
      userId: req.user._id,
      optionId, 
    });

    //  emit socket event here
  const io = getSocketInstance();
  if (io) {
    io.to(poll.spaceId.toString()).emit("poll-updated", pollId);
  }
    res.status(201).json(vote);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already voted" });
    }
    throw err;
  }
};
const getPolls = async (req, res) => {
  const { spaceId } = req.params;

  // 1️⃣ Get polls
  const polls = await Poll.find({ spaceId }).lean();
  if (!polls.length) {
    return res.json([]);
  }

  const pollIds = polls.map(p => p._id);

  // 2️⃣ Aggregate total votes per option
  const votes = await Vote.aggregate([
    { $match: { pollId: { $in: pollIds } } },
    {
      $group: {
        _id: { pollId: "$pollId", optionId: "$optionId" },
        count: { $sum: 1 },
      },
    },
  ]);

  const resultMap = {};
  votes.forEach(v => {
    const pid = v._id.pollId.toString();
    if (!resultMap[pid]) resultMap[pid] = {};
    resultMap[pid][v._id.optionId] = v.count;
  });

  // 3️⃣ 🔥 Get CURRENT USER votes
  const myVotes = await Vote.find({
    pollId: { $in: pollIds },
    userId: req.user._id,
  }).lean();

  const myVoteMap = {};
  myVotes.forEach(v => {
    const pid = v.pollId.toString();
    if (!myVoteMap[pid]) myVoteMap[pid] = [];
    myVoteMap[pid].push(v.optionId);
  });

  // 4️⃣ Final response
  const final = polls.map(p => ({
    ...p,
    results: resultMap[p._id.toString()] || {},
    myVotes: myVoteMap[p._id.toString()] || [],
  }));

  res.json(final);
};

module.exports = {
    createPoll,
    getPolls,
    votePoll
}

