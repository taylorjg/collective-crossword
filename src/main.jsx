import React from "react";
import ReactDOM from "react-dom/client";
import { Global } from "@emotion/react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { GlobalStyles } from "./Global.styles";
import { App } from "./App.jsx";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Global styles={GlobalStyles} />
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
