import PropTypes from "prop-types";
import { ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

export const UserMenu = ({
  anchorEl,
  open,
  onClose,
  onUserDetails,
  onSignOut,
}) => {
  return (
    <Menu
      sx={{ mt: "45px" }}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      open={open}
      onClose={onClose}
    >
      <MenuItem onClick={onUserDetails}>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <Typography textAlign="center">User Details...</Typography>
      </MenuItem>
      <MenuItem onClick={onSignOut}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <Typography textAlign="center">Sign Out</Typography>
      </MenuItem>
    </Menu>
  );
};

UserMenu.propTypes = {
  anchorEl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUserDetails: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
};
