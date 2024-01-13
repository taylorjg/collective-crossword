import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export const UserDetailsModal2 = ({ open, onClose, user }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm">
      <DialogTitle>User Details</DialogTitle>
      <Divider />
      <DialogContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography>Display Name</Typography>
              </TableCell>
              <TableCell>{user.displayName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>Email</Typography>
              </TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>Username</Typography>
              </TableCell>
              <TableCell>{user.username}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>Admin</Typography>
              </TableCell>
              <TableCell>
                {user.isAdmin ? (
                  <CheckIcon color="success" />
                ) : (
                  <CloseIcon color="error" />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>Creation Time</Typography>
              </TableCell>
              <TableCell>{user.creationTime}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>Last Sign In Time</Typography>
              </TableCell>
              <TableCell>{user.lastSignInTime}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

UserDetailsModal2.propTypes = {
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
