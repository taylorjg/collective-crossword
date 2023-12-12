import { useQuery } from "react-query";

import { getCrypticCrossword, getPrizeCryptic } from "@app/firebase";
import { transformTelegraphCrossword } from "@app/transforms";

export const useTelegraphCrypticCrossword = (id) => {
  const queryResponse = useQuery(
    ["getCrypticCrossword", id],
    () => getCrypticCrossword({ id }),
    { enabled: Boolean(id) }
  );

  const { isLoading, isError, error } = queryResponse;
  const puzData = queryResponse.data?.data?.puzData?.json ?? null;
  const puzUrl = queryResponse.data?.data?.puzUrl ?? null;
  const crossword =
    puzData && puzUrl ? transformTelegraphCrossword(puzData, puzUrl) : null;

  return { crossword, isLoading, isError, error };
};

export const useTelegraphPrizeCryptic = (id) => {
  const queryResponse = useQuery(
    ["getPrizeCryptic", id],
    () => getPrizeCryptic({ id }),
    { enabled: Boolean(id) }
  );

  const { isLoading, isError, error } = queryResponse;
  const puzData = queryResponse.data?.data?.puzData?.json ?? null;
  const puzUrl = queryResponse.data?.data?.puzUrl ?? null;
  const crossword =
    puzData && puzUrl ? transformTelegraphCrossword(puzData, puzUrl) : null;

  return { crossword, isLoading, isError, error };
};
