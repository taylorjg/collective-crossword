import { useCallback, useEffect, useRef, useState } from "react";

import { listenForCrosswordAnswers } from "@app/firebase";
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
  const [answers, setAnswers] = useState([]);

  // Internal
  const [toggleableClues, setToggleableClues] = useState();
  const allCluesRef = useRef([]);

  useEffect(() => {
    if (crossword) {
      const firstClue = crossword.acrossClues[0];
      setCurrentCell(firstClue.cells[0]);
      setSelectedClue(firstClue);
      if (allCluesRef.current.length === 0) {
        allCluesRef.current = [
          ...crossword.acrossClues,
          ...crossword.downClues,
        ];
      }
    }
  }, [crossword]);

  useEffect(() => {
    const onNext = (querySnapshot) => {
      const localAnswers = [];
      querySnapshot.forEach((doc) => {
        localAnswers.push({ id: doc.id, ...doc.data() });
      });
      setAnswers(localAnswers);
    };

    if (crossword) {
      return listenForCrosswordAnswers(crossword.id, onNext);
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
    // TODO
    goToNextCell();
  };

  const deleteLetter = () => {
    if (!selectedClue) return;
    const index = findSelectedClueIndex();
    if (index < 0) return;
    // TODO
    goToPreviousCell();
  };

  const navigateLeft = () => {
    if (!currentCell || !selectedClue) return;
    const validOptions = crossword.acrossClues
      .filter((clue) => clue.row === currentCell.row)
      .flatMap((clue) => clue.cells.map((cell) => [cell.col, clue]));
    const oldIndex = validOptions.findIndex(([col]) => col === currentCell.col);
    if (oldIndex < 0) return;
    const wrapIndex = (index) => {
      if (index < 0) return validOptions.length - 1;
      return index;
    };
    const newIndex = wrapIndex(oldIndex - 1);
    const [newCol, newClue] = validOptions[newIndex];
    setCurrentCell({ ...currentCell, col: newCol });
    if (newClue !== selectedClue) setSelectedClue(newClue);
  };

  const navigateRight = () => {
    if (!currentCell || !selectedClue) return;
    const validOptions = crossword.acrossClues
      .filter((clue) => clue.row === currentCell.row)
      .flatMap((clue) => clue.cells.map((cell) => [cell.col, clue]));
    const oldIndex = validOptions.findIndex(([col]) => col === currentCell.col);
    if (oldIndex < 0) return;
    const wrapIndex = (index) => {
      if (index >= validOptions.length) return 0;
      return index;
    };
    const newIndex = wrapIndex(oldIndex + 1);
    const [newCol, newClue] = validOptions[newIndex];
    setCurrentCell({ ...currentCell, col: newCol });
    if (newClue !== selectedClue) setSelectedClue(newClue);
  };

  const navigateUp = () => {
    if (!currentCell || !selectedClue) return;
    const validOptions = crossword.downClues
      .filter((clue) => clue.col === currentCell.col)
      .flatMap((clue) => clue.cells.map((cell) => [cell.row, clue]));
    const oldIndex = validOptions.findIndex(([row]) => row === currentCell.row);
    if (oldIndex < 0) return;
    const wrapIndex = (index) => {
      if (index < 0) return validOptions.length - 1;
      return index;
    };
    const newIndex = wrapIndex(oldIndex - 1);
    const [newRow, newClue] = validOptions[newIndex];
    setCurrentCell({ ...currentCell, row: newRow });
    if (newClue !== selectedClue) setSelectedClue(newClue);
  };

  const navigateDown = () => {
    if (!currentCell || !selectedClue) return;
    const validOptions = crossword.downClues
      .filter((clue) => clue.col === currentCell.col)
      .flatMap((clue) => clue.cells.map((cell) => [cell.row, clue]));
    const oldIndex = validOptions.findIndex(([row]) => row === currentCell.row);
    if (oldIndex < 0) return;
    const wrapIndex = (index) => {
      if (index >= validOptions.length) return 0;
      return index;
    };
    const newIndex = wrapIndex(oldIndex + 1);
    const [newRow, newClue] = validOptions[newIndex];
    setCurrentCell({ ...currentCell, row: newRow });
    if (newClue !== selectedClue) setSelectedClue(newClue);
  };

  return {
    currentCell,
    selectedClue,
    answers,
    selectCell,
    selectClue,
    enterLetter,
    deleteLetter,
    navigateToNextClue: goToNextClue,
    navigateToPreviousClue: goToPreviousClue,
    navigateLeft,
    navigateRight,
    navigateUp,
    navigateDown,
  };
};
