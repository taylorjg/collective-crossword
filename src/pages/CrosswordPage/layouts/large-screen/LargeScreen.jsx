import { useEffect } from "react";
import PropTypes from "prop-types";
import { Grid, IconButton, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SearchIcon from "@mui/icons-material/Search";

import { PuzzleGrid } from "@app/components";
import { formatDate } from "@app/utils";

import {
  StyledPuzzle,
  StyledPuzzleGrid,
  StyledClues,
  StyledClue,
  StyledClueNumber,
  StyledClueText,
} from "../../CrosswordPage.styles";

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
          <IconButton
            title="Save answers"
            onClick={onSaveAnswers}
            sx={{ my: 1 }}
            color="primary"
            disabled={!canSaveAnswers}
          >
            <CloudUploadIcon />
          </IconButton>
          <IconButton
            title="View answer details"
            onClick={onViewAnswerDetails}
            sx={{ my: 1 }}
            disabled={!canViewAnswerDetails}
          >
            <SearchIcon />
          </IconButton>
          <IconButton
            title="Clear selected clue"
            onClick={onClearSelectedClue}
            sx={{ my: 1 }}
            disabled={!canClearSelectedClue}
          >
            <ClearIcon />
          </IconButton>
          {crossword.author && <div>Author: {crossword.author}</div>}
          <StyledPuzzle>
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
          </StyledPuzzle>
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
