import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

import { AlreadyAdded } from "./AlreadyAdded";
import { Error } from "./Error";
import { Loading } from "./Loading";
import { ViewCrosswordButton } from "./ViewCrosswordButton";

import { StyledBox, StyledBoxContent, StyledRow } from "./common.styles";

export const Crossword = ({ crosswordResponse, onAddCrossword }) => {
  const [addedCrosswordId, setAddedCrosswordId] = useState();

  const { crossword, isLoading, isError, error, crosswordId } =
    crosswordResponse;

  const handleAddCrossword = async () => {
    const crosswordRef = await onAddCrossword(crossword);
    setAddedCrosswordId(crosswordRef.id);
  };

  return (
    <StyledBox>
      <StyledBoxContent showContent={crossword && !isLoading}>
        <div>Url: {crossword?.url ?? ""}</div>
        {crosswordId ? (
          <AlreadyAdded crosswordId={crosswordId} />
        ) : (
          <StyledRow>
            <Button
              variant="outlined"
              size="small"
              onClick={handleAddCrossword}
            >
              Add Crossword
            </Button>
            {addedCrosswordId && (
              <ViewCrosswordButton crosswordId={addedCrosswordId} />
            )}
          </StyledRow>
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
