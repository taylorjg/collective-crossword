import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";

import { transformPrivateEyeCrossword } from "@app/transforms";
import { useExistenceCheck } from "./use-existence-check";

// TODO: move this into config of some sort ?
const SERVERLESS_URL = "https://fr0r2wv048.execute-api.us-east-1.amazonaws.com";

const scrapePuzzleUrl = async () => {
  const response = await axios.get(`${SERVERLESS_URL}/scrape-puzzle-url`);
  return response.data.puzzleUrl;
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

const listPuzzles = async () => {
  const response = await axios.get(`${SERVERLESS_URL}/list-puzzles`);
  return response.data;
};

export const usePrivateEyeCurrentCrossword = () => {
  const [puzUrl, setPuzUrl] = useState();
  const [puzData, setPuzData] = useState();

  const query1Response = useQuery("scrapePuzzleUrl", scrapePuzzleUrl, {
    onSuccess: (data) => {
      setPuzUrl(data);
    },
  });

  const query2Response = useQuery(
    ["parsePuzzle", puzUrl],
    () => parsePuzzle(puzUrl),
    {
      enabled: Boolean(puzUrl),
      onSuccess: (data) => {
        setPuzData(data);
      },
    }
  );

  const isLoading = query1Response.isLoading || query2Response.isLoading;
  const error = query1Response.error ?? query2Response.error;
  const isError = Boolean(error);
  const crossword = puzData
    ? transformPrivateEyeCrossword(puzData, puzUrl)
    : null;

  return useExistenceCheck({ crossword, puzData, isLoading, isError, error });
};

export const usePrivateEyeCrosswordByUrl = (puzUrl) => {
  const [puzData, setPuzData] = useState();

  const queryResponse = useQuery(
    ["parsePuzzle", puzUrl],
    () => parsePuzzle(puzUrl),
    {
      enabled: Boolean(puzUrl),
      onSuccess: (data) => {
        setPuzData(data);
      },
    }
  );

  const isLoading = queryResponse.isLoading;
  const isError = queryResponse.isError;
  const error = queryResponse.error;
  const crossword = puzData
    ? transformPrivateEyeCrossword(puzData, puzUrl)
    : null;

  return useExistenceCheck({ crossword, puzData, isLoading, isError, error });
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
      return {
        ...entry,
        id: extractIdFromUrl(entry.url),
        filename: extractFilenameFromUrl(entry.url),
      };
    })
    .reverse();

  return { puzList, isLoading, isError, error };
};
