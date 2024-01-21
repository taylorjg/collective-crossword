import PropTypes from "prop-types";

import { ImportCrossword } from "./ImportCrossword";

export const TheTelegraphTab = ({ onAddCrossword }) => {
  return <ImportCrossword onAddCrossword={onAddCrossword} />;
};

TheTelegraphTab.propTypes = {
  onAddCrossword: PropTypes.func.isRequired,
};
