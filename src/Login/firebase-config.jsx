// firebase-config.js
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCVFiOCEQTZ2mYP0OPC4CU2gyj6ZkZ-z7E",
  authDomain: "lifegrid-adfce.firebaseapp.com",
  projectId: "lifegrid-adfce",
  storageBucket: "lifegrid-adfce.firebasestorage.app",
  messagingSenderId: "1088112673316",
  appId: "1:1088112673316:web:0b6eb48591daf014184eb1",
  measurementId: "G-BVTLZ9DBES"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Explicitly export auth
export default { auth, analytics };  // Add this line