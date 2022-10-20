import create from "zustand";
import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getDatabase,
  connectDatabaseEmulator,
  Database,
} from "firebase/database";
import {
  Functions,
  getFunctions,
  connectFunctionsEmulator,
} from "firebase/functions";
import { getFirebaseConfig } from "../config/firebase";

export type FirebaseState = {
  db: Database;
  functions: Functions;
};

export const useFirebaseState = create<FirebaseState>(() => {
  const firebaseConfig = getFirebaseConfig();
  initializeApp(firebaseConfig);

  const db = getDatabase();
  const functions = getFunctions();
  if (import.meta.env.MODE === "emulator") {
    // Point to the RTDB emulator running on localhost.
    connectDatabaseEmulator(db, "localhost", 9000);
    connectFunctionsEmulator(functions, "localhost", 5001);
  }

  return { db, functions };
});
