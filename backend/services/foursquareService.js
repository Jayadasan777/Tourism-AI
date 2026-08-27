const axios = require('axios');

const FOURSQUARE_API_BASE = 'https://api.foursquare.com/v3';

/**
 * FOURSQUARE PLACES API - Production-Grade Real Data
 * Free Tier: 100,000 calls/month
 * Data: Real venues, ratings, photos, tips, pricing, hours
 */

/**
 * Search for venues near a location with detailed filters
 */
const searchVenues = async ({ latitude, longitude, query, categories, radius = 50000, limit = 100 }) => {
  try {
    const apiKey = process.env.FOURSQUARE_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ FOURSQUARE_API_KEY not set');
      return null;
    }

    const params = {
      ll: `${latitude},${longitude}`,
      radius,
      limit,
      sort: 'RELEVANCE',
    };

    if (query) params.query = query;
    if (categories) params.categories = categories;

    console.log(`🔍 Foursquare: Searching near (${latitude}, ${longitude}), radius: ${radius}m`);

    const response = await axios.get(`${FOURSQUARE_API_BASE}/places/search`, {
      headers: {
        'Authorization': apiKey,
        'Accept': 'application/json'
      },
      params,
      timeout: 10000
    });

    if (response.data && response.data.results) {
      console.log(`✅ Found ${response.data.results.length} venues from Foursquare`);
      return response.data.results.map(venue => formatVenue(venue));
    }

    return [];
  } catch (error) {
    console.error('Foursquare API error:', error.message);
    return [];
  }
};

/**
 * Get detailed information about a specific venue
 */
const getVenueDetails = async (fsqId) => {
  try {
    const apiKey = process.env.FOURSQUARE_API_KEY;
    if (!apiKey) return null;

    const response = await axios.get(`${FOURSQUARE_API_BASE}/places/${fsqId}`, {
      headers: {
        'Authorization': apiKey,
        'Accept': 'application/json'
      },
      params: {
        fields: 'name,location,categories,rating,price,photos,tips,hours,website,tel,description,tastes,popularity'
      },
      timeout: 8000
    });

    if (response.data) {
      return formatVenueDetails(response.data);
    }

    return null;
  } catch (error) {
    console.error('Foursquare venue details error:', error.message);
    return null;
  }
};

/**
 * Get venue photos
 */
const getVenuePhotos = async (fsqId) => {
  try {
    const apiKey = process.env.FOURSQUARE_API_KEY;
    if (!apiKey) return [];

    const response = await axios.get(`${FOURSQUARE_API_BASE}/places/${fsqId}/photos`, {
      headers: {
        'Authorization': apiKey,
        'Accept': 'application/json'
      },
      params: {
        limit: 10
      },
      timeout: 5000
    });

    if (response.data) {
      return response.data.map(photo => ({
        url: `${photo.prefix}original${photo.suffix}`,
        width: photo.width,
        height: photo.height
      }));
    }

    return [];
  } catch (error) {
    console.error('Foursquare photos error:', error.message);
    return [];
  }
};

/**
 * Get user tips/reviews for a venue
 */
const getVenueTips = async (fsqId, limit = 10) => {
  try {
    const apiKey = process.env.FOURSQUARE_API_KEY;
    if (!apiKey) return [];

    const response = await axios.get(`${FOURSQUARE_API_BASE}/places/${fsqId}/tips`, {
      headers: {
        'Authorization': apiKey,
        'Accept': 'application/json'
      },
      params: { limit },
      timeout: 5000
    });

    if (response.data) {
      return response.data.map(tip => ({
        text: tip.text,
        created: tip.created_at,
        agreeCount: tip.agree_count
      }));
    }

    return [];
  } catch (error) {
    console.error('Foursquare tips error:', error.message);
    return [];
  }
};

/**
 * Format venue data into consistent structure
 */
const formatVenue = (venue) => {
  const categories = venue.categories || [];
  const primaryCategory = categories[0] || {};

  // Determine venue type
  let venueType = 'attraction';
  const categoryName = primaryCategory.name?.toLowerCase() || '';

  if (categoryName.includes('restaurant') || categoryName.includes('food') || categoryName.includes('café')) {
    venueType = 'restaurant';
  } else if (categoryName.includes('hotel') || categoryName.includes('hostel') || categoryName.includes('resort')) {
    venueType = 'hotel';
  }

  // Price level (1-4 scale)
  const priceLevel = venue.price || 2;

  // Estimated cost ranges based on venue type and price level (in INR)
  let estimatedCost = 0;
  if (venueType === 'restaurant') {
    const restaurantPrices = [200, 500, 1200, 2500];
    estimatedCost = restaurantPrices[priceLevel - 1] || 500;
  } else if (venueType === 'hotel') {
    const hotelPrices = [1500, 3500, 7000, 15000];
    estimatedCost = hotelPrices[priceLevel - 1] || 3500;
  } else {
    const attractionPrices = [100, 300, 800, 1500];
    estimatedCost = attractionPrices[priceLevel - 1] || 300;
  }

  return {
    id: venue.fsq_id,
    name: venue.name,
    location: {
      address: venue.location?.formatted_address || venue.location?.address,
      city: venue.location?.locality,
      postalCode: venue.location?.postcode,
      country: venue.location?.country,
      lat: venue.geocodes?.main?.latitude,
      lng: venue.geocodes?.main?.longitude
    },
    category: primaryCategory.name,
    venueType,
    categories: categories.map(c => c.name),
    rating: venue.rating || null,
    priceLevel,
    estimatedCost,
    distance: venue.distance,
    photos: venue.photos?.map(p => `${p.prefix}original${p.suffix}`) || [],
    verified: venue.verified || false,
    hours: venue.hours?.display,
    isOpen: venue.hours?.open_now,
    popularity: venue.popularity || 0,
    website: venue.website,
    tel: venue.tel,
    tips: venue.tips || []
  };
};

