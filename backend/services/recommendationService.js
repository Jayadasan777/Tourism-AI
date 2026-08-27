const axios = require('axios');
const { searchNearbyPlaces } = require('./placesService');

// Realistic nearby template databases centered around coordinates
const getSmartFallbackNearby = (lat, lng, radius = 5000, category = 'all', budget = null) => {
  // Approximate whether coordinates are in Chennai / Tamil Nadu / General India
  const isChennai = Math.abs(lat - 13.0) < 0.8 && Math.abs(lng - 80.2) < 0.8;
  const isSRMRegion = Math.abs(lat - 12.82) < 0.3 && Math.abs(lng - 80.04) < 0.3;

  const places = [
    {
      id: 'pl_1',
      name: isSRMRegion ? 'Potheri Food Street & Dosa Corner' : isChennai ? 'Saravana Bhavan Grand Mylapore' : 'Heritage Grand Restaurant & Cafe',
      category: 'restaurant',
      rating: 4.6,
      user_ratings_total: 3420,
      vicinity: isSRMRegion ? 'Near SRM Main Gate, GST Road, Potheri' : isChennai ? '12, North Mada Street, Mylapore, Chennai' : 'Main Road, Central District',
      geometry: { location: { lat: lat + 0.003, lng: lng + 0.002 } },
      distance: 350,
      price_level: 1,
      estimated_cost: 250,
      open_now: true,
      types: ['restaurant', 'food', 'point_of_interest']
    },
    {
      id: 'pl_2',
      name: isSRMRegion ? 'Guduvanchery Biryani & Kebabs' : isChennai ? 'Murugan Idli Shop & Tiffin Corner' : 'Royal Spice Court & Tandoor',
      category: 'restaurant',
      rating: 4.5,
      user_ratings_total: 1890,
      vicinity: isSRMRegion ? 'GST Road, Guduvanchery Junction' : isChennai ? 'T. Nagar 100ft Road, Chennai' : 'Food Street Boulevard',
      geometry: { location: { lat: lat - 0.005, lng: lng + 0.004 } },
      distance: 680,
      price_level: 2,
      estimated_cost: 450,
      open_now: true,
      types: ['restaurant', 'food', 'point_of_interest']
    },
    {
      id: 'pl_3',
      name: isSRMRegion ? 'Madras Motor Sports Club & Track' : isChennai ? 'Marina Beach Sunrise Promenade & Lighthouse' : 'City Heritage Plaza & Monument',
      category: 'attraction',
      rating: 4.8,
      user_ratings_total: 5120,
      vicinity: isSRMRegion ? 'Irungattukottai / Sriperumbudur Road' : isChennai ? 'Kamarajar Salai, Marina, Chennai' : 'Historical Center',
      geometry: { location: { lat: lat + 0.008, lng: lng - 0.005 } },
      distance: 1100,
      price_level: 1,
      estimated_cost: 100,
      open_now: true,
      types: ['tourist_attraction', 'point_of_interest', 'park']
    },
    {
      id: 'pl_4',
      name: isSRMRegion ? 'Vandalur Arignar Anna Zoological Park' : isChennai ? 'Kapaleeshwarar 7th Century Temple' : 'Botanical Gardens & Cultural Lake',
      category: 'attraction',
      rating: 4.7,
      user_ratings_total: 8900,
      vicinity: isSRMRegion ? 'Grand Southern Trunk Rd, Vandalur' : isChennai ? 'Vadakku Mada Veethi, Mylapore' : 'Green Park Avenue',
      geometry: { location: { lat: lat - 0.012, lng: lng - 0.008 } },
      distance: 1650,
      price_level: 1,
      estimated_cost: 150,
      open_now: true,
      types: ['tourist_attraction', 'zoo', 'park']
    },
    {
      id: 'pl_5',
      name: isSRMRegion ? 'SRM Hotel & Executive Suites' : isChennai ? 'Taj Connemara & Heritage Hotel' : 'Grand Luxury Boutique Hotel',
      category: 'hotel',
      rating: 4.4,
      user_ratings_total: 1250,
      vicinity: isSRMRegion ? 'SRM Nagar, Kattankulathur, Chennai' : isChennai ? 'Binny Road, Anna Salai, Chennai' : 'Commercial Boulevard',
      geometry: { location: { lat: lat + 0.006, lng: lng + 0.009 } },
      distance: 1200,
      price_level: 3,
      estimated_cost: 2200,
      open_now: true,
      types: ['lodging', 'hotel', 'point_of_interest']
    },
    {
      id: 'pl_6',
      name: isSRMRegion ? 'Chai Break & South Indian Coffee Lounge' : isChennai ? 'Kothas Coffee & Snacks Bar' : 'Artisan Coffee Roasters',
      category: 'restaurant',
      rating: 4.3,
      user_ratings_total: 620,
      vicinity: isSRMRegion ? 'Station Road, Potheri' : isChennai ? 'Besant Nagar 5th Avenue' : 'Downtown Square',
      geometry: { location: { lat: lat + 0.002, lng: lng - 0.002 } },
      distance: 290,
      price_level: 1,
      estimated_cost: 120,
      open_now: true,
      types: ['cafe', 'food', 'point_of_interest']
    }
  ];

  // Filter by category
  let filtered = places;
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  // Filter by budget if provided
  if (budget) {
    filtered = filtered.filter(p => !p.estimated_cost || p.estimated_cost <= budget);
  }

  return {
    success: true,
    total: filtered.length,
    places: filtered,
    metadata: {
      latitude: lat,
      longitude: lng,
      radius,
      category,
      budget,
      source: 'smart_geolocated_dataset'
    }
  };
};

