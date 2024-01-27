import PropTypes from "prop-types";
import { Avatar } from "@mui/material";

const getLogo = (publication) => {
  switch (publication) {
    case "The Telegraph":
      return {
        src: "logos/the-telegraph-logo.svg",
        alt: "The Telegraph logo",
      };
    case "Private Eye":
      return {
        src: "logos/private-eye-logo.png",
        alt: "Private Eye logo",
      };
    default:
      return null;
  }
};

export const CrosswordAvatar = ({ crossword }) => {
  const logo = getLogo(crossword.publication);

  return logo ? <Avatar {...logo} /> : <Avatar>?</Avatar>;
};

CrosswordAvatar.propTypes = {
  crossword: PropTypes.object.isRequired,
};
