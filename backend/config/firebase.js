const admin = require('firebase-admin');
const path = require('path');

let firebaseApp;

/**
 * Initialize Firebase Admin SDK
 */
const initializeFirebase = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    let serviceAccount;

    // Production: Use environment variable (for Render/Heroku/etc)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.log('📦 Loading Firebase credentials from environment variable');
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    }
    // Development: Use file path
    else {
      console.log('📦 Loading Firebase credentials from file');
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
                                 path.join(__dirname, 'serviceAccountKey.json');
      serviceAccount = require(serviceAccountPath);
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    console.log('✅ Firebase Admin SDK initialized');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    console.error('Make sure you have:');
    console.error('  - FIREBASE_SERVICE_ACCOUNT env variable (production), OR');
    console.error('  - serviceAccountKey.json file at: backend/config/serviceAccountKey.json (development)');
    throw new Error('Firebase configuration error');
  }
};

/**
 * Get Firestore database instance
 */
const getFirestore = () => {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return admin.firestore();
};

/**
 * Get Firebase Auth instance
 */
const getAuth = () => {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return admin.auth();
};

/**
 * Middleware to verify Firebase ID token
 */
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token provided'
      });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

module.exports = {
  initializeFirebase,
  getFirestore,
  getAuth,
  verifyToken
};
