import { alpha, createTheme, responsiveFontSizes } from "@mui/material/styles";

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
    h5: {
      fontSize: "1.45rem",
      fontWeight: 700,
      lineHeight: 1.22,
      letterSpacing: "-0.02em",
      "@media (max-width:600px)": {
        fontSize: "1.28rem",
      },
    },
    h6: {
      fontSize: "1.18rem",
      fontWeight: 700,
      lineHeight: 1.22,
      letterSpacing: "-0.01em",
      "@media (max-width:600px)": {
        fontSize: "1.06rem",
      },
    },
    subtitle1: {
      fontSize: "1.06rem",
      lineHeight: 1.3,
      "@media (max-width:600px)": {
        fontSize: "0.98rem",
      },
    },
    body1: {
      fontSize: "0.97rem",
      lineHeight: 1.45,
      "@media (max-width:600px)": {
        fontSize: "0.92rem",
      },
    },
    body2: {
      fontSize: "0.9rem",
      lineHeight: 1.4,
      "@media (max-width:600px)": {
        fontSize: "0.84rem",
      },
    },
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
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minWidth: 320,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 14,
          fontWeight: 700,
        },
        outlined: ({ theme }) => ({
          borderColor: alpha(theme.palette.text.primary, 0.16),
        }),
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 20,
          border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
          backgroundImage: "none",
          boxShadow: "none",
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          ":last-child": {
            paddingBottom: 16,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          backgroundColor: theme.palette.background.paper,
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          justifyContent: "flex-start",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({
          fontWeight: 700,
          color: theme.palette.text.secondary,
        }),
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
