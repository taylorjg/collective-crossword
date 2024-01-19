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

const HiddenPlaceholderForConsistentHeight = () => {
  return (
    <IconButton style={{ visibility: "hidden" }}>
      <Avatar />
    </IconButton>
  );
};

export const Auth = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);

  const { isCheckingAuthState, user, onSignIn, onSignOut } = useAuth();

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

  if (isCheckingAuthState) return <HiddenPlaceholderForConsistentHeight />;

  if (user) {
    return (
      <>
        <IconButton onClick={handleOpenUserMenu} sx={{ mr: 1 }}>
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
    <>
      <HiddenPlaceholderForConsistentHeight />
      <Button onClick={onSignIn} sx={{ mr: 1 }}>
        Sign In&nbsp;
        <GitHubIcon />
      </Button>
    </>
  );
};
