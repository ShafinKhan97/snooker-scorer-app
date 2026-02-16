import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import GroupIcon from "@mui/icons-material/Group";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const MatchSetup = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [selectedType, setSelectedType] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState({});

  const matchTypes = [
    {
      id: "1v1",
      title: "1 vs 1",
      icon: (
        <SportsEsportsIcon
          sx={{ fontSize: isMobile ? 40 : 60, color: "#1B5E20" }}
        />
      ),
      description: "Classic one-on-one match",
      color: "#1B5E20",
    },
    {
      id: "2v2",
      title: "2 vs 2",
      icon: (
        <GroupIcon sx={{ fontSize: isMobile ? 40 : 60, color: "#1B5E20" }} />
      ),
      description: "Team doubles match",
      color: "#1B5E20",
    },
    {
      id: "century",
      title: "Century Challenge",
      icon: (
        <EmojiEventsIcon
          sx={{ fontSize: isMobile ? 40 : 60, color: "#1B5E20" }}
        />
      ),
      description: "Practice with multiple players",
      color: "#1B5E20",
    },
  ];

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setActiveStep(0);
    setPlayerCount(2);
    setPlayers({});
    setOpenDialog(true);
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleStartMatch = () => {
    setOpenDialog(false);

    // Create a serializable version of the match type (without the icon)
    const serializableType = {
      id: selectedType.id,
      title: selectedType.title,
      description: selectedType.description,
      color: selectedType.color,
    };

    if (selectedType.id === "century") {
      const centuryPlayers = {};
      for (let i = 0; i < playerCount; i++) {
        centuryPlayers[i] = players[i]?.trim() || `Player ${i + 1}`;
      }
      navigate(`/match/${selectedType.id}`, {
        state: {
          type: serializableType,
          players: centuryPlayers,
          playerCount,
        },
      });
    } else if (selectedType.id === "1v1") {
      navigate(`/match/${selectedType.id}`, {
        state: {
          type: serializableType,
          players: {
            player1: players.player1?.trim() || "Player 1",
            player2: players.player2?.trim() || "Player 2",
          },
        },
      });
    } else if (selectedType.id === "2v2") {
      navigate(`/match/${selectedType.id}`, {
        state: {
          type: serializableType,
          players: {
            player1: players.player1?.trim() || "Team 1 Player 1",
            player2: players.player2?.trim() || "Team 1 Player 2",
            player3: players.player3?.trim() || "Team 2 Player 1",
            player4: players.player4?.trim() || "Team 2 Player 2",
          },
        },
      });
    }
  };

  const renderDialogContent = () => {
    if (!selectedType) return null;

    if (selectedType.id === "century") {
      return (
        <>
          <Stepper activeStep={activeStep} sx={{ my: 2 }}>
            <Step>
              <StepLabel>Players</StepLabel>
            </Step>
            <Step>
              <StepLabel>Names</StepLabel>
            </Step>
          </Stepper>
          {activeStep === 0 ? (
            <FormControl fullWidth>
              <InputLabel>Number of Players</InputLabel>
              <Select
                value={playerCount}
                label="Number of Players"
                onChange={(e) => setPlayerCount(e.target.value)}
              >
                {[2, 3, 4, 5, 6].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num} Players
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Box>
              {[...Array(playerCount)].map((_, i) => (
                <TextField
                  key={i}
                  fullWidth
                  margin="dense"
                  label={`Player ${i + 1} Name`}
                  value={players[i] || ""}
                  onChange={(e) =>
                    setPlayers({ ...players, [i]: e.target.value })
                  }
                />
              ))}
            </Box>
          )}
        </>
      );
    }

    if (selectedType.id === "1v1") {
      return (
        <Box>
          <TextField
            fullWidth
            margin="dense"
            label="Player 1 Name"
            value={players.player1 || ""}
            onChange={(e) =>
              setPlayers({ ...players, player1: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Player 2 Name"
            value={players.player2 || ""}
            onChange={(e) =>
              setPlayers({ ...players, player2: e.target.value })
            }
          />
        </Box>
      );
    }

    if (selectedType.id === "2v2") {
      return (
        <Box>
          <Chip
            label="Team 1"
            sx={{ bgcolor: "#1B5E20", color: "white", my: 1 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Player 1 Name"
            value={players.player1 || ""}
            onChange={(e) =>
              setPlayers({ ...players, player1: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Player 2 Name"
            value={players.player2 || ""}
            onChange={(e) =>
              setPlayers({ ...players, player2: e.target.value })
            }
          />
          <Chip
            label="Team 2"
            sx={{ bgcolor: "#FF6F00", color: "white", my: 1 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Player 3 Name"
            value={players.player3 || ""}
            onChange={(e) =>
              setPlayers({ ...players, player3: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Player 4 Name"
            value={players.player4 || ""}
            onChange={(e) =>
              setPlayers({ ...players, player4: e.target.value })
            }
          />
        </Box>
      );
    }
  };

  const renderDialogActions = () => {
    if (selectedType?.id === "century") {
      return (
        <>
          {activeStep === 1 && <Button onClick={handleBack}>Back</Button>}
          <Button
            variant="contained"
            onClick={activeStep === 0 ? handleNext : handleStartMatch}
            sx={{ bgcolor: "#1B5E20" }}
          >
            {activeStep === 0 ? "Next" : "Start Match"}
          </Button>
        </>
      );
    }
    return (
      <>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleStartMatch}
          sx={{ bgcolor: "#1B5E20" }}
        >
          Start Match
        </Button>
      </>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: isMobile ? 2 : 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, borderRadius: 4 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "#1B5E20" }}
        >
          Select Match Type
        </Typography>

        <Grid container spacing={isMobile ? 2 : 4}>
          {matchTypes.map((type) => (
            <Grid item xs={12} sm={6} md={4} key={type.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>{type.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {type.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {type.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleTypeSelect(type)}
                    sx={{ bgcolor: "#1B5E20" }}
                  >
                    Select
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </Box>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#1B5E20", color: "white" }}>
          {selectedType?.title} Setup
        </DialogTitle>
        <DialogContent>{renderDialogContent()}</DialogContent>
        <DialogActions>{renderDialogActions()}</DialogActions>
      </Dialog>
    </Container>
  );
};

export default MatchSetup;
