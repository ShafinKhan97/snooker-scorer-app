const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  matchType: {
    type: String,
    enum: ["1v1", "2v2", "century"],
    required: true,
  },
  players: [
    {
      name: String,
      score: Number,
      team: Number, // 1 or 2 for 2v2 mode
    },
  ],
  winner: {
    name: String,
    isDraw: {
      type: Boolean,
      default: false,
    },
  },
  finalScores: {
    type: Map,
    of: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Match", MatchSchema);
