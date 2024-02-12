import { act, render } from "@testing-library/react";

import { enhance } from "@app/transforms";
import exampleCrossword from "@app/mocks/example-crossword.json";
import { range } from "@app/utils";

import { useCrosswordState } from "./use-crossword-state";

const crossword = enhance(exampleCrossword);

const TestComponent = ({ crossword, onCrosswordState }) => {
  const crosswordState = useCrosswordState(crossword);
  onCrosswordState(crosswordState);
};

const renderComponent = (props) => {
  return render(<TestComponent {...props} />);
};

const testHelperNavigation = ({
  fromCell,
  fromClue,
  toCell,
  toClue,
  action,
  optionalPrologue,
  optionalEpilogue,
}) => {
  let crosswordState;
  const onCrosswordState = (arg) => {
    crosswordState = arg;
  };
  renderComponent({ crossword, onCrosswordState });

  if (optionalPrologue?.action) {
    act(() => {
      optionalPrologue.action(crosswordState);
    });

    if (optionalPrologue.assertions) {
      optionalPrologue.assertions(crosswordState);
    }
  }

  act(() => {
    crosswordState.selectCell(fromCell);
  });

  expect(crosswordState.currentCell).toEqual(fromCell);
  expect(crosswordState.selectedClue).toMatchObject(fromClue);

  act(() => {
    action(crosswordState);
  });

  expect(crosswordState.currentCell).toEqual(toCell);
  expect(crosswordState.selectedClue).toMatchObject(toClue);

  if (optionalEpilogue?.action) {
    act(() => {
      optionalEpilogue.action(crosswordState);
    });

    if (optionalEpilogue.assertions) {
      optionalEpilogue.assertions(crosswordState);
    }
  }
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
      const cell = { row: 4, col: 11 };
      const clue = { clueNumber: 12, clueType: "across" };
      testHelperNavigation({
        fromCell: cell,
        fromClue: clue,
        toCell: cell,
        toClue: clue,
        action: (crosswordState) => crosswordState.selectCell(cell),
      });
    });

    it("click on cell of a down-only clue", () => {
      const cell = { row: 7, col: 4 };
      const clue = { clueNumber: 13, clueType: "down" };
      testHelperNavigation({
        fromCell: cell,
        fromClue: clue,
        toCell: cell,
        toClue: clue,
        action: (crosswordState) => crosswordState.selectCell(cell),
      });
    });

    it("click on cell of an across and down clue", () => {
      const cell = { row: 2, col: 10 };
      const fromClue = { clueNumber: 9, clueType: "across" };
      const toClue = { clueNumber: 6, clueType: "down" };
      testHelperNavigation({
        fromCell: cell,
        fromClue,
        toCell: cell,
        toClue,
        action: (crosswordState) => crosswordState.selectCell(cell),
        optionalEpilogue: {
          action: (crosswordState) => crosswordState.selectCell(cell),
          assertions: (crosswordState) => {
            expect(crosswordState.currentCell).toEqual(cell);
            expect(crosswordState.selectedClue).toMatchObject(fromClue);
          },
        },
      });
    });
  });

  describe("selectClue", () => {
    it("select an across clue", () => {
      let crosswordState;
      const onCrosswordState = (arg) => {
        crosswordState = arg;
      };
      renderComponent({ crossword, onCrosswordState });

      const clue = crossword.acrossClues[1];

      act(() => {
        crosswordState.selectClue(clue);
      });

      expect(crosswordState.currentCell).toEqual(clue.cells[0]);
      expect(crosswordState.selectedClue).toBe(clue);
    });

    it("select a down clue", () => {
      let crosswordState;
      const onCrosswordState = (arg) => {
        crosswordState = arg;
      };
      renderComponent({ crossword, onCrosswordState });

      const clue = crossword.downClues[1];

      act(() => {
        crosswordState.selectClue(clue);
      });

      expect(crosswordState.currentCell).toEqual(clue.cells[0]);
      expect(crosswordState.selectedClue).toBe(clue);
    });
  });

  describe("navigateToNextClue", () => {
    it("across to next across", () => {
      testHelperNavigation({
        fromCell: { row: 0, col: 3 },
        fromClue: { clueNumber: 1, clueType: "across" },
        toCell: { row: 0, col: 8 },
        toClue: { clueNumber: 5, clueType: "across" },
        action: (crosswordState) => crosswordState.navigateToNextClue(),
      });
    });

    it("down to next down", () => {
      testHelperNavigation({
        fromCell: { row: 0, col: 10 },
        fromClue: { clueNumber: 6, clueType: "down" },
        toCell: { row: 0, col: 12 },
        toClue: { clueNumber: 7, clueType: "down" },
        action: (crosswordState) => crosswordState.navigateToNextClue(),
      });
    });

    it("last across to first down", () => {
      testHelperNavigation({
        fromCell: { row: 14, col: 8 },
        fromClue: { clueNumber: 28, clueType: "across" },
        toCell: { row: 0, col: 0 },
        toClue: { clueNumber: 1, clueType: "down" },
        action: (crosswordState) => crosswordState.navigateToNextClue(),
      });
    });

    it("last down to first across", () => {
      testHelperNavigation({
        fromCell: { row: 11, col: 10 },
        fromClue: { clueNumber: 25, clueType: "down" },
        toCell: { row: 0, col: 0 },
        toClue: { clueNumber: 1, clueType: "across" },
        action: (crosswordState) => crosswordState.navigateToNextClue(),
      });
    });
  });

  describe("navigateToPreviousClue", () => {
    it("across to previous across", () => {
      testHelperNavigation({
        fromCell: { row: 0, col: 9 },
        fromClue: { clueNumber: 5, clueType: "across" },
        toCell: { row: 0, col: 0 },
        toClue: { clueNumber: 1, clueType: "across" },
        action: (crosswordState) => crosswordState.navigateToPreviousClue(),
      });
    });

    it("down to previous down", () => {
      testHelperNavigation({
        fromCell: { row: 7, col: 10 },
        fromClue: { clueNumber: 14, clueType: "down" },
        toCell: { row: 5, col: 4 },
        toClue: { clueNumber: 13, clueType: "down" },
        action: (crosswordState) => crosswordState.navigateToPreviousClue(),
      });
    });

    it("first across to last down", () => {
      testHelperNavigation({
        fromCell: { row: 0, col: 1 },
        fromClue: { clueNumber: 1, clueType: "across" },
        toCell: { row: 11, col: 10 },
        toClue: { clueNumber: 25, clueType: "down" },
        action: (crosswordState) => crosswordState.navigateToPreviousClue(),
      });
    });

    it("first down to last across", () => {
      testHelperNavigation({
        fromCell: { row: 1, col: 0 },
        fromClue: { clueNumber: 1, clueType: "down" },
        toCell: { row: 14, col: 8 },
        toClue: { clueNumber: 28, clueType: "across" },
        action: (crosswordState) => crosswordState.navigateToPreviousClue(),
      });
    });
  });

  describe("navigateLeft", () => {
    it("previous col is within same clue", () => {
      testHelperNavigation({
        fromCell: { row: 0, col: 3 },
        fromClue: { clueNumber: 1, clueType: "across" },
        toCell: { row: 0, col: 2 },
        toClue: { clueNumber: 1, clueType: "across" },
        action: (crosswordState) => crosswordState.navigateLeft(),
      });
    });

    it("previous col is end of previous clue on row", () => {
      testHelperNavigation({
        fromCell: { row: 0, col: 8 },
        fromClue: { clueNumber: 5, clueType: "across" },
        toCell: { row: 0, col: 6 },
        toClue: { clueNumber: 1, clueType: "across" },
        action: (crosswordState) => crosswordState.navigateLeft(),
      });
    });

    it("previous col wraps to end of last clue on row", () => {
      testHelperNavigation({
        fromCell: { row: 4, col: 0 },
        fromClue: { clueNumber: 10, clueType: "across" },
        toCell: { row: 4, col: 14 },
        toClue: { clueNumber: 12, clueType: "across" },
        action: (crosswordState) => crosswordState.navigateLeft(),
      });
    });
  });

  describe("navigateRight", () => {
    it("next col is within same clue", () => {
      testHelperNavigation({
        fromCell: { row: 0, col: 3 },
        fromClue: { clueNumber: 1, clueType: "across" },
        toCell: { row: 0, col: 4 },
        toClue: { clueNumber: 1, clueType: "across" },
        action: (crosswordState) => crosswordState.navigateRight(),
      });
    });

    it("next col is start of next clue on row", () => {
      testHelperNavigation({
        fromCell: { row: 4, col: 3 },
        fromClue: { clueNumber: 10, clueType: "across" },
        toCell: { row: 4, col: 5 },
        toClue: { clueNumber: 11, clueType: "across" },
        action: (crosswordState) => crosswordState.navigateRight(),
      });
    });

    it("next col wraps to start of first clue on row", () => {
      testHelperNavigation({
        fromCell: { row: 4, col: 14 },
        fromClue: { clueNumber: 12, clueType: "across" },
        toCell: { row: 4, col: 0 },
        toClue: { clueNumber: 10, clueType: "across" },
        action: (crosswordState) => crosswordState.navigateRight(),
      });
    });
  });

  describe("navigateUp", () => {
    it("previous row is within same clue", () => {
      testHelperNavigation({
        fromCell: { row: 7, col: 10 },
        fromClue: { clueNumber: 14, clueType: "down" },
        toCell: { row: 6, col: 10 },
        toClue: { clueNumber: 14, clueType: "down" },
        action: (crosswordState) => crosswordState.navigateUp(),
      });
    });

    it("previous row is end of previous clue on col", () => {
      testHelperNavigation({
        fromCell: { row: 5, col: 10 },
        fromClue: { clueNumber: 14, clueType: "down" },
        toCell: { row: 3, col: 10 },
        toClue: { clueNumber: 6, clueType: "down" },
        action: (crosswordState) => crosswordState.navigateUp(),
      });
    });

    it("previous row wraps to end of last clue on col", () => {
      testHelperNavigation({
        fromCell: { row: 0, col: 10 },
        fromClue: { clueNumber: 6, clueType: "down" },
        toCell: { row: 14, col: 10 },
        toClue: { clueNumber: 25, clueType: "down" },
        action: (crosswordState) => crosswordState.navigateUp(),
      });
    });
  });

  describe("navigateDown", () => {
    it("next row is within same clue", () => {
      testHelperNavigation({
        fromCell: { row: 1, col: 10 },
        fromClue: { clueNumber: 6, clueType: "down" },
        toCell: { row: 2, col: 10 },
        toClue: { clueNumber: 6, clueType: "down" },
        action: (crosswordState) => crosswordState.navigateDown(),
      });
    });

    it("next row is start of next clue on col", () => {
      testHelperNavigation({
        fromCell: { row: 3, col: 10 },
        fromClue: { clueNumber: 6, clueType: "down" },
        toCell: { row: 5, col: 10 },
        toClue: { clueNumber: 14, clueType: "down" },
        action: (crosswordState) => crosswordState.navigateDown(),
      });
    });

    it("next row wraps to start of first clue on col", () => {
      const fromCell = { row: 14, col: 10 };
      testHelperNavigation({
        optionalPrologue: {
          action: (crosswordState) => crosswordState.selectCell(fromCell),
        },
        fromCell,
        fromClue: { clueNumber: 25, clueType: "down" },
        toCell: { row: 0, col: 10 },
        toClue: { clueNumber: 6, clueType: "down" },
        action: (crosswordState) => crosswordState.navigateDown(),
      });
    });
  });

  describe("enterLetter", () => {
    it("advances within same clue", () => {
      let crosswordState;
      const onCrosswordState = (arg) => {
        crosswordState = arg;
      };
      renderComponent({ crossword, onCrosswordState });

      const clue = crossword.acrossClues[0];

      act(() => {
        crosswordState.selectClue(clue);
      });

      expect(crosswordState.currentCell).toBe(clue.cells[0]);
      expect(crosswordState.selectedClue).toBe(clue);

      act(() => {
        crosswordState.enterLetter("A");
      });

      expect(crosswordState.currentCell).toBe(clue.cells[1]);
      expect(crosswordState.selectedClue).toBe(clue);
    });

    it("advances to next clue", () => {
      let crosswordState;
      const onCrosswordState = (arg) => {
        crosswordState = arg;
      };
      renderComponent({ crossword, onCrosswordState });

      const clue = crossword.acrossClues[0];
      const nextClue = crossword.acrossClues[1];

      act(() => {
        crosswordState.selectClue(clue);
      });

      const letters = "ABCDEFG";

      for (const index of range(clue.cells.length)) {
        expect(crosswordState.currentCell).toBe(clue.cells[index]);
        expect(crosswordState.selectedClue).toBe(clue);

        act(() => {
          crosswordState.enterLetter(letters[index]);
        });
      }

      expect(crosswordState.currentCell).toBe(nextClue.cells[0]);
      expect(crosswordState.selectedClue).toBe(nextClue);
    });
  });

  describe("deleteLetter", () => {
    it("goes to previous cell in same clue", () => {
      let crosswordState;
      const onCrosswordState = (arg) => {
        crosswordState = arg;
      };
      renderComponent({ crossword, onCrosswordState });

      act(() => {
        crosswordState.selectCell({ row: 0, col: 3 });
      });

      expect(crosswordState.currentCell).toEqual({ row: 0, col: 3 });
      expect(crosswordState.selectedClue).toMatchObject({
        clueNumber: 1,
        clueType: "across",
      });

      act(() => {
        crosswordState.deleteLetter();
      });

      expect(crosswordState.currentCell).toEqual({ row: 0, col: 2 });
      expect(crosswordState.selectedClue).toMatchObject({
        clueNumber: 1,
        clueType: "across",
      });
    });

    it("stops at start of clue", () => {
      let crosswordState;
      const onCrosswordState = (arg) => {
        crosswordState = arg;
      };
      renderComponent({ crossword, onCrosswordState });

      act(() => {
        crosswordState.selectCell({ row: 0, col: 0 });
      });

      expect(crosswordState.currentCell).toEqual({ row: 0, col: 0 });
      expect(crosswordState.selectedClue).toMatchObject({
        clueNumber: 1,
        clueType: "across",
      });

      act(() => {
        crosswordState.deleteLetter();
      });

      expect(crosswordState.currentCell).toEqual({ row: 0, col: 0 });
      expect(crosswordState.selectedClue).toMatchObject({
        clueNumber: 1,
        clueType: "across",
      });
    });
  });
});
