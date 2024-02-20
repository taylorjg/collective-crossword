import { useCallback, useEffect, useRef, useState } from "react";

import {
  findCellIndex,
  isSameAsFirstCell,
  isSameCell,
  range,
} from "@app/utils";

export const useCrosswordState = (
  crossword,
  allAnswers = [],
  isSignedIn = false
) => {
  // External
  const [currentCell, setCurrentCell] = useState();
  const [selectedClue, setSelectedClue] = useState();
  const [enteredLettersMap, setEnteredLettersMap] = useState(new Map());
  const [answers, setAnswers] = useState([]);

  // Internal
  const [toggleableClues, setToggleableClues] = useState();
  const allCluesRef = useRef([]);

  const makeKey = (cell) => `${cell.row}:${cell.col}`;

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

  const getMostRecentAnswers = (allAnswers) => {
    const map = new Map();
    const nowSeconds = new Date().valueOf() / 1000;
    for (const answer of allAnswers) {
      const key = `${answer.clueNumber}:${answer.clueType}`;
      if (map.has(key)) {
        const oldValue = map.get(key);
        const oldValueSeconds = oldValue.timestamp?.seconds ?? nowSeconds;
        const answerSeconds = answer.timestamp?.seconds ?? nowSeconds;
        const newValue = answerSeconds > oldValueSeconds ? answer : oldValue;
        map.set(key, newValue);
      } else {
        map.set(key, answer);
      }
    }
    return Array.from(map.values());
  };

  useEffect(() => {
    setAnswers(getMostRecentAnswers(allAnswers));
    setEnteredLettersMap((currentMap) => {
      const newMap = new Map(currentMap);
      for (const answer of allAnswers) {
        const clue = findClueForAnswer(answer);
        if (clue) {
          for (const cell of clue.cells) {
            const key = makeKey(cell);
            newMap.delete(key);
          }
        }
      }
      return newMap;
    });
  }, [allAnswers]);

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

      const key = `${cell.row}:${cell.col}`;
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

  const findCrossCheckingLetter = (clue, cell) => {
    const key = `${cell.row}:${cell.col}`;
    const { acrossClue, downClue } = crossword.cellsToCluesMap.get(key);
    const otherClue = clue.clueType === "across" ? downClue : acrossClue;
    if (otherClue) {
      const answer = findAnswerForClue(otherClue);
      if (answer) {
        const index = findCellIndex(otherClue.cells, cell);
        const letters = Array.from(answer.answer);
        return letters[index];
      }
    }
  };

  const getAnswersReadyForSaving = () => {
    const answersReadyForSaving = [];
    for (const clue of allCluesRef.current) {
      if (findAnswerForClue(clue)) continue;
      const cellCount = clue.cells.length;
      const answerLetters = Array(cellCount).fill(" ");
      for (const index of range(cellCount)) {
        const cell = clue.cells[index];
        const crossCheckingLetter = findCrossCheckingLetter(clue, cell);
        const key = makeKey(cell);
        const enteredLetter = enteredLettersMap.get(key);
        const letter = crossCheckingLetter ?? enteredLetter;
        if (letter) {
          answerLetters[index] = letter;
        }
      }
      if (!answerLetters.includes(" ")) {
        const answer = {
          clueNumber: clue.clueNumber,
          clueType: clue.clueType,
          answer: answerLetters.join(""),
        };
        answersReadyForSaving.push(answer);
      }
    }
    return answersReadyForSaving;
  };

  const selectedClueHasEnteredLetters = () => {
    if (!selectedClue) return false;
    return selectedClue.cells.some((cell) =>
      enteredLettersMap.has(makeKey(cell))
    );
  };

  const clearEnteredLettersForSelectedClue = () => {
    if (!selectedClue) return;
    setEnteredLettersMap((currentMap) => {
      const newMap = new Map(currentMap);
      for (const cell of selectedClue.cells) {
        const key = makeKey(cell);
        newMap.delete(key);
      }
      return newMap;
    });
  };

  const unlockAnswer = (answer) => {
    const clue = findClueForAnswer(answer);
    if (clue) {
      const cellCount = clue.cells.length;
      const answerLetters = Array.from(answer.answer);
      for (const index of range(cellCount)) {
        const cell = clue.cells[index];
        if (!findCrossCheckingLetter(clue, cell)) {
          const key = makeKey(cell);
          const letter = answerLetters[index];
          enteredLettersMap.set(key, letter);
        }
      }
      setAnswers((currentAnswers) =>
        currentAnswers.filter((currentAnswer) => currentAnswer !== answer)
      );
    }
  };

  const findCurrentCellIndex = () => {
    return findCellIndex(selectedClue.cells, currentCell);
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

  const navigateToNextClue = () => {
    if (!selectedClue) return;
    const index = findSelectedClueIndex();
    if (index < 0) return;
    const newIndex = wrapClueIndex(index + 1);
    const newClue = allCluesRef.current[newIndex];
    setSelectedClue(newClue);
    setCurrentCell(newClue.cells[0]);
  };

  const navigateToPreviousClue = () => {
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
      navigateToNextClue();
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

  const findAnswerForClue = (clue) => {
    return answers.find(
      (answer) =>
        answer.clueNumber === clue.clueNumber &&
        answer.clueType === clue.clueType
    );
  };

  const findClueForAnswer = (answer) => {
    return allCluesRef.current.find(
      (clue) =>
        clue.clueNumber === answer.clueNumber &&
        clue.clueType === answer.clueType
    );
  };

  const enterLetter = (letter) => {
    if (!isSignedIn) return;
    if (!currentCell) return;

    const isPartOfAcceptedAnswer = answers.some((answer) => {
      const clue = findClueForAnswer(answer);
      return clue && clue.cells.some((cell) => isSameCell(cell, currentCell));
    });

    if (!isPartOfAcceptedAnswer) {
      setEnteredLettersMap((currentMap) => {
        const newMap = new Map(currentMap);
        const key = makeKey(currentCell);
        newMap.set(key, letter);
        return newMap;
      });
    }

    goToNextCell();
  };

  const deleteLetter = () => {
    if (!isSignedIn) return;
    if (!currentCell) return;
    setEnteredLettersMap((currentMap) => {
      const key = makeKey(currentCell);
      if (!currentMap.has(key)) return currentMap;
      const newMap = new Map(currentMap);
      newMap.delete(key);
      return newMap;
    });
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
    allAnswers,
    answers,
    enteredLettersMap,
    getAnswersReadyForSaving,
    selectedClueHasEnteredLetters,
    clearEnteredLettersForSelectedClue,
    unlockAnswer,
    selectCell,
    selectClue,
    enterLetter,
    deleteLetter,
    navigateToNextClue,
    navigateToPreviousClue,
    navigateLeft,
    navigateRight,
    navigateUp,
    navigateDown,
  };
};
