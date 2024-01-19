import { useState } from "react";
import { Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { addCrossword } from "@app/firebase";
import { useToast } from "@app/contexts";

import { PrivateEyeTab, TheTelegraphTab } from "./tabs";

export const AdminPage = () => {
  const [value, setValue] = useState("1");
  const { showSuccess, showError } = useToast();

  const onChangeTab = (_, newValue) => {
    setValue(newValue);
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
    <TabContext value={value}>
      <TabList onChange={onChangeTab}>
        <Tab label="Private Eye" value="1" />
        <Tab label="The Telegraph" value="2" />
      </TabList>
      <TabPanel value="1">
        <PrivateEyeTab onAddCrossword={onAddCrossword} />
      </TabPanel>
      <TabPanel value="2">
        <TheTelegraphTab onAddCrossword={onAddCrossword} />
      </TabPanel>
    </TabContext>
  );
};
