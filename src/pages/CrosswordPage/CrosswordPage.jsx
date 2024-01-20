import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "@app/utils";

import { getCrosswordById } from "@app/firebase";

import { FullPageMessage } from "@app/components";

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

  const transformLine = (line) => {
    const charsIn = Array.from(line);
    const charsOut = charsIn.map((ch) => (ch === "." ? "\u2591" : "\u2588"));
    return charsOut.join("");
  };

  if (errorMessage) return <FullPageMessage message={errorMessage} />;

  if (!crossword) return <FullPageMessage message="Fetching crossword..." />;

  return (
    <>
      <div>Publication: {crossword.publication}</div>
      <div>Publish Date: {formatDate(crossword.publishDate)}</div>
      <div>Title: {crossword.title}</div>
      {crossword.author && <div>Author: {crossword.author}</div>}
      <pre>
        {crossword.grid.map((line, index) => (
          <div key={index}>{transformLine(line)}</div>
        ))}
      </pre>
      <br />
      <pre>{JSON.stringify(crossword, null, 2)}</pre>
    </>
  );
};
