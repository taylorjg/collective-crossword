import { useState } from "react";
import PropTypes from "prop-types";
import { Alert, Snackbar, Slide, AlertTitle } from "@mui/material";

import { ToastContext } from "./toast-context";

export const ToastContextProvider = ({ children }) => {
  const [toastState, setToastState] = useState({
    open: false,
    message: "",
    details: "",
    severity: "success",
  });

  const { open, message, details, severity } = toastState;

  const showCommon = (message, details, severity) => {
    setToastState({
      open: true,
      message,
      details,
      severity,
    });
  };

  const showSuccess = (message, details = "") =>
    showCommon(message, details, "success");

  const showInfo = (message, details = "") =>
    showCommon(message, details, "info");

  const showWarning = (message, details = "") =>
    showCommon(message, details, "warning");

  const showError = (message, details = "") =>
    showCommon(message, details, "error");

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
          variant="outlined"
          sx={{ width: "100%" }}
        >
          {details ? (
            <>
              <AlertTitle>{message}</AlertTitle>
              {details}
            </>
          ) : (
            <>{message}</>
          )}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

ToastContextProvider.propTypes = {
  children: PropTypes.node,
};
