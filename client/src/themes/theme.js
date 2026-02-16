import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: "#1B5E20",
      light: "#4CAF50",
      dark: "#0A3A0A",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FF6F00",
      light: "#FFB74D",
      dark: "#B85C00",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F5F7FA",
      paper: "#FFFFFF",
    },
    success: {
      main: "#4CAF50",
    },
    error: {
      main: "#F44336",
    },
    warning: {
      main: "#FF9800",
    },
    info: {
      main: "#2196F3",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      "@media (min-width:600px)": {
        fontSize: "3rem",
      },
      "@media (min-width:960px)": {
        fontSize: "3.5rem",
      },
      "@media (min-width:1280px)": {
        fontSize: "4rem",
      },
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      "@media (min-width:600px)": {
        fontSize: "2.5rem",
      },
      "@media (min-width:960px)": {
        fontSize: "3rem",
      },
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      "@media (min-width:600px)": {
        fontSize: "2rem",
      },
      "@media (min-width:960px)": {
        fontSize: "2.25rem",
      },
    },
    body1: {
      fontSize: "0.875rem",
      "@media (min-width:600px)": {
        fontSize: "1rem",
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 16px",
          "@media (min-width:600px)": {
            padding: "10px 24px",
          },
          "@media (min-width:960px)": {
            padding: "12px 32px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});
