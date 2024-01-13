import { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GithubAuthProvider,
} from "firebase/auth";
import { Button } from "@mui/material";

const SIGNED_IN_STATE_DONT_KNOW = 0;
const SIGNED_IN_STATE_YES = 1;
const SIGNED_IN_STATE_NO = 2;

export const Auth = () => {
  const [signedInState, setSignedInState] = useState(SIGNED_IN_STATE_DONT_KNOW);
  const [user, setUser] = useState();

  console.log({ user });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (userArg) => {
      console.log("[Auth#onAuthStateChanged callback]", userArg);
      if (userArg) {
        setUser(userArg);
        setSignedInState(SIGNED_IN_STATE_YES);
      } else {
        setSignedInState(SIGNED_IN_STATE_NO);
      }

      return unsubscribe;
    });
  }, []);

  const onSignIn = async () => {
    try {
      const auth = getAuth();
      const provider = new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      console.log("[Auth#onSignIn]", userCredential);
      console.log("[Auth#onSignIn]", {
        screenName: userCredential._tokenResponse.screenName,
      });
    } catch (error) {
      console.log("[Auth#onSignIn]", error);
    }
  };

  const onSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (error) {
      console.log("[Auth#onSignOut]", error);
    }
  };

  if (signedInState === SIGNED_IN_STATE_DONT_KNOW) return null;

  if (signedInState === SIGNED_IN_STATE_YES) {
    return <Button onClick={onSignOut}>Sign Out</Button>;
  }

  if (signedInState === SIGNED_IN_STATE_NO) {
    return <Button onClick={onSignIn}>Sign In</Button>;
  }
};
