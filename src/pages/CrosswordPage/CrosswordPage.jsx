import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Drawer, useMediaQuery } from "@mui/material";

import {
  getCrosswordById,
  listenForCrosswordAnswers,
  addAnswer,
} from "@app/firebase";
import { FullPageMessage } from "@app/components";
import { enhance } from "@app/transforms";
import { useAuth, useToast } from "@app/contexts";
import { minDuration } from "@app/utils";

import { AnswerDetailsPanel } from "./components/AnswerDetailsPanel";
import { SmallScreen, UnsupportedViewport } from "./layouts/small-screen";
import { LargeScreen } from "./layouts/large-screen/LargeScreen";
import { useCrosswordState } from "./use-crossword-state";

export const CrosswordPage = () => {
  const [crossword, setCrossword] = useState();
  const [answers, setAnswers] = useState([]);
  const [errorMessage, setErrorMessage] = useState();
  const { user } = useAuth();
  const isSignedIn = Boolean(user);
  const [showSavingSpinner, setShowSavingSpinner] = useState(false);
  const { showError } = useToast();

  const crosswordState = useCrosswordState(crossword, answers, isSignedIn);

  const { id } = useParams();

  const isLargeScreen = useMediaQuery("screen and (min-width: 720px)");
  const isLandscape = useMediaQuery("screen and (orientation:landscape)");

  useEffect(() => {
    const invokeGetCrossword = async () => {
      const docSnap = await getCrosswordById(id);
      if (docSnap.exists()) {
        const crossword = {
          id: docSnap.id,
          ...docSnap.data(),
        };
        const enhancedCrossword = enhance(crossword);
        setCrossword(enhancedCrossword);
      } else {
        setErrorMessage("Failed to load specified crossword");
      }
    };

    invokeGetCrossword();
  }, [id]);

  useEffect(() => {
    const onNext = (querySnapshot) => {
      const localAnswers = [];
      querySnapshot.forEach((doc) => {
        localAnswers.push({ id: doc.id, ...doc.data() });
      });
      setAnswers(localAnswers);
    };

    return listenForCrosswordAnswers(id, onNext);
  }, [id]);

  const onSaveAnswers = async () => {
    if (!user) return;
    const saveAnswer = async (answer) => {
      await addAnswer(
        crossword,
        answer.clueNumber,
        answer.clueType,
        answer.answer,
        user.userId,
        user.username,
        user.displayName
      );
    };
    const saveAnswers = async () => {
      for (const answer of answersReadyForSaving) {
        saveAnswer(answer);
      }
    };
    try {
      setShowSavingSpinner(true);
      await minDuration(saveAnswers(), 1000);
    } catch (error) {
      showError("Failed to save answers", error.message);
    } finally {
      setShowSavingSpinner(false);
    }
  };

  const onViewAnswerDetails = () => {
    openDrawer();
  };

  const onClearSelectedClue = () => {
    crosswordState.clearEnteredLettersForSelectedClue();
  };

  const onUnlockAnswer = () => {
    crosswordState.unlockAnswer(currentAnswer);
  };

  const currentAnswer = crosswordState.selectedClue
    ? crosswordState.answers.find(
        (answer) =>
          answer.clueNumber === crosswordState.selectedClue.clueNumber &&
          answer.clueType === crosswordState.selectedClue.clueType
      )
    : undefined;

  const answersReadyForSaving = crosswordState.getAnswersReadyForSaving();

  const canSaveAnswers = isSignedIn && answersReadyForSaving.length > 0;
  const canViewAnswerDetails = Boolean(currentAnswer);
  const canClearSelectedClue = crosswordState.selectedClueHasEnteredLetters();
  const canUnlockAnswer = Boolean(currentAnswer);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  if (!crossword) return <FullPageMessage message="Fetching crossword..." />;
  if (errorMessage) return <FullPageMessage message={errorMessage} />;
  if (!isLargeScreen && isLandscape) return <UnsupportedViewport />;

  const Layout = isLargeScreen ? LargeScreen : SmallScreen;

  return (
    <>
      <Layout
        crossword={crossword}
        crosswordState={crosswordState}
        onSaveAnswers={onSaveAnswers}
        onViewAnswerDetails={onViewAnswerDetails}
        onClearSelectedClue={onClearSelectedClue}
        onUnlockAnswer={onUnlockAnswer}
        canSaveAnswers={canSaveAnswers}
        canViewAnswerDetails={canViewAnswerDetails}
        canClearSelectedClue={canClearSelectedClue}
        canUnlockAnswer={canUnlockAnswer}
        showSavingSpinner={showSavingSpinner}
      />
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={closeDrawer}
        sx={{
          "& .MuiDrawer-paper": { width: { xs: "100%", sm: "25rem" } },
        }}
      >
        {currentAnswer && (
          <AnswerDetailsPanel
            clue={crosswordState.selectedClue}
            answer={currentAnswer}
            onClose={closeDrawer}
          />
        )}
      </Drawer>
    </>
  );
};
