import PropTypes from "prop-types";

export const MiniKeyboard = ({ onLetterEntered, onDeleteLetter }) => {
  console.log({ onLetterEntered, onDeleteLetter });
  return <div>MiniKeyboard</div>;
};

MiniKeyboard.propTypes = {
  onLetterEntered: PropTypes.func.isRequired,
  onDeleteLetter: PropTypes.func.isRequired,
};
