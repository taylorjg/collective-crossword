import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";

import { transformPrivateEyeCrossword } from "@app/transforms";

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

  return { crossword, isLoading, isError, error };
};

export const usePrivateEyeCrosswordById = (id, enabled) => {
  const puzUrl = `https://www.private-eye.co.uk/pictures/crossword/download/${id}.puz`;

  const [puzData, setPuzData] = useState();

  const query2Response = useQuery(
    ["parsePuzzle", puzUrl],
    () => parsePuzzle(puzUrl),
    {
      enabled: Boolean(puzUrl) && enabled,
      onSuccess: (data) => {
        setPuzData(data);
      },
    }
  );

  const isLoading = query2Response.isLoading;
  const error = query2Response.error;
  const isError = Boolean(error);
  const crossword = puzData
    ? transformPrivateEyeCrossword(puzData, puzUrl)
    : null;

  return { crossword, isLoading, isError, error };
};
