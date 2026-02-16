import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import UndoIcon from "@mui/icons-material/Undo";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import api from "../services/api";

const LiveMatch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { type, players, playerCount } = location.state || {};

  const [scores, setScores] = useState({});
  const [teamScores, setTeamScores] = useState({ 1: 0, 2: 0 });
  const [currentTeam, setCurrentTeam] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [history, setHistory] = useState([]);
  const [openFinishDialog, setOpenFinishDialog] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [saving, setSaving] = useState(false);

  // Ball values (only for Century mode)
  const centuryBalls = [
    { value: 10, label: "Red", bg: "#f44336" },
    { value: 2, label: "Yellow", bg: "#ffeb3b", textColor: "black" },
    { value: 3, label: "Green", bg: "#4caf50" },
    { value: 4, label: "Brown", bg: "#795548" },
    { value: 5, label: "Blue", bg: "#2196f3" },
    { value: 6, label: "Pink", bg: "#e91e63" },
    { value: 7, label: "Black", bg: "#212121" },
  ];

  // Regular point values (for 1v1 and 2v2) - including +1
  const regularPoints = [1, 2, 3, 4, 5, 6, 7];

  // Foul values (only for Century mode)
  const centuryFouls = [
    { value: -4, label: "-4", color: "#ff9800" },
    { value: -5, label: "-5", color: "#ff9800" },
    { value: -6, label: "-6", color: "#ff9800" },
    { value: -7, label: "-7", color: "#ff9800" },
    { value: -10, label: "-10", color: "#f44336" },
  ];

  // Simple fouls (for 1v1 and 2v2)
  const simpleFouls = [
    { value: -4, label: "Foul -4", color: "#ff9800" },
    { value: -5, label: "Foul -5", color: "#ff9800" },
    { value: -6, label: "Foul -6", color: "#ff9800" },
    { value: -7, label: "Foul -7", color: "#ff9800" },
  ];

  // Initialize scores
  useEffect(() => {
    if (type && players) {
      if (type.id === "century") {
        const initialScores = {};
        for (let i = 0; i < playerCount; i++) {
          initialScores[i] = {
            id: i,
            name: players[i] || `Player ${i + 1}`,
            score: 0,
          };
        }
        setScores(initialScores);
      } else if (type.id === "1v1") {
        setScores({
          0: { id: 0, name: players.player1 || "Player 1", score: 0 },
          1: { id: 1, name: players.player2 || "Player 2", score: 0 },
        });
      } else if (type.id === "2v2") {
        setScores({
          0: { id: 0, name: players.player1 || "Team 1 A", team: 1 },
          1: { id: 1, name: players.player2 || "Team 1 B", team: 1 },
          2: { id: 2, name: players.player3 || "Team 2 A", team: 2 },
          3: { id: 3, name: players.player4 || "Team 2 B", team: 2 },
        });
        setTeamScores({ 1: 0, 2: 0 });
      }
    }
  }, [type, players, playerCount]);

  const addPoints = (target, points) => {
    if (type.id === "2v2") {
      setHistory([
        ...history,
        { team: target, points, teamScores: { ...teamScores } },
      ]);
      setTeamScores((prev) => ({
        ...prev,
        [target]: (prev[target] || 0) + points,
      }));
    } else {
      setHistory([
        ...history,
        { playerId: target, points, scores: { ...scores } },
      ]);
      setScores((prev) => ({
        ...prev,
        [target]: {
          ...prev[target],
          score: (prev[target]?.score || 0) + points,
        },
      }));
    }
  };

  const undo = () => {
    if (history.length > 0) {
      const lastAction = history[history.length - 1];
      if (type.id === "2v2") {
        setTeamScores(lastAction.teamScores);
      } else {
        setScores(lastAction.scores);
      }
      setHistory(history.slice(0, -1));
    }
  };

  const finishMatch = async () => {
    setSaving(true);

    try {
      let winnerData = null;
      let finalScores = {};

      if (type.id === "century") {
        let highestScore = -1;
        let winnerName = "";
        let drawPlayers = [];

        Object.values(scores).forEach((player) => {
          finalScores[player.name] = player.score;
          if (player.score > highestScore) {
            highestScore = player.score;
            winnerName = player.name;
            drawPlayers = [player.name];
          } else if (player.score === highestScore) {
            drawPlayers.push(player.name);
          }
        });

        if (drawPlayers.length > 1) {
          setIsDraw(true);
          winnerData = {
            name: drawPlayers.join(" & "),
            isDraw: true,
          };
        } else {
          setIsDraw(false);
          winnerData = { name: winnerName, isDraw: false };
        }
      } else if (type.id === "1v1") {
        const p1Score = scores[0]?.score || 0;
        const p2Score = scores[1]?.score || 0;

        finalScores[scores[0].name] = p1Score;
        finalScores[scores[1].name] = p2Score;

        if (p1Score === p2Score) {
          setIsDraw(true);
          winnerData = {
            name: `${scores[0].name} & ${scores[1].name}`,
            isDraw: true,
          };
        } else {
          setIsDraw(false);
          const winnerName =
            p1Score > p2Score ? scores[0].name : scores[1].name;
          winnerData = { name: winnerName, isDraw: false };
        }
      } else if (type.id === "2v2") {
        const team1Score = teamScores[1] || 0;
        const team2Score = teamScores[2] || 0;

        finalScores["Team 1"] = team1Score;
        finalScores["Team 2"] = team2Score;

        if (team1Score === team2Score) {
          setIsDraw(true);
          winnerData = {
            name: "Team 1 & Team 2",
            isDraw: true,
          };
        } else {
          setIsDraw(false);
          const winnerName = team1Score > team2Score ? "Team 1" : "Team 2";
          winnerData = { name: winnerName, isDraw: false };
        }
      }

      // Prepare players array for saving
      const playersArray = Object.values(scores).map((p) => ({
        name: p.name,
        score: p.score || 0,
        team: p.team,
      }));

      // Save match to database
      try {
        await api.post("/matches/save", {
          matchType: type.id,
          players: playersArray,
          winner: winnerData,
          finalScores,
        });
        console.log("Match saved successfully");
      } catch (err) {
        console.error("Error saving match:", err);
        // Don't logout on error, just show error but still finish match
      }

      setWinner({
        ...winnerData,
        score: Math.max(...Object.values(finalScores)),
      });
      setOpenFinishDialog(true);
    } catch (err) {
      console.error("Error in finishMatch:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!type || !players) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            No match selected
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/setup-match")}
            sx={{ bgcolor: "#1B5E20", mt: 2 }}
          >
            Go to Match Setup
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4 }}>
      {/* Header */}
      <Paper
        sx={{
          p: isMobile ? 2 : 3,
          mb: 3,
          bgcolor: "#1B5E20",
          color: "white",
          borderRadius: 2,
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ fontWeight: 600 }}
            >
              {type.title}
            </Typography>
            {type.id === "century" && (
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                {playerCount} Players • Century Challenge
              </Typography>
            )}
          </Grid>
          <Grid item>
            <Chip
              icon={<EmojiEventsIcon />}
              label="LIVE"
              sx={{ bgcolor: "white", color: "#1B5E20", fontWeight: "bold" }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 2v2 Mode */}
      {type.id === "2v2" && (
        <Grid container spacing={isMobile ? 2 : 3}>
          {/* Team 1 */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: isMobile ? 2 : 3,
                border:
                  currentTeam === 1 ? "3px solid #1B5E20" : "1px solid #e0e0e0",
                bgcolor: "#e8f5e8",
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  sx={{ fontWeight: 600, color: "#1B5E20" }}
                >
                  Team 1
                </Typography>
                <Chip
                  label={`${scores[0]?.name} & ${scores[1]?.name}`}
                  size="small"
                />
              </Box>

              <Typography
                variant={isMobile ? "h1" : "h1"}
                align="center"
                sx={{
                  my: 2,
                  fontWeight: 700,
                  color: "#1B5E20",
                  fontSize: isMobile ? "4rem" : "6rem",
                }}
              >
                {teamScores[1] || 0}
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Points
              </Typography>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {regularPoints.map((points) => (
                  <Grid item xs={isMobile ? 4 : 3} key={points}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => addPoints(1, points)}
                      sx={{
                        bgcolor: "#1B5E20",
                        minHeight: isMobile ? 50 : 55,
                        fontSize: isMobile ? "1.1rem" : "1.3rem",
                        fontWeight: 700,
                      }}
                    >
                      +{points}
                    </Button>
                  </Grid>
                ))}
              </Grid>

              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Fouls
              </Typography>
              <Grid container spacing={1}>
                {simpleFouls.map((foul) => (
                  <Grid item xs={isMobile ? 6 : 3} key={foul.value}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => addPoints(1, foul.value)}
                      sx={{
                        bgcolor: foul.color,
                        minHeight: isMobile ? 45 : 50,
                      }}
                    >
                      {foul.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>

              <Button
                fullWidth
                variant={currentTeam === 1 ? "contained" : "outlined"}
                onClick={() => setCurrentTeam(1)}
                sx={{
                  mt: 2,
                  borderColor: "#1B5E20",
                  color: currentTeam === 1 ? "white" : "#1B5E20",
                  bgcolor: currentTeam === 1 ? "#1B5E20" : "transparent",
                }}
              >
                {currentTeam === 1 ? "Current Team" : "Set as Current"}
              </Button>
            </Paper>
          </Grid>

          {/* Team 2 */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: isMobile ? 2 : 3,
                border:
                  currentTeam === 2 ? "3px solid #FF6F00" : "1px solid #e0e0e0",
                bgcolor: "#fff3e0",
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  sx={{ fontWeight: 600, color: "#FF6F00" }}
                >
                  Team 2
                </Typography>
                <Chip
                  label={`${scores[2]?.name} & ${scores[3]?.name}`}
                  size="small"
                />
              </Box>

              <Typography
                variant={isMobile ? "h1" : "h1"}
                align="center"
                sx={{
                  my: 2,
                  fontWeight: 700,
                  color: "#FF6F00",
                  fontSize: isMobile ? "4rem" : "6rem",
                }}
              >
                {teamScores[2] || 0}
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Points
              </Typography>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {regularPoints.map((points) => (
                  <Grid item xs={isMobile ? 4 : 3} key={points}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => addPoints(2, points)}
                      sx={{
                        bgcolor: "#FF6F00",
                        minHeight: isMobile ? 50 : 55,
                        fontSize: isMobile ? "1.1rem" : "1.3rem",
                        fontWeight: 700,
                      }}
                    >
                      +{points}
                    </Button>
                  </Grid>
                ))}
              </Grid>

              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Fouls
              </Typography>
              <Grid container spacing={1}>
                {simpleFouls.map((foul) => (
                  <Grid item xs={isMobile ? 6 : 3} key={foul.value}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => addPoints(2, foul.value)}
                      sx={{
                        bgcolor: foul.color,
                        minHeight: isMobile ? 45 : 50,
                      }}
                    >
                      {foul.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>

              <Button
                fullWidth
                variant={currentTeam === 2 ? "contained" : "outlined"}
                onClick={() => setCurrentTeam(2)}
                sx={{
                  mt: 2,
                  borderColor: "#FF6F00",
                  color: currentTeam === 2 ? "white" : "#FF6F00",
                  bgcolor: currentTeam === 2 ? "#FF6F00" : "transparent",
                }}
              >
                {currentTeam === 2 ? "Current Team" : "Set as Current"}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* 1v1 Mode */}
      {type.id === "1v1" && (
        <Grid container spacing={isMobile ? 2 : 3}>
          {[0, 1].map((playerId) => (
            <Grid item xs={12} md={6} key={playerId}>
              <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant={isMobile ? "h5" : "h4"}>
                    {scores[playerId]?.name}
                  </Typography>
                  {currentPlayer === playerId && (
                    <Chip
                      label="Current"
                      size="small"
                      sx={{ bgcolor: "#1B5E20", color: "white" }}
                    />
                  )}
                </Box>

                <Typography
                  variant={isMobile ? "h1" : "h1"}
                  align="center"
                  sx={{
                    my: 2,
                    fontWeight: 700,
                    fontSize: isMobile ? "4rem" : "6rem",
                  }}
                >
                  {scores[playerId]?.score || 0}
                </Typography>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Points
                </Typography>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  {regularPoints.map((points) => (
                    <Grid item xs={isMobile ? 4 : 3} key={points}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => addPoints(playerId, points)}
                        sx={{
                          bgcolor: "#1B5E20",
                          minHeight: isMobile ? 50 : 55,
                          fontSize: isMobile ? "1.1rem" : "1.3rem",
                        }}
                      >
                        +{points}
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Fouls
                </Typography>
                <Grid container spacing={1}>
                  {simpleFouls.map((foul) => (
                    <Grid item xs={isMobile ? 6 : 3} key={foul.value}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => addPoints(playerId, foul.value)}
                        sx={{
                          bgcolor: foul.color,
                          minHeight: isMobile ? 45 : 50,
                        }}
                      >
                        {foul.label}
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                <Button
                  fullWidth
                  variant={
                    currentPlayer === playerId ? "contained" : "outlined"
                  }
                  onClick={() => setCurrentPlayer(playerId)}
                  sx={{
                    mt: 2,
                    borderColor: "#1B5E20",
                    color: currentPlayer === playerId ? "white" : "#1B5E20",
                    bgcolor:
                      currentPlayer === playerId ? "#1B5E20" : "transparent",
                  }}
                >
                  {currentPlayer === playerId
                    ? "Current Player"
                    : "Set as Current"}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Century Mode */}
      {type.id === "century" && (
        <Grid container spacing={isMobile ? 2 : 3}>
          {Object.values(scores).map((player) => (
            <Grid
              item
              key={player.id}
              xs={12}
              sm={playerCount <= 2 ? 6 : 12}
              md={playerCount <= 2 ? 6 : playerCount <= 4 ? 6 : 4}
            >
              <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    sx={{ fontWeight: 600 }}
                  >
                    {player.name}
                  </Typography>
                  {currentPlayer === player.id && (
                    <Chip
                      label="Current"
                      size="small"
                      sx={{ bgcolor: "#1B5E20", color: "white" }}
                    />
                  )}
                </Box>

                <Typography
                  variant={isMobile ? "h2" : "h1"}
                  align="center"
                  sx={{
                    my: 2,
                    fontWeight: 700,
                    color: "#1B5E20",
                  }}
                >
                  {player.score}
                </Typography>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Balls
                </Typography>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  {centuryBalls.map((ball) => (
                    <Grid item xs={isMobile ? 4 : 3} key={ball.value}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => addPoints(player.id, ball.value)}
                        sx={{
                          bgcolor: ball.bg,
                          color: ball.textColor || "white",
                          minHeight: isMobile ? 45 : 50,
                        }}
                      >
                        {ball.label}
                        <br />
                        {ball.value}
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Fouls
                </Typography>
                <Grid container spacing={1}>
                  {centuryFouls.map((foul) => (
                    <Grid item xs={isMobile ? 4 : 2.4} key={foul.value}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => addPoints(player.id, foul.value)}
                        sx={{
                          bgcolor: foul.color,
                          minHeight: isMobile ? 40 : 45,
                        }}
                      >
                        {foul.label}
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                <Button
                  fullWidth
                  variant={
                    currentPlayer === player.id ? "contained" : "outlined"
                  }
                  onClick={() => setCurrentPlayer(player.id)}
                  sx={{
                    mt: 2,
                    borderColor: "#1B5E20",
                    color: currentPlayer === player.id ? "white" : "#1B5E20",
                    bgcolor:
                      currentPlayer === player.id ? "#1B5E20" : "transparent",
                  }}
                >
                  {currentPlayer === player.id
                    ? "Current Player"
                    : "Set as Current"}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Controls */}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          gap: 2,
          justifyContent: "center",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<UndoIcon />}
          onClick={undo}
          disabled={history.length === 0 || saving}
          fullWidth={isMobile}
          sx={{ borderColor: "#1B5E20", color: "#1B5E20" }}
        >
          Undo Last Shot
        </Button>
        <Button
          variant="contained"
          onClick={finishMatch}
          disabled={saving}
          fullWidth={isMobile}
          sx={{ bgcolor: "#FF6F00" }}
        >
          {saving ? "Saving..." : "Finish Match"}
        </Button>
      </Box>

      {/* Winner Dialog */}
      <Dialog
        open={openFinishDialog}
        onClose={() => setOpenFinishDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: isDraw ? "#FF6F00" : "#1B5E20",
            color: "white",
            textAlign: "center",
          }}
        >
          {isDraw ? "🤝 Match Drawn! 🤝" : "🏆 Match Finished! 🏆"}
        </DialogTitle>
        <DialogContent sx={{ p: 4, textAlign: "center" }}>
          {winner && (
            <>
              <Typography
                variant="h2"
                gutterBottom
                sx={{
                  color: isDraw ? "#FF6F00" : "#1B5E20",
                  fontWeight: 700,
                }}
              >
                {winner.name}
              </Typography>
              <Typography variant="h4" color="text.secondary">
                {isDraw
                  ? `All players scored ${winner.score} points!`
                  : `Winner with ${winner.score} points!`}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => {
              setOpenFinishDialog(false);
              navigate("/dashboard");
            }}
            variant="contained"
            sx={{ bgcolor: "#1B5E20" }}
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => {
              setOpenFinishDialog(false);
              navigate("/setup-match");
            }}
            variant="outlined"
            sx={{ borderColor: "#1B5E20", color: "#1B5E20" }}
          >
            New Match
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LiveMatch;
