import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  shape: {
    borderRadius: 14,
  },
  palette: {
    mode: "light",
    primary: {
      main: "#15803d",
    },
    secondary: {
      main: "#ea580c",
    },
    background: {
      default: "#edf1f7",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
    },
  },
  typography: {
    fontFamily: '"Pretendard Variable", "Noto Sans KR", "Segoe UI", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 14,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
