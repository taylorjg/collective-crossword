import { useQuery } from "react-query";

import {
  getCrypticCrossword,
  getToughieCrossword,
  getPrizeCryptic,
  getPrizeToughie,
} from "@app/firebase";
import { transformTelegraphCrossword } from "@app/transforms";
import { useExistenceCheck } from "./use-existence-check";

const useTheTelegraphCrossword = (fn, fnName, id) => {
  const queryResponse = useQuery([fnName, id], () => fn({ id }), {
    enabled: Boolean(id),
  });

  const { isLoading, isError, error } = queryResponse;

  const puzData = queryResponse.data?.data?.puzData?.json ?? null;
  const puzUrl = queryResponse.data?.data?.puzUrl ?? null;
  const crossword =
    puzData && puzUrl ? transformTelegraphCrossword(puzData, puzUrl) : null;

  return useExistenceCheck({ crossword, puzData, isLoading, isError, error });
};

export const useTheTelegraphCrypticCrosswordById = (id) => {
  return useTheTelegraphCrossword(
    getCrypticCrossword,
    "getCrypticCrossword",
    id
  );
};

export const useTheTelegraphToughieCrosswordById = (id) => {
  return useTheTelegraphCrossword(
    getToughieCrossword,
    "getToughieCrossword",
    id
  );
};

export const useTheTelegraphPrizeCrypticById = (id) => {
  return useTheTelegraphCrossword(getPrizeCryptic, "getPrizeCryptic", id);
};

export const useTheTelegraphPrizeToughieById = (id) => {
  return useTheTelegraphCrossword(getPrizeToughie, "getPrizeToughie", id);
};
