import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import LockIcon from "@mui/icons-material/Lock";
import PeopleIcon from "@mui/icons-material/People";

import { PathConstants } from "@app/constants";

import { AboutModal } from "./AboutModal";

export const NavMenu = ({ anchorEl, open, onClose, isAdmin }) => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const navigate = useNavigate();

  const makeMenuItemHandler = (to) => () => {
    navigate(to);
    onClose();
  };

  const openAboutModal = () => {
    onClose();
    setShowAboutModal(true);
  };

  const closeAboutModal = () => {
    setShowAboutModal(false);
  };

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose} keepMounted>
      <MenuItem onClick={makeMenuItemHandler(PathConstants.Home)}>
        <ListItemIcon>
          <HomeIcon fontSize="small" />
        </ListItemIcon>
        <Typography textAlign="center">Home</Typography>
      </MenuItem>
      <MenuItem onClick={makeMenuItemHandler(PathConstants.Users)}>
        <ListItemIcon>
          <PeopleIcon fontSize="small" />
        </ListItemIcon>
        <Typography textAlign="center">Users</Typography>
      </MenuItem>
      {isAdmin && (
        <MenuItem onClick={makeMenuItemHandler(PathConstants.Admin)}>
          <ListItemIcon>
            <LockIcon fontSize="small" />
          </ListItemIcon>
          <Typography textAlign="center">Admin</Typography>
        </MenuItem>
      )}
      <MenuItem onClick={openAboutModal}>
        <ListItemIcon>
          <InfoIcon fontSize="small" />
        </ListItemIcon>
        <Typography textAlign="center">About</Typography>
      </MenuItem>
      <AboutModal open={showAboutModal} onClose={closeAboutModal} />
    </Menu>
  );
};

NavMenu.propTypes = {
  anchorEl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};
