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

import { HomePage, CrosswordPage, AdminPage, NotFoundPage } from "@app/pages";
import { Layout } from "@app/components";
import { PathConstants } from "@app/constants";
import { UserContextProvider } from "@app/contexts/user";

import { GlobalStyles } from "./Global.styles";
import { Version } from "./Version";
import "./firebase";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: PathConstants.Home,
        element: <HomePage />,
      },
      {
        path: PathConstants.Crossword,
        element: <CrosswordPage />,
      },
      {
        path: PathConstants.Admin,
        element: <AdminPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
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
        <UserContextProvider>
          <RouterProvider router={router} />
        </UserContextProvider>
        <Version />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
