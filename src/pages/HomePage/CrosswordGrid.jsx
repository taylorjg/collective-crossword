import PropTypes from "prop-types";

import { CrosswordGridItem } from "./CrosswordGridItem";
import { StyledCrosswordGrid } from "./HomePage.styles";

export const CrosswordGrid = ({ crosswords, isAdmin, onView, onDelete }) => {
  return (
    <StyledCrosswordGrid>
      {crosswords.map((crossword) => (
        <CrosswordGridItem
          key={crossword.id}
          crossword={crossword}
          isAdmin={isAdmin}
          onView={onView}
          onDelete={onDelete}
        />
      ))}
    </StyledCrosswordGrid>
  );
};

CrosswordGrid.propTypes = {
  crosswords: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
