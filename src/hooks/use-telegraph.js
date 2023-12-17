import { useQuery } from "react-query";

import { getCrypticCrossword, getPrizeCryptic } from "@app/firebase";
import { transformTelegraphCrossword } from "@app/transforms";
import { useExistenceCheck } from "./use-existence-check";

const useTelegraphCommon = (fn, fnName, id) => {
  const queryResponse = useQuery([fnName, id], () => fn({ id }), {
    enabled: Boolean(id),
  });

  let { isLoading, isError, error } = queryResponse;

  const puzData = queryResponse.data?.data?.puzData?.json ?? null;
  const puzUrl = queryResponse.data?.data?.puzUrl ?? null;
  const crossword =
    puzData && puzUrl ? transformTelegraphCrossword(puzData, puzUrl) : null;

  return useExistenceCheck({ crossword, isLoading, isError, error });
};

export const useTheDailyTelegraphCrypticCrosswordById = (id) => {
  return useTelegraphCommon(getCrypticCrossword, "getCrypticCrossword", id);
};

export const useTheDailyTelegraphPrizeCrypticById = (id) => {
  return useTelegraphCommon(getPrizeCryptic, "getPrizeCryptic", id);
};

export const useTheSundayTelegraphPrizeCrypticById = (id) => {
  return useTelegraphCommon(getPrizeCryptic, "getPrizeCryptic", id);
};
