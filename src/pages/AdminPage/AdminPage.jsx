import { useState } from "react";
import { Button, Container, CircularProgress, TextField } from "@mui/material";
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
  StyledRow,
  StyledRow2Cols,
  StyledAlreadyAdded,
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
      <StyledBoxContent showContent={crossword && !isLoading}>
        <div>Url: {crossword?.url ?? ""}</div>
        {exists ? (
          <StyledAlreadyAdded>
            This crossword has already been added.
          </StyledAlreadyAdded>
        ) : (
          <Button variant="outlined" size="small" onClick={handleAddCrossword}>
            Add Crossword
          </Button>
        )}
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

const Crossword2 = ({ onAddCrossword, useCrossword, label, exampleId }) => {
  const [id, setId] = useState("");
  const [idToUse, setIdToUse] = useState("");

  const crosswordResponse = useCrossword(idToUse);

  const { crossword, puzData, isLoading, isError, error, exists } =
    crosswordResponse;

  const handleFetchCrossword = () => {
    setIdToUse(id);
  };

  const handleReset = () => {
    setId("");
    setIdToUse("");
  };

  const handleAddCrossword = () => {
    onAddCrossword(crossword);
  };

  return (
    <StyledBox>
      <StyledBoxContent showContent={true}>
        <div>{label}</div>
        <StyledRow>
          <TextField
            label="Crossword ID"
            placeholder={`e.g. ${exampleId}`}
            value={id}
            onChange={(e) => setId(e.target.value)}
            size="small"
            disabled={Boolean(idToUse)}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleFetchCrossword}
            disabled={!id || idToUse}
          >
            Fetch Crossword
          </Button>
        </StyledRow>
        <Button
          size="small"
          onClick={handleReset}
          style={{ position: "absolute", top: "16px", right: "16px" }}
          disabled={!idToUse}
        >
          Reset
        </Button>
        {crossword && !isLoading && (
          <>
            <StyledRow2Cols>
              <div>Title: {crossword.title}</div>
              <div>Date: {puzData.copy["date-publish"]}</div>
            </StyledRow2Cols>
            {exists ? (
              <StyledAlreadyAdded>
                This crossword has already been added.
              </StyledAlreadyAdded>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddCrossword}
              >
                Add Crossword
              </Button>
            )}
          </>
        )}
      </StyledBoxContent>
      {isError && <Error error={error} />}
    </StyledBox>
  );
};

Crossword2.propTypes = {
  onAddCrossword: PropTypes.func.isRequired,
  useCrossword: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  exampleId: PropTypes.number.isRequired,
};

export const AdminPage = () => {
  const privateEyeCrosswordResponse = usePrivateEyeCurrentCrossword();
  console.log({ privateEyeCrossword: privateEyeCrosswordResponse });

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

      <Crossword2
        onAddCrossword={onAddCrossword}
        useCrossword={useTheDailyTelegraphCrypticCrosswordById}
        label="The Daily Telegraph Cryptic Crossword"
        exampleId={31769}
      />

      <Crossword2
        onAddCrossword={onAddCrossword}
        useCrossword={useTheDailyTelegraphPrizeCrypticById}
        label="The Daily Telegraph Prize Cryptic"
        exampleId={31711}
      />

      <Crossword2
        onAddCrossword={onAddCrossword}
        useCrossword={useTheSundayTelegraphPrizeCrypticById}
        label="The Sunday Telegraph Prize Cryptic"
        exampleId={31712}
      />
    </Container>
  );
};
