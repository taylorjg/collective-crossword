import PropTypes from "prop-types";

import { usePrivateEyeCurrentCrossword } from "@app/hooks";

import { Crossword } from "../components";

export const PrivateEyeTab = ({ onAddCrossword }) => {
  const privateEyeCrosswordResponse = usePrivateEyeCurrentCrossword();

  return (
    <Crossword
      crosswordResponse={privateEyeCrosswordResponse}
      onAddCrossword={onAddCrossword}
    />
  );
};

PrivateEyeTab.propTypes = {
  onAddCrossword: PropTypes.func.isRequired,
};
