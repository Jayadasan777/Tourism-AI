/**
 * DATABASE CONTROLLER
 *
 * Endpoints to showcase Tamil Nadu database statistics
 * For demo purposes and judge verification
 */

const tamilNaduDb = require('../services/tamilNaduDbService');
const { AppError } = require('../utils/errorHandler');

/**
 * Get database statistics
 * GET /api/database/stats
 */
const getDatabaseStats = async (req, res, next) => {
  try {
    const stats = await tamilNaduDb.getDatabaseStats();

    if (!stats) {
      return res.status(200).json({
        success: true,
        message: 'Database not yet initialized',
        data: {
          totalDistricts: 0,
          totalPlaces: 0,
          initialized: false
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...stats,
        initialized: true,
        message: '100% Tamil Nadu Coverage'
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get all districts
 * GET /api/database/districts
 */
const getAllDistricts = async (req, res, next) => {
  try {
    const districts = await tamilNaduDb.getAllDistricts();

    res.status(200).json({
      success: true,
      count: districts.length,
      data: districts
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get district details
 * GET /api/database/districts/:districtId
 */
const getDistrictDetails = async (req, res, next) => {
  try {
    const { districtId } = req.params;

    const district = await tamilNaduDb.getDistrict(districtId);

    if (!district) {
      throw new AppError(`District '${districtId}' not found`, 404);
    }

    // Get sample places
    const [attractions, restaurants, hotels] = await Promise.all([
      tamilNaduDb.getAttractions(districtId, { limit: 10 }),
      tamilNaduDb.getRestaurants(districtId, { limit: 10 }),
      tamilNaduDb.getHotels(districtId, { limit: 10 })
    ]);

    res.status(200).json({
      success: true,
      data: {
        district,
        samples: {
          attractions: attractions.slice(0, 5),
          restaurants: restaurants.slice(0, 5),
          hotels: hotels.slice(0, 5)
        },
        counts: {
          attractions: attractions.length,
          restaurants: restaurants.length,
          hotels: hotels.length
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Search places across all districts
 * GET /api/database/search?q=marina beach
 */
const searchPlaces = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      throw new AppError('Search query must be at least 2 characters', 400);
    }

    const results = await tamilNaduDb.searchPlaces(q, { limit: 20 });

    const totalResults =
      (results.attractions?.length || 0) +
      (results.restaurants?.length || 0) +
      (results.hotels?.length || 0);

    res.status(200).json({
      success: true,
      query: q,
      totalResults,
      data: results
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDatabaseStats,
  getAllDistricts,
  getDistrictDetails,
  searchPlaces
};
