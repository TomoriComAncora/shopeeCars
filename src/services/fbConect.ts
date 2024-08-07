import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyACkV29QXZJOpX43g2fhG2NwPGvSBKD-uE",
  authDomain: "progweb-e5b15.firebaseapp.com",
  projectId: "progweb-e5b15",
  storageBucket: "progweb-e5b15.appspot.com",
  messagingSenderId: "16677754735",
  appId: "1:16677754735:web:5af2c366c359ae5e7ffa9a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
