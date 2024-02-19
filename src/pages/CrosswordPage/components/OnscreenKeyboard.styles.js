import styled from "@emotion/styled";

export const StyledMiniKeyboard = styled.div`
  background-color: #f3efe8;
`;

export const StyledKeyboardRow = styled.div`
  display: flex;
  justify-content: center;
  column-gap: 0.4rem;
  margin: 0.25rem 0;
`;

export const StyledLetterKey = styled.div`
  display: inline-block;
  width: 8.5%;
  color: #222;
  background-color: white;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 700;
  font-size: 1.8rem;
  line-height: 2rem;
`;

export const StyledDeleteKey = styled.div`
  display: inline-block;
  width: 8.5%;
  color: #222;
  border-radius: 0.5rem;
  border: 1px solid #222;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
`;

export const StyledKeyInner = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
