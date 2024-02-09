import { useEffect } from "react";
import PropTypes from "prop-types";
import { Grid, Typography } from "@mui/material";

import { PuzzleGrid } from "@app/components";
import { formatDate } from "@app/utils";

import {
  StyledPuzzle,
  StyledPuzzleGrid,
  StyledClues,
  StyledClue,
  StyledClueNumber,
  StyledClueText,
} from "./CrosswordPage.styles";

export const LargeScreen = ({ crossword, crosswordState }) => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (/[a-zA-Z]/.test(e.key)) {
        crosswordState.enterLetter(e.key.toUpperCase());
      }
      if (e.key === "Backspace") {
        // TODO: crosswordState.deleteLetter();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [crosswordState]);

  return (
    <Grid container>
      <Grid item xs={12} md={10} sx={{ mx: { xs: 2, md: "auto" } }}>
        <div>Publication: {crossword.publication}</div>
        <div>Publish Date: {formatDate(crossword.publishDate)}</div>
        <div>Creation Date: {formatDate(crossword.timestamp.seconds)}</div>
        <div>Title: {crossword.title}</div>
        {crossword.author && <div>Author: {crossword.author}</div>}
        <StyledPuzzle>
          <StyledPuzzleGrid>
            <PuzzleGrid
              crossword={crossword}
              currentCell={crosswordState.currentCell}
              selectedCells={crosswordState.selectedClue?.cells}
              selectCell={crosswordState.selectCell}
              acrossAnswers={crosswordState.acrossAnswers}
              downAnswers={crosswordState.downAnswers}
            />
          </StyledPuzzleGrid>
          <StyledClues>
            <Typography variant="h6">Across</Typography>
            {crossword.acrossClues.map((clue) => {
              return (
                <StyledClue key={`across-clue-${clue.clueNumber}`}>
                  <StyledClueNumber>{clue.clueNumber}</StyledClueNumber>
                  <StyledClueText>{clue.clue}</StyledClueText>
                </StyledClue>
              );
            })}
          </StyledClues>
          <StyledClues>
            <Typography variant="h6">Down</Typography>
            {crossword.downClues.map((clue) => {
              return (
                <StyledClue key={`down-clue-${clue.clueNumber}`}>
                  <StyledClueNumber>{clue.clueNumber}</StyledClueNumber>
                  <StyledClueText>{clue.clue}</StyledClueText>
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
