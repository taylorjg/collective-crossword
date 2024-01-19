import { matchPath, useLocation } from "react-router-dom";

import { PathConstants, RoutesMap } from "@app/constants";

const DEFAULT_TITLE = "Not Found";

export const useRouteMatch = () => {
  const { pathname } = useLocation();
  const patterns = Object.values(PathConstants);

  const tryToMatchRoute = () => {
    for (const pattern of patterns) {
      const possibleMatch = matchPath(pattern, pathname);
      if (possibleMatch) {
        return possibleMatch;
      }
    }
  };

  const routeMatch = tryToMatchRoute();
  const path = routeMatch?.pattern?.path;
  const title = RoutesMap.get(path) ?? DEFAULT_TITLE;

  return { routeMatch, path, title };
};
