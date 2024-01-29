import { useState } from "react";
import { Grid, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { addCrossword } from "@app/firebase";
import { useToast } from "@app/contexts";

import { PrivateEyeTab, TheTelegraphTab } from "./tabs";

export const AdminPage = () => {
  const [currentTab, setCurrentTab] = useState("1");
  const { showSuccess, showError } = useToast();

  const onChangeTab = (_, newValue) => {
    setCurrentTab(newValue);
  };

  const onAddCrossword = async (crossword) => {
    try {
      const crosswordRef = await addCrossword(crossword);
      showSuccess("Successfully added crossword");
      return crosswordRef;
    } catch (error) {
      showError("Failed to add crossword", error.message);
    }
  };

  return (
    <Grid container>
      <Grid item xs={12} md={6} sx={{ mx: { xs: 2, md: "auto" } }}>
        <TabContext value={currentTab}>
          <TabList onChange={onChangeTab} variant="fullWidth">
            <Tab label="Private Eye" value="1" />
            <Tab label="The Telegraph" value="2" />
          </TabList>
          <TabPanel value="1" sx={{ px: 0 }}>
            <PrivateEyeTab onAddCrossword={onAddCrossword} />
          </TabPanel>
          <TabPanel value="2" sx={{ px: 0 }}>
            <TheTelegraphTab onAddCrossword={onAddCrossword} />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
};
