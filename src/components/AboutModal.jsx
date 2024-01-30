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
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

import packageJson from "@app/../package.json";

export const AboutModal = ({ open, onClose }) => {
  const onClickGitHubIcon = () => {
    window.open("https://github.com/taylorjg/collective-crossword", "_blank");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>About</DialogTitle>
      <Divider />
      <DialogContent>
        <List disablePadding dense>
          <ListItem>
            <ListItemText primary="Author" secondary="Jonathan Taylor" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Version" secondary={packageJson.version} />
          </ListItem>
          <Divider />
        </List>
      </DialogContent>
      <DialogActions style={{ justifyContent: "space-between" }}>
        <IconButton onClick={onClickGitHubIcon}>
          <GitHubIcon />
        </IconButton>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

AboutModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
