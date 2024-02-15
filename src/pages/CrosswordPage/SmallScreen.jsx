import PropTypes from "prop-types";
import { Toolbar } from "@mui/material";

import { PuzzleGrid } from "@app/components";

import { MiniClues } from "./MiniClues";
import { MiniKeyboard } from "./MiniKeyboard";

import {
  StyledContent,
  StyledPuzzleGrid,
  StyledBottomArea,
} from "./SmallScreen.styles";

export const SmallScreen = ({ crossword, crosswordState }) => {
  const showMiniKeyboard = "ontouchstart" in document.documentElement;

  return (
    <StyledContent>
      <Toolbar />
      <StyledPuzzleGrid>
        <PuzzleGrid
          crossword={crossword}
          currentCell={crosswordState.currentCell}
          selectedCells={crosswordState.selectedClue?.cells}
          answers={crosswordState.answers}
          selectCell={crosswordState.selectCell}
        />
      </StyledPuzzleGrid>
      <StyledBottomArea>
        <MiniClues
          selectedClue={crosswordState.selectedClue}
          onNextClue={crosswordState.navigateToNextClue}
          onPreviousClue={crosswordState.navigateToPreviousClue}
        />
        {showMiniKeyboard && (
          <MiniKeyboard
            onLetterEntered={crosswordState.enterLetter}
            onDeleteLetter={crosswordState.deleteLetter}
          />
        )}
      </StyledBottomArea>
    </StyledContent>
  );
};

SmallScreen.propTypes = {
  crossword: PropTypes.object.isRequired,
  crosswordState: PropTypes.object.isRequired,
};
