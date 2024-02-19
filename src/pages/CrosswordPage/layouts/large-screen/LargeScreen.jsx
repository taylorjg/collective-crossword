import { useEffect } from "react";
import PropTypes from "prop-types";
import { Grid, IconButton, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SearchIcon from "@mui/icons-material/Search";

import { PuzzleGrid } from "@app/components";
import { formatDate } from "@app/utils";

import {
  StyledPuzzleAndClues,
  StyledPuzzleGrid,
  StyledClues,
  StyledClue,
  StyledClueNumber,
  StyledClueText,
} from "../../CrosswordPage.styles";

import { StyledControls } from "./LargeScreen.styles";

export const LargeScreen = ({
  crossword,
  crosswordState,
  onSaveAnswers,
  onViewAnswerDetails,
  onClearSelectedClue,
  canSaveAnswers,
  canViewAnswerDetails,
  canClearSelectedClue,
  showSavingSpinner,
}) => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (/^[a-zA-Z]$/.test(e.key)) {
        crosswordState.enterLetter(e.key.toUpperCase());
      }
      if (e.key === "Backspace") {
        crosswordState.deleteLetter();
      }
      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          crosswordState.navigateToPreviousClue();
        } else {
          crosswordState.navigateToNextClue();
        }
      }
      if (e.key === "ArrowLeft") {
        crosswordState.navigateLeft();
      }
      if (e.key === "ArrowRight") {
        crosswordState.navigateRight();
      }
      if (e.key === "ArrowUp") {
        crosswordState.navigateUp();
      }
      if (e.key === "ArrowDown") {
        crosswordState.navigateDown();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [crosswordState]);

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={10} sx={{ mx: { xs: 2, md: "auto" } }}>
          <div>Publication: {crossword.publication}</div>
          <div>Publish Date: {formatDate(crossword.publishDate)}</div>
          <div>Creation Date: {formatDate(crossword.timestamp.seconds)}</div>
          <div>Title: {crossword.title}</div>
          {crossword.author && <div>Author: {crossword.author}</div>}

          <StyledControls>
            <IconButton
              onClick={onSaveAnswers}
              disabled={!canSaveAnswers}
              title="Save answers"
              color="primary"
            >
              <CloudUploadIcon />
            </IconButton>
            <IconButton
              onClick={onViewAnswerDetails}
              disabled={!canViewAnswerDetails}
              title="View answer details"
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
          </StyledControls>

          <StyledPuzzleAndClues>
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

            <StyledClues>
              <Typography variant="h6">Across</Typography>
              {crossword.acrossClues.map((clue) => {
                const selected = clue === crosswordState.selectedClue;
                return (
                  <StyledClue
                    key={`across-clue-${clue.clueNumber}`}
                    selected={selected}
                    onClick={() => crosswordState.selectClue(clue)}
                  >
                    <StyledClueNumber>{clue.clueNumber}</StyledClueNumber>
                    <StyledClueText
                      dangerouslySetInnerHTML={{
                        __html: clue.clue,
                      }}
                    />
                  </StyledClue>
                );
              })}
            </StyledClues>

            <StyledClues>
              <Typography variant="h6">Down</Typography>
              {crossword.downClues.map((clue) => {
                const selected = clue === crosswordState.selectedClue;
                return (
                  <StyledClue
                    key={`down-clue-${clue.clueNumber}`}
                    selected={selected}
                    onClick={() => crosswordState.selectClue(clue)}
                  >
                    <StyledClueNumber>{clue.clueNumber}</StyledClueNumber>
                    <StyledClueText
                      dangerouslySetInnerHTML={{
                        __html: clue.clue,
                      }}
                    />
                  </StyledClue>
                );
              })}
            </StyledClues>
          </StyledPuzzleAndClues>
        </Grid>
      </Grid>
    </>
  );
};

LargeScreen.propTypes = {
  crossword: PropTypes.object.isRequired,
  crosswordState: PropTypes.object.isRequired,
  onSaveAnswers: PropTypes.func.isRequired,
  onViewAnswerDetails: PropTypes.func.isRequired,
  onClearSelectedClue: PropTypes.func.isRequired,
  canSaveAnswers: PropTypes.bool.isRequired,
  canViewAnswerDetails: PropTypes.bool.isRequired,
  canClearSelectedClue: PropTypes.bool.isRequired,
  showSavingSpinner: PropTypes.bool.isRequired,
};
