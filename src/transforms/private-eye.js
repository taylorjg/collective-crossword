export const transformPrivateEyeCrossword = (puzData, url) => {
  return {
    url,
    publication: "Private Eye",
    author: puzData.puzzle.author,
    title: puzData.puzzle.title,
    grid: puzData.grid,
    acrossClues: puzData.acrossClues,
    downClues: puzData.downClues,
  };
};
