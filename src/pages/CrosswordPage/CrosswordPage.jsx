import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container } from "@mui/material";

import { getCrossword } from "@app/firebase";

export const CrosswordPage = () => {
  const [crossword, setCrossword] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const { id } = useParams();

  useEffect(() => {
    const invokeGetCrossword = async () => {
      const docSnap = await getCrossword(id);
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

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/">Home</Link>
      </div>

      <div>id: {id}</div>
      <div>crossword.title: {crossword?.title}</div>
      <div>errorMessage: {errorMessage}</div>
    </Container>
  );
};
