import { useState } from "react";
import { useQuery } from "react-query";

import {
  getCrypticCrossword,
  getPrizeCryptic,
  doesCrosswordExistByTitle,
} from "@app/firebase";
import { transformTelegraphCrossword } from "@app/transforms";

const ExistenceValues = Object.freeze({
  DontKnowYet: "DontKnowYet",
  Yes: "Yes",
  No: "No",
  Error: "Error",
});

const useTelegraphCommon = (fn, fnName, id) => {
  const [internalState, setInternalState] = useState({
    crossword: null,
    existence: ExistenceValues.DontKnowYet,
  });

  const queryResponse = useQuery([fnName, id], () => fn({ id }), {
    enabled: Boolean(id),
    onSuccess: async (data) => {
      const puzData = data.data?.puzData?.json ?? null;
      const puzUrl = data.data?.puzUrl ?? null;
      const crossword =
        puzData && puzUrl ? transformTelegraphCrossword(puzData, puzUrl) : null;

      try {
        const exists = await doesCrosswordExistByTitle(crossword.title);
        const existence = exists ? ExistenceValues.Yes : ExistenceValues.No;
        setInternalState({ crossword, existence });
      } catch (error) {
        setInternalState({ crossword, existence: ExistenceValues.Error });
      }
    },
  });

  let { isError, error } = queryResponse;

  const { crossword, existence } = internalState;
  const isLoading = existence === ExistenceValues.DontKnowYet;
  const exists = existence === ExistenceValues.Yes;

  if (existence === ExistenceValues.Error) {
    isError = true;
    error = new Error("Failed to check whether crossword already exists.");
  }

  return { isLoading, isError, error, crossword, exists };
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
