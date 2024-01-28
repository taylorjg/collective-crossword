import { useQuery } from "react-query";

import {
  getQuickCrossword,
  getCrypticCrossword,
  getToughieCrossword,
  getPrizeCryptic,
  getPrizeToughie,
} from "@app/firebase";
import { transformTelegraphCrossword } from "@app/transforms";
import { useExistenceCheck } from "./use-existence-check";
import { CrosswordTypes, CrypticTypes } from "@app/constants";

const useTheTelegraphCrossword = (
  crosswordType,
  crypticType,
  fn,
  fnName,
  id
) => {
  const queryResponse = useQuery([fnName, id], () => fn({ id }), {
    enabled: Boolean(id),
  });

  const { isLoading, isError, error } = queryResponse;

  const puzData = queryResponse.data?.data?.puzData?.json ?? null;
  const puzUrl = queryResponse.data?.data?.puzUrl ?? null;
  const crossword =
    puzData && puzUrl
      ? transformTelegraphCrossword(crosswordType, crypticType, puzData, puzUrl)
      : null;

  return useExistenceCheck({ crossword, puzData, isLoading, isError, error });
};

export const useTheTelegraphQuickCrosswordById = (id) => {
  return useTheTelegraphCrossword(
    CrosswordTypes.Quick,
    CrypticTypes.NotApplicable,
    getQuickCrossword,
    "getQuickCrossword",
    id
  );
};

export const useTheTelegraphCrypticCrosswordById = (id) => {
  return useTheTelegraphCrossword(
    CrosswordTypes.Cryptic,
    CrypticTypes.CrypticCrossword,
    getCrypticCrossword,
    "getCrypticCrossword",
    id
  );
};

export const useTheTelegraphToughieCrosswordById = (id) => {
  return useTheTelegraphCrossword(
    CrosswordTypes.Cryptic,
    CrypticTypes.ToughieCrossword,
    getToughieCrossword,
    "getToughieCrossword",
    id
  );
};

export const useTheTelegraphPrizeCrypticById = (id) => {
  return useTheTelegraphCrossword(
    CrosswordTypes.Cryptic,
    CrypticTypes.PrizeCryptic,
    getPrizeCryptic,
    "getPrizeCryptic",
    id
  );
};

export const useTheTelegraphPrizeToughieById = (id) => {
  return useTheTelegraphCrossword(
    CrosswordTypes.Cryptic,
    CrypticTypes.PrizeToughie,
    getPrizeToughie,
    "getPrizeToughie",
    id
  );
};
