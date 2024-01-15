import { useState } from "react";
import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

import { useAuth } from "@app/contexts";

import { UserDetailsModal } from "./UserDetailsModal";

export const Auth = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);

  const { isCheckingAuthState, user, onSignIn, onSignOut } = useAuth();

  if (isCheckingAuthState) return null;

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onUserDetailsMenuItem = () => {
    setUserDetailsModalOpen(true);
    handleCloseUserMenu();
  };

  const onSignOutMenuItem = () => {
    onSignOut();
    handleCloseUserMenu();
  };

  if (user) {
    return (
      <>
        <IconButton onClick={handleOpenUserMenu}>
          <Avatar alt={user.username} src={user.photoURL} />
        </IconButton>
        <Menu
          sx={{ mt: "45px" }}
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem onClick={onUserDetailsMenuItem}>
            <Typography textAlign="center">User Details...</Typography>
          </MenuItem>
          <MenuItem onClick={onSignOutMenuItem}>
            <Typography textAlign="center">Sign Out</Typography>
          </MenuItem>
        </Menu>
        <UserDetailsModal
          open={userDetailsModalOpen}
          user={user}
          onClose={() => setUserDetailsModalOpen(false)}
        />
      </>
    );
  }

  return (
    <Button onClick={onSignIn}>
      Sign In&nbsp;
      <GitHubIcon />
    </Button>
  );
};
