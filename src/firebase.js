import { initializeApp } from "firebase/app";
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

const firebaseConfig = {
  apiKey: "AIzaSyAOV1FlYTXlvlsKFI5Pngq84bdUsvZPtE0",
  authDomain: "collective-crossword.firebaseapp.com",
  projectId: "collective-crossword",
  storageBucket: "collective-crossword.appspot.com",
  messagingSenderId: "1001354859647",
  appId: "1:1001354859647:web:aa2e0a38c87533f8f7db4a",
  measurementId: "G-BV82V50TSY",
};

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

export const doesCrosswordExistByTitle = async (title) => {
  const collectionRef = collection(db, "crosswords");
  const q = query(collectionRef, where("title", "==", title));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size > 0;
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
