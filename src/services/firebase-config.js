// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Importa Firestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbSg4GBQ_IRXPLc2yKNNpHKi4pVjdQa4k",
  authDomain: "kine-8c247.firebaseapp.com",
  projectId: "kine-8c247",
  storageBucket: "kine-8c247.firebasestorage.app",
  messagingSenderId: "1067217434942",
  appId: "1:1067217434942:web:5d198580aa067683e5546f",
  measurementId: "G-DXEG8CR66F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);

export default app;
