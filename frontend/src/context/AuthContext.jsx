import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

const AuthContext = createContext(null);

// Safely import Firebase - wrapped to prevent module crash
let auth = null;
let firebaseError = null;

try {
  // This will throw if Firebase config has issues
  const firebaseModule = require('../config/firebase');
  auth = firebaseModule.auth;
  console.log('✅ Firebase auth loaded');
} catch (error) {
  console.error('❌ Firebase auth import failed:', error);
  firebaseError = error.message;
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth didn't load, stop loading
    if (!auth) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const token = await firebaseUser.getIdToken();
            localStorage.setItem('authToken', token);
          } catch {
            // token fetch failed, user object is still valid
          }
          setUser(firebaseUser);
        } else {
          localStorage.removeItem('authToken');
          setUser(null);
        }
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Auth state listener error:', error);
      setLoading(false);
    }
  }, []);

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Show error if Firebase failed to load
  if (firebaseError && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ Configuration Error</h2>
          <p className="text-gray-700 mb-4">
            Firebase could not initialize. Check Vercel environment variables:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 mb-4 space-y-1">
            <li>VITE_FIREBASE_API_KEY</li>
            <li>VITE_FIREBASE_AUTH_DOMAIN</li>
            <li>VITE_FIREBASE_PROJECT_ID</li>
            <li>VITE_FIREBASE_STORAGE_BUCKET</li>
            <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
            <li>VITE_FIREBASE_APP_ID</li>
          </ul>
          <details className="text-xs text-gray-500 mb-4">
            <summary className="cursor-pointer font-semibold">Error Details</summary>
            <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto text-xs">
              {firebaseError}
            </pre>
          </details>
          <a
            href="/status"
            className="block w-full text-center bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
          >
            Check Status Page
          </a>
        </div>
      </div>
    );
  }

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export { AuthProvider, useAuth };
