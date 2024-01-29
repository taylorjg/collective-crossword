import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";

import { useAuth } from "@app/contexts";
import { deleteCrossword, listenForCrosswordChanges } from "@app/firebase";
import { FullPageLoading } from "@app/components";
import { CrosswordTypes } from "@app/constants";

import { CrosswordGrid } from "./CrosswordGrid";
import { CrosswordList } from "./CrosswordList";
import { StyledControls } from "./HomePage.styles";

export const HomePage = () => {
  const [currentTab, setCurrentTab] = useState("1");
  const [crosswords, setCrosswords] = useState();
  const [gridMode, setGridMode] = useState(() =>
    Boolean(localStorage.getItem("grid-mode"))
  );
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

  const onChangeTab = (_, newValue) => {
    setCurrentTab(newValue);
  };

  const onView = (id) => {
    navigate(`/crosswords/${id}`);
  };

  const onDelete = (id) => {
    deleteCrossword(id);
  };

  const isAdmin = user?.isAdmin ?? false;

  const CrosswordLayoutType = gridMode ? CrosswordGrid : CrosswordList;

  const toggleGridMode = () => {
    const newGridMode = !gridMode;
    localStorage.setItem("grid-mode", newGridMode ? "true" : "");
    setGridMode(newGridMode);
  };

  if (!crosswords) return <FullPageLoading />;

  return (
    <>
      <StyledControls>
        {gridMode ? (
          <ListIcon
            titleAccess="Switch to list view"
            onClick={toggleGridMode}
          />
        ) : (
          <GridViewIcon
            titleAccess="Switch to grid view"
            onClick={toggleGridMode}
          />
        )}
      </StyledControls>
      <TabContext value={currentTab}>
        <TabList onChange={onChangeTab} sx={{ mx: 2 }}>
          <Tab label="Cryptic" value="1" />
          <Tab label="Quick" value="2" />
          <Tab label="All" value="3" />
        </TabList>
        <TabPanel value="1" sx={{ px: 0 }}>
          <CrosswordLayoutType
            crosswords={crosswords.filter(
              ({ crosswordType }) => crosswordType === CrosswordTypes.Cryptic
            )}
            isAdmin={isAdmin}
            onView={onView}
            onDelete={onDelete}
          />
        </TabPanel>
        <TabPanel value="2" sx={{ px: 0 }}>
          <CrosswordLayoutType
            crosswords={crosswords.filter(
              ({ crosswordType }) => crosswordType === CrosswordTypes.Quick
            )}
            isAdmin={isAdmin}
            onView={onView}
            onDelete={onDelete}
          />
        </TabPanel>
        <TabPanel value="3" sx={{ px: 0 }}>
          <CrosswordLayoutType
            crosswords={crosswords}
            isAdmin={isAdmin}
            onView={onView}
            onDelete={onDelete}
          />
        </TabPanel>
      </TabContext>
    </>
  );
};
