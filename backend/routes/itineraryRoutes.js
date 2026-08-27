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
  (req, res, next) => {
    // Try to verify token, but don't fail if not present
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (token) {
      return verifyToken(req, res, next);
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
