import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Validate config
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId;

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
  console.error('Please set all VITE_FIREBASE_* environment variables in Vercel!');

  // Throw error to show error boundary
  throw new Error('Firebase configuration is incomplete. Check environment variables in Vercel dashboard.');
}

console.log('✅ Firebase config loaded successfully');

// Initialize Firebase
let app, auth, db;

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
  throw error;
}

export { auth, db };
export default app;
