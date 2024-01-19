// import { useNavigate } from "react-router-dom";

import { addCrossword } from "@app/firebase";
// import { useAuth, useToast } from "@app/contexts";
import { useToast } from "@app/contexts";
// import { PathConstants } from "@app/constants";
import {
  usePrivateEyeCurrentCrossword,
  useTheDailyTelegraphCrypticCrosswordById,
  useTheDailyTelegraphPrizeCrypticById,
  useTheSundayTelegraphPrizeCrypticById,
} from "@app/hooks";

import { Crossword, Crossword2 } from "./components";

export const AdminPage = () => {
  // const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  // const navigate = useNavigate();
  const privateEyeCrosswordResponse = usePrivateEyeCurrentCrossword();

  // if (!user) {
  //   const options = {
  //     state: {
  //       protectedRouteName: "Admin",
  //       protectedRoute: PathConstants.Admin,
  //     },
  //   };
  //   navigate(PathConstants.SignIn, options);
  //   return;
  // }

  // if (!user.isAdmin) {
  //   const options = {
  //     state: {
  //       protectedRouteName: "Admin",
  //     },
  //   };
  //   navigate(PathConstants.NoAccess, options);
  // }

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
    <>
      <Crossword
        crosswordResponse={privateEyeCrosswordResponse}
        onAddCrossword={onAddCrossword}
      />

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
