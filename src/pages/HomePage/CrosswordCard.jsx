import PropTypes from "prop-types";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from "@mui/material";

import { Grid } from "@app/components";
import { formatDate } from "@app/utils";

import { CrosswordAvatar } from "./CrosswordAvatar";
import { StyledThumbnailGrid } from "./CrosswordCard.styles";

export const CrosswordCard = ({ crossword, isAdmin, onView, onDelete }) => {
  return (
    <Card square variant="outlined">
      <CardHeader
        avatar={<CrosswordAvatar crossword={crossword} />}
        title={crossword.title}
        subheader={formatDate(crossword.publishDate)}
      />
      <CardContent>
        <StyledThumbnailGrid>
          <Grid crossword={crossword} />
        </StyledThumbnailGrid>
      </CardContent>
      <CardActions>
        <Button onClick={() => onView(crossword.id)}>View</Button>
        {isAdmin && (
          <Button color="error" onClick={() => onDelete(crossword.id)}>
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

CrosswordCard.propTypes = {
  crossword: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
