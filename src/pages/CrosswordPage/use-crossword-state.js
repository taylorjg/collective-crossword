import { useCallback, useEffect, useRef, useState } from "react";

import { isSameAsFirstCell, isSameCell } from "@app/utils";

// const setLetterAtIndex = (letters, letter, index) => {
//   const arr = Array.from(letters);
//   arr[index] = letter;
//   return arr.join("");
// };

export const useCrosswordState = (crossword) => {
  // External
  const [currentCell, setCurrentCell] = useState();
  const [selectedClue, setSelectedClue] = useState();
  // const [acrossAnswers, setAcrossAnswers] = useState([]);
  // const [downAnswers, setDownAnswers] = useState([]);
  const [acrossAnswers] = useState([]);
  const [downAnswers] = useState([]);
  const allCluesRef = useRef([]);

  // Internal
  const [toggleableClues, setToggleableClues] = useState();

  useEffect(() => {
    if (allCluesRef.current.length === 0 && crossword) {
      allCluesRef.current = [...crossword.acrossClues, ...crossword.downClues];
    }
  }, [crossword]);

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
      const { acrossClue, downClue } = crossword.cellsToCluesMap.get(key) ?? {};
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
    setSelectedClue(clue);
    setCurrentCell(clue.cells[0]);
    setToggleableClues();
  }, []);

  const findCurrentCellIndex = () => {
    return selectedClue.cells.findIndex((cell) =>
      isSameCell(currentCell, cell)
    );
  };

  const findSelectedClueIndex = () => {
    return allCluesRef.current.findIndex((clue) => clue === selectedClue);
  };

  const wrapClueIndex = (index) => {
    const lastIndex = allCluesRef.current.length - 1;
    if (index < 0) return lastIndex;
    if (index > lastIndex) return 0;
    return index;
  };

  const goToNextClue = () => {
    if (!selectedClue) return;
    const index = findSelectedClueIndex();
    if (index < 0) return;
    const newIndex = wrapClueIndex(index + 1);
    const newClue = allCluesRef.current[newIndex];
    setSelectedClue(newClue);
    setCurrentCell(newClue.cells[0]);
  };

  const goToPreviousClue = () => {
    if (!selectedClue) return;
    const index = findSelectedClueIndex();
    if (index < 0) return;
    const newIndex = wrapClueIndex(index - 1);
    const newClue = allCluesRef.current[newIndex];
    setSelectedClue(newClue);
    setCurrentCell(newClue.cells[0]);
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

  const goToPreviousCell = () => {
    if (!selectedClue) return;
    const index = findCurrentCellIndex();
    if (index < 0) return;
    if (index > 0) {
      setCurrentCell(selectedClue.cells[index - 1]);
    }
  };

  const enterLetter = (/* letter */) => {
    if (!selectedClue) return;
    const index = findSelectedClueIndex();
    if (index < 0) return;
    // TODO: other stuff...
    goToNextCell();
  };

  const deleteLetter = () => {
    if (!selectedClue) return;
    const index = findSelectedClueIndex();
    if (index < 0) return;
    // TODO: other stuff...
    goToPreviousCell();
  };

  return {
    currentCell,
    selectedClue,
    acrossAnswers,
    downAnswers,
    selectCell,
    selectClue,
    enterLetter,
    deleteLetter,
    goToNextClue,
    goToPreviousClue,
  };
};
