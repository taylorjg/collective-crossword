import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, CircularProgress, MenuItem, Select } from "@mui/material";

import {
  usePrivateEyeCrosswords,
  usePrivateEyeCrosswordByUrl,
} from "@app/hooks";
import { formatDate } from "@app/utils";

import { AddOrViewCrossword, Error } from "../components";
import { StyledImportForm, StyledRow } from "../components/common.styles";

export const PrivateEyeTab = ({ onAddCrossword }) => {
  const [selectedPuzzleId, setSelectedPuzzleId] = useState("");
  const [puzzleToFetch, setPuzzleToFetch] = useState();

  const hookResult1 = usePrivateEyeCrosswords();
  const { puzList } = hookResult1;

  const hookResult2 = usePrivateEyeCrosswordByUrl(puzzleToFetch);
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

  return (
    <StyledImportForm>
      <StyledRow>
        <Select
          sx={{ width: "20rem" }}
          size="small"
          aria-label="Puzzles"
          value={selectedPuzzleId}
          onChange={(e) => {
            setSelectedPuzzleId(e.target.value);
          }}
        >
          {puzList.map((puzzle) => {
            const { id, filename, unixTimestamp } = puzzle;
            const publishDate = formatDate(unixTimestamp);
            return (
              <MenuItem key={id} value={id}>
                {filename} ({publishDate})
              </MenuItem>
            );
          })}
        </Select>
        <Button
          variant="outlined"
          size="small"
          onClick={handleFetchCrossword}
          disabled={!selectedPuzzleId || selectedPuzzleId === puzzleToFetch?.id}
        >
          Fetch Crossword
        </Button>
        {hookResult1.isLoading && <CircularProgress size="1.5rem" />}
        {hookResult1.isError && <Error error={hookResult1.error} />}
      </StyledRow>
      <AddOrViewCrossword
        crossword={crossword}
        crosswordId={crosswordId}
        isLoading={hookResult2.isLoading}
        onAddCrossword={onAddCrossword}
      />
      {hookResult2.isError && <Error error={hookResult2.error} />}
    </StyledImportForm>
  );
};

PrivateEyeTab.propTypes = {
  onAddCrossword: PropTypes.func.isRequired,
};
