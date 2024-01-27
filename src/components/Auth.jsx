import { useState } from "react";
import { Avatar, Button, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

import { useAuth } from "@app/contexts";

import { UserMenu } from "./UserMenu";
import { UserDetailsModal } from "./UserDetailsModal";

const HiddenPlaceholderForConsistentHeight = () => {
  return (
    <div style={{ visibility: "hidden", width: 0 }}>
      <IconButton>
        <Avatar />
      </IconButton>
    </div>
  );
};

export const Auth = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);

  const {
    isCheckingAuthState,
    user,
    onSignIn,
    onSignOut: onSignOutFromHook,
  } = useAuth();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onUserDetails = () => {
    setUserDetailsModalOpen(true);
    handleCloseUserMenu();
  };

  const onSignOut = () => {
    onSignOutFromHook();
    handleCloseUserMenu();
  };

  if (isCheckingAuthState) return <HiddenPlaceholderForConsistentHeight />;

  if (user) {
    return (
      <>
        <IconButton onClick={handleOpenUserMenu} sx={{ mr: 1 }}>
          <Avatar alt={user.username} src={user.photoURL} />
        </IconButton>
        <UserMenu
          anchorEl={anchorElUser}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          onUserDetails={onUserDetails}
          onSignOut={onSignOut}
        />
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
