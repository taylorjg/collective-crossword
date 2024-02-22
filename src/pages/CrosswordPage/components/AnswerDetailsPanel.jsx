import PropTypes from "prop-types";
import { Divider, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { formatDateTime } from "@app/utils";

import {
  StyledPanel,
  StyledPanelHeader,
  StyledPanelBody,
  StyledClue,
  StyledClueNumberAndType,
  StyledAnswer,
  StyledAnswerLabel,
  StyledAnswerValue,
} from "./AnswerDetailsPanel.styles";

export const AnswerDetailsPanel = ({ clue, answer, onClose }) => {
  return (
    <StyledPanel>
      <StyledPanelHeader>
        <Typography variant="h6">Answer History</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </StyledPanelHeader>
      <Divider />
      <StyledPanelBody>
        <StyledClue>
          <StyledClueNumberAndType>
            {clue.clueNumber} {clue.clueType}
          </StyledClueNumberAndType>
          <Typography dangerouslySetInnerHTML={{ __html: clue.clue ?? "" }} />
        </StyledClue>

        <Divider />

        <StyledAnswer>
          <StyledAnswerLabel>Answer:</StyledAnswerLabel>
          <StyledAnswerValue primary>{answer.answer}</StyledAnswerValue>

          <StyledAnswerLabel>Added By:</StyledAnswerLabel>
          <StyledAnswerValue>
            {answer.displayName ?? answer.answer}
          </StyledAnswerValue>

          <StyledAnswerLabel>Added At:</StyledAnswerLabel>
          <StyledAnswerValue>
            {formatDateTime(answer.timestamp.seconds)}
          </StyledAnswerValue>
        </StyledAnswer>
      </StyledPanelBody>
    </StyledPanel>
  );
};

AnswerDetailsPanel.propTypes = {
  clue: PropTypes.object.isRequired,
  answer: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};
