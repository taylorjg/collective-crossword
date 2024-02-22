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

export const AnswerDetailsPanel = ({ clue, allAnswers, onClose }) => {
  const nowSeconds = new Date().valueOf() / 1000;
  const answersToThisClue = allAnswers
    .filter(
      (answer) =>
        answer.clueNumber === clue.clueNumber &&
        answer.clueType === clue.clueType
    )
    .sort((a, b) => {
      const aSeconds = a.timestamp?.seconds ?? nowSeconds;
      const bSeconds = b.timestamp?.seconds ?? nowSeconds;
      return bSeconds - aSeconds;
    });

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

        {answersToThisClue.map((answer, index) => (
          <StyledAnswer key={index}>
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
        ))}
      </StyledPanelBody>
    </StyledPanel>
  );
};

AnswerDetailsPanel.propTypes = {
  clue: PropTypes.object.isRequired,
  allAnswers: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};
