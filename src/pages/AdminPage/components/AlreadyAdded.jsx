import PropTypes from "prop-types";

import { ViewCrosswordButton } from "./ViewCrosswordButton";
import { StyledAlreadyAdded } from "./AlreadyAdded.styles";

export const AlreadyAdded = ({ crosswordId }) => {
  return (
    <StyledAlreadyAdded>
      This crossword has already been added.&nbsp;{" "}
      <ViewCrosswordButton crosswordId={crosswordId} />
    </StyledAlreadyAdded>
  );
};

AlreadyAdded.propTypes = {
  crosswordId: PropTypes.string.isRequired,
};
