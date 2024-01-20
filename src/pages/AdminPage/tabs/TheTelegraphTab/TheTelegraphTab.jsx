import PropTypes from "prop-types";

import {
  useTheDailyTelegraphCrypticCrosswordById,
  useTheDailyTelegraphPrizeCrypticById,
  useTheSundayTelegraphPrizeCrypticById,
} from "@app/hooks";

import { ImportCrossword } from "./ImportCrossword";

export const TheTelegraphTab = ({ onAddCrossword }) => {
  return (
    <>
      <ImportCrossword
        onAddCrossword={onAddCrossword}
        useCrossword={useTheDailyTelegraphCrypticCrosswordById}
        label="The Daily Telegraph Cryptic Crossword"
        exampleId={31769}
      />

      <ImportCrossword
        onAddCrossword={onAddCrossword}
        useCrossword={useTheDailyTelegraphPrizeCrypticById}
        label="The Daily Telegraph Prize Cryptic"
        exampleId={31711}
      />

      <ImportCrossword
        onAddCrossword={onAddCrossword}
        useCrossword={useTheSundayTelegraphPrizeCrypticById}
        label="The Sunday Telegraph Prize Cryptic"
        exampleId={31712}
      />
    </>
  );
};

TheTelegraphTab.propTypes = {
  onAddCrossword: PropTypes.func.isRequired,
};
