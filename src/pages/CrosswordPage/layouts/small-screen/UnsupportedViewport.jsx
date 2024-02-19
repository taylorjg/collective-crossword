import { Alert } from "@mui/material";

import { StyledUnsupportedViewport } from "./UnsupportedViewport.styles";

export const UnsupportedViewport = () => {
  return (
    <StyledUnsupportedViewport>
      <Alert severity="warning" variant="outlined">
        This viewport size is not supported. Try rotating your device.
      </Alert>
    </StyledUnsupportedViewport>
  );
};
