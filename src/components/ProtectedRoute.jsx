import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "@app/contexts";
import { PathConstants } from "@app/constants";
import { useRouteMatch } from "@app/hooks";

export const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { isCheckingAuthState, user } = useAuth();
  const { path, title } = useRouteMatch();
  const protectedRoute = path;
  const protectedRouteName = title;

  useEffect(() => {
    if (isCheckingAuthState) {
      return;
    }

    if (!user) {
      const options = {
        state: { protectedRouteName, protectedRoute },
      };
      navigate(PathConstants.SignIn, options);
      return;
    }

    if (!user.isAdmin) {
      const options = {
        state: { protectedRouteName },
      };
      navigate(PathConstants.NoAccess, options);
      return;
    }
  }, [isCheckingAuthState, user, protectedRoute, protectedRouteName, navigate]);

  if (isCheckingAuthState) {
    return null;
  }

  return <Outlet />;
};
