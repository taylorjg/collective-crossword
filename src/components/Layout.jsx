import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";

import { Header } from "./Header";
// import { Version } from "./Version";

export const Layout = () => {
  return (
    <Container maxWidth={"xl"} disableGutters>
      <Header />
      <main>
        <Outlet />
      </main>
      {/* <Version /> */}
    </Container>
  );
};
