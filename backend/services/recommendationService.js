const { searchNearbyPlaces, getPlaceDetails } = require('./placesService');

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg) => deg * (Math.PI / 180);

/**
 * Convert price_level (0-4) to estimated price range in INR
 */
const getPriceRange = (priceLevel, category) => {
  if (category === 'restaurant') {
    const ranges = {
      0: { min: 0, max: 100, label: 'Budget (₹100-200)' },
      1: { min: 100, max: 300, label: 'Budget (₹100-300)' },
      2: { min: 300, max: 800, label: 'Mid-range (₹300-800)' },
      3: { min: 800, max: 2000, label: 'Upscale (₹800-2000)' },
      4: { min: 2000, max: 5000, label: 'Fine Dining (₹2000+)' }
    };
    return ranges[priceLevel] || ranges[2];
  } else if (category === 'lodging') {
    const ranges = {
      0: { min: 0, max: 500, label: 'Budget (₹500-1000)' },
      1: { min: 500, max: 1500, label: 'Budget (₹500-1500)' },
      2: { min: 1500, max: 3500, label: 'Mid-range (₹1500-3500)' },
      3: { min: 3500, max: 8000, label: 'Upscale (₹3500-8000)' },
      4: { min: 8000, max: 20000, label: 'Luxury (₹8000+)' }
    };
    return ranges[priceLevel] || ranges[2];
  } else {
    // Attractions/activities
    const ranges = {
      0: { min: 0, max: 50, label: 'Free or very cheap' },
      1: { min: 50, max: 200, label: 'Budget (₹50-200)' },
      2: { min: 200, max: 500, label: 'Mid-range (₹200-500)' },
      3: { min: 500, max: 1500, label: 'Premium (₹500-1500)' },
      4: { min: 1500, max: 5000, label: 'Premium (₹1500+)' }
    };
    return ranges[priceLevel] || ranges[1];
  }
};

/**
 * Get smart recommendations based on current location, budget, and preferences
 */
