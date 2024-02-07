import { useCallback, useState } from "react";

export const useCrosswordState = (crossword) => {
  const [selectedCells, setSelectedCells] = useState();
  const [currentCell, setCurrentCell] = useState();

  const onCellClick = useCallback(
    ({ row, col }) => {
      const key = `${row}:${col}`;
      const value = crossword.cellsToCluesMap.get(key);
      const acrossCells = value?.across?.cells;
      const downCells = value?.down?.cells;
      const cells = acrossCells ?? downCells;
      if (cells) {
        setSelectedCells(cells);
        setCurrentCell({ row, col });
      } else {
        setSelectedCells();
        setCurrentCell();
      }
    },
    [crossword]
  );

  return {
    selectedCells,
    currentCell,
    onCellClick,
  };
};
