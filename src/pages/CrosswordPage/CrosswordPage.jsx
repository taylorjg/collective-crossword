import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container } from "@mui/material";

import { getCrosswordById } from "@app/firebase";

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
        setErrorMessage("Failed to load specified crossword.");
      }
    };

    invokeGetCrossword();
  }, [id]);

  const transformLine = (line) => {
    const charsIn = Array.from(line);
    const charsOut = charsIn.map((ch) => (ch === "." ? "\u2591" : "\u2588"));
    return charsOut.join("");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/">Home</Link>
      </div>

      <div>id: {id}</div>
      <div>crossword.title: {crossword?.title}</div>
      <div>errorMessage: {errorMessage}</div>

      {crossword && (
        <>
          <pre>
            {crossword.grid.map((line, index) => (
              <div key={index}>{transformLine(line)}</div>
            ))}
          </pre>
          <br />
          <pre>{JSON.stringify(crossword, null, 2)}</pre>
        </>
      )}
    </Container>
  );
};
