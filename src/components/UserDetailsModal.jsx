import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { StyledTitle } from "./UserDetailsModal.styles";

export const UserDetailsModal = ({ open, onClose, user }) => {
  const theme = useTheme();
  const mediaQuery = theme.breakpoints.down("sm");
  const isXs = useMediaQuery(mediaQuery);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={true}
      maxWidth={isXs ? "xs" : "sm"}
      fullScreen={isXs}
    >
      <DialogTitle>
        <StyledTitle>
          User Details
          <IconButton edge="end" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </StyledTitle>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <List disablePadding dense>
          <ListItem>
            <ListItemText primary="Display Name" secondary={user.displayName} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Email" secondary={user.email} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Username" secondary={user.username} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Admin"
              secondary={
                user.isAdmin ? (
                  <CheckIcon color="success" />
                ) : (
                  <CloseIcon color="error" />
                )
              }
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Creation Time"
              secondary={user.creationTime}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Last Sign In Time"
              secondary={user.lastSignInTime}
            />
          </ListItem>
          <Divider />
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

UserDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    photoURL: PropTypes.string,
    isAdmin: PropTypes.bool.isRequired,
    creationTime: PropTypes.string.isRequired,
    lastSignInTime: PropTypes.string.isRequired,
  }).isRequired,
};
