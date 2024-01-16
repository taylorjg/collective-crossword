import { useState } from "react";
import PropTypes from "prop-types";
import { Alert, Snackbar, Slide } from "@mui/material";

import { ToastContext } from "./toast-context";

export const ToastContextProvider = ({ children }) => {
  const [toastState, setToastState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { open, message, severity } = toastState;

  const showCommon = (message, severity) => {
    setToastState({
      open: true,
      message,
      severity,
    });
  };

  const showSuccess = (message) => showCommon(message, "success");
  const showInfo = (message) => showCommon(message, "info");
  const showWarning = (message) => showCommon(message, "warning");
  const showError = (message) => showCommon(message, "error");

  const handleClose = () => {
    setToastState((currentValue) => ({
      ...currentValue,
      open: false,
    }));
  };

  const anchorOrigin = {
    horizontal: "center",
    vertical: "bottom",
  };

  return (
    <ToastContext.Provider
      value={{ showSuccess, showInfo, showWarning, showError }}
    >
      {children}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

ToastContextProvider.propTypes = {
  children: PropTypes.node,
};
