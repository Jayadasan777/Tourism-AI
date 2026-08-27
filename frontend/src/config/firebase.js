import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from environment variables (with production fallbacks)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDb0qcMPM5W-cttr3ZHAwHp9RPwtPf9Tmc',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'smart-tour-ai-b20ba.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'smart-tour-ai-b20ba',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'smart-tour-ai-b20ba.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '793193364173',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:793193364173:web:6c1280221bea56a8e74784'
};

// Validate config
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId;

// Initialize Firebase (or return null if config invalid)
let app = null;
let auth = null;
let db = null;

if (!isConfigValid) {
  console.error('❌ Firebase config is missing or incomplete!');
  console.error('Current config:', {
    apiKey: firebaseConfig.apiKey ? '✓' : '✗ MISSING',
    authDomain: firebaseConfig.authDomain ? '✓' : '✗ MISSING',
    projectId: firebaseConfig.projectId ? '✓' : '✗ MISSING',
    storageBucket: firebaseConfig.storageBucket ? '✓' : '✗ MISSING',
    messagingSenderId: firebaseConfig.messagingSenderId ? '✓' : '✗ MISSING',
    appId: firebaseConfig.appId ? '✓' : '✗ MISSING',
  });
  console.error('⚠️ Please set all VITE_FIREBASE_* environment variables in Vercel!');
  console.error('⚠️ Firebase will not work until variables are set.');

  // DO NOT THROW - just export null to allow module to load
} else {
  console.log('✅ Firebase config loaded successfully');

  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Set auth persistence to LOCAL (keeps user logged in after page refresh)
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('Failed to set auth persistence:', error);
    });

    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    console.error('Error details:', error.message);
    // DO NOT THROW - just export null
  }
}

// Always export (even if null) to prevent module crash
export { auth, db };
export default app;
