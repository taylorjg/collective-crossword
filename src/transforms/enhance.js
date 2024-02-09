import { range } from "@app/utils";

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

const findEntry = (map, row, col) => {
  for (const entry of map.entries()) {
    const [, cells] = entry;
    for (const cell of cells) {
      if (cell.row === row && cell.col === col) {
        return entry;
      }
    }
  }
};

const makeCluesMapEntry = (entry, property) => {
  return entry
    ? { [property]: { clueNumber: entry[0], cells: entry[1] } }
    : undefined;
};

export const enhance = (crossword) => {
  const numRows = crossword.grid.length;
  const numCols = crossword.grid[0].length;

  // across clue number to array of corresponding { row, col } cells
  const acrossCluesToCellsMap = new Map();

  // down clue number to array of corresponding { row, col } cells
  const downCluesToCellsMap = new Map();

  // "<row>:<col>" string to { across?: { clueNumber, cells }, down?: { clueNumber, cells} }
  const cellsToCluesMap = new Map();

  for (const clue of crossword.acrossClues) {
    const { clueNumber, rowIndex, colIndex } = clue;
    const cells = findAcrossCells(crossword.grid, rowIndex, colIndex);
    acrossCluesToCellsMap.set(clueNumber, cells);
  }

  for (const clue of crossword.downClues) {
    const { clueNumber, rowIndex, colIndex } = clue;
    const cells = findDownCells(crossword.grid, rowIndex, colIndex);
    downCluesToCellsMap.set(clueNumber, cells);
  }

  for (const row of range(numRows)) {
    for (const col of range(numCols)) {
      if (crossword.grid[row][col] === ".") {
        let acrossCluesEntry = findEntry(acrossCluesToCellsMap, row, col);
        let downCluesEntry = findEntry(downCluesToCellsMap, row, col);
        const maybeAcross = makeCluesMapEntry(acrossCluesEntry, "across");
        const maybeDown = makeCluesMapEntry(downCluesEntry, "down");
        const key = `${row}:${col}`;
        const value = { ...maybeAcross, ...maybeDown };
        cellsToCluesMap.set(key, value);
      }
    }
  }

  return {
    ...crossword,
    acrossClues: crossword.acrossClues.map((clue) => ({
      ...clue,
      clueType: "across",
    })),
    downClues: crossword.downClues.map((clue) => ({
      ...clue,
      clueType: "down",
    })),
    acrossCluesToCellsMap,
    downCluesToCellsMap,
    cellsToCluesMap,
  };
};
