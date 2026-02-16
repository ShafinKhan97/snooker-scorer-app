import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import HistoryIcon from "@mui/icons-material/History";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Mock data - replace with actual data from backend later
  const stats = {
    matchesPlayed: 0,
    matchesWon: 0,
    highestBreak: 0,
    totalPoints: 0,
  };

  const recentMatches = []; // Empty for now

  return (
    <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4 }}>
      {/* Welcome Section */}
      <Paper
        sx={{
          p: isMobile ? 2 : 3,
          mb: 3,
          bgcolor: "#1B5E20",
          color: "white",
          borderRadius: 2,
        }}
      >
        <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>
          Welcome back, {user?.username || "Player"}! 👋
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
          Ready to play some snooker?
        </Typography>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card sx={{ textAlign: "center", p: isMobile ? 1 : 2 }}>
            <SportsEsportsIcon
              sx={{ fontSize: isMobile ? 30 : 40, color: "#1B5E20" }}
            />
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{ fontWeight: 600, mt: 1 }}
            >
              {stats.matchesPlayed}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Matches Played
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ textAlign: "center", p: isMobile ? 1 : 2 }}>
            <EmojiEventsIcon
              sx={{ fontSize: isMobile ? 30 : 40, color: "#FF6F00" }}
            />
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{ fontWeight: 600, mt: 1 }}
            >
              {stats.matchesWon}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Matches Won
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ textAlign: "center", p: isMobile ? 1 : 2 }}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{ fontWeight: 600, color: "#1B5E20" }}
            >
              {stats.highestBreak}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Highest Break
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ textAlign: "center", p: isMobile ? 1 : 2 }}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{ fontWeight: 600, color: "#1B5E20" }}
            >
              {stats.totalPoints}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Points
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: isMobile ? 2 : 3, mb: 4, borderRadius: 2 }}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate("/setup-match")}
              sx={{
                bgcolor: "#1B5E20",
                py: isMobile ? 1.5 : 2,
              }}
            >
              Start New Match
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/profile")}
              sx={{
                borderColor: "#1B5E20",
                color: "#1B5E20",
                py: isMobile ? 1.5 : 2,
              }}
            >
              View Profile
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              disabled
              sx={{ py: isMobile ? 1.5 : 2 }}
            >
              Match History (Coming Soon)
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Recent Matches */}
      <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Recent Matches
        </Typography>
        {recentMatches.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <HistoryIcon sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No matches played yet
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/setup-match")}
              sx={{ mt: 2, bgcolor: "#1B5E20" }}
            >
              Start Your First Match
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {/* Map through recent matches here */}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;
