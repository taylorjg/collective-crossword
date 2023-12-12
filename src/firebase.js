import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
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
  const docRef = await addDoc(collection(db, "crosswords"), {
    timestamp: serverTimestamp(),
    ...crossword,
  });
  console.log("Document written with ID: ", docRef.id);
};

const functions = getFunctions(app);

export const getCrypticCrossword = httpsCallable(
  functions,
  "getCrypticCrossword"
);

export const getPrizeCryptic = httpsCallable(functions, "getPrizeCryptic");
