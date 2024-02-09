import { useCallback, useState } from "react";

import { isSameAsFirstCell, isSameCell } from "@app/utils";

export const useCrosswordState = (crossword) => {
  // External
  const [currentCell, setCurrentCell] = useState();
  const [selectedClue, setSelectedClue] = useState();

  // Internal
  const [toggleableClues, setToggleableClues] = useState();

  const selectCell = useCallback(
    (cell) => {
      if (isSameCell(cell, currentCell) && toggleableClues) {
        if (selectedClue === toggleableClues.acrossClue) {
          setSelectedClue(toggleableClues.downClue);
        } else {
          setSelectedClue(toggleableClues.acrossClue);
        }
        return;
      }

      const { row, col } = cell;
      const key = `${row}:${col}`;
      const value = crossword.cellsToCluesMap.get(key);
      const acrossClue = value?.across;
      const downClue = value?.down;
      const clue = acrossClue ?? downClue;

      if (acrossClue && downClue) {
        setToggleableClues({ acrossClue, downClue });
      } else {
        setToggleableClues();
      }

      if (clue) {
        setCurrentCell(cell);
        if (acrossClue && downClue) {
          let clueToUse = acrossClue;
          if (isSameAsFirstCell(acrossClue, cell)) {
            clueToUse = acrossClue;
          } else {
            if (isSameAsFirstCell(downClue, cell)) {
              clueToUse = downClue;
            }
          }
          setSelectedClue(clueToUse);
        } else {
          setSelectedClue(clue);
        }
      } else {
        setCurrentCell();
        setSelectedClue();
      }
    },
    [crossword, currentCell, selectedClue, toggleableClues]
  );

  const selectClue = useCallback(() => {
    //
  }, []);

  return {
    currentCell,
    selectedClue,
    selectCell,
    selectClue,
  };
};