/**
 * Format detailed venue data
 */
const formatVenueDetails = (venue) => {
  const formatted = formatVenue(venue);

  return {
    ...formatted,
    description: venue.description,
    tastes: venue.tastes || [],
    hours: {
      display: venue.hours?.display,
      isOpen: venue.hours?.open_now,
      schedule: venue.hours?.regular || []
    },
    tips: venue.tips?.map(tip => ({
      text: tip.text,
      created: tip.created_at,
      agrees: tip.agree_count
    })) || []
  };
};

/**
 * Get venues by category with intelligent filtering
 */
const getVenuesByCategory = async ({ latitude, longitude, category, budget, limit = 20 }) => {
  try {
    // Foursquare category IDs for common types
    const categoryMap = {
      'restaurant': '13065', // Dining and Drinking category
      'hotel': '19014', // Hotels and Lodging
      'attraction': '16000', // Landmarks and Outdoors
      'cafe': '13034', // Café
      'bar': '13003', // Bar
      'museum': '10027', // Museum
      'park': '16032', // Park
      'shopping': '17000', // Shopping
      'nightlife': '10032' // Nightlife
    };

    const venues = await searchVenues({
      latitude,
      longitude,
      categories: categoryMap[category],
      limit,
      radius: 100000 // 100km HUGE radius!
    });

    if (!venues || venues.length === 0) return [];

    // Filter by budget if specified
    let filtered = venues;
    if (budget) {
      filtered = venues.filter(v => v.estimatedCost <= budget * 1.2); // Allow 20% over
    }

    // Sort by rating and popularity
    filtered.sort((a, b) => {
      const scoreA = (a.rating || 0) * 10 + (a.popularity || 0);
      const scoreB = (b.rating || 0) * 10 + (b.popularity || 0);
      return scoreB - scoreA;
    });

    return filtered;
  } catch (error) {
    console.error('Error getting venues by category:', error.message);
    return [];
  }
};

/**
 * Get comprehensive place data for itinerary generation
 */
const getPlacesForItinerary = async (destination) => {
  try {
    console.log(`🌍 Fetching real places for: ${destination}`);

    // First, geocode the destination
    const geocodeResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: `${destination}, India`,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'SmartTourAI/1.0'
      }
    });

    if (!geocodeResponse.data || geocodeResponse.data.length === 0) {
      console.warn(`⚠️ Could not geocode ${destination}`);
      return null;
    }

    const location = geocodeResponse.data[0];
    const lat = parseFloat(location.lat);
    const lng = parseFloat(location.lon);

    console.log(`📍 Coordinates: ${lat}, ${lng}`);

    // Fetch different categories in parallel with HUGE limits
    const [attractions, restaurants, hotels, cafes] = await Promise.all([
      getVenuesByCategory({ latitude: lat, longitude: lng, category: 'attraction', limit: 100 }),
      getVenuesByCategory({ latitude: lat, longitude: lng, category: 'restaurant', limit: 100 }),
      getVenuesByCategory({ latitude: lat, longitude: lng, category: 'hotel', limit: 50 }),
      getVenuesByCategory({ latitude: lat, longitude: lng, category: 'cafe', limit: 50 })
    ]);

    const placesData = {
      destination: location.display_name,
      coordinates: { lat, lng },
      attractions: attractions || [],
      restaurants: restaurants || [],
      hotels: hotels || [],
      cafes: cafes || [],
      totalPlaces: (attractions?.length || 0) + (restaurants?.length || 0) + (hotels?.length || 0) + (cafes?.length || 0)
    };

    console.log(`✅ Foursquare: ${placesData.totalPlaces} real venues found`);
    console.log(`   - ${placesData.attractions.length} attractions`);
    console.log(`   - ${placesData.restaurants.length} restaurants`);
    console.log(`   - ${placesData.hotels.length} hotels`);
    console.log(`   - ${placesData.cafes.length} cafes`);

    return placesData;
  } catch (error) {
    console.error('Error fetching places for itinerary:', error.message);
    return null;
  }
};

module.exports = {
  searchVenues,
  getVenueDetails,
  getVenuePhotos,
  getVenueTips,
  getVenuesByCategory,
  getPlacesForItinerary
};
