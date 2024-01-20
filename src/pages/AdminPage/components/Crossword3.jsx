import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, CircularProgress, MenuItem, Select } from "@mui/material";

import {
  usePrivateEyeCrosswords,
  usePrivateEyeCrosswordById,
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

// TODO: do this inside usePrivateEyeCrosswords - add an id property to each entry
const extractPuzzleIdFromUrl = (url) => {
  const m = url.match(/(\d+)\.puz$/);
  return m[1];
};

export const Crossword3 = ({ onAddCrossword }) => {
  const [selectedPuzzle, setSelectedPuzzle] = useState("");
  const [idToUse, setIdToUse] = useState("");
  const [showAddSpinner, setShowAddSpinner] = useState(false);
  const [addedCrosswordId, setAddedCrosswordId] = useState();

  const hookResult1 = usePrivateEyeCrosswords();
  const { puzList } = hookResult1;

  useEffect(() => {
    if (puzList.length > 0 && selectedPuzzle === "") {
      const id = extractPuzzleIdFromUrl(puzList[0].url);
      setSelectedPuzzle(id);
    }
  }, [puzList, selectedPuzzle]);

  const hookResult2 = usePrivateEyeCrosswordById(idToUse, Boolean(idToUse));
  const { crossword, crosswordId } = hookResult2;

  const handleFetchCrossword = () => {
    setIdToUse(selectedPuzzle);
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
            value={selectedPuzzle}
            onChange={(e) => {
              setSelectedPuzzle(e.target.value);
            }}
          >
            {puzList.map((puzzle) => {
              const { url, timestamp } = puzzle;
              const id = extractPuzzleIdFromUrl(url);
              return (
                <MenuItem key={id} value={id}>
                  {id} ({timestamp})
                </MenuItem>
              );
            })}
          </Select>
          <Button
            variant="outlined"
            size="small"
            onClick={handleFetchCrossword}
            disabled={!selectedPuzzle || idToUse === selectedPuzzle}
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
