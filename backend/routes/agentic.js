/**
 * AGENTIC AI ROUTES
 * Routes for autonomous AI travel agent
 */

const express = require('express');
const router = express.Router();
const {
  planCompleteTrip,
  executeBookings,
  getAgentStatus
} = require('../controllers/agenticController');

/**
 * @route   POST /api/agentic/plan-trip
 * @desc    Use AI agents to plan complete trip autonomously
 * @access  Public
 */
router.post('/plan-trip', planCompleteTrip);

/**
 * @route   POST /api/agentic/execute-bookings
 * @desc    Execute all bookings autonomously
 * @access  Public
 */
router.post('/execute-bookings', executeBookings);

/**
 * @route   GET /api/agentic/status/:taskId
 * @desc    Get real-time agent status
 * @access  Public
 */
router.get('/status/:taskId', getAgentStatus);

module.exports = router;
