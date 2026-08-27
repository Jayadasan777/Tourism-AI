const { getAuth, getFirestore } = require('../config/firebase');
const { AppError } = require('../utils/errorHandler');

/**
 * Verify user token and return user info
 */
const verifyUser = async (req, res, next) => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const auth = getAuth();
    const userRecord = await auth.getUser(userId);

    res.status(200).json({
      success: true,
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName || null,
        photoURL: userRecord.photoURL || null,
        emailVerified: userRecord.emailVerified
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Create or update user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const { displayName, preferences } = req.body;

    const db = getFirestore();
    const userRef = db.collection('users').doc(userId);

    const userData = {
      uid: userId,
      displayName: displayName || null,
      preferences: preferences || {},
      updatedAt: new Date().toISOString()
    };

    // Check if user document exists
    const doc = await userRef.get();
    if (!doc.exists) {
      userData.createdAt = new Date().toISOString();
    }

    await userRef.set(userData, { merge: true });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userData
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get user profile from Firestore
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const db = getFirestore();
    const doc = await db.collection('users').doc(userId).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: doc.data()
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyUser,
  updateProfile,
  getProfile
};
