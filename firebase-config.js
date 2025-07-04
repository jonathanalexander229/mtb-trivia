// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnGrb3rmjzPglId6bBTQXis6UiPWMyxc4",
  authDomain: "mtb-trivia.firebaseapp.com",
  projectId: "mtb-trivia",
  storageBucket: "mtb-trivia.firebasestorage.app",
  messagingSenderId: "892514249212",
  appId: "1:892514249212:web:97405f8847d1547172aa79",
  measurementId: "G-ZHVMX5TPES"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);