import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const ViewCrosswordButton = ({ crosswordId }) => {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate(`/crosswords/${crosswordId}`)}>
      View Crossword
    </Button>
  );
};

ViewCrosswordButton.propTypes = {
  crosswordId: PropTypes.string.isRequired,
};
