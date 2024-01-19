import PropTypes from "prop-types";

import {
  useTheDailyTelegraphCrypticCrosswordById,
  useTheDailyTelegraphPrizeCrypticById,
  useTheSundayTelegraphPrizeCrypticById,
} from "@app/hooks";

import { Crossword2 } from "../components";

export const TheTelegraphTab = ({ onAddCrossword }) => {
  return (
    <>
      <Crossword2
        onAddCrossword={onAddCrossword}
        useCrossword={useTheDailyTelegraphCrypticCrosswordById}
        label="The Daily Telegraph Cryptic Crossword"
        exampleId={31769}
      />

      <Crossword2
        onAddCrossword={onAddCrossword}
        useCrossword={useTheDailyTelegraphPrizeCrypticById}
        label="The Daily Telegraph Prize Cryptic"
        exampleId={31711}
      />

      <Crossword2
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
