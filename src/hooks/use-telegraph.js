import { useQuery } from "react-query";
import axios from "axios";

// TODO: move this into config of some sort ?
const PUZZLESDATA_URL = "https://puzzlesdata.telegraph.co.uk";

const getCrypticCrossword = async (id) => {
  const response = await axios.get(
    `${PUZZLESDATA_URL}/puzzles/cryptic-crossword-1/cryptic-crossword-${id}.json`
  );
  return response.data;
};

const getPrizeCryptic = async (id) => {
  const response = await axios.get(
    `${PUZZLESDATA_URL}/puzzles/prize-cryptic/prize-cryptic-${id}.json`
  );
  return response.data;
};

export const useTelegraphCrypticCrossword = (id) => {
  return useQuery(["getCrypticCrossword", id], () => getCrypticCrossword(id), {
    enabled: Boolean(id),
  });
};

export const useTelegraphPrizeCryptic = (id) => {
  return useQuery(["getPrizeCryptic", id], () => getPrizeCryptic(id), {
    enabled: Boolean(id),
  });
};
