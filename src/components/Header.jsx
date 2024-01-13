import { AppBar, Tabs, Tab, Toolbar } from "@mui/material";
import { NavLink } from "react-router-dom";

import { useRouteMatch } from "@app/hooks";
import { PathConstants } from "@app/constants";

import { Auth } from "./Auth";
import { StyledHeader } from "./Header.styles";

const routes = [
  PathConstants.Home,
  PathConstants.Crossword,
  PathConstants.Admin,
];

export const Header = () => {
  const routeMatch = useRouteMatch(routes);
  const currentTab = routeMatch?.pattern?.path;

  return (
    currentTab && (
      <>
        <AppBar position="fixed">
          <StyledHeader>
            <Tabs value={currentTab}>
              <Tab
                label="Home"
                value={PathConstants.Home}
                to={PathConstants.Home}
                component={NavLink}
              />
              {currentTab === PathConstants.Crossword && (
                <Tab
                  label="Crossword"
                  value={currentTab}
                  to={routeMatch.pathname}
                  component={NavLink}
                />
              )}
              <Tab
                label="Admin"
                value={PathConstants.Admin}
                to={PathConstants.Admin}
                component={NavLink}
              />
            </Tabs>
            <Auth />
          </StyledHeader>
        </AppBar>
        <Toolbar />
      </>
    )
  );
};
