import { useQuery } from "react-query";

import { getCrypticCrossword, getPrizeCryptic } from "@app/firebase";

export const useTelegraphCrypticCrossword = (id) => {
  const queryResponse = useQuery(
    ["getCrypticCrossword", id],
    () => getCrypticCrossword({ id }),
    { enabled: Boolean(id) }
  );

  const { isLoading, isError, error } = queryResponse;
  const puzData = queryResponse.data?.data?.json ?? null;

  return { puzData, isLoading, isError, error };
};

export const useTelegraphPrizeCryptic = (id) => {
  const queryResponse = useQuery(
    ["getPrizeCryptic", id],
    () => getPrizeCryptic({ id }),
    { enabled: Boolean(id) }
  );

  const { isLoading, isError, error } = queryResponse;
  const puzData = queryResponse.data?.data?.json ?? null;

  return { puzData, isLoading, isError, error };
};
