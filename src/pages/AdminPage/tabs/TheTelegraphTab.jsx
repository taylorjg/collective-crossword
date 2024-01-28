import { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import {
  useTheTelegraphCrypticCrosswordById,
  useTheTelegraphToughieCrosswordById,
  useTheTelegraphPrizeCrypticById,
  useTheTelegraphPrizeToughieById,
  useTheTelegraphQuickCrosswordById,
} from "@app/hooks";

import { AddOrViewCrossword, Error } from "../components";
import { StyledImportForm, StyledRow } from "../components/common.styles";

const getUseCrossword = (crosswordType) => {
  switch (crosswordType) {
    default:
    case "cryptic-crossword":
      return useTheTelegraphCrypticCrosswordById;
    case "toughie-crossword":
      return useTheTelegraphToughieCrosswordById;
    case "prize-cryptic":
      return useTheTelegraphPrizeCrypticById;
    case "prize-toughie":
      return useTheTelegraphPrizeToughieById;
    case "quick-crossword":
      return useTheTelegraphQuickCrosswordById;
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

  const onChangeCrosswordType = (e) => {
    setSelectedCrosswordType(e.target.value);
  };

  const onReset = () => {
    setId("");
    setIdToFetch("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIdToFetch(id);
  };

  return (
    <StyledImportForm>
      <form autoComplete="off" onSubmit={onSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="demo-simple-select-label">Crossword Type</InputLabel>
          <Select
            label="Crossword Type"
            size="small"
            value={selectedCrosswordType}
            onChange={onChangeCrosswordType}
          >
            <MenuItem value="cryptic-crossword">Cryptic Crossword</MenuItem>
            <MenuItem value="toughie-crossword">Toughie Crossword</MenuItem>
            <MenuItem value="prize-cryptic">Prize Cryptic</MenuItem>
            <MenuItem value="prize-toughie">Prize Toughie</MenuItem>
            <MenuItem value="quick-crossword">Quick Crossword</MenuItem>
          </Select>
        </FormControl>
        <StyledRow>
          <TextField
            label="Crossword ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            size="small"
            disabled={Boolean(idToFetch)}
          />
          <Button
            type="submit"
            variant="outlined"
            size="small"
            disabled={!id || id === idToFetch}
          >
            Fetch
          </Button>
          {isLoading && <CircularProgress size="1.5rem" />}
        </StyledRow>
        <Button
          size="small"
          onClick={onReset}
          style={{ position: "absolute", top: "16px", right: "16px" }}
          disabled={!idToFetch}
        >
          Reset
        </Button>
      </form>

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
