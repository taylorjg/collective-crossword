import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Container, Toolbar } from "@mui/material";

export const Layout = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Header />

      {/* Option 2 listed here: https://mui.com/material-ui/react-app-bar/#fixed-placement */}
      <Toolbar />

      <main>
        <Outlet />
      </main>
    </Container>
  );
};
