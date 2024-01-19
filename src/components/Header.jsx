import { useState } from "react";
import {
  AppBar,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LockIcon from "@mui/icons-material/Lock";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";

import { useRouteMatch } from "@app/hooks";
import { PathConstants, RoutesMap } from "@app/constants";
import { useAuth } from "@app/contexts";

import { Auth } from "./Auth";
import {
  StyledHeader,
  StyledHeaderLeft,
  StyledHeaderMiddle,
  StyledHeaderRight,
} from "./Header.styles";

export const Header = () => {
  const [anchorElNavMenu, setAnchorElNavMenu] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin;

  const routeMatch = useRouteMatch(Object.values(PathConstants));
  const currentTab = routeMatch?.pattern?.path;
  const title = RoutesMap.get(currentTab) ?? "Not Found";

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
      <Menu
        anchorEl={anchorElNavMenu}
        keepMounted
        open={Boolean(anchorElNavMenu)}
        onClose={handleCloseNavMenu}
      >
        <MenuItem onClick={onClickHomeMenuItem}>
          <ListItemIcon>
            <HomeIcon fontSize="small" />
          </ListItemIcon>
          <Typography textAlign="center">Home</Typography>
        </MenuItem>
        <MenuItem onClick={onClickUsersMenuItem}>
          <ListItemIcon>
            <PeopleIcon fontSize="small" />
          </ListItemIcon>
          <Typography textAlign="center">Users</Typography>
        </MenuItem>
        {isAdmin && (
          <MenuItem onClick={onClickAdminMenuItem}>
            <ListItemIcon>
              <LockIcon fontSize="small" />
            </ListItemIcon>
            <Typography textAlign="center">Admin</Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
