import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyATOabCWWF2ZrKJ8FEVRwOvLThbA7DFszs",
  authDomain: "://firebaseapp.com",
  projectId: "mythics-forge-web",
  storageBucket: "mythics-forge-web.firebasestorage.app",
  messagingSenderId: "201188426049",
  appId: "1:201188426049:web:6eecbfb7b3a8c2be3621c0",
  measurementId: "G-0VGV4HQBFX"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// This lets your other files use Firebase
export { app, analytics };
