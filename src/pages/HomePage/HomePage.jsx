import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";

import { useAuth } from "@app/contexts";
import { deleteCrossword, listenForCrosswordChanges } from "@app/firebase";

import { CrosswordGrid } from "./CrosswordGrid";
import { CrosswordList } from "./CrosswordList";

import { StyledControls } from "./HomePage.styles";

export const HomePage = () => {
  const [crosswords, setCrosswords] = useState([]);
  const [gridMode, setGridMode] = useState(true);
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

  const CrosswordLayoutType = gridMode ? CrosswordGrid : CrosswordList;

  return (
    <>
      <StyledControls>
        {gridMode ? (
          <ListIcon
            titleAccess="Switch to list view"
            onClick={() => setGridMode(false)}
          />
        ) : (
          <GridViewIcon
            titleAccess="Switch to grid view"
            onClick={() => setGridMode(true)}
          />
        )}
      </StyledControls>
      <CrosswordLayoutType
        crosswords={crosswords}
        isAdmin={isAdmin}
        onView={onView}
        onDelete={onDelete}
      />
    </>
  );
};
