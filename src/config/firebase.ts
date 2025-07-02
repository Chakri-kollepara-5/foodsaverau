import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDH8o7rrgaJ5jdwkbwez-shDiifzeWquuU",
  authDomain: "food-saver-2524b.firebaseapp.com",
  projectId: "food-saver-2524b",
  storageBucket: "food-saver-2524b.firebasestorage.app",
  messagingSenderId: "378105291279",
  appId: "1:378105291279:web:ca546945e6e4f31b72f97a",
  measurementId: "G-PRN2PFP2E9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics
let analytics;
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.log('Analytics not available:', error);
}
export { analytics };

// Enable network for Firestore
enableNetwork(db).catch((err) => {
  console.log("Network already enabled or failed:", err.message);
});

export default app;