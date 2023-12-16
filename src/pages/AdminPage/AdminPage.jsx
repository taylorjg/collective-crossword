import { Button, Container, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

import { addCrossword } from "@app/firebase";
import {
  usePrivateEye2,
  useTelegraphCrypticCrossword,
  useTelegraphPrizeCryptic,
} from "@app/hooks";

import {
  StyledBox,
  StyledBoxContent,
  StyledLoading,
  StyledError,
} from "./AdminPage.styles";

const Loading = () => {
  return (
    <StyledLoading>
      <CircularProgress />
    </StyledLoading>
  );
};

const Error = ({ error }) => {
  return <StyledError>Error: {error.message}</StyledError>;
};

Error.propTypes = {
  error: PropTypes.shape({ message: PropTypes.string.isRequired }),
};

export const AdminPage = () => {
  const { crossword, isLoading, isError, error } = usePrivateEye2(767);

  const crypticCrossword = useTelegraphCrypticCrossword(31769);
  console.log({ crypticCrossword });

  const prizeCryptic = useTelegraphPrizeCryptic(31711);
  console.log({ prizeCryptic });

  const onAddCrossword = () => {
    addCrossword(crossword);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <StyledBox>
        <StyledBoxContent showContent={Boolean(crossword)}>
          <div>Puzzle Url: {crossword?.url ?? ""}</div>
          <Button variant="outlined" size="small" onClick={onAddCrossword}>
            Add Crossword
          </Button>
        </StyledBoxContent>
        {isLoading && <Loading />}
        {isError && <Error error={error} />}
      </StyledBox>
    </Container>
  );
};
