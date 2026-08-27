const express = require('express');
const router = express.Router();
const {
  verifyUser,
  updateProfile,
  getProfile
} = require('../controllers/authController');
const { verifyToken } = require('../config/firebase');

/**
 * GET /api/auth/verify
 * Verify user token and get user info
 */
router.get('/verify', verifyToken, verifyUser);

/**
 * GET /api/auth/profile
 * Get user profile from Firestore
 */
router.get('/profile', verifyToken, getProfile);

/**
 * PUT /api/auth/profile
 * Create or update user profile
 */
router.put('/profile', verifyToken, updateProfile);

module.exports = router;
