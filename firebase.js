// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATOabCWWF2ZrKJ8FEVRwOvLThbA7DFszs",
  authDomain: "mythics-forge-web.firebaseapp.com",
  projectId: "mythics-forge-web",
  storageBucket: "mythics-forge-web.firebasestorage.app",
  messagingSenderId: "201188426049",
  appId: "1:201188426049:web:38574e6f98d064cc3621c0",
  measurementId: "G-LE39E6V38Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
