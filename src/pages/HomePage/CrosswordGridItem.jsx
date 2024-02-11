import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from "@mui/material";

import { PuzzleGrid } from "@app/components";
import { formatDate } from "@app/utils";

import { CrosswordAvatar } from "./CrosswordAvatar";
import { StyledThumbnailGrid } from "./CrosswordGridItem.styles";

export const CrosswordGridItem = ({ crossword, isAdmin, onView, onDelete }) => {
  const handleViewCrossword = () => {
    onView(crossword.id);
  };

  const handleDeleteCrossword = () => {
    onDelete(crossword.id);
  };

  return (
    <Card square variant="outlined">
      <CardHeader
        avatar={<CrosswordAvatar crossword={crossword} />}
        title={crossword.title}
        subheader={formatDate(crossword.publishDate)}
      />
      <CardContent>
        <StyledThumbnailGrid>
          <PuzzleGrid crossword={crossword} />
        </StyledThumbnailGrid>
      </CardContent>
      <CardActions>
        <Button onClick={handleViewCrossword} title="View crossword">
          View
        </Button>
        {isAdmin && (
          <Button
            onClick={handleDeleteCrossword}
            title="Delete crossword"
            color="error"
          >
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

CrosswordGridItem.propTypes = {
  crossword: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
