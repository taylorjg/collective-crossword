export const isSameCell = (cell1, cell2) =>
  cell1 && cell2 && cell1.row === cell2.row && cell1.col === cell2.col;

export const isSameAsFirstCell = ({ cells }, cell) =>
  isSameCell(cells[0], cell);

export const isSameAsLastCell = ({ cells }, cell) =>
  isSameCell(cells[cells.length - 1], cell);

export const findCellIndex = (cells, cellToLookFor) =>
  cells.findIndex((cell) => isSameCell(cell, cellToLookFor));
