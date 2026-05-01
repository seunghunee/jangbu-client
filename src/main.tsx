import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { App } from "./App";
import { setItemIconConfig } from "./components/itemIcons";
import "./styles.css";
import theme from "./theme";

setItemIconConfig(window.__JANGBU_RUNTIME_CONFIG__?.itemIconConfig ?? null);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
