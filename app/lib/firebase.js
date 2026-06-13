import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB3qLkvx-bE0IRRJLx9ptmYU-mHTuQq5yc",
  authDomain: "sahil-portfolio-cf061.firebaseapp.com",
  projectId: "sahil-portfolio-cf061",
  storageBucket: "sahil-portfolio-cf061.firebasestorage.app",
  messagingSenderId: "951737944490",
  appId: "1:951737944490:web:f2a055e3027c4dc397c3d3",
  measurementId: "G-FVC3D4SB8R",
  databaseURL: "https://sahil-portfolio-cf061-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