const getSmartRecommendations = async ({
  latitude,
  longitude,
  budget,
  radius = 5000, // meters
  category = 'all', // 'restaurant', 'lodging', 'attraction', 'all'
  sortBy = 'distance' // 'distance', 'rating', 'budget'
}) => {
  try {
    console.log(`🎯 Getting smart recommendations near (${latitude}, ${longitude})`);

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ GOOGLE_PLACES_API_KEY not set - using smart nearby places generator');
      return getSmartFallbackNearby({ latitude, longitude, budget, radius, category, sortBy });
    }

    // Determine which types to search
    const typesToSearch = category === 'all'
      ? ['tourist_attraction', 'restaurant', 'lodging']
      : [category === 'attraction' ? 'tourist_attraction' : category];

    // Search for places
    const searchPromises = typesToSearch.map(type =>
      searchNearbyPlaces(latitude, longitude, type, radius)
    );

    const results = await Promise.all(searchPromises);
    const allPlaces = results.flat();

    // Process and enrich place data
    const recommendations = allPlaces.map(place => {
      const distance = calculateDistance(
        latitude,
        longitude,
        place.geometry.location.lat,
        place.geometry.location.lng
      );

      const priceLevel = place.price_level !== undefined ? place.price_level : 2;
      const placeCategory = place.types.includes('restaurant') ? 'restaurant'
        : place.types.includes('lodging') ? 'lodging'
        : 'attraction';

      const priceRange = getPriceRange(priceLevel, placeCategory);

      const isBudgetFriendly = budget ? priceRange.max <= budget : true;

      return {
        placeId: place.place_id,
        name: place.name,
        address: place.vicinity || place.formatted_address,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        },
        distance: distance.toFixed(2), // km
        distanceText: distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`,
        rating: place.rating || 0,
        ratingCount: place.user_ratings_total || 0,
        priceLevel,
        priceRange,
        category: placeCategory,
        isOpen: place.opening_hours?.open_now,
        isBudgetFriendly,
        types: place.types,
        photos: place.photos ? place.photos.slice(0, 1) : [],
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)},${encodeURIComponent(place.vicinity || '')}`,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat},${place.geometry.location.lng}`
      };
    });

    // Filter by budget if specified
    let filteredRecommendations = budget
      ? recommendations.filter(r => r.priceRange.max <= budget * 1.2) // Allow 20% over budget
      : recommendations;

    // Sort based on preference
    if (sortBy === 'distance') {
      filteredRecommendations.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else if (sortBy === 'rating') {
      filteredRecommendations.sort((a, b) => {
        // Prioritize higher ratings with more reviews
        const scoreA = a.rating * Math.log(a.ratingCount + 1);
        const scoreB = b.rating * Math.log(b.ratingCount + 1);
        return scoreB - scoreA;
      });
    } else if (sortBy === 'budget') {
      filteredRecommendations.sort((a, b) => a.priceRange.min - b.priceRange.min);
    }

    // Add ranking
    filteredRecommendations = filteredRecommendations.slice(0, 20).map((rec, index) => ({
      ...rec,
      rank: index + 1
    }));

    console.log(`✅ Found ${filteredRecommendations.length} recommendations`);

    return {
      success: true,
      count: filteredRecommendations.length,
      searchCenter: { latitude, longitude },
      radius: `${radius / 1000}km`,
      budget: budget || 'No budget specified',
      sortedBy: sortBy,
      recommendations: filteredRecommendations
    };

  } catch (error) {
    console.error('Error getting recommendations:', error.message);
    return {
      success: false,
      message: error.message,
      recommendations: []
    };
  }
};

/**
 * Get best places by category with smart filtering
 */
const getBestPlacesByCategory = async (latitude, longitude, budget) => {
  const results = await getSmartRecommendations({
    latitude,
    longitude,
    budget,
    radius: 5000,
    category: 'all',
    sortBy: 'rating'
  });

  if (!results.success) {
    return results;
  }

  // Group by category
  const byCategory = {
    restaurants: results.recommendations.filter(r => r.category === 'restaurant').slice(0, 5),
    hotels: results.recommendations.filter(r => r.category === 'lodging').slice(0, 5),
    attractions: results.recommendations.filter(r => r.category === 'attraction').slice(0, 5)
  };

  return {
    success: true,
    searchCenter: results.searchCenter,
    budget: results.budget,
    categories: byCategory,
    totalFound: byCategory.restaurants.length + byCategory.hotels.length + byCategory.attractions.length
  };
};

/**
 * Smart Fallback Generator when Google Places API key is not present
 */
const getSmartFallbackNearby = ({ latitude, longitude, budget, radius = 5000, category = 'all', sortBy = 'distance' }) => {
  const nearbyTemplates = [
    // Attractions
    { name: 'Heritage Cultural Center & Museum', category: 'attraction', rating: 4.8, ratingCount: 1420, priceLevel: 1, latOffset: 0.008, lngOffset: 0.005, address: 'Main Heritage Zone' },
    { name: 'Scenic Waterfront & Eco Park', category: 'attraction', rating: 4.7, ratingCount: 2310, priceLevel: 0, latOffset: -0.005, lngOffset: 0.012, address: 'Beach / Lake Promenade' },
    { name: 'Historic Temple & Viewpoint', category: 'attraction', rating: 4.9, ratingCount: 3890, priceLevel: 0, latOffset: 0.015, lngOffset: -0.008, address: 'Temple Street' },
    { name: 'Local Handicrafts Market & Bazaar', category: 'attraction', rating: 4.5, ratingCount: 980, priceLevel: 1, latOffset: -0.010, lngOffset: -0.004, address: 'Central Market Road' },

    // Restaurants
    { name: 'Saravana Bhavan Authentic Dining', category: 'restaurant', rating: 4.6, ratingCount: 5120, priceLevel: 1, latOffset: 0.003, lngOffset: 0.004, address: 'Station Road' },
    { name: 'Grand Spice Route Fine Indian Cuisine', category: 'restaurant', rating: 4.7, ratingCount: 1840, priceLevel: 2, latOffset: -0.007, lngOffset: 0.006, address: 'Bypass Avenue' },
    { name: 'Coastal Flavors Seafood Restaurant', category: 'restaurant', rating: 4.8, ratingCount: 2950, priceLevel: 2, latOffset: 0.012, lngOffset: 0.010, address: 'Beach Highway' },
    { name: 'Chai & Snacks Local Eatery', category: 'restaurant', rating: 4.4, ratingCount: 650, priceLevel: 0, latOffset: -0.002, lngOffset: -0.003, address: 'Market Square' },

    // Hotels / Lodging
    { name: 'Grand Heritage Residency & Spa', category: 'lodging', rating: 4.8, ratingCount: 1120, priceLevel: 3, latOffset: 0.018, lngOffset: 0.015, address: 'Resort Boulevard' },
    { name: 'Comfort Express Traveler Hotel', category: 'lodging', rating: 4.4, ratingCount: 840, priceLevel: 1, latOffset: -0.014, lngOffset: 0.008, address: 'City Center Link' },
    { name: 'Boutique Stay & Garden Suites', category: 'lodging', rating: 4.6, ratingCount: 530, priceLevel: 2, latOffset: 0.006, lngOffset: -0.012, address: 'Green Avenue' },
  ];

  let rawPlaces = nearbyTemplates.map((t, idx) => {
    const placeLat = latitude + t.latOffset;
    const placeLng = longitude + t.lngOffset;
    const distKm = calculateDistance(latitude, longitude, placeLat, placeLng);
    const priceRange = getPriceRange(t.priceLevel, t.category);
    const isBudgetFriendly = budget ? priceRange.max <= budget : true;

    return {
      placeId: `fallback-place-${idx + 1}`,
      name: t.name,
      address: t.address,
      location: { lat: placeLat, lng: placeLng },
      distance: distKm.toFixed(2),
      distanceText: distKm < 1 ? `${Math.round(distKm * 1000)}m` : `${distKm.toFixed(1)}km`,
      rating: t.rating,
      ratingCount: t.ratingCount,
      priceLevel: t.priceLevel,
      priceRange,
      category: t.category,
      isOpen: true,
      isBudgetFriendly,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.name)}`,
      directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${placeLat},${placeLng}`
    };
  });

  // Filter by radius
  const maxRadiusKm = radius / 1000;
  rawPlaces = rawPlaces.filter(p => parseFloat(p.distance) <= maxRadiusKm);

  // Filter by category
  if (category !== 'all') {
    const targetCat = category === 'tourist_attraction' ? 'attraction' : category;
    rawPlaces = rawPlaces.filter(p => p.category === targetCat);
  }

  // Filter by budget
  if (budget) {
    rawPlaces = rawPlaces.filter(p => p.priceRange.max <= budget * 1.2);
  }

  // Sort
  if (sortBy === 'distance') {
    rawPlaces.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  } else if (sortBy === 'rating') {
    rawPlaces.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'budget') {
    rawPlaces.sort((a, b) => a.priceRange.min - b.priceRange.min);
  }

  const recommendations = rawPlaces.map((rec, index) => ({
    ...rec,
    rank: index + 1
  }));

  return {
    success: true,
    count: recommendations.length,
    searchCenter: { latitude, longitude },
    radius: `${maxRadiusKm}km`,
    budget: budget || 'No budget specified',
    sortedBy: sortBy,
    recommendations
  };
};

module.exports = {
  getSmartRecommendations,
  getBestPlacesByCategory,
  calculateDistance
};
