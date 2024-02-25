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

import { AnswerHistoryPanel } from "./components";
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
      const maybeDeleted = answer.deleted ? { deleted: true } : undefined;

      await addAnswer(crossword, {
        clueNumber: answer.clueNumber,
        clueType: answer.clueType,
        answer: answer.answer,
        ...maybeDeleted,
        userId: user.userId,
        username: user.username,
        displayName: user.displayName,
      });
    };
    const saveAnswers = async () => {
      for (const answer of unsavedCompleteAnswers) {
        saveAnswer(answer);
      }
      for (const deletedAnswer of deletedAnswers) {
        const answerHasBeenOverwritten = unsavedCompleteAnswers.some(
          (uca) =>
            uca.clueNumber === deletedAnswer.clueNumber &&
            uca.clueType === deletedAnswer.clueType
        );
        // Only save the deletion if we haven't overwritten the answer.
        if (!answerHasBeenOverwritten) {
          saveAnswer(deletedAnswer);
        }
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

  const onViewAnswerHistory = () => {
    openDrawer();
  };

  const onClearSelectedClue = () => {
    crosswordState.clearEnteredLettersForSelectedClue();
  };

  const onUnlockAnswer = () => {
    crosswordState.unlockAnswer(currentAnswer);
  };

  const onDeleteAnswer = () => {
    crosswordState.deleteAnswer(currentAnswer);
  };

  const currentAnswer = crosswordState.selectedClue
    ? crosswordState.answers.find(
        (answer) =>
          answer.clueNumber === crosswordState.selectedClue.clueNumber &&
          answer.clueType === crosswordState.selectedClue.clueType
      )
    : undefined;

  const { unsavedCompleteAnswers, deletedAnswers } =
    crosswordState.getUnsavedChanges();
  const unsavedChangesExist =
    unsavedCompleteAnswers.length > 0 || deletedAnswers.length > 0;

  const canSaveAnswers = isSignedIn && unsavedChangesExist;
  const canViewAnswerHistory = Boolean(currentAnswer);
  const canClearSelectedClue = crosswordState.selectedClueHasEnteredLetters();
  const canUnlockAnswer = Boolean(currentAnswer);
  const canDeleteAnswer = Boolean(currentAnswer);

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
        onViewAnswerHistory={onViewAnswerHistory}
        onClearSelectedClue={onClearSelectedClue}
        onUnlockAnswer={onUnlockAnswer}
        onDeleteAnswer={onDeleteAnswer}
        canSaveAnswers={canSaveAnswers}
        canViewAnswerHistory={canViewAnswerHistory}
        canClearSelectedClue={canClearSelectedClue}
        canUnlockAnswer={canUnlockAnswer}
        canDeleteAnswer={canDeleteAnswer}
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
          <AnswerHistoryPanel
            clue={crosswordState.selectedClue}
            allAnswers={answers}
            onClose={closeDrawer}
          />
        )}
      </Drawer>
    </>
  );
};
