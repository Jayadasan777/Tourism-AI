const express = require('express');
const router = express.Router();
const { getNearbyRecommendations, getBestPlaces } = require('../controllers/recommendationController');

/**
 * @route   GET /api/recommendations/nearby
 * @desc    Get smart recommendations near current location
 * @query   latitude, longitude, budget (optional), radius (optional), category (optional), sortBy (optional)
 * @access  Public
 */
router.get('/nearby', getNearbyRecommendations);

/**
 * @route   GET /api/recommendations/best
 * @desc    Get best places grouped by category
 * @query   latitude, longitude, budget (optional)
 * @access  Public
 */
router.get('/best', getBestPlaces);

module.exports = router;
