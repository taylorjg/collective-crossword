import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export const UserDetailsModal = ({ open, onClose, user }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="xs">
      <DialogTitle>User Details</DialogTitle>
      <Divider />
      <DialogContent>
        <List>
          <ListItem disableGutters>
            <ListItemText primary="Display Name" secondary={user.displayName} />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText primary="Email" secondary={user.email} />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText primary="Username" secondary={user.username} />
          </ListItem>
          <ListItem disableGutters>
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
          <ListItem disableGutters>
            <ListItemText
              primary="Creation Time"
              secondary={user.creationTime}
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary="Last Sign In Time"
              secondary={user.lastSignInTime}
            />
          </ListItem>
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
