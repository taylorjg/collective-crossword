import { useLocation } from "react-router-dom";

import { FullPageMessage } from "@app/components";

export const NoAccessPage = () => {
  const location = useLocation();
  const { protectedRouteName } = location.state ?? {};
  const message = protectedRouteName
    ? `You don't have access to the ${protectedRouteName} page`
    : "No access!";

  return <FullPageMessage message={message} />;
};
