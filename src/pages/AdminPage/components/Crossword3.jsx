import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, CircularProgress, MenuItem, Select } from "@mui/material";

import {
  usePrivateEyeCrosswords,
  usePrivateEyeCrosswordByUrl,
} from "@app/hooks";

import { AlreadyAdded } from "./AlreadyAdded";
import { Error } from "./Error";
import { ViewCrosswordButton } from "./ViewCrosswordButton";

import {
  StyledBox,
  StyledBoxContent,
  StyledRow,
  StyledRow2Cols,
} from "./common.styles";

export const Crossword3 = ({ onAddCrossword }) => {
  const [selectedPuzzleId, setSelectedPuzzleId] = useState("");
  const [puzzleToFetch, setPuzzleToFetch] = useState();
  const [showAddSpinner, setShowAddSpinner] = useState(false);
  const [addedCrosswordId, setAddedCrosswordId] = useState();

  const hookResult1 = usePrivateEyeCrosswords();
  const { puzList } = hookResult1;

  const hookResult2 = usePrivateEyeCrosswordByUrl(puzzleToFetch?.url);
  const { crossword, crosswordId } = hookResult2;

  useEffect(() => {
    if (puzList.length > 0 && selectedPuzzleId === "") {
      const id = puzList[0].id;
      setSelectedPuzzleId(id);
    }
  }, [puzList, selectedPuzzleId]);

  const handleFetchCrossword = () => {
    const puzzle = puzList.find(({ id }) => id === selectedPuzzleId);
    if (puzzle) {
      setPuzzleToFetch(puzzle);
    }
  };

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
    <StyledBox>
      <StyledBoxContent showContent={true}>
        <StyledRow>
          <Select
            sx={{ width: "15rem" }}
            size="small"
            aria-label="Puzzles"
            value={selectedPuzzleId}
            onChange={(e) => {
              setSelectedPuzzleId(e.target.value);
            }}
          >
            {puzList.map((puzzle) => {
              const { id, filename, timestamp } = puzzle;
              return (
                <MenuItem key={id} value={id}>
                  {filename} ({timestamp})
                </MenuItem>
              );
            })}
          </Select>
          <Button
            variant="outlined"
            size="small"
            onClick={handleFetchCrossword}
            disabled={
              !selectedPuzzleId || selectedPuzzleId === puzzleToFetch?.id
            }
          >
            Fetch Crossword
          </Button>
          {hookResult2.isLoading && <CircularProgress size="1.5rem" />}
        </StyledRow>
        {crossword && !hookResult2.isLoading && (
          <>
            <StyledRow2Cols>
              <div>Title: {crossword.title}</div>
              {/* <div>Date: {puzData.copy["date-publish"]}</div> */}
              <div>Date: (not available)</div>
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
                  Add Crossword
                </Button>
                {showAddSpinner && <CircularProgress size="1.5rem" />}
                {addedCrosswordId && (
                  <ViewCrosswordButton crosswordId={addedCrosswordId} />
                )}
              </StyledRow>
            )}
          </>
        )}
      </StyledBoxContent>
      {hookResult2.isError && <Error error={hookResult2.error} />}
    </StyledBox>
  );
};

Crossword3.propTypes = {
  onAddCrossword: PropTypes.func.isRequired,
};
