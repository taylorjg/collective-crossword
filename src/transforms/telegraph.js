import moment from "moment";

import { range } from "@app/utils";

const makeGrid = (puzData) => {
  const rows = Number(puzData.copy.gridsize.rows);
  const cols = Number(puzData.copy.gridsize.cols);

  const grid = [];

  for (const row of range(rows)) {
    const currentRowChars = [];
    for (const col of range(cols)) {
      const square = puzData.grid[row][col];
      currentRowChars.push(square.Blank ? "X" : ".");
    }
    grid.push(currentRowChars.join(""));
  }

  return grid;
};

const findWord = (puzData, id) => {
  return puzData.copy.words.find((word) => word.id === id);
};

const makeAcrossClues = (puzData) => {
  return puzData.copy.clues[0].clues.map((clue) => {
    const word = findWord(puzData, clue.word);
    return {
      clue: `${clue.clue} (${clue.length})`,
      clueNumber: clue.number,
      rowIndex: Number(word.y) - 1,
      colIndex: Number(word.x.split("-")[0]) - 1,
    };
  });
};

const makeDownClues = (puzData) => {
  return puzData.copy.clues[1].clues.map((clue) => {
    const word = findWord(puzData, clue.word);
    return {
      clue: `${clue.clue} (${clue.length})`,
      clueNumber: clue.number,
      rowIndex: Number(word.y.split("-")[0]) - 1,
      colIndex: Number(word.x) - 1,
    };
  });
};

export const transformTelegraphCrossword = (puzData, url) => {
  const grid = makeGrid(puzData);
  const acrossClues = makeAcrossClues(puzData);
  const downClues = makeDownClues(puzData);

  // e.g. "Wednesday, 06 December 2023",
  const momentPublishDate = moment(
    puzData.copy["date-publish"],
    "dddd, DD MMMM YYYY"
  );

  return {
    url,
    publication: "The Telegraph",
    author: puzData.copy.setter,
    title: puzData.copy.title,
    publishDate: momentPublishDate.unix(),
    grid,
    acrossClues,
    downClues,
  };
};
