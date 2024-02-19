import PropTypes from "prop-types";

import {
  StyledMiniKeyboard,
  StyledKeyboardRow,
  StyledLetterKey,
  StyledDeleteKey,
  StyledKeyInner,
} from "./OnscreenKeyboard.styles";

// eslint-disable-next-line prettier/prettier
const KEYBOARD_ROWS = [
  "QWERTYUIOP",
  "ASDFGHJKL",
  "ZXCVBNM."
];

export const OnscreenKeyboard = ({ onLetterEntered, onDeleteLetter }) => {
  return (
    <StyledMiniKeyboard>
      {KEYBOARD_ROWS.flatMap((keyboardRow) => {
        const keys = Array.from(keyboardRow);

        return (
          <StyledKeyboardRow key={keyboardRow}>
            {keys.map((key) =>
              key === "." ? (
                <StyledDeleteKey key={key} onClick={onDeleteLetter}>
                  <StyledKeyInner>Del</StyledKeyInner>
                </StyledDeleteKey>
              ) : (
                <StyledLetterKey key={key} onClick={() => onLetterEntered(key)}>
                  <StyledKeyInner>{key}</StyledKeyInner>
                </StyledLetterKey>
              )
            )}
          </StyledKeyboardRow>
        );
      })}
    </StyledMiniKeyboard>
  );
};

OnscreenKeyboard.propTypes = {
  onLetterEntered: PropTypes.func.isRequired,
  onDeleteLetter: PropTypes.func.isRequired,
};
