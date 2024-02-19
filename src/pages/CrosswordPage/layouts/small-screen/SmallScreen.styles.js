import styled from "@emotion/styled";

export const StyledContent = styled.div`
  min-height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
`;

export const StyledPuzzleGrid = styled.div`
  aspect-ratio: 1;
  width: 100%;
  border: 2px solid grey;
  line-height: 0;
`;

export const StyledBottomArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  /* align-items: center; */
`;
