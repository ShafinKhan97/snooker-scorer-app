import React, { useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  Alert,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock data - replace with actual data from backend
  const stats = {
    memberSince: new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    matchesPlayed: 0,
    matchesWon: 0,
    winRate: "0%",
    highestBreak: 0,
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // Here you would make an API call to update user profile
    setShowSuccess(true);
    setIsEditing(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
      {/* Success Alert */}
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{ p: isMobile ? 2 : 3, borderRadius: 2, textAlign: "center" }}
          >
            <Avatar
              sx={{
                width: isMobile ? 80 : 120,
                height: isMobile ? 80 : 120,
                bgcolor: "#1B5E20",
                fontSize: isMobile ? "2rem" : "3rem",
                margin: "0 auto",
                mb: 2,
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>

            {!isEditing ? (
              <>
                <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
                  {user?.username}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {user?.email}
                </Typography>
                <Chip
                  icon={<CalendarTodayIcon />}
                  label={`Member since ${stats.memberSince}`}
                  size="small"
                  sx={{ mb: 2 }}
                />
              </>
            ) : (
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  value={formData.username}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                />
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                />
              </Box>
            )}

            <Box
              sx={{ display: "flex", gap: 1, justifyContent: "center", mt: 2 }}
            >
              {!isEditing ? (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{ bgcolor: "#1B5E20" }}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{ bgcolor: "#1B5E20" }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        username: user?.username,
                        email: user?.email,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Paper>
        </Grid>

        {/* Stats Card */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Player Statistics
            </Typography>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#f5f5f5" }}>
                  <Typography
                    variant="h4"
                    sx={{ color: "#1B5E20", fontWeight: 700 }}
                  >
                    {stats.matchesPlayed}
                  </Typography>
                  <Typography variant="body2">Matches</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#f5f5f5" }}>
                  <Typography
                    variant="h4"
                    sx={{ color: "#FF6F00", fontWeight: 700 }}
                  >
                    {stats.matchesWon}
                  </Typography>
                  <Typography variant="body2">Wins</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#f5f5f5" }}>
                  <Typography
                    variant="h4"
                    sx={{ color: "#1B5E20", fontWeight: 700 }}
                  >
                    {stats.winRate}
                  </Typography>
                  <Typography variant="body2">Win Rate</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#f5f5f5" }}>
                  <Typography
                    variant="h4"
                    sx={{ color: "#1B5E20", fontWeight: 700 }}
                  >
                    {stats.highestBreak}
                  </Typography>
                  <Typography variant="body2">High Break</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant={isMobile ? "h6" : "h5"}
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Account Information
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonIcon sx={{ color: "#1B5E20" }} />
                      <Typography variant="body2">
                        Username: <strong>{user?.username}</strong>
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon sx={{ color: "#1B5E20" }} />
                      <Typography variant="body2">
                        Email: <strong>{user?.email}</strong>
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
