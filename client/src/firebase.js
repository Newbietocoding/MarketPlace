// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "market-4b524.firebaseapp.com",
  projectId: "market-4b524",
  storageBucket: "market-4b524.appspot.com",
  messagingSenderId: "956987661921",
  appId: "1:956987661921:web:3fc24204d4bf490ea01420"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);