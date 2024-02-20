import { isSameCell, range } from "@app/utils";

const findAcrossCells = (grid, row, col) => {
  const numCols = grid[0].length;
  const cells = [];
  const indexes = range(numCols - col);
  for (const index of indexes) {
    const colToCheck = col + index;
    if (grid[row][colToCheck] === "X") break;
    cells.push({ row, col: colToCheck });
  }
  return cells;
};

const findDownCells = (grid, row, col) => {
  const numRows = grid.length;
  const cells = [];
  const indexes = range(numRows - row);
  for (const index of indexes) {
    const rowToCheck = row + index;
    if (grid[rowToCheck][col] === "X") break;
    cells.push({ row: rowToCheck, col });
  }
  return cells;
};

const findClueByRowCol = (clues, row, col) => {
  for (const clue of clues) {
    for (const cell of clue.cells) {
      if (cell.row === row && cell.col === col) {
        return clue;
      }
    }
  }
};

export const enhance = (crossword) => {
  const numRows = crossword.grid.length;
  const numCols = crossword.grid[0].length;

  // "<row>:<col>" string to { acrossClue?, downClue? }
  const cellsToCluesMap = new Map();

  const acrossCluesEnhanced = crossword.acrossClues.map((clue) => {
    const { rowIndex: row, colIndex: col, ...rest } = clue;

    return {
      ...rest,
      row,
      col,
      clueType: "across",
      cells: findAcrossCells(crossword.grid, row, col),
    };
  });

  const downCluesEnhanced = crossword.downClues.map((clue) => {
    const { rowIndex: row, colIndex: col, ...rest } = clue;

    return {
      ...rest,
      row,
      col,
      clueType: "down",
      cells: findDownCells(crossword.grid, row, col),
    };
  });

  for (const row of range(numRows)) {
    for (const col of range(numCols)) {
      if (crossword.grid[row][col] === ".") {
        const acrossClue = findClueByRowCol(acrossCluesEnhanced, row, col);
        const downClue = findClueByRowCol(downCluesEnhanced, row, col);
        const maybeAcrossClue = acrossClue ? { acrossClue } : undefined;
        const maybeDownClue = downClue ? { downClue } : undefined;
        const key = `${row}:${col}`;
        const value = { ...maybeAcrossClue, ...maybeDownClue };
        cellsToCluesMap.set(key, value);
      }
    }
  }

  const acrossCluesMap = new Map(
    acrossCluesEnhanced.map((clue) => [clue.clueNumber, clue])
  );

  const downCluesMap = new Map(
    downCluesEnhanced.map((clue) => [clue.clueNumber, clue])
  );

  // clue to [{ cell, cellIndex, otherClue, otherCellIndex }, ...]
  const cluesToCrossCheckingDetailsMap = new Map();

  for (const clue of [...acrossCluesEnhanced, ...downCluesEnhanced]) {
    for (const cellIndex of range(clue.cells.length)) {
      const cell = clue.cells[cellIndex];
      const otherClues =
        clue.clueType === "across" ? downCluesEnhanced : acrossCluesEnhanced;
      const otherClue = otherClues.find(({ cells }) =>
        cells.some((otherCell) => isSameCell(cell, otherCell))
      );
      if (otherClue) {
        const otherCellIndex = otherClue.cells.findIndex((otherCell) =>
          isSameCell(cell, otherCell)
        );
        if (otherCellIndex >= 0) {
          const newItem = {
            cell,
            cellIndex,
            otherClue,
            otherCellIndex,
          };
          const oldItems = cluesToCrossCheckingDetailsMap.get(clue) ?? [];
          const newItems = [...oldItems, newItem];
          cluesToCrossCheckingDetailsMap.set(clue, newItems);
        }
      }
    }
  }

  return {
    ...crossword,
    acrossClues: acrossCluesEnhanced,
    downClues: downCluesEnhanced,
    acrossCluesMap,
    downCluesMap,
    cellsToCluesMap,
    cluesToCrossCheckingDetailsMap,
  };
};
