import { useEffect, useState } from "react";
import {
  getAuth,
  getAdditionalUserInfo,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GithubAuthProvider,
} from "firebase/auth";
import { Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { db } from "@app/firebase";

import { useUser } from "@app/contexts/user";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SIGNED_IN_STATE_DONT_KNOW = 0;
const SIGNED_IN_STATE_YES = 1;
const SIGNED_IN_STATE_NO = 2;

export const Auth = () => {
  const [signedInState, setSignedInState] = useState(SIGNED_IN_STATE_DONT_KNOW);

  const { setUser } = useUser();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (userArg) => {
      if (userArg) {
        console.log("[Auth#onAuthStateChanged callback]", {
          uid: userArg.uid,
          currentUser: Boolean(auth.currentUser),
        });

        const docRef = doc(db, "users", userArg.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const user = docSnap.data();
          console.log("[Auth#onAuthStateChanged callback]", { user });
          setUser(user);
        }

        setSignedInState(SIGNED_IN_STATE_YES);
      } else {
        console.log("[Auth#onAuthStateChanged callback]", { userArg });
        setSignedInState(SIGNED_IN_STATE_NO);
      }

      return unsubscribe;
    });
  }, [setUser]);

  const onSignIn = async () => {
    try {
      const auth = getAuth();
      const provider = new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const additionalUserInfo = getAdditionalUserInfo(userCredential);
      console.log("[Auth#onSignIn]", {
        isNewUser: additionalUserInfo.isNewUser,
      });
      if (additionalUserInfo.isNewUser) {
        const user = {
          displayName: userCredential.user.displayName,
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL,
          username: additionalUserInfo.username,
          isAdmin: false,
        };
        console.log("[Auth#onSignIn]", { user });
        const docRef = doc(db, "users", userCredential.user.uid);
        await setDoc(docRef, user);
        setUser(user);
      }
    } catch (error) {
      console.log("[Auth#onSignIn]", error);
    }
  };

  const onSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setUser();
    } catch (error) {
      console.log("[Auth#onSignOut]", error);
    }
  };

  if (signedInState === SIGNED_IN_STATE_DONT_KNOW) return null;

  if (signedInState === SIGNED_IN_STATE_YES) {
    return <Button onClick={onSignOut}>Sign Out</Button>;
  }

  if (signedInState === SIGNED_IN_STATE_NO) {
    return (
      <Button onClick={onSignIn}>
        Sign In&nbsp;
        <GitHubIcon />
      </Button>
    );
  }
};
