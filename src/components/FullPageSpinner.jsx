import { CircularProgress } from "@mui/material";

import { StyledFullPageSpinner } from "./FullPageSpinner.styles";

export const FullPageSpinner = () => {
  return (
    <StyledFullPageSpinner>
      <CircularProgress />
    </StyledFullPageSpinner>
  );
};
