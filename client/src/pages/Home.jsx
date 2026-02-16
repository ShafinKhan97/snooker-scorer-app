import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import TimelineIcon from "@mui/icons-material/Timeline";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const theme = useTheme();

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const features = [
    {
      icon: (
        <SportsEsportsIcon
          sx={{ fontSize: isMobile ? 40 : 60, color: "#1B5E20" }}
        />
      ),
      title: "1v1 & 2v2 Matches",
      description: "Play classic snooker matches with friends",
    },
    {
      icon: (
        <TimelineIcon sx={{ fontSize: isMobile ? 40 : 60, color: "#1B5E20" }} />
      ),
      title: "Live Scoring",
      description: "Real-time score tracking with ball values",
    },
    {
      icon: (
        <EmojiEventsIcon
          sx={{ fontSize: isMobile ? 40 : 60, color: "#1B5E20" }}
        />
      ),
      title: "Century Challenge",
      description: "Practice mode with multiple players",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        pt: isMobile ? 4 : isTablet ? 6 : 8,
        pb: isMobile ? 4 : isTablet ? 6 : 8,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={isMobile ? 2 : isTablet ? 3 : 4}>
          {/* Hero Section */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: isMobile ? 3 : isTablet ? 4 : 6,
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: isMobile ? "2rem" : isTablet ? "2.5rem" : "3rem",
                  fontWeight: 700,
                  color: "#1B5E20",
                  mb: 2,
                }}
              >
                🎱 Snooker Scorer
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontSize: isMobile ? "1rem" : isTablet ? "1.2rem" : "1.5rem",
                  color: "text.secondary",
                  mb: 4,
                  maxWidth: "800px",
                  mx: "auto",
                }}
              >
                Track your snooker matches with style. Real-time scoring,
                multiple players, and beautiful analytics.
              </Typography>

              {!isAuthenticated && (
                <Typography
                  variant="body1"
                  sx={{
                    color: "#FF6F00",
                    mb: 3,
                    fontWeight: 500,
                  }}
                >
                  🔐 Please login or register to start playing
                </Typography>
              )}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  size={isMobile ? "medium" : "large"}
                  onClick={() => navigate("/setup-match")}
                  disabled={!isAuthenticated}
                  fullWidth={isMobile}
                  sx={{
                    bgcolor: "#1B5E20",
                    "&:hover": { bgcolor: "#0A3A0A" },
                    "&:disabled": { bgcolor: "#ccc" },
                    minWidth: isMobile ? "100%" : "200px",
                  }}
                >
                  Start New Match
                </Button>

                <Button
                  variant="outlined"
                  size={isMobile ? "medium" : "large"}
                  onClick={() => navigate("/dashboard")}
                  disabled={!isAuthenticated}
                  fullWidth={isMobile}
                  sx={{
                    borderColor: "#1B5E20",
                    color: "#1B5E20",
                    "&:hover": {
                      borderColor: "#0A3A0A",
                      bgcolor: "rgba(27, 94, 32, 0.04)",
                    },
                    minWidth: isMobile ? "100%" : "200px",
                  }}
                >
                  View Dashboard
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Features Section */}
          <Grid item xs={12}>
            <Typography
              variant="h2"
              sx={{
                fontSize: isMobile ? "1.5rem" : isTablet ? "2rem" : "2.5rem",
                color: "white",
                textAlign: "center",
                mb: isMobile ? 2 : 3,
                mt: isMobile ? 2 : 3,
              }}
            >
              Why Choose Snooker Scorer?
            </Typography>

            <Grid
              container
              spacing={isMobile ? 2 : isTablet ? 3 : 4}
              justifyContent="center"
            >
              {features.map((feature, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: isMobile ? 2 : 3,
                      height: "100%",
                      textAlign: "center",
                      borderRadius: 4,
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: isDesktop ? "translateY(-8px)" : "none",
                        boxShadow: isDesktop ? 8 : 2,
                      },
                    }}
                  >
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: isMobile ? "1.1rem" : "1.3rem",
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: isMobile ? "0.875rem" : "1rem",
                        color: "text.secondary",
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
