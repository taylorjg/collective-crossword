import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { PathConstants } from "@app/constants";
import { useAuth } from "@app/contexts";

import { FullPageMessage } from "@app/components";

export const SignInPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const message = `You must be signed in to access the ${protectedRouteName} page`;

  return <FullPageMessage message={message} />;
};
