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
