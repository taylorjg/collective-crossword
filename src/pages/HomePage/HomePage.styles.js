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
  width: 15rem;
`;

export const StyledThumbnailGrid = styled.div`
  aspect-ratio: 1;
  width: 7rem;
  margin: 1rem;
  border: 2px solid grey;
  line-height: 0;
  margin-left: auto;
  margin-right: auto;
`;
