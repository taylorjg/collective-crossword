import { CircularProgress } from "@mui/material";

import { StyledLoading } from "./Loading.styles";

export const Loading = () => {
  return (
    <StyledLoading>
      <CircularProgress />
    </StyledLoading>
  );
};
