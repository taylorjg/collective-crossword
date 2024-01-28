import { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import { formatDate } from "@app/utils";

import { AlreadyAdded } from "./AlreadyAdded";
import { ViewCrosswordButton } from "./ViewCrosswordButton";

import { StyledRow } from "./common.styles";

export const AddOrViewCrossword = ({
  crossword,
  crosswordId,
  isLoading,
  onAddCrossword,
}) => {
  const [showAddSpinner, setShowAddSpinner] = useState(false);
  const [addedCrosswordId, setAddedCrosswordId] = useState();

  const handleAddCrossword = async () => {
    try {
      setShowAddSpinner(true);
      const crosswordRef = await onAddCrossword(crossword);
      setAddedCrosswordId(crosswordRef.id);
    } finally {
      setShowAddSpinner(false);
    }
  };

  return (
    <>
      {crossword && !isLoading && (
        <>
          <List disablePadding dense>
            <ListItem disableGutters disablePadding>
              <ListItemText primary="Title" secondary={crossword.title} />
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText
                primary="Date"
                secondary={formatDate(crossword.publishDate)}
              />
            </ListItem>
          </List>
          {crosswordId ? (
            <AlreadyAdded crosswordId={crosswordId} />
          ) : (
            <StyledRow>
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddCrossword}
                disabled={Boolean(addedCrosswordId)}
              >
                Add
              </Button>
              {showAddSpinner && <CircularProgress size="1.5rem" />}
              {addedCrosswordId && (
                <ViewCrosswordButton crosswordId={addedCrosswordId} />
              )}
            </StyledRow>
          )}
        </>
      )}
    </>
  );
};

AddOrViewCrossword.propTypes = {
  crossword: PropTypes.object,
  crosswordId: PropTypes.string,
  isLoading: PropTypes.bool,
  onAddCrossword: PropTypes.func.isRequired,
};
