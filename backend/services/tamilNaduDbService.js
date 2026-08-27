/**
 * TAMIL NADU DATABASE SERVICE
 *
 * Service layer for querying Tamil Nadu tourism database
 * Provides real, verified data for all 38 districts
 */

const { getFirestore } = require('../config/firebase');

const db = getFirestore();

// Check if Firebase is available
const isFirebaseAvailable = () => db !== null;

/**
 * Get all districts with stats
 */
const getAllDistricts = async () => {
  if (!isFirebaseAvailable()) {
    console.log('⚠️  Firebase not available, returning empty districts');
    return [];
  }

  try {
    const snapshot = await db.collection('districts')
      .where('id', '!=', '_metadata')
      .orderBy('id')
      .get();

    const districts = [];
    snapshot.forEach(doc => {
      districts.push({ id: doc.id, ...doc.data() });
    });

    return districts;
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
};

/**
 * Get district by ID
 */
const getDistrict = async (districtId) => {
  if (!isFirebaseAvailable()) {
    console.log('⚠️  Firebase not available, returning null for district');
    return null;
  }

  try {
    const doc = await db.collection('districts').doc(districtId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error fetching district:', error);
    return null;
  }
};

/**
 * Get attractions for a district
 */
const getAttractions = async (districtId, { limit = 50, verified = true, minRating = 0 } = {}) => {
  try {
    let query = db.collection('places')
      .where('district', '==', districtId);

    if (verified) {
      query = query.where('verified', '==', true);
    }

    const snapshot = await query
      .orderBy('ratings.overall', 'desc')
      .limit(limit)
      .get();

    const attractions = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.ratings?.overall >= minRating) {
        attractions.push({ id: doc.id, ...data });
      }
    });

    return attractions;
  } catch (error) {
    console.error('Error fetching attractions:', error);
    return [];
  }
};

/**
 * Get restaurants for a district
 */
const getRestaurants = async (districtId, { limit = 50, maxBudget = null, cuisine = null } = {}) => {
  try {
    let query = db.collection('restaurants')
      .where('district', '==', districtId)
      .where('verified', '==', true);

    const snapshot = await query
      .orderBy('ratings.overall', 'desc')
      .limit(limit * 2) // Fetch more to filter
      .get();

    let restaurants = [];
    snapshot.forEach(doc => {
      const data = doc.data();

      // Filter by budget
      if (maxBudget && data.pricing?.costForTwo > maxBudget) {
        return;
      }

      // Filter by cuisine
      if (cuisine && data.cuisine && !data.cuisine.includes(cuisine)) {
        return;
      }

      restaurants.push({ id: doc.id, ...data });
    });

    return restaurants.slice(0, limit);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
};

/**
 * Get hotels for a district
 */
const getHotels = async (districtId, { limit = 30, maxBudget = null, category = null } = {}) => {
  try {
    let query = db.collection('hotels')
      .where('district', '==', districtId)
      .where('verified', '==', true);

    const snapshot = await query
      .orderBy('ratings.overall', 'desc')
      .limit(limit * 2)
      .get();

    let hotels = [];
    snapshot.forEach(doc => {
      const data = doc.data();

      // Filter by budget (check lowest room price)
      if (maxBudget && data.pricing?.pricePerNight > maxBudget) {
        return;
      }

      // Filter by category
      if (category && data.category !== category) {
        return;
      }

      hotels.push({ id: doc.id, ...data });
    });

    return hotels.slice(0, limit);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
};

/**
 * Get comprehensive data for itinerary generation
 */
const getDistrictItineraryData = async (districtId, budget = null) => {
  try {
    console.log(`📊 Fetching Tamil Nadu DB data for: ${districtId}`);

    const [district, attractions, restaurants, hotels] = await Promise.all([
      getDistrict(districtId),
      getAttractions(districtId, { limit: 30, verified: true }),
      getRestaurants(districtId, { limit: 40, maxBudget: budget }),
      getHotels(districtId, { limit: 20, maxBudget: budget ? budget * 0.4 : null })
    ]);

    if (!district) {
      console.log(`⚠️  District '${districtId}' not found in Tamil Nadu DB`);
      return null;
    }

    const result = {
      district,
      attractions: attractions || [],
      restaurants: restaurants || [],
      hotels: hotels || [],
      totalPlaces: (attractions?.length || 0) + (restaurants?.length || 0) + (hotels?.length || 0),
      dataSource: 'Tamil Nadu Database',
      verified: true
    };

    console.log(`✅ Tamil Nadu DB: ${result.totalPlaces} verified places`);
    console.log(`   - ${result.attractions.length} attractions`);
    console.log(`   - ${result.restaurants.length} restaurants`);
    console.log(`   - ${result.hotels.length} hotels`);

    return result;
  } catch (error) {
    console.error('Error fetching itinerary data:', error);
    return null;
  }
};

/**
 * Search places by name across all districts
 */
const searchPlaces = async (searchQuery, { limit = 20, districts = null } = {}) => {
  try {
    const searchLower = searchQuery.toLowerCase();
    const results = {
      attractions: [],
      restaurants: [],
      hotels: []
    };

    // Search attractions
    let attractionsQuery = db.collection('places').where('verified', '==', true);
    if (districts) {
      attractionsQuery = attractionsQuery.where('district', 'in', districts);
    }
    const attractionsSnapshot = await attractionsQuery.limit(100).get();
    attractionsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.name.toLowerCase().includes(searchLower)) {
        results.attractions.push({ id: doc.id, ...data });
      }
    });

    // Search restaurants
    let restaurantsQuery = db.collection('restaurants').where('verified', '==', true);
    if (districts) {
      restaurantsQuery = restaurantsQuery.where('district', 'in', districts);
    }
    const restaurantsSnapshot = await restaurantsQuery.limit(100).get();
    restaurantsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.name.toLowerCase().includes(searchLower)) {
        results.restaurants.push({ id: doc.id, ...data });
      }
    });

    // Search hotels
    let hotelsQuery = db.collection('hotels').where('verified', '==', true);
    if (districts) {
      hotelsQuery = hotelsQuery.where('district', 'in', districts);
    }
    const hotelsSnapshot = await hotelsQuery.limit(100).get();
    hotelsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.name.toLowerCase().includes(searchLower)) {
        results.hotels.push({ id: doc.id, ...data });
      }
    });

    return results;
  } catch (error) {
    console.error('Error searching places:', error);
    return { attractions: [], restaurants: [], hotels: [] };
  }
};

/**
 * Get database statistics
 */
const getDatabaseStats = async () => {
  try {
    const [districtsCount, placesCount, restaurantsCount, hotelsCount] = await Promise.all([
      db.collection('districts').where('id', '!=', '_metadata').count().get(),
      db.collection('places').where('verified', '==', true).count().get(),
      db.collection('restaurants').where('verified', '==', true).count().get(),
      db.collection('hotels').where('verified', '==', true).count().get()
    ]);

    return {
      totalDistricts: districtsCount.data().count,
      totalAttractions: placesCount.data().count,
      totalRestaurants: restaurantsCount.data().count,
      totalHotels: hotelsCount.data().count,
      totalPlaces: placesCount.data().count + restaurantsCount.data().count + hotelsCount.data().count,
      coverage: '38 Tamil Nadu Districts',
      verified: true
    };
  } catch (error) {
    console.error('Error fetching database stats:', error);
    return null;
  }
};

module.exports = {
  getAllDistricts,
  getDistrict,
  getAttractions,
  getRestaurants,
  getHotels,
  getDistrictItineraryData,
  searchPlaces,
  getDatabaseStats
};
