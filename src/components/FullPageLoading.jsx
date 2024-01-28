import { CircularProgress } from "@mui/material";

import { StyledFullPageLoading } from "./FullPageLoading.styles";

export const FullPageLoading = () => {
  return (
    <StyledFullPageLoading>
      <CircularProgress />
    </StyledFullPageLoading>
  );
};
