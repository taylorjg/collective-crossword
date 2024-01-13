import { initializeApp } from "firebase/app";
// import { getAuth, GithubAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
// import { auth } from "firebaseui";

const firebaseConfig = {
  apiKey: "AIzaSyAOV1FlYTXlvlsKFI5Pngq84bdUsvZPtE0",
  authDomain: "collective-crossword.firebaseapp.com",
  projectId: "collective-crossword",
  storageBucket: "collective-crossword.appspot.com",
  messagingSenderId: "1001354859647",
  appId: "1:1001354859647:web:aa2e0a38c87533f8f7db4a",
  measurementId: "G-BV82V50TSY",
};

if (window.location.hostname !== "collective-crossword.web.app") {
  const apiKeyForDev = localStorage.getItem("API_KEY_FOR_DEV");
  if (apiKeyForDev) {
    firebaseConfig.apiKey = apiKeyForDev;
    console.log("Using API_KEY_FOR_DEV for firebaseConfig.apiKey");
  }
}

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const db = getFirestore(app);

export const addCrossword = async (crossword) => {
  const collectionRef = collection(db, "crosswords");
  const data = {
    timestamp: serverTimestamp(),
    ...crossword,
  };
  return addDoc(collectionRef, data);
};

export const getCrosswordById = async (id) => {
  const docRef = doc(db, "crosswords", id);
  return getDoc(docRef);
};

export const getExistingCrosswordIdByTitle = async (title) => {
  const collectionRef = collection(db, "crosswords");
  const q = query(collectionRef, where("title", "==", title));
  const querySnapshot = await getDocs(q);
  const ids = [];
  querySnapshot.forEach((doc) => {
    ids.push(doc.id);
  });
  return ids.length > 0 ? ids[0] : undefined;
};

export const deleteCrossword = async (id) => {
  const docRef = doc(db, "crosswords", id);
  return deleteDoc(docRef);
};

export const listenForCrosswordChanges = (onNext) => {
  const collectionRef = collection(db, "crosswords");
  const q = query(collectionRef, orderBy("timestamp"));
  return onSnapshot(q, onNext);
};

const functions = getFunctions(app);

export const getCrypticCrossword = httpsCallable(
  functions,
  "getCrypticCrossword"
);

export const getPrizeCryptic = httpsCallable(functions, "getPrizeCryptic");

// const myFirebaseAuth = getAuth();

// onAuthStateChanged(myFirebaseAuth, (...args) => {
//   console.log("[onAuthStateChanged callback]", args);
// });

// myFirebaseAuth.authStateReady().then(() => {
//   if (myFirebaseAuth.currentUser) {
//     const { displayName, email, uid } = myFirebaseAuth.currentUser;
//     console.log({ displayName, email, uid });
//   }
// });

// const ui = new auth.AuthUI(myFirebaseAuth);

// setTimeout(() => {
//   ui.start("#firebaseui-auth-container", {
//     signInOptions: [GithubAuthProvider.PROVIDER_ID],
//     signInFlow: "popup",
//     callbacks: {
//       signInSuccessWithAuthResult: (...args) => {
//         console.log("[signInSuccessWithAuthResult callback]", args);
//         return false;
//       },
//       uiShown: (...args) => {
//         console.log("[uiShown callback]", args);
//       },
//     },
//   });
// }, 1000);
