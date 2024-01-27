import PropTypes from "prop-types";

import { CrosswordCard } from "./CrosswordCard";
import { StyledCrosswordCards } from "./HomePage.styles";

export const CrosswordCards = ({ crosswords, isAdmin, onView, onDelete }) => {
  return (
    <StyledCrosswordCards>
      {crosswords.map((crossword) => (
        <CrosswordCard
          key={crossword.id}
          crossword={crossword}
          isAdmin={isAdmin}
          onView={onView}
          onDelete={onDelete}
        />
      ))}
    </StyledCrosswordCards>
  );
};

CrosswordCards.propTypes = {
  crosswords: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
