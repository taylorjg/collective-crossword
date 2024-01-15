import { useEffect, useState } from "react";
import {
  getAuth,
  getAdditionalUserInfo,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GithubAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "@app/firebase";
import { useUser } from "@app/contexts";

export const useAuthState = () => {
  const [isCheckingAuthState, setIsCheckingAuthState] = useState(true);
  const { user, setUser } = useUser();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (userArg) => {
      console.log("[useAuthState onAuthStateChanged callback]", { userArg });
      if (userArg) {
        const docRef = doc(db, "users", userArg.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const user = docSnap.data();
          const userEnhanced = {
            ...user,
            creationTime: userArg.metadata.creationTime,
            lastSignInTime: userArg.metadata.lastSignInTime,
          };
          console.log("[useAuthState onAuthStateChanged callback]", {
            userEnhanced,
          });
          setUser(userEnhanced);
        }
      }
      setIsCheckingAuthState(false);
    });

    return unsubscribe;
  }, [setUser]);

  const onSignIn = async () => {
    try {
      const auth = getAuth();
      const provider = new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const additionalUserInfo = getAdditionalUserInfo(userCredential);
      console.log("[useAuthState#onSignIn]", {
        isNewUser: additionalUserInfo.isNewUser,
        userCredential,
      });
      if (additionalUserInfo.isNewUser) {
        const user = {
          displayName: userCredential.user.displayName,
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL,
          username: additionalUserInfo.username,
          isAdmin: false,
        };
        const docRef = doc(db, "users", userCredential.user.uid);
        await setDoc(docRef, user);
        const userEnhanced = {
          ...user,
          creationTime: userCredential.user.metadata.creationTime,
          lastSignInTime: userCredential.user.metadata.lastSignInTime,
        };
        console.log("[useAuthState#onSignIn]", { userEnhanced });
        setUser(userEnhanced);
      }
    } catch (error) {
      console.log("[useAuthState#onSignIn]", error);
    }
  };

  const onSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setUser();
    } catch (error) {
      console.log("[useAuthState#onSignOut]", error);
    }
  };

  return {
    isCheckingAuthState,
    user,
    onSignIn,
    onSignOut,
  };
};
