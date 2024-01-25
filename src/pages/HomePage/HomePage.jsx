import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@app/contexts";
import { deleteCrossword, listenForCrosswordChanges } from "@app/firebase";

import { CrosswordCard } from "./CrosswordCard";
import { StyledCrosswordCards } from "./HomePage.styles";

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

  const onViewCrossword = (id) => {
    navigate(`/crosswords/${id}`);
  };

  const onDeleteCrossword = (id) => {
    deleteCrossword(id);
  };

  const isAdmin = user?.isAdmin ?? false;

  return (
    <StyledCrosswordCards>
      {crosswords.map((crossword) => (
        <CrosswordCard
          key={crossword.id}
          crossword={crossword}
          isAdmin={isAdmin}
          onViewCrossword={onViewCrossword}
          onDeleteCrossword={onDeleteCrossword}
        />
      ))}
    </StyledCrosswordCards>
  );
};
