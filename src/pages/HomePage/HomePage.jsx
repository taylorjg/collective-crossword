import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";

import { useAuth } from "@app/contexts";
import { listenForCrosswordChanges, deleteCrossword } from "@app/firebase";
import { FullPageLoading, FullPageSpinner } from "@app/components";
import { CrosswordTypes } from "@app/constants";
import { ConfirmationModal } from "@app/components";

import { CrosswordGrid } from "./CrosswordGrid";
import { CrosswordList } from "./CrosswordList";
import { StyledControls } from "./HomePage.styles";

const Tabs = Object.freeze({
  Cryptic: "Cryptic",
  Quick: "Quick",
  All: "All",
});

export const HomePage = () => {
  const [currentTab, setCurrentTab] = useState(Tabs.Cryptic);
  const [crosswords, setCrosswords] = useState();
  const [gridMode, setGridMode] = useState(() =>
    Boolean(localStorage.getItem("grid-mode"))
  );
  const [crosswordIdToDelete, setCrosswordIdToDelete] = useState();
  const [showDeletingSpinner, setShowDeletingSpinner] = useState(false);
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

    let crosswordType;
    if (currentTab === Tabs.Cryptic) crosswordType = CrosswordTypes.Cryptic;
    if (currentTab === Tabs.Quick) crosswordType = CrosswordTypes.Quick;

    setCrosswords((prevCrosswords) => (prevCrosswords ? [] : prevCrosswords));

    return listenForCrosswordChanges(onNext, crosswordType);
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

  const onConfirmDelete = async () => {
    try {
      setShowDeletingSpinner(true);
      console.log("crosswordIdToDelete:", crosswordIdToDelete);
      const deleteCrosswordResult = await deleteCrossword({
        id: crosswordIdToDelete,
      });
      console.log("deleteCrosswordResult:", deleteCrosswordResult);
    } catch (error) {
      // TODO: show error toast
    } finally {
      setShowDeletingSpinner(false);
    }
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
          <Tab label="Cryptic" value={Tabs.Cryptic} />
          <Tab label="Quick" value={Tabs.Quick} />
          <Tab label="All" value={Tabs.All} />
        </TabList>
        <TabPanel value={Tabs.Cryptic} sx={{ px: 0 }}>
          <CrosswordLayoutType
            crosswords={crosswords}
            isAdmin={isAdmin}
            onView={onView}
            onDelete={onDelete}
          />
        </TabPanel>
        <TabPanel value={Tabs.Quick} sx={{ px: 0 }}>
          <CrosswordLayoutType
            crosswords={crosswords}
            isAdmin={isAdmin}
            onView={onView}
            onDelete={onDelete}
          />
        </TabPanel>
        <TabPanel value={Tabs.All} sx={{ px: 0 }}>
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
      {showDeletingSpinner && <FullPageSpinner />}
    </>
  );
};
