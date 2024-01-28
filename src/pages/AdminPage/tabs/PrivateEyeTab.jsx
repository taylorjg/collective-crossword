import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, MenuItem, Select } from "@mui/material";

import {
  usePrivateEyeCrosswords,
  usePrivateEyeCrosswordByUrl,
} from "@app/hooks";
import { formatDate } from "@app/utils";
import { FullPageLoading } from "@app/components";

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

  const onSubmit = (e) => {
    e.preventDefault();
    const puzzle = puzList.find(({ id }) => id === selectedPuzzleId);
    if (puzzle) {
      setPuzzleToFetch(puzzle);
    }
  };

  return (
    <StyledImportForm>
      <form autoComplete="off" onSubmit={onSubmit}>
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
            type="submit"
            variant="outlined"
            size="small"
            disabled={
              !selectedPuzzleId || selectedPuzzleId === puzzleToFetch?.id
            }
          >
            Fetch
          </Button>
          {hookResult1.isLoading && <FullPageLoading />}
          {hookResult1.isError && <Error error={hookResult1.error} />}
        </StyledRow>
      </form>
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
