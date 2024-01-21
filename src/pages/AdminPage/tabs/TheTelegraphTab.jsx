import { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

import {
  useTheTelegraphCrypticCrosswordById,
  useTheTelegraphPrizeCrypticById,
  useTheTelegraphPrizeToughieById,
} from "@app/hooks";
import { formatDate } from "@app/utils";

import { AlreadyAdded } from "../components/AlreadyAdded";
import { Error } from "../components/Error";
import { ViewCrosswordButton } from "../components/ViewCrosswordButton";

import {
  StyledImportForm,
  StyledRow,
  StyledRow2Cols,
} from "../components/common.styles";

const getUseCrossword = (crosswordType) => {
  switch (crosswordType) {
    default:
    case "cryptic-crossword":
      return useTheTelegraphCrypticCrosswordById;
    case "prize-cryptic":
      return useTheTelegraphPrizeCrypticById;
    case "prize-toughie":
      return useTheTelegraphPrizeToughieById;
  }
};

export const TheTelegraphTab = ({ onAddCrossword }) => {
  const [selectedCrosswordType, setSelectedCrosswordType] =
    useState("cryptic-crossword");
  const [id, setId] = useState("");
  const [idToFetch, setIdToFetch] = useState("");
  const [showAddSpinner, setShowAddSpinner] = useState(false);
  const [addedCrosswordId, setAddedCrosswordId] = useState();

  const useCrossword = getUseCrossword(selectedCrosswordType);
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

  const onChangeCrosswordType = (event) => {
    setSelectedCrosswordType(event.target.value);
  };

  return (
    <StyledImportForm>
      <RadioGroup
        value={selectedCrosswordType}
        onChange={onChangeCrosswordType}
      >
        <FormControlLabel
          value="cryptic-crossword"
          control={<Radio size="small" />}
          label="Cryptic Crossword"
        />
        <FormControlLabel
          value="prize-cryptic"
          control={<Radio size="small" />}
          label="Prize Cryptic"
        />
        <FormControlLabel
          value="prize-toughie"
          control={<Radio size="small" />}
          label="Prize Toughie"
        />
      </RadioGroup>
      <StyledRow>
        <TextField
          label="Crossword ID"
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
      {isError && <Error error={error} />}
    </StyledImportForm>
  );
};

TheTelegraphTab.propTypes = {
  onAddCrossword: PropTypes.func.isRequired,
};
