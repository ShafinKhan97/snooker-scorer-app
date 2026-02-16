import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import Login from "./Login";

const Navbar = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate("/");
  };

  const menuItems = [
    { text: "Home", onClick: () => navigate("/") },
    ...(isAuthenticated
      ? [
          { text: "New Match", onClick: () => navigate("/setup-match") },
          { text: "Dashboard", onClick: () => navigate("/dashboard") },
        ]
      : []),
  ];

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#1B5E20" }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              cursor: "pointer",
              fontSize: isMobile ? "1rem" : "1.25rem",
            }}
            onClick={() => navigate("/")}
          >
            🎱 Snooker Scorer
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2 }}>
              {menuItems.map((item, index) => (
                <Button key={index} color="inherit" onClick={item.onClick}>
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {isAuthenticated ? (
            <Box>
              <IconButton size="large" onClick={handleMenu} color="inherit">
                <Avatar sx={{ bgcolor: "#FF6F00" }}>
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled sx={{ fontWeight: "bold" }}>
                  Hello, {user?.username}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/profile");
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button color="inherit" onClick={() => setLoginOpen(true)}>
              Login / Register
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box
          sx={{
            width: 250,
            bgcolor: "#1B5E20",
            height: "100%",
            color: "white",
          }}
        >
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() => {
                  item.onClick();
                  setMobileMenuOpen(false);
                }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Login Dialog */}
      <Login open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default Navbar;
