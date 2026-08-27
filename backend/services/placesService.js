const axios = require('axios');

const PLACES_API_BASE = 'https://maps.googleapis.com/maps/api/place';
const GEOCODING_API_BASE = 'https://maps.googleapis.com/maps/api/geocode';

/**
 * Get coordinates for a destination using Google Geocoding API
 */
const getCoordinates = async (destination) => {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ GOOGLE_PLACES_API_KEY not set, using fallback coordinates');
      return null;
    }

    const response = await axios.get(`${GEOCODING_API_BASE}/json`, {
      params: {
        address: `${destination}, India`,
        key: apiKey
      },
      timeout: 5000
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      console.log(`📍 Coordinates for ${destination}: ${location.lat}, ${location.lng}`);
      return {
        lat: location.lat,
        lng: location.lng,
        formatted_address: response.data.results[0].formatted_address
      };
    }

    console.warn(`⚠️ Geocoding failed for ${destination}: ${response.data.status}`);
    return null;
  } catch (error) {
    console.error('Geocoding API error:', error.message);
    return null;
  }
};

/**
 * Search for places of a specific type near coordinates
 */
const searchNearbyPlaces = async (lat, lng, type, radius = 15000) => {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return [];
    }

    const response = await axios.get(`${PLACES_API_BASE}/nearbysearch/json`, {
      params: {
        location: `${lat},${lng}`,
        radius,
        type,
        key: apiKey
      },
      timeout: 8000
    });

    if (response.data.status === 'OK') {
      return response.data.results.slice(0, 15); // Top 15 results
    }

    console.warn(`⚠️ Places search failed for type ${type}: ${response.data.status}`);
    return [];
  } catch (error) {
    console.error(`Places API error for type ${type}:`, error.message);
    return [];
  }
};

/**
 * Get detailed place information
 */
const getPlaceDetails = async (placeId) => {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return null;
    }

    const response = await axios.get(`${PLACES_API_BASE}/details/json`, {
      params: {
        place_id: placeId,
        fields: 'name,formatted_address,rating,price_level,opening_hours,website,formatted_phone_number,photos',
        key: apiKey
      },
      timeout: 5000
    });

    if (response.data.status === 'OK') {
      return response.data.result;
    }

    return null;
  } catch (error) {
    console.error('Place details API error:', error.message);
    return null;
  }
};

/**
 * Fetch real places for itinerary generation
 * Returns attractions, restaurants, and hotels
 */
const getRealPlacesForDestination = async (destination) => {
  try {
    console.log(`🔍 Fetching real places for: ${destination}`);

    // Step 1: Get coordinates
    const coords = await getCoordinates(destination);
    if (!coords) {
      console.warn('⚠️ Could not get coordinates, AI will use generic places');
      return null;
    }

    // Step 2: Fetch different types of places in parallel
    const [attractions, restaurants, hotels] = await Promise.all([
      searchNearbyPlaces(coords.lat, coords.lng, 'tourist_attraction', 15000),
      searchNearbyPlaces(coords.lat, coords.lng, 'restaurant', 10000),
      searchNearbyPlaces(coords.lat, coords.lng, 'lodging', 12000)
    ]);

    // Format results for Gemini prompt
    const formatPlace = (place) => ({
      name: place.name,
      address: place.vicinity || place.formatted_address,
      rating: place.rating || 'N/A',
      priceLevel: place.price_level ? '₹'.repeat(place.price_level) : 'N/A',
      types: place.types,
      placeId: place.place_id
    });

    const placesData = {
      destination: coords.formatted_address,
      coordinates: { lat: coords.lat, lng: coords.lng },
      attractions: attractions.slice(0, 20).map(formatPlace),
      restaurants: restaurants.slice(0, 15).map(formatPlace),
      hotels: hotels.slice(0, 10).map(formatPlace)
    };

    console.log(`✅ Found ${placesData.attractions.length} attractions, ${placesData.restaurants.length} restaurants, ${placesData.hotels.length} hotels`);
    return placesData;

  } catch (error) {
    console.error('Error fetching real places:', error.message);
    return null;
  }
};

/**
 * Generate Google Maps URL for a place
 */
const getGoogleMapsUrl = (placeName, address) => {
  const query = encodeURIComponent(`${placeName}, ${address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

module.exports = {
  getCoordinates,
  searchNearbyPlaces,
  getPlaceDetails,
  getRealPlacesForDestination,
  getGoogleMapsUrl
};
