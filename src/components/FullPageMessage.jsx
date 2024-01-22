import PropTypes from "prop-types";
import { Alert } from "@mui/material";

import { StyledFullPageMessage } from "./FullPageMessage.styles";

export const FullPageMessage = ({ message }) => {
  return (
    <StyledFullPageMessage>
      <Alert severity="info" variant="outlined">
        {message}
      </Alert>
    </StyledFullPageMessage>
  );
};

FullPageMessage.propTypes = {
  message: PropTypes.string.isRequired,
};
