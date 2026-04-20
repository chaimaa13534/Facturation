import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAnT37kpOLaqWSTFRqstsLvscqdIhfIhBQ",
  authDomain: "facture-87133.firebaseapp.com",
  databaseURL: "https://facture-87133-default-rtdb.firebaseio.com",
  projectId: "facture-87133",
  storageBucket: "facture-87133.firebasestorage.app",
  messagingSenderId: "959026021964",
  appId: "1:959026021964:web:516c65d9e995ca4640d6e9"
};

// Initialisation
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);