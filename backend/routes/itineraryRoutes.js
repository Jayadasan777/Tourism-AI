const express = require('express');
const router = express.Router();
const {
  createItinerary,
  getUserItineraries,
  getItineraryById,
  deleteItinerary
} = require('../controllers/itineraryController');
const { verifyToken } = require('../config/firebase');
const { validateRequest, itineraryRequestSchema } = require('../utils/validateSchema');

/**
 * POST /api/itinerary/generate
 * Generate new itinerary (authentication optional)
 */
router.post(
  '/generate',
  validateRequest(itineraryRequestSchema),
  async (req, res, next) => {
    // Optional auth: try to verify token, but never fail itinerary generation if token is expired/invalid
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (token) {
      try {
        const { getAuth } = require('../config/firebase');
        const decodedToken = await getAuth().verifyIdToken(token);
        req.user = decodedToken;
      } catch (err) {
        console.warn('⚠️ Stale or invalid token, proceeding as guest:', err.message);
        req.user = null;
      }
    }
    next();
  },
  createItinerary
);

/**
 * GET /api/itinerary/my
 * Get user's saved itineraries (requires authentication)
 */
router.get('/my', verifyToken, getUserItineraries);

/**
 * GET /api/itinerary/:id
 * Get specific itinerary by ID
 */
router.get('/:id', getItineraryById);

/**
 * DELETE /api/itinerary/:id
 * Delete itinerary (requires authentication)
 */
router.delete('/:id', verifyToken, deleteItinerary);

module.exports = router;
