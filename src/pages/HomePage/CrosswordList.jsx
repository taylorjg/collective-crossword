import React from "react";
import PropTypes from "prop-types";
import { Divider, Grid, List } from "@mui/material";

import { CrosswordListItem } from "./CrosswordListItem";

export const CrosswordList = ({ crosswords, isAdmin, onView, onDelete }) => {
  return (
    <Grid container>
      <Grid item xs={12} md={6} sx={{ mx: { xs: 2, md: "auto" } }}>
        <List>
          {crosswords.map((crossword, index) => (
            <React.Fragment key={crossword.id}>
              {index > 0 && <Divider variant="inset" />}
              <CrosswordListItem
                crossword={crossword}
                isAdmin={isAdmin}
                onView={onView}
                onDelete={onDelete}
              />
            </React.Fragment>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

CrosswordList.propTypes = {
  crosswords: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
