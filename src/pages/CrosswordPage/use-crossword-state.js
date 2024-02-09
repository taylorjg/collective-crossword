import { useCallback, useEffect, useRef, useState } from "react";

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
  const allCluesRef = useRef([]);

  useEffect(() => {
    if (allCluesRef.current.length === 0 && crossword) {
      allCluesRef.current = [...crossword.acrossClues, ...crossword.downClues];
    }
  }, [crossword]);

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
    setCurrentCell(clue.cells[0]);
    setSelectedClue(clue);
    setToggleableClues();
  }, []);

  // const findCurrentCellIndex = () => {
  //   return selectedClue.cells.find((cell) => isSameCell(currentCell, cell));
  // };

  // const findSelectedClueIndex = () => {
  //   return allCluesRef.current.findIndex((clue) => clue === selectedClue);
  // };

  const goToNextClue = useCallback(() => {
    if (!selectedClue) return;
    // const index = findSelectedClueIndex();
    const index = allCluesRef.current.findIndex(
      (clue) => clue === selectedClue
    );
    if (index < 0) return;
    let newIndex = index + 1;
    if (newIndex >= allCluesRef.current.length) {
      newIndex = 0;
    }
    const newClue = allCluesRef.current[newIndex];
    setSelectedClue(newClue);
    setCurrentCell(newClue.cells[0]);
  }, [selectedClue]);

  const goToPreviousClue = () => {
    if (!selectedClue) return;
    // const index = findSelectedClueIndex();
    const index = allCluesRef.current.findIndex(
      (clue) => clue === selectedClue
    );
    if (index < 0) return;
    let newIndex = index - 1;
    if (newIndex < 0) {
      newIndex = allCluesRef.current.length - 1;
    }
    const newClue = allCluesRef.current[newIndex];
    setSelectedClue(newClue);
    setCurrentCell(newClue.cells[0]);
    // setSelectedClue(allCluesRef.current[newIndex]);
  };

  const goToNextCell = useCallback(() => {
    if (!selectedClue) return;
    // const index = findCurrentCellIndex();
    const index = selectedClue.cells.findIndex((cell) =>
      isSameCell(currentCell, cell)
    );
    if (index < 0) return;
    const lastIndex = selectedClue.cells.length - 1;
    if (index < lastIndex) {
      setCurrentCell(selectedClue.cells[index + 1]);
    } else {
      goToNextClue();
    }
  }, [currentCell, selectedClue, goToNextClue]);

  const enterLetter = useCallback(
    (letter) => {
      if (!selectedClue) return;
      // const index = findCurrentCellIndex();
      const index = selectedClue.cells.findIndex((cell) =>
        isSameCell(currentCell, cell)
      );
      if (index < 0) return;
      // get (find or create) entry in acrossAnswers or downAnswers corresponding to selectedClue
      // add letter at correct place within answer
      goToNextCell();
    },
    [currentCell, selectedClue, goToNextCell]
  );

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
