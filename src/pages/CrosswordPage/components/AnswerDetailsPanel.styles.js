import styled from "@emotion/styled";

export const StyledPanel = styled.div`
  margin: 0;
  padding: 0;
  height: 100%;
`;

export const StyledPanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.5rem 0.5rem 0.5rem 1rem;
`;

export const StyledPanelBody = styled.div`
  margin: 1rem;
  display: flex;
  flex-direction: column;
  > * {
    margin-bottom: 1.5rem;
  }
`;

export const StyledClue = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledClueNumberAndType = styled.div`
  opacity: 0.6;
  margin-bottom: 0.5rem;
`;

export const StyledAnswer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 2rem;
`;

export const StyledAnswerLabel = styled.div`
  font-weight: bold;
`;

export const StyledAnswerValue = styled.div`
  color: ${({ primary, theme }) =>
    primary ? theme.palette.primary.dark : "unset"};
`;
