import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useAuth } from "@app/contexts";

import { deleteCrossword, listenForCrosswordChanges } from "@app/firebase";
import { formatDate } from "@app/utils";

import { StyledCard, StyledDetails, StyledDetail } from "./HomePage.styles";

export const HomePage = () => {
  const [crosswords, setCrosswords] = useState([]);
  const { user } = useAuth();

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
        <StyledCard key={crossword.id}>
          <StyledDetails>
            <StyledDetail>
              <div>Publication:</div>
              <div>{crossword.publication}</div>
            </StyledDetail>
            <StyledDetail>
              <div>Publish Date:</div>
              <div>{formatDate(crossword.publishDate)}</div>
            </StyledDetail>
            <StyledDetail>
              <div>Title:</div>
              <div>{crossword.title}</div>
            </StyledDetail>
            {crossword.author && (
              <StyledDetail>
                <div>Author:</div>
                <div>{crossword.author}</div>
              </StyledDetail>
            )}
          </StyledDetails>
          <Button onClick={() => handleView(crossword.id)}>View</Button>
          {user?.isAdmin && (
            <Button color="error" onClick={() => handleDelete(crossword.id)}>
              Delete
            </Button>
          )}
        </StyledCard>
      ))}
    </>
  );
};
