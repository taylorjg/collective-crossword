import { Button, Container } from "@mui/material";

import { addCrossword } from "@app/firebase";
import { usePrivateEye } from "@app/hooks";

import { StyledBox } from "./AdminPage.styles";

export const AdminPage = () => {
  const { puzData, isLoading, isError, error } = usePrivateEye();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const onAddCrossword = () => {
    addCrossword({
      url: puzData.puzzleUrl,
      publication: "Private Eye",
      author: puzData.puzzle.author,
      title: puzData.puzzle.title,
      grid: puzData.grid,
      acrossClues: puzData.acrossClues,
      downClues: puzData.downClues,
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <StyledBox>
        <div>Puzzle Url: {puzData.puzzleUrl}</div>
        <Button variant="outlined" size="small" onClick={onAddCrossword}>
          Add Crossword
        </Button>
      </StyledBox>
    </Container>
  );
};
