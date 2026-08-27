const { getSmartRecommendations, getBestPlacesByCategory } = require('../services/recommendationService');
const { AppError } = require('../utils/errorHandler');

/**
 * Get nearby recommendations based on current location
 */
const getNearbyRecommendations = async (req, res, next) => {
  try {
    const { latitude, longitude, budget, radius, category, sortBy } = req.query;

    // Validate required parameters
    if (!latitude || !longitude) {
      throw new AppError('Latitude and longitude are required', 400);
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      throw new AppError('Invalid latitude or longitude', 400);
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new AppError('Latitude must be between -90 and 90, longitude between -180 and 180', 400);
    }

    const parsedBudget = budget ? parseInt(budget) : null;
    const parsedRadius = radius ? parseInt(radius) : 500000; // Default 500 km - Tamil Nadu coverage!

    console.log(`📍 Recommendations request: (${lat}, ${lng}), budget: ₹${parsedBudget || 'None'}, radius: ${parsedRadius}m`);

    const recommendations = await getSmartRecommendations({
      latitude: lat,
      longitude: lng,
      budget: parsedBudget,
      radius: parsedRadius,
      category: category || 'all',
      sortBy: sortBy || 'distance'
    });

    res.status(200).json(recommendations);

  } catch (error) {
    next(error);
  }
};

/**
 * Get best places grouped by category
 */
const getBestPlaces = async (req, res, next) => {
  try {
    const { latitude, longitude, budget } = req.query;

    if (!latitude || !longitude) {
      throw new AppError('Latitude and longitude are required', 400);
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      throw new AppError('Invalid latitude or longitude', 400);
    }

    const parsedBudget = budget ? parseInt(budget) : null;

    const bestPlaces = await getBestPlacesByCategory(lat, lng, parsedBudget);

    res.status(200).json(bestPlaces);

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNearbyRecommendations,
  getBestPlaces
};
