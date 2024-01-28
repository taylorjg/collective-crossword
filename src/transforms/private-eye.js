import { CrosswordTypes, CrypticTypes, Publications } from "@app/constants";

export const transformPrivateEyeCrossword = (puzData, url, unixTimestamp) => {
  return {
    publication: Publications.PrivateEye,
    crosswordType: CrosswordTypes.Cryptic,
    crypticType: CrypticTypes.CrypticCrossword,
    url,
    author: puzData.puzzle.author,
    title: puzData.puzzle.title,
    publishDate: unixTimestamp,
    grid: puzData.grid,
    acrossClues: puzData.acrossClues,
    downClues: puzData.downClues,
  };
};
