import PropTypes from "prop-types";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";

import { formatDateTime } from "@app/utils";

import {
  StyledPanel,
  StyledPanelHeader,
  StyledPanelBody,
} from "./AnswerHistoryPanel.styles";

const AnswerTimelineItem = ({ answer }) => {
  const deleted = answer.deleted;
  const colour = deleted ? "error" : "primary";
  const textDecoration = deleted ? "line-through" : "initial";

  return (
    <TimelineItem>
      <TimelineOppositeContent color="text.secondary" variant="caption">
        <Typography>{answer.displayName ?? answer.username}</Typography>
        {formatDateTime(answer.timestamp.seconds)}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot color={colour} variant="outlined">
          {deleted ? (
            <DeleteOutlineIcon color={colour} fontSize="small" />
          ) : (
            <EditIcon color={colour} fontSize="small" />
          )}
        </TimelineDot>
        <TimelineConnector sx={{ height: "3rem" }} />
      </TimelineSeparator>
      <TimelineContent
        color={colour}
        sx={{ textDecoration: textDecoration, py: 2, pl: 1, pr: 0, mr: 0 }}
        variant="body2"
      >
        {answer.answer}
      </TimelineContent>
    </TimelineItem>
  );
};

AnswerTimelineItem.propTypes = {
  answer: PropTypes.object.isRequired,
};

export const AnswerHistoryPanel = ({ clue, allAnswers, onClose }) => {
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
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography color="text.secondary">
            {clue.clueNumber} {clue.clueType}
          </Typography>
          <Typography dangerouslySetInnerHTML={{ __html: clue.clue ?? "" }} />
        </Box>

        <Divider />

        <Timeline sx={{ mx: 0, px: 0 }}>
          {answersToThisClue.map((answer, index) => (
            <AnswerTimelineItem key={index} answer={answer} />
          ))}
        </Timeline>
      </StyledPanelBody>
    </StyledPanel>
  );
};

AnswerHistoryPanel.propTypes = {
  clue: PropTypes.object.isRequired,
  allAnswers: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};
