import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";

import { PathConstants } from "@app/constants";

import { StyledSignInPage, StyledMessage } from "./SignInPage.styles";

export const SignInPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { protectedRouteName, protectedRoute } = location.state ?? {};

  const onSignIn = () => {
    // TODO: sign in
    const user = {};
    if (user.isAdmin) {
      navigate(protectedRoute);
    } else {
      const options = {
        state: {
          protectedRouteName,
        },
      };
      navigate(PathConstants.NoAccess, options);
    }
  };

  return (
    <StyledSignInPage>
      <StyledMessage>
        You must be signed in to access the {protectedRouteName} page
      </StyledMessage>
      <Button onClick={onSignIn}>
        Sign In&nbsp;
        <GitHubIcon />
      </Button>
    </StyledSignInPage>
  );
};
