import PropTypes from "prop-types";
import { IconButton, Toolbar } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

import { PuzzleGrid } from "@app/components";

import { MiniClues } from "./MiniClues";
import { OnscreenKeyboard } from "../../components/OnscreenKeyboard";

import {
  StyledContent,
  StyledPuzzleGrid,
  StyledBottomArea,
  StyledControls,
  StyledControlsLeft,
  StyledControlsRight,
} from "./SmallScreen.styles";

export const SmallScreen = ({
  crossword,
  crosswordState,
  onSaveAnswers,
  onViewAnswerHistory,
  onClearSelectedClue,
  onDeleteAnswer,
  canSaveAnswers,
  canViewAnswerHistory,
  canClearSelectedClue,
  canDeleteAnswer,
  showSavingSpinner,
}) => {
  const showMiniKeyboard = "ontouchstart" in document.documentElement;
  const clueNumberAndType = crosswordState.selectedClue
    ? `${crosswordState.selectedClue.clueNumber} ${crosswordState.selectedClue.clueType}`
    : undefined;

  return (
    <StyledContent>
      <Toolbar />
      <StyledPuzzleGrid>
        <PuzzleGrid
          crossword={crossword}
          currentCell={crosswordState.currentCell}
          selectedCells={crosswordState.selectedClue?.cells}
          answers={crosswordState.answers}
          enteredLettersMap={crosswordState.enteredLettersMap}
          selectCell={crosswordState.selectCell}
          showSavingSpinner={showSavingSpinner}
        />
      </StyledPuzzleGrid>
      <StyledBottomArea>
        <StyledControls>
          <StyledControlsLeft>{clueNumberAndType}</StyledControlsLeft>
          <StyledControlsRight>
            <IconButton
              onClick={onSaveAnswers}
              disabled={!canSaveAnswers}
              title="Save answers"
              color="primary"
            >
              <CloudUploadIcon />
            </IconButton>
            <IconButton
              onClick={onViewAnswerHistory}
              disabled={!canViewAnswerHistory}
              title="View answer history"
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              onClick={onClearSelectedClue}
              disabled={!canClearSelectedClue}
              title="Clear selected clue"
            >
              <ClearIcon />
            </IconButton>
            <IconButton
              onClick={onDeleteAnswer}
              disabled={!canDeleteAnswer}
              title="Delete answer"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </StyledControlsRight>
        </StyledControls>
        <MiniClues
          selectedClue={crosswordState.selectedClue}
          onNextClue={crosswordState.navigateToNextClue}
          onPreviousClue={crosswordState.navigateToPreviousClue}
        />
        {showMiniKeyboard && (
          <OnscreenKeyboard
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
  onSaveAnswers: PropTypes.func.isRequired,
  onViewAnswerHistory: PropTypes.func.isRequired,
  onClearSelectedClue: PropTypes.func.isRequired,
  onDeleteAnswer: PropTypes.func.isRequired,
  canSaveAnswers: PropTypes.bool.isRequired,
  canViewAnswerHistory: PropTypes.bool.isRequired,
  canClearSelectedClue: PropTypes.bool.isRequired,
  canDeleteAnswer: PropTypes.bool.isRequired,
  showSavingSpinner: PropTypes.bool.isRequired,
};
