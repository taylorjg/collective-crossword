import { useEffect, useState } from "react";

import { getExistingCrosswordIdByTitle } from "@app/firebase";

const ExistenceCheck = Object.freeze({
  DontKnowYet: "DontKnowYet",
  Yes: "Yes",
  No: "No",
  Error: "Error",
});

export const useExistenceCheck = (crosswordResponse) => {
  const [result, setResult] = useState({
    existenceCheck: ExistenceCheck.DontKnowYet,
    crosswordId: undefined,
  });

  useEffect(() => {
    const performExistenceCheck = async () => {
      try {
        const crosswordId = await getExistingCrosswordIdByTitle(
          crossword.title
        );
        setResult({
          existenceCheck: crosswordId ? ExistenceCheck.Yes : ExistenceCheck.No,
          crosswordId,
        });
      } catch (error) {
        setResult({
          existenceCheck: ExistenceCheck.Error,
          crosswordId: undefined,
        });
      }
    };

    const { isLoading, crossword } = crosswordResponse;

    if (
      !isLoading &&
      Boolean(crossword) &&
      result.existenceCheck === ExistenceCheck.DontKnowYet
    ) {
      performExistenceCheck();
    }
  }, [crosswordResponse, result]);

  const isError =
    crosswordResponse.isError || result.existenceCheck === ExistenceCheck.Error;

  const error = crosswordResponse.isError
    ? crosswordResponse.error
    : result.existenceCheck === ExistenceCheck.Error
      ? new Error("Failed to check whether crossword already exists.")
      : null;

  const isLoading =
    !isError &&
    (crosswordResponse.isLoading ||
      result.existenceCheck === ExistenceCheck.DontKnowYet);

  return {
    ...crosswordResponse,
    isLoading,
    isError,
    error,
    crosswordId: result.crosswordId,
  };
};
