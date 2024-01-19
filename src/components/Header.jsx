import { useState } from "react";
import { AppBar, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { useRouteMatch } from "@app/hooks";
import { useAuth } from "@app/contexts";

import { Auth } from "./Auth";
import { NavMenu } from "./NavMenu";

import {
  StyledHeader,
  StyledHeaderLeft,
  StyledHeaderMiddle,
  StyledHeaderRight,
} from "./Header.styles";

export const Header = () => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin ?? false;
  const [anchorElNavMenu, setAnchorElNavMenu] = useState(null);
  const { title } = useRouteMatch();

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
