import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";

import { useAuth } from "@app/contexts";
import { getCrosswords, deleteCrossword } from "@app/firebase";
import { FullPageLoading } from "@app/components";
import { CrosswordTypes } from "@app/constants";
import { ConfirmationModal } from "@app/components";

import { CrosswordGrid } from "./CrosswordGrid";
import { CrosswordList } from "./CrosswordList";
import { StyledControls } from "./HomePage.styles";

export const HomePage = () => {
  const [currentTab, setCurrentTab] = useState("1");
  const [crosswords, setCrosswords] = useState();
  const [gridMode, setGridMode] = useState(() =>
    Boolean(localStorage.getItem("grid-mode"))
  );
  const [crosswordIdToDelete, setCrosswordIdToDelete] = useState();
  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const getCrosswordsAsync = async () => {
      let crosswordType;
      if (currentTab === "1") crosswordType = CrosswordTypes.Cryptic;
      if (currentTab === "2") crosswordType = CrosswordTypes.Quick;

      const querySnapshot = await getCrosswords(crosswordType);
      const localCrosswords = [];
      querySnapshot.forEach((doc) => {
        localCrosswords.push({ id: doc.id, ...doc.data() });
      });
      setCrosswords(localCrosswords);
    };

    getCrosswordsAsync();
  }, [currentTab]);

  const onChangeTab = (_, newValue) => {
    setCurrentTab(newValue);
  };

  const onView = (id) => {
    navigate(`/crosswords/${id}`);
  };

  const onDelete = (id) => {
    setCrosswordIdToDelete(id);
  };

  const onConfirmDelete = () => {
    deleteCrossword(crosswordIdToDelete);
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
        <IconButton onClick={toggleGridMode}>
          {gridMode ? (
            <ListIcon titleAccess="Switch to list view" />
          ) : (
            <GridViewIcon titleAccess="Switch to grid view" />
          )}
        </IconButton>
      </StyledControls>
      <TabContext value={currentTab}>
        <TabList onChange={onChangeTab} sx={{ mx: 2 }}>
          <Tab label="Cryptic" value="1" />
          <Tab label="Quick" value="2" />
          <Tab label="All" value="3" />
        </TabList>
        <TabPanel value="1" sx={{ px: 0 }}>
          <CrosswordLayoutType
            crosswords={crosswords}
            isAdmin={isAdmin}
            onView={onView}
            onDelete={onDelete}
          />
        </TabPanel>
        <TabPanel value="2" sx={{ px: 0 }}>
          <CrosswordLayoutType
            crosswords={crosswords}
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
      <ConfirmationModal
        open={Boolean(crosswordIdToDelete)}
        onClose={() => setCrosswordIdToDelete()}
        title="Are you sure ?"
        message="This will permanently delete the crossword."
        onOK={onConfirmDelete}
      />
    </>
  );
};
