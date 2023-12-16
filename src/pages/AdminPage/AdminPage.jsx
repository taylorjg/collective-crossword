import { Button, Container, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

import { addCrossword } from "@app/firebase";
import {
  usePrivateEyeCrosswordById,
  useTheDailyTelegraphCrypticCrosswordById,
  useTheDailyTelegraphPrizeCrypticById,
  useTheSundayTelegraphPrizeCrypticById,
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
  const { crossword, isLoading, isError, error } =
    usePrivateEyeCrosswordById(767);

  const telegraphCrossword1 = useTheDailyTelegraphCrypticCrosswordById(31769);
  console.log({ telegraphCrossword1 });

  const telegraphCrossword2 = useTheDailyTelegraphPrizeCrypticById(31711);
  console.log({ telegraphCrossword2 });

  const telegraphCrossword3 = useTheSundayTelegraphPrizeCrypticById(31712);
  console.log({ telegraphCrossword3 });

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
