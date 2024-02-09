import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

import { getCrosswordById } from "@app/firebase";
import { FullPageMessage } from "@app/components";
import { enhance } from "@app/transforms";

import { UnsupportedViewport } from "./UnsupportedViewport";
import { SmallScreen } from "./SmallScreen";
import { LargeScreen } from "./LargeScreen";
import { useCrosswordState } from "./use-crossword-state";

export const CrosswordPage = () => {
  const [crossword, setCrossword] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const crosswordState = useCrosswordState(crossword);

  const { id } = useParams();

  const isLargeScreen = useMediaQuery("screen and (min-width: 720px)");
  const isLandscape = useMediaQuery("screen and (orientation:landscape)");

  useEffect(() => {
    const invokeGetCrossword = async () => {
      const docSnap = await getCrosswordById(id);
      if (docSnap.exists()) {
        const crossword = {
          id: docSnap.id,
          ...docSnap.data(),
        };
        const enhancedCrossword = enhance(crossword);
        console.log(enhancedCrossword);
        setCrossword(enhancedCrossword);
      } else {
        setErrorMessage("Failed to load specified crossword");
      }
    };

    invokeGetCrossword();
  }, [id]);

  if (errorMessage) return <FullPageMessage message={errorMessage} />;
  if (!crossword) return <FullPageMessage message="Fetching crossword..." />;
  if (isLargeScreen)
    return (
      <LargeScreen crossword={crossword} crosswordState={crosswordState} />
    );
  if (isLandscape) return <UnsupportedViewport />;
  return <SmallScreen crossword={crossword} crosswordState={crosswordState} />;
};
