import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB3qLkvx-bE0IRRJLx9ptmYU-mHTuQq5yc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tushar-portfolio.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tushar-portfolio",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tushar-portfolio.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "951737944490",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:951737944490:web:f2a055e3027c4dc397c3d3",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://tushar-portfolio-default-rtdb.firebaseio.com"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);
export const storage = getStorage(app);
