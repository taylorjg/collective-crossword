import { Button, Container } from "@mui/material";

import { addCrossword } from "@app/firebase";
import {
  usePrivateEye,
  useTelegraphCrypticCrossword,
  useTelegraphPrizeCryptic,
} from "@app/hooks";

import { StyledBox } from "./AdminPage.styles";

export const AdminPage = () => {
  const { crossword, isLoading, isError, error } = usePrivateEye();

  const crypticCrossword = useTelegraphCrypticCrossword(31769);
  console.log({ crypticCrossword });

  const prizeCryptic = useTelegraphPrizeCryptic(31711);
  console.log({ prizeCryptic });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const onAddCrossword = () => {
    addCrossword(crossword);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <StyledBox>
        <div>Puzzle Url: {crossword.url}</div>
        <Button variant="outlined" size="small" onClick={onAddCrossword}>
          Add Crossword
        </Button>
      </StyledBox>
    </Container>
  );
};
