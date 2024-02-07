import { useCallback, useState } from "react";

export const useCrosswordState = (crossword) => {
  const [highlightedCells, setHighlightedCells] = useState();
  const [currentCell, setCurrentCell] = useState();

  const onCellClick = useCallback(
    ({ row, col }) => {
      const key = `${row}:${col}`;
      const value = crossword.cellsToCluesMap.get(key);
      const acrossCells = value?.across?.cells;
      const downCells = value?.down?.cells;
      const cells = acrossCells ?? downCells;
      if (cells) {
        setHighlightedCells(cells);
        setCurrentCell({ row, col });
      } else {
        setHighlightedCells();
        setCurrentCell();
      }
    },
    [crossword]
  );

  return {
    highlightedCells,
    currentCell,
    onCellClick,
  };
};
