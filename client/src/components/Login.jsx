import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import api from "../services/api";

const Login = ({ open, onClose }) => {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const endpoint = tabValue === 0 ? "login" : "register";
      const response = await api.post(`/auth/${endpoint}`, {
        email: formData.email,
        password: formData.password,
        ...(tabValue === 1 && { username: formData.username }),
      });

      localStorage.setItem("token", response.data.token);
      dispatch(setUser(response.data.user));
      onClose();

      // Reset form
      setFormData({ username: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          margin: isMobile ? 0 : 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#1B5E20",
          color: "white",
          textAlign: "center",
          py: isMobile ? 2 : 3,
        }}
      >
        🎱 Snooker Scorer
      </DialogTitle>

      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiTab-root": {
            fontSize: isMobile ? "0.875rem" : "1rem",
          },
        }}
      >
        <Tab label="Login" sx={{ flex: 1 }} />
        <Tab label="Register" sx={{ flex: 1 }} />
      </Tabs>

      <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
        <Box sx={{ mt: isMobile ? 1 : 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {tabValue === 1 && (
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              size={isMobile ? "small" : "medium"}
              autoFocus
            />
          )}

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            size={isMobile ? "small" : "medium"}
            autoFocus={tabValue === 0}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            size={isMobile ? "small" : "medium"}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: isMobile ? 2 : 3,
          flexDirection: "column",
          gap: 1,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            bgcolor: "#1B5E20",
            "&:hover": { bgcolor: "#0A3A0A" },
            py: isMobile ? 1 : 1.5,
          }}
        >
          {loading ? "Please wait..." : tabValue === 0 ? "Login" : "Register"}
        </Button>

        <Typography variant="body2" color="text.secondary">
          {tabValue === 0
            ? "Don't have an account? "
            : "Already have an account? "}
          <Button
            color="primary"
            onClick={() => setTabValue(tabValue === 0 ? 1 : 0)}
            sx={{
              textTransform: "none",
              fontSize: isMobile ? "0.8rem" : "0.9rem",
            }}
          >
            {tabValue === 0 ? "Register" : "Login"}
          </Button>
        </Typography>
      </DialogActions>
    </Dialog>
  );
};

export default Login;
