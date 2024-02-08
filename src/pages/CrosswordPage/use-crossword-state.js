import { useCallback, useState } from "react";

export const useCrosswordState = (crossword) => {
  const [selectedCells, setSelectedCells] = useState();
  const [currentCell, setCurrentCell] = useState();
  const [acrossCells, setAcrossCells] = useState();
  const [downCells, setDownCells] = useState();

  const isSameCell = (cell1, cell2) =>
    cell1 && cell2 && cell1.row === cell2.row && cell1.col === cell2.col;

  const onCellClick = useCallback(
    (cell) => {
      if (isSameCell(cell, currentCell) && acrossCells && downCells) {
        if (selectedCells === acrossCells) {
          setSelectedCells(downCells);
        } else {
          setSelectedCells(acrossCells);
        }
        return;
      }

      const { row, col } = cell;
      const key = `${row}:${col}`;
      const value = crossword.cellsToCluesMap.get(key);
      const across = value?.across;
      const down = value?.down;
      const cells = across?.cells ?? down?.cells;

      if (across && down) {
        setAcrossCells(across.cells);
        setDownCells(down.cells);
      } else {
        setAcrossCells();
        setDownCells();
      }

      if (cells) {
        if (across && down) {
          let cellsToUse = cells;
          if (isSameCell(cell, across.cells[0])) {
            cellsToUse = across.cells;
          } else {
            if (isSameCell(cell, down.cells[0])) {
              cellsToUse = down.cells;
            }
          }
          setSelectedCells(cellsToUse);
        } else {
          setSelectedCells(cells);
        }
        setCurrentCell(cell);
      } else {
        setSelectedCells();
        setCurrentCell();
      }
    },
    [crossword, selectedCells, currentCell, acrossCells, downCells]
  );

  return {
    selectedCells,
    currentCell,
    onCellClick,
  };
};
