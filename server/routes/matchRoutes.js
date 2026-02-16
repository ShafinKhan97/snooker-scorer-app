const express = require("express");
const router = express.Router();
const Match = require("../models/Match");
const auth = require("../middleware/auth");

// Save a match
router.post("/save", auth, async (req, res) => {
  try {
    const { matchType, players, winner, finalScores } = req.body;

    const match = new Match({
      userId: req.user,
      matchType,
      players,
      winner,
      finalScores,
    });

    await match.save();
    res.status(201).json({ success: true, match });
  } catch (err) {
    console.error("Error saving match:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's matches
router.get("/history", auth, async (req, res) => {
  try {
    const matches = await Match.find({ userId: req.user })
      .sort({ date: -1 })
      .limit(10);

    res.json({ success: true, matches });
  } catch (err) {
    console.error("Error fetching matches:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user stats
router.get("/stats", auth, async (req, res) => {
  try {
    const matches = await Match.find({ userId: req.user });

    let stats = {
      matchesPlayed: matches.length,
      matchesWon: 0,
      draws: 0,
      totalPoints: 0,
      highestBreak: 0,
    };

    matches.forEach((match) => {
      // Count wins and draws
      if (match.winner && match.winner.isDraw) {
        stats.draws += 1;
      } else if (match.winner && !match.winner.isDraw) {
        stats.matchesWon += 1;
      }

      // Calculate total points and highest break
      if (match.finalScores) {
        // Convert Map to array if needed
        const scores =
          match.finalScores instanceof Map
            ? Array.from(match.finalScores.values())
            : Object.values(match.finalScores);

        scores.forEach((score) => {
          if (typeof score === "number") {
            stats.totalPoints += score;
            if (score > stats.highestBreak) {
              stats.highestBreak = score;
            }
          }
        });
      }
    });

    res.json({ success: true, stats });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
