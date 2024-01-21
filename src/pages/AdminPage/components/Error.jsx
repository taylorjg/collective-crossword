import PropTypes from "prop-types";
import { Alert } from "@mui/material";

const isCloudFunctions404 = (error) => error?.code === "functions/not-found";
const isAxios404 = (error) => error.response?.status === 404;

export const Error = ({ error }) => {
  const errorMessage =
    isCloudFunctions404(error) || isAxios404(error)
      ? `Failed to find requested crossword.`
      : `Error: ${error.message}`;
  return <Alert severity="error">{errorMessage}</Alert>;
};

Error.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
};
