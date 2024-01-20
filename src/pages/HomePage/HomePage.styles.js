import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const StyledCard = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  border: 1px solid white;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
`;

export const StyledDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledDetail = styled.div`
  display: grid;
  grid-template-columns: 10rem 20rem;
`;
