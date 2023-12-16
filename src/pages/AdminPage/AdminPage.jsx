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

const Crossword = ({
  crossword,
  isLoading,
  isError,
  error,
  onAddCrossword,
}) => {
  return (
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
  );
};

Crossword.propTypes = {
  crossword: PropTypes.shape({ url: PropTypes.string.isRequired }),
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  error: PropTypes.shape({ message: PropTypes.string }),
  onAddCrossword: PropTypes.func.isRequired,
};

export const AdminPage = () => {
  const privateEyeCrossword = usePrivateEyeCrosswordById(767);

  const theDailyTelegraphCrypticCrossword =
    useTheDailyTelegraphCrypticCrosswordById(31769);
  console.log({ telegraphCrossword1: theDailyTelegraphCrypticCrossword });

  const theDailyTelegraphPrizeCryptic =
    useTheDailyTelegraphPrizeCrypticById(31711);
  console.log({ telegraphCrossword2: theDailyTelegraphPrizeCryptic });

  const theSundayTelegraphPrizrCryptic =
    useTheSundayTelegraphPrizeCrypticById(31712);
  console.log({ telegraphCrossword3: theSundayTelegraphPrizrCryptic });

  const onAddCrossword = () => {
    addCrossword(privateEyeCrossword.crossword);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Crossword {...privateEyeCrossword} onAddCrossword={onAddCrossword} />
      <Crossword
        {...theDailyTelegraphCrypticCrossword}
        onAddCrossword={onAddCrossword}
      />
      <Crossword
        {...theDailyTelegraphPrizeCryptic}
        onAddCrossword={onAddCrossword}
      />
      <Crossword
        {...theSundayTelegraphPrizrCryptic}
        onAddCrossword={onAddCrossword}
      />
    </Container>
  );
};
