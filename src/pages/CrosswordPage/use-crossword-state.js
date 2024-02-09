import { useCallback, useState } from "react";

import { isSameAsFirstCell, isSameCell } from "@app/utils";

const setLetterAtIndex = (letters, letter, index) => {
  const arr = Array.from(letters);
  arr[index] = letter;
  return arr.join("");
};

export const useCrosswordState = (crossword) => {
  // External
  const [currentCell, setCurrentCell] = useState();
  const [selectedClue, setSelectedClue] = useState();
  const [acrossAnswers, setAcrossAnswers] = useState([]);
  const [downAnswers, setDownAnswers] = useState([]);

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

  const selectClue = useCallback((clue) => {
    setCurrentCell(clue.cells[0]);
    setSelectedClue(clue);
    setToggleableClues();
  }, []);

  const findCurrentCellIndex = () => {
    return selectedClue.cells.find((cell) => isSameCell(currentCell, cell));
  };

  const enterLetter = (/* letter */) => {
    if (!selectedClue) return;
    const index = findCurrentCellIndex();
    if (index < 0) return;
    // get (find or create) entry in acrossAnswers or downAnswers corresponding to selectedClue
    // add letter at correct place within answer
    goToNextCell();
  };

  const goToNextCell = () => {
    if (!selectedClue) return;
    const index = findCurrentCellIndex();
    if (index < 0) return;
    const lastIndex = selectedClue.cells.length - 1;
    if (index < lastIndex) {
      setCurrentCell(selectedClue.cells[index + 1]);
    } else {
      goToNextClue();
    }
  };

  const goToNextClue = () => {
    if (!selectedClue) return;
    // if selectedClue is an across clue, go to next across clue
    // if selectedClue is a down clue, go to next down clue
    // if run off end of across clues, go to first down clue
    // if run off end of down clues, go to first across clue
  };

  const goToPreviousClue = () => {
    if (!selectedClue) return;
    // if selectedClue is an across clue, go to previous across clue
    // if selectedClue is a down clue, go to previous down clue
    // if run off beginning of across clues, go to last down clue
    // if run off beginning of down clues, go to last across clue
  };

  return {
    currentCell,
    selectedClue,
    acrossAnswers,
    downAnswers,
    selectCell,
    selectClue,
    enterLetter,
    goToNextClue,
    goToPreviousClue,
  };
};
