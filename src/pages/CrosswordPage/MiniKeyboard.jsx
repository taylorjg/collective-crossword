import PropTypes from "prop-types";

import { StyledMiniKeyboard } from "./MiniKeyboard.styles";

export const MiniKeyboard = ({ onLetterEntered, onDeleteLetter }) => {
  console.log({ onLetterEntered, onDeleteLetter });
  return <StyledMiniKeyboard>MiniKeyboard</StyledMiniKeyboard>;
};

MiniKeyboard.propTypes = {
  onLetterEntered: PropTypes.func.isRequired,
  onDeleteLetter: PropTypes.func.isRequired,
};
