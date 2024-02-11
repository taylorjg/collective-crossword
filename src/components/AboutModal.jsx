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
            <ListItemText primary="Written by" secondary="Jonathan Taylor" />
          </ListItem>
          <Divider variant="middle" />
          <ListItem>
            <ListItemText
              primary="Based on an idea by"
              secondary="Simon Souter"
            />
          </ListItem>
          <Divider variant="middle" />
          <ListItem>
            <ListItemText primary="Version" secondary={packageJson.version} />
          </ListItem>
          <Divider variant="middle" />
        </List>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <IconButton onClick={onClickGitHubIcon} title="View repo on github.com">
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
