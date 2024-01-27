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
  const handleViewClick = () => {
    onView(crossword.id);
  };

  const handleDeleteClick = () => {
    onDelete(crossword.id);
  };

  const maybeSecondaryAction = isAdmin
    ? {
        secondaryAction: (
          <IconButton edge="end" color="error" onClick={handleDeleteClick}>
            <DeleteIcon />
          </IconButton>
        ),
      }
    : undefined;

  return (
    <ListItem disablePadding {...maybeSecondaryAction}>
      <ListItemButton onClick={handleViewClick}>
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
