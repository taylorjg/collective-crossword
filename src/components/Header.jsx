import { useState } from "react";
import { AppBar, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { useRouteMatch } from "@app/hooks";
import { PathConstants, RoutesMap } from "@app/constants";
import { useAuth } from "@app/contexts";

import { Auth } from "./Auth";
import { NavMenu } from "./NavMenu";

import {
  StyledHeader,
  StyledHeaderLeft,
  StyledHeaderMiddle,
  StyledHeaderRight,
} from "./Header.styles";

const DEFAULT_TITLE = "Not Found";

export const Header = () => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;
  const [anchorElNavMenu, setAnchorElNavMenu] = useState(null);
  const routeMatch = useRouteMatch(Object.values(PathConstants));
  const path = routeMatch?.pattern?.path;
  const title = RoutesMap.get(path) ?? DEFAULT_TITLE;

  const handleOpenNavMenu = (event) => {
    setAnchorElNavMenu(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNavMenu(null);
  };

  return (
    <>
      <AppBar position="fixed">
        <StyledHeader>
          <StyledHeaderLeft>
            <IconButton onClick={handleOpenNavMenu} sx={{ ml: 1 }}>
              <MenuIcon />
            </IconButton>
          </StyledHeaderLeft>
          <StyledHeaderMiddle>{title}</StyledHeaderMiddle>
          <StyledHeaderRight>
            <Auth />
          </StyledHeaderRight>
        </StyledHeader>
      </AppBar>
      <Toolbar />
      <NavMenu
        anchorEl={anchorElNavMenu}
        open={Boolean(anchorElNavMenu)}
        onClose={handleCloseNavMenu}
        isAdmin={isAdmin}
      />
    </>
  );
};
