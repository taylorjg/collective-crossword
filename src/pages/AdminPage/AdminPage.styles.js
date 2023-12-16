import styled from "@emotion/styled";

import { Box } from "@mui/material";

export const StyledBox = styled(Box)`
  border: 1px solid white;
  border-radius: 4px;
  padding: 16px;
  position: relative;
`;

export const StyledBoxContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  visibility: ${(props) => (props.showContent ? "visible" : "hidden")};
`;

export const StyledOverlay = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  place-items: center;
`;

export const StyledLoading = styled(StyledOverlay)`
  color: orange;
`;

export const StyledError = styled(StyledOverlay)`
  color: red;
`;
