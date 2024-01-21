import { useQuery } from "react-query";
import axios from "axios";
import moment from "moment";

import { transformPrivateEyeCrossword } from "@app/transforms";
import { useExistenceCheck } from "./use-existence-check";

// TODO: move this into config of some sort ?
const SERVERLESS_URL = "https://fr0r2wv048.execute-api.us-east-1.amazonaws.com";

const listPuzzles = async () => {
  const response = await axios.get(`${SERVERLESS_URL}/list-puzzles`);
  return response.data;
};

const parsePuzzle = async (puzzleUrl) => {
  const config = {
    params: {
      puzzleUrl,
    },
  };
  const response = await axios.get(`${SERVERLESS_URL}/parse-puzzle`, config);
  return response.data;
};

const extractIdFromUrl = (url) => {
  const m = url.match(/(\d+)\.puz$/);
  return m[1];
};

const extractFilenameFromUrl = (url) => {
  const pos = url.lastIndexOf("/");
  return pos >= 0 ? url.substring(pos + 1) : url;
};

export const usePrivateEyeCrosswords = () => {
  const queryResponse = useQuery("listPuzzles", listPuzzles);
  const { data, isLoading, isError, error } = queryResponse;

  const puzzles = data?.puzzles ?? [];
  const puzList = puzzles
    .filter(({ timestamp }) => timestamp !== "2017-04-24")
    .filter(
      ({ url, timestamp }) =>
        !(url.endsWith("783.puz") && timestamp === "2022-10-07")
    )
    .map((entry) => {
      const { url, timestamp } = entry;
      const id = extractIdFromUrl(url);
      const filename = extractFilenameFromUrl(url);
      const unixTimestamp = moment(timestamp, "YYYY-MM-DD").unix();

      return {
        ...entry,
        id,
        filename,
        unixTimestamp,
      };
    })
    .reverse();

  return { puzList, isLoading, isError, error };
};

export const usePrivateEyeCrosswordByUrl = (puzzleToFetch) => {
  const puzUrl = puzzleToFetch?.url;
  const unixTimestamp = puzzleToFetch?.unixTimestamp;

  const queryResponse = useQuery(
    ["parsePuzzle", puzUrl],
    () => parsePuzzle(puzUrl),
    { enabled: Boolean(puzzleToFetch) }
  );

  const puzData = queryResponse.data;
  const isLoading = queryResponse.isLoading;
  const isError = queryResponse.isError;
  const error = queryResponse.error;

  const crossword = puzData
    ? transformPrivateEyeCrossword(puzData, puzUrl, unixTimestamp)
    : null;

  return useExistenceCheck({ crossword, puzData, isLoading, isError, error });
};
