import { act, render } from "@testing-library/react";

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
    expect(crosswordState.selectedClue).toBeUndefined();
  });

  it("click on cell of an across-only clue", () => {
    let crosswordState;
    const onCrosswordState = (arg) => {
      crosswordState = arg;
    };
    renderComponent({ crossword, onCrosswordState });

    expect(crosswordState).toBeDefined();
    expect(crosswordState.currentCell).toBeUndefined();
    expect(crosswordState.selectedClue).toBeUndefined();

    act(() => {
      crosswordState.onCellClick({ row: 4, col: 11 });
    });

    expect(crosswordState.currentCell).toEqual({ row: 4, col: 11 });
    expect(crosswordState.selectedClue).toMatchObject({
      clueNumber: 12,
      clueType: "across",
    });

    act(() => {
      crosswordState.onCellClick({ row: 4, col: 11 });
    });

    expect(crosswordState.currentCell).toEqual({ row: 4, col: 11 });
    expect(crosswordState.selectedClue).toMatchObject({
      clueNumber: 12,
      clueType: "across",
    });
  });

  it("click on cell of a down-only clue", () => {
    let crosswordState;
    const onCrosswordState = (arg) => {
      crosswordState = arg;
    };
    renderComponent({ crossword, onCrosswordState });

    expect(crosswordState).toBeDefined();
    expect(crosswordState.currentCell).toBeUndefined();
    expect(crosswordState.selectedClue).toBeUndefined();

    act(() => {
      crosswordState.onCellClick({ row: 7, col: 4 });
    });

    expect(crosswordState.currentCell).toEqual({ row: 7, col: 4 });
    expect(crosswordState.selectedClue).toMatchObject({
      clueNumber: 13,
      clueType: "down",
    });

    act(() => {
      crosswordState.onCellClick({ row: 7, col: 4 });
    });

    expect(crosswordState.currentCell).toEqual({ row: 7, col: 4 });
    expect(crosswordState.selectedClue).toMatchObject({
      clueNumber: 13,
      clueType: "down",
    });
  });

  it("click on cell of an across and down clue", () => {
    let crosswordState;
    const onCrosswordState = (arg) => {
      crosswordState = arg;
    };
    renderComponent({ crossword, onCrosswordState });

    expect(crosswordState).toBeDefined();
    expect(crosswordState.currentCell).toBeUndefined();
    expect(crosswordState.selectedClue).toBeUndefined();

    act(() => {
      crosswordState.onCellClick({ row: 2, col: 10 });
    });

    expect(crosswordState.currentCell).toEqual({ row: 2, col: 10 });
    expect(crosswordState.selectedClue).toMatchObject({
      clueNumber: 9,
      clueType: "across",
    });

    act(() => {
      crosswordState.onCellClick({ row: 2, col: 10 });
    });

    expect(crosswordState.currentCell).toEqual({ row: 2, col: 10 });
    expect(crosswordState.selectedClue).toMatchObject({
      clueNumber: 6,
      clueType: "down",
    });

    act(() => {
      crosswordState.onCellClick({ row: 2, col: 10 });
    });

    expect(crosswordState.currentCell).toEqual({ row: 2, col: 10 });
    expect(crosswordState.selectedClue).toMatchObject({
      clueNumber: 9,
      clueType: "across",
    });
  });
});
