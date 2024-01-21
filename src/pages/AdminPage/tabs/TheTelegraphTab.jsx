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

import { AddOrViewCrossword, Error } from "../components";
import { StyledImportForm, StyledRow } from "../components/common.styles";

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
      <AddOrViewCrossword
        crossword={crossword}
        crosswordId={crosswordId}
        isLoading={isLoading}
        onAddCrossword={onAddCrossword}
      />
      {isError && <Error error={error} />}
    </StyledImportForm>
  );
};

TheTelegraphTab.propTypes = {
  onAddCrossword: PropTypes.func.isRequired,
};
