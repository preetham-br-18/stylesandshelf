import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCpQTAcYVh7QnlAu-IKQlmPi55hBSGwMBE",
  authDomain: "styleandshelf.firebaseapp.com",
  projectId: "styleandshelf",
  storageBucket: "styleandshelf.firebasestorage.app",
  messagingSenderId: "930832557087",
  appId: "1:930832557087:web:936dccc152da37b4d3e12a",
  measurementId: "G-GKPKECCFVB"
};

let appInstance = null;
let authInstance: ReturnType<typeof getAuth> | null = null;
let dbInstance: ReturnType<typeof getFirestore> | null = null;

try {
  appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  authInstance = getAuth(appInstance);
  dbInstance = getFirestore(appInstance);
} catch (error) {
  console.warn('Firebase initialization notice:', error);
}

export const app = appInstance;
export const auth = authInstance;
export const db = dbInstance;

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized.');
  }
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}

export async function logoutUser(): Promise<void> {
  if (auth) {
    await signOut(auth);
  }
}

