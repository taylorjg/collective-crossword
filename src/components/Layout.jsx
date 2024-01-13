import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Container } from "@mui/material";

export const Layout = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Header />
      <main>
        <Outlet />
      </main>
    </Container>
  );
};
