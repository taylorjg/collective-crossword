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

  describe("selectCell", () => {
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
        crosswordState.selectCell({ row: 4, col: 11 });
      });

      expect(crosswordState.currentCell).toEqual({ row: 4, col: 11 });
      expect(crosswordState.selectedClue).toMatchObject({
        clueNumber: 12,
        clueType: "across",
      });

      act(() => {
        crosswordState.selectCell({ row: 4, col: 11 });
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
        crosswordState.selectCell({ row: 7, col: 4 });
      });

      expect(crosswordState.currentCell).toEqual({ row: 7, col: 4 });
      expect(crosswordState.selectedClue).toMatchObject({
        clueNumber: 13,
        clueType: "down",
      });

      act(() => {
        crosswordState.selectCell({ row: 7, col: 4 });
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
        crosswordState.selectCell({ row: 2, col: 10 });
      });

      expect(crosswordState.currentCell).toEqual({ row: 2, col: 10 });
      expect(crosswordState.selectedClue).toMatchObject({
        clueNumber: 9,
        clueType: "across",
      });

      act(() => {
        crosswordState.selectCell({ row: 2, col: 10 });
      });

      expect(crosswordState.currentCell).toEqual({ row: 2, col: 10 });
      expect(crosswordState.selectedClue).toMatchObject({
        clueNumber: 6,
        clueType: "down",
      });

      act(() => {
        crosswordState.selectCell({ row: 2, col: 10 });
      });

      expect(crosswordState.currentCell).toEqual({ row: 2, col: 10 });
      expect(crosswordState.selectedClue).toMatchObject({
        clueNumber: 9,
        clueType: "across",
      });
    });
  });

  describe("selectClue", () => {
    // select an across clue
    // select a down clue
  });

  describe("navigateToNextClue", () => {
    // across to next across
    // down to next down
    // last across to first down
    // last down to first across
  });

  describe("navigateToPreviousClue", () => {
    // across to previous across
    // down to previous down
    // first across to last down
    // first down to last across
  });

  describe("navigateLeft", () => {
    // previous col is within same clue
    // previous col is end of previous clue on row
    // previous col wraps to end of last clue on row
  });

  describe("navigateRight", () => {
    // next col is within same clue
    // next col is start of next clue on row
    // next col wraps to start of first clue on row
  });

  describe("navigateUp", () => {
    // previous row is within same clue
    // previous row is end of previous clue on col
    // previous row wraps to end of last clue on col
  });

  describe("navigateDown", () => {
    // next row is within same clue
    // next row is start of next clue on col
    // next row wraps to start of first clue on col
  });

  describe("enterLetter", () => {
    // TODO
  });

  describe("deleteLetter", () => {
    // TODO
  });
});
