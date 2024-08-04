// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeLsSej6JAFhVi5UcpRIPB9El-qVMur5A",
  authDomain: "pantry-tracker-32476.firebaseapp.com",
  projectId: "pantry-tracker-32476",
  storageBucket: "pantry-tracker-32476.appspot.com",
  messagingSenderId: "860103019055",
  appId: "1:860103019055:web:64605b011e8365e55094da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore= getFirestore(app);
//export const firebaseApp = initializeApp(firebaseConfig);
export {app, firestore};