import { useState } from "react";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

import { PathConstants } from "@app/constants";
import { useAuth } from "@app/contexts";

import { Auth } from "./Auth";
import { StyledHeader } from "./Header.styles";

export const Header = () => {
  const [anchorElNavMenu, setAnchorElNavMenu] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin;

  const handleOpenNavMenu = (event) => {
    setAnchorElNavMenu(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNavMenu(null);
  };

  const onClickHomeMenuItem = () => {
    navigate(PathConstants.Home);
    handleCloseNavMenu();
  };

  const onClickUsersMenuItem = () => {
    navigate(PathConstants.Users);
    handleCloseNavMenu();
  };

  const onClickAdminMenuItem = () => {
    navigate(PathConstants.Admin);
    handleCloseNavMenu();
  };

  return (
    <>
      <AppBar position="fixed">
        <StyledHeader>
          <IconButton onClick={handleOpenNavMenu} sx={{ ml: 1 }}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorElNavMenu}
            keepMounted
            open={Boolean(anchorElNavMenu)}
            onClose={handleCloseNavMenu}
          >
            <MenuItem onClick={onClickHomeMenuItem}>
              <Typography textAlign="center">Home</Typography>
            </MenuItem>
            <MenuItem onClick={onClickUsersMenuItem}>
              <Typography textAlign="center">Users</Typography>
            </MenuItem>
            {isAdmin && (
              <MenuItem onClick={onClickAdminMenuItem}>
                <Typography textAlign="center">Admin</Typography>
              </MenuItem>
            )}
          </Menu>
          <Auth />
        </StyledHeader>
      </AppBar>
      <Toolbar />
    </>
  );
};
