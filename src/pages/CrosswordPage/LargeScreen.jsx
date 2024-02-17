import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Grid, IconButton, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { addAnswer } from "@app/firebase";
import { PuzzleGrid } from "@app/components";
import { formatDate, minDuration } from "@app/utils";
import { useAuth, useToast } from "@app/contexts";

import {
  StyledPuzzle,
  StyledPuzzleGrid,
  StyledClues,
  StyledClue,
  StyledClueNumber,
  StyledClueText,
} from "./CrosswordPage.styles";

export const LargeScreen = ({ crossword, crosswordState }) => {
  const [showSavingSpinner, setShowSavingSpinner] = useState(false);
  const { user } = useAuth();
  const { showError } = useToast();

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

  const onAddAnswers = async () => {
    if (!user) return;
    const saveAnswer = async (partialAnswer) => {
      await addAnswer(
        crossword,
        partialAnswer.clueNumber,
        partialAnswer.clueType,
        partialAnswer.answer,
        user.userId,
        user.username,
        user.displayName
      );
    };
    const saveAnswers = async () => {
      for (const partialAnswer of crosswordState.partialAnswers) {
        const isComplete = !partialAnswer.answer.includes(" ");
        if (isComplete) {
          saveAnswer(partialAnswer);
        }
      }
    };
    try {
      setShowSavingSpinner(true);
      await minDuration(saveAnswers(), 1000);
      // TODO: call crosswordState function to remove complete partial answers
    } catch (error) {
      showError("Failed to save answers", error.message);
    } finally {
      setShowSavingSpinner(false);
    }
  };

  return (
    <Grid container>
      <Grid item xs={12} md={10} sx={{ mx: { xs: 2, md: "auto" } }}>
        <div>Publication: {crossword.publication}</div>
        <div>Publish Date: {formatDate(crossword.publishDate)}</div>
        <div>Creation Date: {formatDate(crossword.timestamp.seconds)}</div>
        <div>Title: {crossword.title}</div>
        <IconButton
          variant="contained"
          title="Save answers"
          onClick={onAddAnswers}
          sx={{ my: 1 }}
          disabled={!user}
        >
          <CloudUploadIcon />
        </IconButton>
        {crossword.author && <div>Author: {crossword.author}</div>}
        <StyledPuzzle>
          <StyledPuzzleGrid>
            <PuzzleGrid
              crossword={crossword}
              currentCell={crosswordState.currentCell}
              selectedCells={crosswordState.selectedClue?.cells}
              answers={crosswordState.answers}
              partialAnswers={crosswordState.partialAnswers}
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
  );
};

LargeScreen.propTypes = {
  crossword: PropTypes.object.isRequired,
  crosswordState: PropTypes.object.isRequired,
};
