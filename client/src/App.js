import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { theme } from "./themes/theme";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

// Pages
import Home from "./pages/Home";
import MatchSetup from "./pages/MatchSetup";
import LiveMatch from "./pages/LiveMatch";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

// Components
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// Redux actions
import { setUser } from "./store/authSlice";
import api from "./services/api";

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me")
        .then((response) => {
          dispatch(setUser(response.data.user));
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />

        {/* Protected Routes */}
        <Route
          path="/setup-match"
          element={
            <PrivateRoute>
              <MatchSetup />
            </PrivateRoute>
          }
        />
        <Route
          path="/match/:type"
          element={
            <PrivateRoute>
              <LiveMatch />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Catch all route - 404 */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
