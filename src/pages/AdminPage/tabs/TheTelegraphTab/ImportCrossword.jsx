import { useState } from "react";
import PropTypes from "prop-types";
import { Button, CircularProgress, TextField } from "@mui/material";

import { formatDate } from "@app/utils";

import { AlreadyAdded } from "../../components/AlreadyAdded";
import { Error } from "../../components/Error";
import { ViewCrosswordButton } from "../../components/ViewCrosswordButton";

import {
  StyledBox,
  StyledBoxContent,
  StyledRow,
  StyledRow2Cols,
} from "../../components/common.styles";

export const ImportCrossword = ({
  onAddCrossword,
  useCrossword,
  label,
  exampleId,
}) => {
  const [id, setId] = useState("");
  const [idToFetch, setIdToFetch] = useState("");
  const [showAddSpinner, setShowAddSpinner] = useState(false);
  const [addedCrosswordId, setAddedCrosswordId] = useState();

  const crosswordResponse = useCrossword(idToFetch);

  const { crossword, isLoading, isError, error, crosswordId } =
    crosswordResponse;

  const handleFetchCrossword = () => {
    setIdToFetch(id);
  };

  const handleReset = () => {
    setId("");
    setIdToFetch("");
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
        <div>{label}</div>
        <StyledRow>
          <TextField
            label="Crossword ID"
            placeholder={`e.g. ${exampleId}`}
            value={id}
            onChange={(e) => setId(e.target.value)}
            size="small"
            disabled={Boolean(idToFetch)}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleFetchCrossword}
            disabled={!id || id === idToFetch}
          >
            Fetch Crossword
          </Button>
          {isLoading && <CircularProgress size="1.5rem" />}
        </StyledRow>
        <Button
          size="small"
          onClick={handleReset}
          style={{ position: "absolute", top: "16px", right: "16px" }}
          disabled={!idToFetch}
        >
          Reset
        </Button>
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
      {isError && <Error error={error} />}
    </StyledBox>
  );
};

ImportCrossword.propTypes = {
  onAddCrossword: PropTypes.func.isRequired,
  useCrossword: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  exampleId: PropTypes.number.isRequired,
};
