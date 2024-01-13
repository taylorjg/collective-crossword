import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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

  const onSignIn = () => {
    //
  };

  const onSignOut = () => {
    //
  };

  if (signedInState === SIGNED_IN_STATE_DONT_KNOW) return null;

  if (signedInState === SIGNED_IN_STATE_YES) {
    return <Button onClick={onSignOut}>Sign Out</Button>;
  }

  if (signedInState === SIGNED_IN_STATE_NO) {
    return <Button onClick={onSignIn}>Sign In</Button>;
  }
};
