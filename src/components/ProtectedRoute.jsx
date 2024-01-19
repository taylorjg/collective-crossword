import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "@app/contexts";
import { PathConstants, RoutesMap } from "@app/constants";
import { useRouteMatch } from "@app/hooks";

export const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { isCheckingAuthState, user } = useAuth();
  const routeMatch = useRouteMatch(Object.values(PathConstants));
  const protectedRoute = routeMatch?.pattern?.path;
  const protectedRouteName = RoutesMap.get(protectedRoute) ?? "Not Found";

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

  // if (!user) {
  //   const options = {
  //     state: { protectedRouteName, protectedRoute },
  //   };
  //   navigate(PathConstants.SignIn, options);
  //   return;
  // }

  // if (!user.isAdmin) {
  //   const options = {
  //     state: { protectedRouteName },
  //   };
  //   navigate(PathConstants.NoAccess, options);
  //   return;
  // }

  return <Outlet />;
};
