import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

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

export const addAnswer = async (
  crossword,
  clueNumber,
  clueType,
  answer,
  userId,
  username,
  displayName
) => {
  const subcollectionRef = collection(
    db,
    "crosswords",
    crossword.id,
    "answers"
  );
  const data = {
    clueNumber,
    clueType,
    answer,
    userId,
    username,
    displayName,
    timestamp: serverTimestamp(),
  };
  return addDoc(subcollectionRef, data);
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

export const listenForCrosswordChanges = (onNext, crosswordType) => {
  const collectionRef = collection(db, "crosswords");
  const q = crosswordType
    ? query(
        collectionRef,
        where("crosswordType", "==", crosswordType),
        orderBy("timestamp")
      )
    : query(collectionRef, orderBy("timestamp"));
  return onSnapshot(q, onNext);
};

export const getCrosswords = async (crosswordType) => {
  const collectionRef = collection(db, "crosswords");
  const q = crosswordType
    ? query(
        collectionRef,
        where("crosswordType", "==", crosswordType),
        orderBy("timestamp")
      )
    : query(collectionRef, orderBy("timestamp"));
  return getDocs(q);
};

export const listenForCrosswordAnswers = (crosswordId, onNext) => {
  const collectionRef = collection(db, "crosswords", crosswordId, "answers");
  return onSnapshot(collectionRef, onNext);
};

const functions = getFunctions(app);

export const getQuickCrossword = httpsCallable(functions, "getQuickCrossword");

export const getCrypticCrossword = httpsCallable(
  functions,
  "getCrypticCrossword"
);

export const getToughieCrossword = httpsCallable(
  functions,
  "getToughieCrossword"
);

export const getPrizeCryptic = httpsCallable(functions, "getPrizeCryptic");

export const getPrizeToughie = httpsCallable(functions, "getPrizeToughie");

export const deleteCrossword = httpsCallable(functions, "deleteCrossword");
