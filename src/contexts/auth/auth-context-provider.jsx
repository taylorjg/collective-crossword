import { useEffect, useState } from "react";
import PropTypes from "prop-types";
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

import { AuthContext } from "./auth-context";
import { useToast } from "@app/contexts";

export const AuthContextProvider = ({ children }) => {
  const [isCheckingAuthState, setIsCheckingAuthState] = useState(true);
  const [user, setUser] = useState();
  const { showError } = useToast();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (userArg) => {
      console.log("[onAuthStateChanged]", { userArg });
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
          console.log("[onAuthStateChanged]", {
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
      console.log("[AuthContextProvider#onSignIn]", {
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
        console.log("[AuthContextProvider#onSignIn]", { userEnhanced });
        setUser(userEnhanced);
      }
    } catch (error) {
      console.log("[AuthContextProvider#onSignIn]", error);
      showError("An error occurred signing in", error.message);
    }
  };

  const onSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setUser();
    } catch (error) {
      console.log("[AuthContextProvider#onSignOut]", error);
      showError("An error occurred signing out", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isCheckingAuthState, user, onSignIn, onSignOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
