import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Initialize Firebase for client-side usage
export const initializeFirebase = () => {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
  };
};

export { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';
export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
