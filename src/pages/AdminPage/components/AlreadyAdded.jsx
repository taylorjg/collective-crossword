import PropTypes from "prop-types";
import { Alert } from "@mui/material";

import { ViewCrosswordButton } from "./ViewCrosswordButton";
import { StyledActionWrapper } from "./AlreadyAdded.styles";

export const AlreadyAdded = ({ crosswordId }) => {
  return (
    <Alert
      severity="info"
      variant="outlined"
      action={
        <StyledActionWrapper>
          <ViewCrosswordButton crosswordId={crosswordId} />
        </StyledActionWrapper>
      }
    >
      This crossword has already been added.
    </Alert>
  );
};

AlreadyAdded.propTypes = {
  crosswordId: PropTypes.string.isRequired,
};
