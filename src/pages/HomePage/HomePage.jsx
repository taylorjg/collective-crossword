import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "@mui/material";

import { deleteCrossword, listenForCrosswordChanges } from "@app/firebase";

import { StyledAuthContainer } from "./HomePage.styles";

export const HomePage = () => {
  const [crosswords, setCrosswords] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const onNext = (querySnapshot) => {
      const localCrosswords = [];
      querySnapshot.forEach((doc) => {
        localCrosswords.push({ id: doc.id, ...doc.data() });
      });
      setCrosswords(localCrosswords);
    };

    const unsubscribe = listenForCrosswordChanges(onNext);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleView = (id) => {
    navigate(`/crosswords/${id}`);
  };

  const handleDelete = (id) => {
    deleteCrossword(id);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <StyledAuthContainer id="firebaseui-auth-container" />
      {crosswords.map((crossword) => (
        <div
          key={crossword.id}
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
        >
          <div style={{ width: "20rem" }}>Title: {crossword.title}</div>
          <Button onClick={() => handleView(crossword.id)}>View</Button>
          <Button color="error" onClick={() => handleDelete(crossword.id)}>
            Delete
          </Button>
        </div>
      ))}
    </Container>
  );
};
