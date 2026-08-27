const express = require('express');
const router = express.Router();
const {
  getSafetyInfo,
  getWeather,
  getHazards,
  getEmergency
} = require('../controllers/safetyController');

/**
 * GET /api/safety?destination=Ladakh
 * Get complete safety information (weather + hazards + emergency contacts)
 */
router.get('/', getSafetyInfo);

/**
 * GET /api/safety/weather?destination=Ladakh
 * Get only weather information
 */
router.get('/weather', getWeather);

/**
 * GET /api/safety/hazards?destination=Ladakh
 * Get only hazard alerts
 */
router.get('/hazards', getHazards);

/**
 * GET /api/safety/emergency?destination=Ladakh
 * Get emergency contact numbers
 */
router.get('/emergency', getEmergency);

module.exports = router;
