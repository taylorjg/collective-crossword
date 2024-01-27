import PropTypes from "prop-types";
import { Avatar } from "@mui/material";

const getPublicationInitials = (publication) => {
  switch (publication) {
    case "The Telegraph":
      return "TT";
    case "Private Eye":
      return "PE";
    default:
      return "?";
  }
};

export const CrosswordAvatar = ({ crossword }) => {
  return <Avatar>{getPublicationInitials(crossword.publication)}</Avatar>;
};

CrosswordAvatar.propTypes = {
  crossword: PropTypes.object.isRequired,
};
