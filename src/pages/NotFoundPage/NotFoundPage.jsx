import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { PathConstants } from "@app/constants";

import { StyledNotFoundPage, StyledMessage } from "./NotFoundPage.styles";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const onHome = () => {
    navigate(PathConstants.Home);
  };

  return (
    <StyledNotFoundPage>
      <StyledMessage>Page not found!</StyledMessage>
      <Button onClick={onHome}>Home</Button>
    </StyledNotFoundPage>
  );
};
