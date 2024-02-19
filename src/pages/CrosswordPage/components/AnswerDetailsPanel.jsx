import PropTypes from "prop-types";
import { Divider, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { formatDateTime } from "@app/utils";

import {
  StyledPanel,
  StyledPanelHeader,
  StyledPanelBody,
} from "./AnswerDetailsPanel.styles";

export const AnswerDetailsPanel = ({ clue, answer, onClose }) => {
  return (
    <StyledPanel>
      <StyledPanelHeader>
        <Typography variant="h6">Answer Details</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </StyledPanelHeader>
      <Divider />
      <StyledPanelBody>
        <div>
          {clue.clueNumber} {clue.clueType}
        </div>
        <Typography sx={{ fontStyle: "italic" }}>{clue.clue}</Typography>
        <div>{answer.answer}</div>
        <div>{answer.username}</div>
        <div>{answer.displayName}</div>
        <div>{formatDateTime(answer.timestamp.seconds)}</div>
      </StyledPanelBody>
    </StyledPanel>
  );
};

AnswerDetailsPanel.propTypes = {
  clue: PropTypes.object.isRequired,
  answer: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};
