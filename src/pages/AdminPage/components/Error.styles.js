import styled from "@emotion/styled";

import { StyledOverlay } from "./common.styles";

export const StyledError = styled(StyledOverlay)`
  color: ${(props) => props.theme.palette.error.dark};
`;
