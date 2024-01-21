import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const StyledBox = styled(Box)`
  border: 1px solid white;
  border-radius: 4px;
  padding: 16px;
  position: relative;
  margin-bottom: 1rem;
`;

export const StyledBoxContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

export const StyledRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const StyledRow2Cols = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;
