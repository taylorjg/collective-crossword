import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Global } from "@emotion/react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { HomePage, CrosswordPage, AdminPage, NoMatchPage } from "@app/pages";

import { GlobalStyles } from "./Global.styles";
import { Version } from "./Version";
import "./firebase";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/crosswords/:id",
    element: <CrosswordPage />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "*",
    element: <NoMatchPage />,
  },
]);

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Global styles={GlobalStyles} />
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Version />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
