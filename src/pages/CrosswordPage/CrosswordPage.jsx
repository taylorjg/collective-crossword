import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "@app/utils";

import { getCrosswordById } from "@app/firebase";
import { FullPageMessage } from "@app/components";

import { Grid } from "./Grid";
import { StyledGrid } from "./CrosswordPage.styles";

export const CrosswordPage = () => {
  const [crossword, setCrossword] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const { id } = useParams();

  useEffect(() => {
    const invokeGetCrossword = async () => {
      const docSnap = await getCrosswordById(id);
      if (docSnap.exists()) {
        setCrossword({
          id: docSnap.id,
          ...docSnap.data(),
        });
      } else {
        setErrorMessage("Failed to load specified crossword");
      }
    };

    invokeGetCrossword();
  }, [id]);

  if (errorMessage) return <FullPageMessage message={errorMessage} />;

  if (!crossword) return <FullPageMessage message="Fetching crossword..." />;

  return (
    <>
      <div>Publication: {crossword.publication}</div>
      <div>Publish Date: {formatDate(crossword.publishDate)}</div>
      <div>Creation Date: {formatDate(crossword.timestamp.seconds)}</div>
      <div>Title: {crossword.title}</div>
      <StyledGrid>
        <Grid crossword={crossword} />
      </StyledGrid>
      {crossword.author && <div>Author: {crossword.author}</div>}
      <pre>{JSON.stringify(crossword.acrossClues, null, 2)}</pre>
      <pre>{JSON.stringify(crossword.downClues, null, 2)}</pre>
    </>
  );
};
