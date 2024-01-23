import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";

import { Header } from "./Header";
import { Version } from "./Version";

export const Layout = () => {
  return (
    <Container maxWidth="lg" disableGutters sx={{ mt: 2 }}>
      <Header />
      <main>
        <Outlet />
      </main>
      <Version />
    </Container>
  );
};
