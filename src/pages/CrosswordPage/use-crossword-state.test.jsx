import { render } from "@testing-library/react";

import { enhance } from "@app/transforms";
import exampleCrossword from "@app/mocks/example-crossword.json";

import { useCrosswordState } from "./use-crossword-state";

const crossword = enhance(exampleCrossword);

const TestComponent = ({ crossword, onCrosswordState }) => {
  const crosswordState = useCrosswordState(crossword);
  onCrosswordState(crosswordState);
};

const renderComponent = (props) => {
  return render(<TestComponent {...props} />);
};

describe("useCrosswordState tests", () => {
  it("initial crosswordState", () => {
    let crosswordState;
    const onCrosswordState = (arg) => {
      crosswordState = arg;
    };
    renderComponent({ crossword, onCrosswordState });
    expect(crosswordState).toBeDefined();
    expect(crosswordState.currentCell).toBeUndefined();
    expect(crosswordState.selectedCells).toBeUndefined();
  });
});
