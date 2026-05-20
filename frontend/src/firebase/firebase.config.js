import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDERID,
  appId: import.meta.env.VITE_APP_ID
};

let app;
let auth = null;
let provider = null;

try {
  if (!firebaseConfig.apiKey) {
    console.warn("⚠️ Firebase configuration missing! Google authentication will not be functional. Please add your Firebase credentials to a frontend/.env file.");
  } else {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
  }
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
}

export { auth, provider };