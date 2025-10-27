// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5e1nxrZ6o3DNYs1YsUJy6HBRqLQRWnuI",  // Public key used for Firebase API requests
  authDomain: "finance-tracker-2025-859d5.firebaseapp.com", // Domain used for authentication redirects
  databaseURL: "https://finance-tracker-2025-859d5-default-rtdb.firebaseio.com",
  projectId: "finance-tracker-2025-859d5",  // Unique identifier for the Firebase project
  storageBucket: "finance-tracker-2025-859d5.firebasestorage.app", // Cloud storage bucket URL
  messagingSenderId: "39902818239", // Unique identifier for Firebase Cloud Messaging
  appId: "1:39902818239:web:bfb199e4eb0e80b98b7b0a",  // Unique identifier for this app instance
  measurementId: "G-025TB5F85X" // Identifier for Google Analytics measurement
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;