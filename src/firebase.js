// Import Firebase services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database"; // Firebase Realtime Database import

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAsUajHI0NcZhsZF_zfaAYblWmQ2DXwZME",
  authDomain: "resoluteai-87930.firebaseapp.com",
  projectId: "resoluteai-87930",
  storageBucket: "resoluteai-87930.appspot.com",
  messagingSenderId: "130538378299",
  databaseURL: "https://resoluteai-87930-default-rtdb.firebaseio.com/", // ✅ Corrected database URL
  appId: "1:130538378299:web:a5376f379257a1d3c4781e",
  measurementId: "G-WZHBXRL5XQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); // Initialize app first

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app); // Ensure the database is initialized properly

// Export Firebase services
export { auth, db, storage, database };
