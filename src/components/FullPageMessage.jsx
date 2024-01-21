import PropTypes from "prop-types";

import { StyledFullPageMessage, StyledMessage } from "./FullPageMessage.styles";

export const FullPageMessage = ({ message }) => {
  return (
    <StyledFullPageMessage>
      <StyledMessage>{message}</StyledMessage>
    </StyledFullPageMessage>
  );
};

FullPageMessage.propTypes = {
  message: PropTypes.string.isRequired,
};