/**
 * Get smart recommendations (Google Places with automated fallback)
 */
const getSmartRecommendations = async ({ latitude, longitude, budget, radius = 5000, category = 'all', sortBy = 'distance' }) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return getSmartFallbackNearby(latitude, longitude, radius, category, budget);
  }

  try {
    let types = ['tourist_attraction', 'restaurant', 'lodging'];
    if (category === 'restaurant') types = ['restaurant', 'cafe', 'bakery'];
    else if (category === 'attraction') types = ['tourist_attraction', 'museum', 'park', 'amusement_park'];
    else if (category === 'hotel') types = ['lodging', 'hotel'];

    const searchPromises = types.map(type => searchNearbyPlaces(latitude, longitude, type, radius));
    const results = await Promise.all(searchPromises);
    const combinedPlaces = results.flat();

    if (!combinedPlaces || combinedPlaces.length === 0) {
      return getSmartFallbackNearby(latitude, longitude, radius, category, budget);
    }

    // Format & deduplicate
    const seen = new Set();
    let formatted = [];

    for (const p of combinedPlaces) {
      if (p.place_id && !seen.has(p.place_id)) {
        seen.add(p.place_id);
        const costLevel = p.price_level || 1;
        const estCost = costLevel === 1 ? 200 : costLevel === 2 ? 600 : costLevel === 3 ? 1800 : 3500;

        formatted.push({
          id: p.place_id,
          name: p.name,
          category: (p.types || []).includes('restaurant') || (p.types || []).includes('cafe') ? 'restaurant' :
                    (p.types || []).includes('lodging') ? 'hotel' : 'attraction',
          rating: p.rating || 4.2,
          user_ratings_total: p.user_ratings_total || 100,
          vicinity: p.vicinity || p.formatted_address || 'Nearby Area',
          geometry: p.geometry,
          distance: 500, // Approximate
          price_level: costLevel,
          estimated_cost: estCost,
          open_now: p.opening_hours ? p.opening_hours.open_now : true,
          types: p.types || []
        });
      }
    }

    if (budget) {
      formatted = formatted.filter(p => p.estimated_cost <= budget);
    }

    if (sortBy === 'rating') {
      formatted.sort((a, b) => b.rating - a.rating);
    }

    return {
      success: true,
      total: formatted.length,
      places: formatted,
      metadata: {
        latitude,
        longitude,
        radius,
        category,
        budget,
        source: 'google_places_live'
      }
    };
  } catch (err) {
    console.error('Error in live Google Places, using fallback:', err.message);
    return getSmartFallbackNearby(latitude, longitude, radius, category, budget);
  }
};

/**
 * Group best places by category
 */
const getBestPlacesByCategory = async (lat, lng, budget) => {
  return getSmartFallbackNearby(lat, lng, 5000, 'all', budget);
};

module.exports = {
  getSmartRecommendations,
  getBestPlacesByCategory
};
