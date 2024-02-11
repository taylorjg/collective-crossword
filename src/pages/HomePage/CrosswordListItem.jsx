import PropTypes from "prop-types";
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { formatDate } from "@app/utils";

import { CrosswordAvatar } from "./CrosswordAvatar";

export const CrosswordListItem = ({ crossword, isAdmin, onView, onDelete }) => {
  const handleViewCrossword = () => {
    onView(crossword.id);
  };

  const handleDeleteCrossword = () => {
    onDelete(crossword.id);
  };

  const maybeSecondaryAction = isAdmin
    ? {
        secondaryAction: (
          <IconButton
            edge="end"
            color="error"
            onClick={handleDeleteCrossword}
            title="Delete crossword"
          >
            <DeleteIcon />
          </IconButton>
        ),
      }
    : undefined;

  return (
    <ListItem disablePadding {...maybeSecondaryAction}>
      <ListItemButton onClick={handleViewCrossword}>
        <ListItemAvatar>
          <CrosswordAvatar crossword={crossword} />
        </ListItemAvatar>
        <ListItemText
          primary={crossword.title}
          secondary={formatDate(crossword.publishDate)}
        />
      </ListItemButton>
    </ListItem>
  );
};

CrosswordListItem.propTypes = {
  crossword: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
