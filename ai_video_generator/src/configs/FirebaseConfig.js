// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:  process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-video-generator-77f39.firebaseapp.com",
  projectId: "ai-video-generator-77f39",
  storageBucket: "ai-video-generator-77f39.firebasestorage.app",
  messagingSenderId: "234355271048",
  appId: "1:234355271048:web:978caf46d7daba4de3863d",
  measurementId: "G-8YQ4VBYCH1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const storage= getStorage(app)