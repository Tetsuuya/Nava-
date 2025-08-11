// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfcdSVTP7Mu7CAZlDAAe04glVvv9IAcgc",
  authDomain: "nava-ed64b.firebaseapp.com",
  projectId: "nava-ed64b",
  storageBucket: "nava-ed64b.firebasestorage.app",
  messagingSenderId: "19804904138",
  appId: "1:19804904138:web:0452c21e699c117e7e3233",
  measurementId: "G-27HCYV1M3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, app, db };