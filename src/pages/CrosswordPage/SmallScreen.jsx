import PropTypes from "prop-types";
import { Toolbar } from "@mui/material";

import { PuzzleGrid } from "@app/components";

import {
  StyledContent,
  StyledPuzzleGrid,
  StyledSingleClueArea,
} from "./SmallScreen.styles";

export const SmallScreen = ({ crossword }) => {
  return (
    <StyledContent>
      <Toolbar />
      <StyledPuzzleGrid>
        <PuzzleGrid crossword={crossword} />
      </StyledPuzzleGrid>
      <StyledSingleClueArea>
        Single clues will appear here...
      </StyledSingleClueArea>
    </StyledContent>
  );
};

SmallScreen.propTypes = {
  crossword: PropTypes.object.isRequired,
};
