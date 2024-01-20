import moment from "moment";

export const transformPrivateEyeCrossword = (puzData, url, timestamp) => {
  // e.g. "2024-01-17",
  const momentPublishDate = moment(timestamp, "YYYY-MM-DD");

  return {
    url,
    publication: "Private Eye",
    author: puzData.puzzle.author,
    title: puzData.puzzle.title,
    publishDate: momentPublishDate.unix(),
    grid: puzData.grid,
    acrossClues: puzData.acrossClues,
    downClues: puzData.downClues,
  };
};
