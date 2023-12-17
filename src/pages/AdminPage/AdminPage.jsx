import { Button, Container, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { addCrossword } from "@app/firebase";
import {
  usePrivateEyeCurrentCrossword,
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

const isCloudFunctions404 = (error) => error?.code === "functions/not-found";
const isAxios404 = (error) => error.response?.status === 404;

const Error = ({ error }) => {
  const errorMessage =
    isCloudFunctions404(error) || isAxios404(error)
      ? `Failed to find requested crossword.`
      : `Error: ${error.message}`;
  return <StyledError>{errorMessage}</StyledError>;
};

Error.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
};

const Crossword = ({ crosswordResponse, onAddCrossword }) => {
  const { crossword, isLoading, isError, error, exists } = crosswordResponse;

  const handleAddCrossword = () => {
    onAddCrossword(crossword);
  };

  return (
    <StyledBox>
      <StyledBoxContent showContent={Boolean(crossword)}>
        <div>Puzzle Url: {crossword?.url ?? ""}</div>
        <Button
          variant="outlined"
          size="small"
          onClick={handleAddCrossword}
          disabled={isLoading || exists === true}
        >
          Add Crossword
        </Button>
      </StyledBoxContent>
      {isLoading && <Loading />}
      {isError && <Error error={error} />}
    </StyledBox>
  );
};

Crossword.propTypes = {
  crosswordResponse: PropTypes.shape({
    crossword: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }),
    isLoading: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    error: PropTypes.shape({ message: PropTypes.string }),
    exists: PropTypes.bool,
  }),
  onAddCrossword: PropTypes.func.isRequired,
};

export const AdminPage = () => {
  const privateEyeCrosswordResponse = usePrivateEyeCurrentCrossword();
  console.log({ privateEyeCrossword: privateEyeCrosswordResponse });

  const theDailyTelegraphCrypticCrosswordResponse =
    useTheDailyTelegraphCrypticCrosswordById(31769);
  console.log({
    theDailyTelegraphCrypticCrossword:
      theDailyTelegraphCrypticCrosswordResponse,
  });

  const theDailyTelegraphPrizeCrypticResponse =
    useTheDailyTelegraphPrizeCrypticById(31711);
  console.log({
    theDailyTelegraphPrizeCryptic: theDailyTelegraphPrizeCrypticResponse,
  });

  const theSundayTelegraphPrizrCrypticResponse =
    useTheSundayTelegraphPrizeCrypticById(31712);
  console.log({
    theSundayTelegraphPrizrCryptic: theSundayTelegraphPrizrCrypticResponse,
  });

  const onAddCrossword = (crossword) => {
    addCrossword(crossword);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/">Home</Link>
      </div>

      <Crossword
        crosswordResponse={privateEyeCrosswordResponse}
        onAddCrossword={onAddCrossword}
      />
      <Crossword
        crosswordResponse={theDailyTelegraphCrypticCrosswordResponse}
        onAddCrossword={onAddCrossword}
      />
      <Crossword
        crosswordResponse={theDailyTelegraphPrizeCrypticResponse}
        onAddCrossword={onAddCrossword}
      />
      <Crossword
        crosswordResponse={theSundayTelegraphPrizrCrypticResponse}
        onAddCrossword={onAddCrossword}
      />
    </Container>
  );
};
