import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { noop } from "@app/utils";

export const ConfirmationModal = ({
  open,
  onClose,
  title,
  message,
  onCancel = noop,
  onOK = noop,
}) => {
  const handleCancel = () => {
    onCancel();
    onClose();
  };

  const handleOK = () => {
    onOK();
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleOK}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onCancel: PropTypes.func,
  onOK: PropTypes.func,
};
