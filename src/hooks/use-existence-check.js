import { useEffect, useState } from "react";

import { doesCrosswordExistByTitle } from "@app/firebase";

const ExistenceCheck = Object.freeze({
  DontKnowYet: "DontKnowYet",
  Yes: "Yes",
  No: "No",
  Error: "Error",
});

export const useExistenceCheck = (crosswordResponse) => {
  const [existenceCheck, setExistenceCheck] = useState(
    ExistenceCheck.DontKnowYet
  );

  useEffect(() => {
    const performExistenceCheck = async () => {
      try {
        const exists = await doesCrosswordExistByTitle(crossword.title);
        setExistenceCheck(exists ? ExistenceCheck.Yes : ExistenceCheck.No);
      } catch (error) {
        setExistenceCheck(ExistenceCheck.Error);
      }
    };

    const { isLoading, crossword } = crosswordResponse;
    if (
      !isLoading &&
      Boolean(crossword) &&
      existenceCheck === ExistenceCheck.DontKnowYet
    ) {
      performExistenceCheck();
    }
  }, [crosswordResponse, existenceCheck]);

  const isLoading =
    crosswordResponse.isLoading ||
    existenceCheck === ExistenceCheck.DontKnowYet;

  const isError =
    crosswordResponse.isError || existenceCheck === ExistenceCheck.Error;

  const error =
    crosswordResponse.error ?? existenceCheck === ExistenceCheck.Error
      ? new Error("Failed to check whether crossword already exists.")
      : undefined;

  return {
    ...crosswordResponse,
    isLoading,
    isError,
    error,
    exists: existenceCheck === ExistenceCheck.Yes,
  };
};
