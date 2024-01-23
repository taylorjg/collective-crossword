import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

import { getCrosswordById } from "@app/firebase";
import { FullPageMessage, Grid } from "@app/components";
import { formatDate } from "@app/utils";

import {
  StyledPuzzle,
  StyledGrid,
  StyledClues,
  StyledClue,
  StyledClueNumber,
  StyledClueText,
} from "./CrosswordPage.styles";

export const CrosswordPage = () => {
  const [crossword, setCrossword] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const { id } = useParams();

  useEffect(() => {
    const invokeGetCrossword = async () => {
      const docSnap = await getCrosswordById(id);
      if (docSnap.exists()) {
        setCrossword({
          id: docSnap.id,
          ...docSnap.data(),
        });
      } else {
        setErrorMessage("Failed to load specified crossword");
      }
    };

    invokeGetCrossword();
  }, [id]);

  if (errorMessage) return <FullPageMessage message={errorMessage} />;

  if (!crossword) return <FullPageMessage message="Fetching crossword..." />;

  return (
    <>
      <div>Publication: {crossword.publication}</div>
      <div>Publish Date: {formatDate(crossword.publishDate)}</div>
      <div>Creation Date: {formatDate(crossword.timestamp.seconds)}</div>
      <div>Title: {crossword.title}</div>
      {crossword.author && <div>Author: {crossword.author}</div>}
      <StyledPuzzle>
        <StyledGrid>
          <Grid crossword={crossword} />
        </StyledGrid>
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
    </>
  );
};
