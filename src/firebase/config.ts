import { initializeApp, getApp, getApps, FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig: FirebaseOptions = {
    // THIS IS A PLACEHOLDER.
    // Go to your Firebase project console, find "Project settings" > "General",
    // and under "Your apps", create a new Web app or select an existing one.
    // Then, copy the firebaseConfig object and paste it here.
    apiKey: "AIzaSyDMifaZye74NLSfeqSlHYzfDnbnhNsTCJg",
  authDomain: "url-shortner-69404.firebaseapp.com",
  projectId: "url-shortner-69404",
  storageBucket: "url-shortner-69404.firebasestorage.app",
  messagingSenderId: "1086705164994",
  appId: "1:1086705164994:web:133f006d04437de503d15b"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };
