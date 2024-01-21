export const transformPrivateEyeCrossword = (puzData, url, unixTimestamp) => {
  return {
    url,
    publication: "Private Eye",
    author: puzData.puzzle.author,
    title: puzData.puzzle.title,
    publishDate: unixTimestamp,
    grid: puzData.grid,
    acrossClues: puzData.acrossClues,
    downClues: puzData.downClues,
  };
};
