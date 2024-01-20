import PropTypes from "prop-types";

import { ImportCrossword } from "./ImportCrossword";

export const PrivateEyeTab = ({ onAddCrossword }) => {
  return <ImportCrossword onAddCrossword={onAddCrossword} />;
};

PrivateEyeTab.propTypes = {
  onAddCrossword: PropTypes.func.isRequired,
};
