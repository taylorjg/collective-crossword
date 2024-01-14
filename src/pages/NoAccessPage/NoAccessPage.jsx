import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { PathConstants } from "@app/constants";

import { StyledNoAccessPage, StyledMessage } from "./NoAccessPage.styles";

export const NoAccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { protectedRouteName } = location.state ?? {};

  const onHome = () => {
    navigate(PathConstants.Home);
  };

  const message = protectedRouteName
    ? `You don't have access to the ${protectedRouteName} page`
    : "No access!";

  return (
    <StyledNoAccessPage>
      <StyledMessage>{message}</StyledMessage>
      <Button onClick={onHome}>Home</Button>
    </StyledNoAccessPage>
  );
};
