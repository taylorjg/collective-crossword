import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@app/contexts";
import { deleteCrossword, listenForCrosswordChanges } from "@app/firebase";

// import { CrosswordCards } from "./CrosswordCards";
import { CrosswordList } from "./CrosswordList";

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

  const onView = (id) => {
    navigate(`/crosswords/${id}`);
  };

  const onDelete = (id) => {
    deleteCrossword(id);
  };

  const isAdmin = user?.isAdmin ?? false;

  return (
    <CrosswordList
      crosswords={crosswords}
      isAdmin={isAdmin}
      onView={onView}
      onDelete={onDelete}
    />
  );
};
