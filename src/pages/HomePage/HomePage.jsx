import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useAuthState } from "@app/hooks";

import { deleteCrossword, listenForCrosswordChanges } from "@app/firebase";

export const HomePage = () => {
  const [crosswords, setCrosswords] = useState([]);
  const { user } = useAuthState();

  console.log("[HomePage]", { user });

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
    <>
      {crosswords.map((crossword) => (
        <div
          key={crossword.id}
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
        >
          <div style={{ width: "20rem" }}>Title: {crossword.title}</div>
          <Button onClick={() => handleView(crossword.id)}>View</Button>
          {user?.isAdmin && (
            <Button color="error" onClick={() => handleDelete(crossword.id)}>
              Delete
            </Button>
          )}
        </div>
      ))}
    </>
  );
};
