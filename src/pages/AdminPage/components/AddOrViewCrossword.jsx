import { useState } from "react";
import PropTypes from "prop-types";
import { Button, CircularProgress } from "@mui/material";

import { formatDate } from "@app/utils";

import { AlreadyAdded } from "./AlreadyAdded";
import { ViewCrosswordButton } from "./ViewCrosswordButton";

import { StyledRow, StyledRow2Cols } from "./common.styles";

export const AddOrViewCrossword = ({
  crossword,
  crosswordId,
  isLoading,
  onAddCrossword,
}) => {
  const [showAddSpinner, setShowAddSpinner] = useState(false);
  const [addedCrosswordId, setAddedCrosswordId] = useState();

  const handleAddCrossword = async () => {
    try {
      setShowAddSpinner(true);
      const crosswordRef = await onAddCrossword(crossword);
      setAddedCrosswordId(crosswordRef.id);
    } finally {
      setShowAddSpinner(false);
    }
  };

  return (
    <>
      {crossword && !isLoading && (
        <>
          <StyledRow2Cols>
            <div>Title: {crossword.title}</div>
            <div>Date: {formatDate(crossword.publishDate)}</div>
          </StyledRow2Cols>
          {crosswordId ? (
            <AlreadyAdded crosswordId={crosswordId} />
          ) : (
            <StyledRow>
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddCrossword}
                disabled={Boolean(addedCrosswordId)}
              >
                Add
              </Button>
              {showAddSpinner && <CircularProgress size="1.5rem" />}
              {addedCrosswordId && (
                <ViewCrosswordButton crosswordId={addedCrosswordId} />
              )}
            </StyledRow>
          )}
        </>
      )}
    </>
  );
};

AddOrViewCrossword.propTypes = {
  crossword: PropTypes.object,
  crosswordId: PropTypes.string,
  isLoading: PropTypes.bool,
  onAddCrossword: PropTypes.func.isRequired,
};
