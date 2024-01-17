import PropTypes from "prop-types";
import { Button } from "@mui/material";

import { AlreadyAdded } from "./AlreadyAdded";
import { Error } from "./Error";
import { Loading } from "./Loading";

import { StyledBox, StyledBoxContent } from "./common.styles";

export const Crossword = ({ crosswordResponse, onAddCrossword }) => {
  const { crossword, isLoading, isError, error, crosswordId } =
    crosswordResponse;

  const handleAddCrossword = () => {
    onAddCrossword(crossword);
  };

  return (
    <StyledBox>
      <StyledBoxContent showContent={crossword && !isLoading}>
        <div>Url: {crossword?.url ?? ""}</div>
        {crosswordId ? (
          <AlreadyAdded crosswordId={crosswordId} />
        ) : (
          <Button variant="outlined" size="small" onClick={handleAddCrossword}>
            Add Crossword
          </Button>
        )}
      </StyledBoxContent>
      {isLoading && <Loading />}
      {isError && <Error error={error} />}
    </StyledBox>
  );
};

Crossword.propTypes = {
  crosswordResponse: PropTypes.shape({
    crossword: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }),
    isLoading: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    error: PropTypes.shape({ message: PropTypes.string }),
    crosswordId: PropTypes.string,
  }),
  onAddCrossword: PropTypes.func.isRequired,
};
