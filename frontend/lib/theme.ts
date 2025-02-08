import { createTheme } from "@mui/material/styles";


const theme = createTheme({
  palette: {
    primary: {
      main: "#82cfff",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#5db1ff",
    },
    background: {
      default: "#f9f9f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#5db1ff",
    },
    action: {
      hover: "#cceeff",
    },
    divider: "#d1e7ff",
  },

  typography: {
    fontFamily: "'Roboto', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#333333",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#333333",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
      color: "#333333",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: "#333333",
    },
    body2: {
      fontSize: "0.875rem",
      color: "#555555",
    },
    button: {
      fontSize: "1rem",
      fontWeight: 600,
      textTransform: "none",
    },
  },
});

export default theme;
