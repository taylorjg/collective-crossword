import { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  LinearProgress,
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

  const onSubmit = (e) => {
    e.preventDefault();
    setIdToFetch(id);
  };

  const onReset = () => {
    setSelectedCrosswordType("cryptic-crossword");
    setId("");
    setIdToFetch("");
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
            disabled={Boolean(idToFetch)}
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
        </StyledRow>

        {isLoading && <LinearProgress sx={{ mt: 2 }} />}
        {isError && <Error error={error} />}
      </form>

      <AddOrViewCrossword
        crossword={crossword}
        crosswordId={crosswordId}
        isLoading={isLoading}
        onAddCrossword={onAddCrossword}
      />

      <Button
        variant="outlined"
        size="small"
        onClick={onReset}
        disabled={!idToFetch || isLoading}
        color="error"
        sx={{ mt: 4 }}
      >
        Reset
      </Button>
    </StyledImportForm>
  );
};

TheTelegraphTab.propTypes = {
  onAddCrossword: PropTypes.func.isRequired,
};
