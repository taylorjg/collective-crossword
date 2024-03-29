import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import { StyledMiniClues, StyledNav, StyledClue } from "./MiniClues.styles";

export const MiniClues = ({ selectedClue, onNextClue, onPreviousClue }) => {
  return (
    <StyledMiniClues>
      <StyledNav onClick={onPreviousClue}>
        <IconButton>
          <ArrowBackIosNewIcon />
        </IconButton>
      </StyledNav>
      <StyledClue
        dangerouslySetInnerHTML={{ __html: selectedClue?.clue ?? "" }}
      />
      <StyledNav onClick={onNextClue}>
        <IconButton>
          <ArrowForwardIosIcon />
        </IconButton>
      </StyledNav>
    </StyledMiniClues>
  );
};

MiniClues.propTypes = {
  selectedClue: PropTypes.object,
  onNextClue: PropTypes.func.isRequired,
  onPreviousClue: PropTypes.func.isRequired,
};
