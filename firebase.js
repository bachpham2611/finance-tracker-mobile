// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5e1nxrZ6o3DNYs1YsUJy6HBRqLQRWnuI",
  authDomain: "finance-tracker-2025-859d5.firebaseapp.com",
  databaseURL: "https://finance-tracker-2025-859d5-default-rtdb.firebaseio.com",
  projectId: "finance-tracker-2025-859d5",
  storageBucket: "finance-tracker-2025-859d5.firebasestorage.app",
  messagingSenderId: "39902818239",
  appId: "1:39902818239:web:bfb199e4eb0e80b98b7b0a",
  measurementId: "G-025TB5F85X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;