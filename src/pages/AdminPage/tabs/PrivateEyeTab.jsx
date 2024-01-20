import PropTypes from "prop-types";

import { Crossword3 } from "../components";

export const PrivateEyeTab = ({ onAddCrossword }) => {
  return (
    <>
      <Crossword3 onAddCrossword={onAddCrossword} />
    </>
  );
};

PrivateEyeTab.propTypes = {
  onAddCrossword: PropTypes.func.isRequired,
};
