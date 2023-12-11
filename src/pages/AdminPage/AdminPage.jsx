import { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Box, Button, Container } from "@mui/material";

import { addCrossword } from "@app/firebase";

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

const usePuz = () => {
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

  return { query1Response, query2Response, puzData };
};

export const AdminPage = () => {
  const { query1Response, query2Response, puzData } = usePuz();

  if (query1Response.isLoading || query2Response.isLoading) {
    return <div>Loading...</div>;
  }

  if (query1Response.isError) {
    return <div>Error: {query1Response.error.message}</div>;
  }

  if (query2Response.isError) {
    return <div>Error: {query2Response.error.message}</div>;
  }

  const onAdd = () => {
    addCrossword({
      url: puzData.puzzleUrl,
      publication: "Private Eye",
      author: puzData.puzzle.author,
      title: puzData.puzzle.title,
      grid: puzData.grid,
      acrossClues: puzData.acrossClues,
      downClues: puzData.downClues,
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          borderColor: "#ffffff",
          borderStyle: "solid",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <div>Puzzle Url: {puzData.puzzleUrl}</div>
        <Button variant="outlined" size="small" onClick={onAdd}>
          Add
        </Button>
      </Box>
    </Container>
  );
};
