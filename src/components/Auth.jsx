import { useEffect, useState } from "react";
import {
  getAuth,
  getAdditionalUserInfo,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GithubAuthProvider,
} from "firebase/auth";
import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "@app/firebase";
import { useUser } from "@app/contexts";
import { UserDetailsModal2 } from "./UserDetailsModal2";

const SIGNED_IN_STATE_DONT_KNOW = 0;
const SIGNED_IN_STATE_YES = 1;
const SIGNED_IN_STATE_NO = 2;

export const Auth = () => {
  const [signedInState, setSignedInState] = useState(SIGNED_IN_STATE_DONT_KNOW);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);

  const { user, setUser } = useUser();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (userArg) => {
      if (userArg) {
        console.log("[Auth#onAuthStateChanged callback]", {
          uid: userArg.uid,
          currentUser: Boolean(auth.currentUser),
          userArg,
        });

        const docRef = doc(db, "users", userArg.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const user = docSnap.data();
          const userEnhanced = {
            ...user,
            creationTime: userArg.metadata.creationTime,
            lastSignInTime: userArg.metadata.lastSignInTime,
          };
          console.log("[Auth#onAuthStateChanged callback]", { userEnhanced });
          setUser(userEnhanced);
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
        console.log("[Auth#onSignIn]", { userEnhanced });
        setUser(userEnhanced);
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

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onUserDetailsMenuItem = () => {
    setUserDetailsModalOpen(true);
    handleCloseUserMenu();
  };

  const onSignOutMenuItem = () => {
    onSignOut();
    handleCloseUserMenu();
  };

  if (signedInState === SIGNED_IN_STATE_YES) {
    return (
      <>
        <IconButton onClick={handleOpenUserMenu}>
          <Avatar alt={user.username} src={user.photoURL} />
        </IconButton>
        <Menu
          sx={{ mt: "45px" }}
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem onClick={onUserDetailsMenuItem}>
            <Typography textAlign="center">User Details...</Typography>
          </MenuItem>
          <MenuItem onClick={onSignOutMenuItem}>
            <Typography textAlign="center">Sign Out</Typography>
          </MenuItem>
        </Menu>
        <UserDetailsModal2
          open={userDetailsModalOpen}
          user={user}
          onClose={() => setUserDetailsModalOpen(false)}
        />
      </>
    );
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
