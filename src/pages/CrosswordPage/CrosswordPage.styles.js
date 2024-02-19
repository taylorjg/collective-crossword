import styled from "@emotion/styled";

export const StyledPuzzleAndClues = styled.div`
  display: grid;
  grid-template-columns: 50fr 25fr 25fr;
  gap: 1rem;
`;

export const StyledPuzzleGrid = styled.div`
  aspect-ratio: 1;
  width: calc(min(50vw, 50vh));
  margin: 1rem;
  border: 2px solid grey;
  line-height: 0;
  margin-left: auto;
  margin-right: auto;
`;

export const StyledClues = styled.div`
  //
`;

export const StyledClue = styled.div`
  display: grid;
  grid-template-columns: 2rem 1fr;
  color: ${({ selected, theme }) =>
    selected ? theme.palette.primary.dark : "unset"};
`;

export const StyledClueNumber = styled.div`
  //
`;

export const StyledClueText = styled.div`
  //
`;
