import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase configuration
 *
 * IMPORTANT: Replace these values with your actual Firebase project credentials
 * Get these from Firebase Console > Project Settings > General > Your apps
 */
const firebaseConfig = {
  apiKey: "YOUR-API-KEY",
  authDomain: "bakugan-focus.firebaseapp.com",
  projectId: "bakugan-focus",
  storageBucket: "bakugan-focus.firebasestorage.app",
  messagingSenderId: "YOUR-SENDER-ID",
  appId: "YOUR-APP-ID"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);
