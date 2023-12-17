import { useEffect, useState } from "react";
import { getCrosswords, deleteCrossword } from "@app/firebase";
import { Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const [crosswords, setCrosswords] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const invokeGetCrosswords = async () => {
      const querySnapshot = await getCrosswords();
      const localCrosswords = [];
      querySnapshot.forEach((doc) => {
        localCrosswords.push({ id: doc.id, ...doc.data() });
      });
      setCrosswords(localCrosswords);
    };

    invokeGetCrosswords();
  }, []);

  const handleView = (id) => {
    navigate(`/crosswords/${id}`);
  };

  const handleDelete = (id) => {
    deleteCrossword(id);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
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
