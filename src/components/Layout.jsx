import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";

import { Header } from "./Header";

export const Layout = () => {
  return (
    <Container maxWidth={"xl"} disableGutters>
      <Header />
      <main>
        <Outlet />
      </main>
    </Container>
  );
};
