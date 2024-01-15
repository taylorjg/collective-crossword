import { useEffect } from "react";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";

import { PathConstants } from "@app/constants";
import { useAuth } from "@app/contexts";

import { StyledSignInPage, StyledMessage } from "./SignInPage.styles";

export const SignInPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, onSignIn } = useAuth();

  const { protectedRouteName, protectedRoute } = location.state ?? {};

  useEffect(() => {
    if (user) {
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
    }
  }, [user, navigate, protectedRoute, protectedRouteName]);

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
