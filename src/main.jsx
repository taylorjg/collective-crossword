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

import {
  HomePage,
  CrosswordPage,
  UsersPage,
  AdminPage,
  NotFoundPage,
  NoAccessPage,
  SignInPage,
} from "@app/pages";
import { ProtectedRoute } from "@app/components";
import { Layout } from "@app/components";
import { PathConstants } from "@app/constants";
import { AuthContextProvider, ToastContextProvider } from "@app/contexts";

import { GlobalStyles } from "./Global.styles";
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
        path: PathConstants.Users,
        element: <UsersPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: PathConstants.Admin,
            element: <AdminPage />,
          },
        ],
      },
      {
        path: PathConstants.SignIn,
        element: <SignInPage />,
      },
      {
        path: PathConstants.NoAccess,
        element: <NoAccessPage />,
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
        <ToastContextProvider>
          <AuthContextProvider>
            <RouterProvider router={router} />
          </AuthContextProvider>
        </ToastContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
