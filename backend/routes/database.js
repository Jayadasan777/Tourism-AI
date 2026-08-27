/**
 * DATABASE ROUTES
 *
 * Public routes to showcase Tamil Nadu database
 * For demo and judge verification
 */

const express = require('express');
const router = express.Router();
const {
  getDatabaseStats,
  getAllDistricts,
  getDistrictDetails,
  searchPlaces
} = require('../controllers/databaseController');

/**
 * @route   GET /api/database/stats
 * @desc    Get database statistics (total places, districts, etc.)
 * @access  Public
 */
router.get('/stats', getDatabaseStats);

/**
 * @route   GET /api/database/districts
 * @desc    Get all Tamil Nadu districts with stats
 * @access  Public
 */
router.get('/districts', getAllDistricts);

/**
 * @route   GET /api/database/districts/:districtId
 * @desc    Get specific district details with sample places
 * @access  Public
 */
router.get('/districts/:districtId', getDistrictDetails);

/**
 * @route   GET /api/database/search
 * @desc    Search places across all districts
 * @access  Public
 */
router.get('/search', searchPlaces);

module.exports = router;
