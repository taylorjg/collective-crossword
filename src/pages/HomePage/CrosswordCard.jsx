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

export const CrosswordCard = ({
  crossword,
  isAdmin,
  onViewCrossword,
  onDeleteCrossword,
}) => {
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
        <Button onClick={() => onViewCrossword(crossword.id)}>View</Button>
        {isAdmin && (
          <Button color="error" onClick={() => onDeleteCrossword(crossword.id)}>
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
  onViewCrossword: PropTypes.func.isRequired,
  onDeleteCrossword: PropTypes.func.isRequired,
};
