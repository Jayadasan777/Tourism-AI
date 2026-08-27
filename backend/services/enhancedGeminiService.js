/**
 * ENHANCED GEMINI SERVICE - WITH TAMIL NADU DATABASE INTEGRATION
 *
 * This service integrates our local Tamil Nadu database with Gemini AI
 * to provide REAL, VERIFIED places in itineraries
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { AppError } = require('../utils/errorHandler');
const tamilNaduDb = require('./tamilNaduDbService');
const foursquareService = require('./foursquareService');

let genAI;

/**
 * Initialize Gemini API client
 */
const initializeGemini = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log('✅ Gemini API initialized');
};

/**
 * Normalize destination name to district ID
 */
const normalizeDestination = (destination) => {
  const destLower = destination.toLowerCase().trim();

  // Map common names to district IDs
  const districtMap = {
    // Direct matches
    'chennai': 'chennai',
    'coimbatore': 'coimbatore',
    'madurai': 'madurai',
    'trichy': 'tiruchirappalli',
    'tiruchirappalli': 'tiruchirappalli',
    'salem': 'salem',
    'tirunelveli': 'tirunelveli',
    'ooty': 'nilgiris',
    'nilgiris': 'nilgiris',
    'kodaikanal': 'dindigul',
    'rameswaram': 'ramanathapuram',
    'kanyakumari': 'kanyakumari',
    'kanchipuram': 'kanchipuram',

    // Aliases
    'cbr': 'coimbatore',
    'cbe': 'coimbatore',
    'kovai': 'coimbatore',
    'tuticorin': 'thoothukudi',
    'thoothukudi': 'thoothukudi',
    'udhagai': 'nilgiris',
    'thanjavur': 'thanjavur',
    'tanjore': 'thanjavur'
  };

  return districtMap[destLower] || destLower;
};

/**
 * Get real places data from Tamil Nadu database or Foursquare fallback
 */
const getRealPlacesForDestination = async (destination) => {
  console.log(`\n🔍 Step 1: Fetching REAL places for ${destination}...`);

  // Normalize destination to district ID
  const districtId = normalizeDestination(destination);
  console.log(`📍 Normalized to district: ${districtId}`);

  try {
    // Try Tamil Nadu Database first
    console.log('🗄️ Checking Tamil Nadu Database...');
    const dbData = await tamilNaduDb.getDistrictItineraryData(districtId);

    if (dbData && dbData.totalPlaces > 0) {
      console.log(`✅ Tamil Nadu DB: Found ${dbData.totalPlaces} verified places!`);
      return {
        source: 'Tamil Nadu Database',
        verified: true,
        ...dbData
      };
    }

    console.log('⚠️ No data in Tamil Nadu DB, trying Foursquare API...');

  } catch (dbError) {
    console.log('⚠️ Tamil Nadu DB error:', dbError.message);
  }

  // Fallback to Foursquare API
  try {
    const foursquareData = await foursquareService.getPlacesForItinerary(destination);

    if (foursquareData && foursquareData.totalPlaces > 0) {
      console.log(`✅ Foursquare API: Found ${foursquareData.totalPlaces} places!`);
      return {
        source: 'Foursquare API',
        verified: true,
        attractions: foursquareData.attractions || [],
        restaurants: foursquareData.restaurants || [],
        hotels: foursquareData.hotels || [],
        totalPlaces: foursquareData.totalPlaces
      };
    }
  } catch (apiError) {
    console.log('⚠️ Foursquare API error:', apiError.message);
  }

  console.log('❌ No real places data available');
  return null;
};

/**
 * Format places data for Gemini prompt
 */
const formatPlacesForPrompt = (placesData) => {
  if (!placesData) return '';

  let prompt = '\n\n**REAL VERIFIED PLACES TO USE:**\n';

  // Format attractions
  if (placesData.attractions && placesData.attractions.length > 0) {
    prompt += '\n**Attractions:**\n';
    placesData.attractions.slice(0, 20).forEach((place, i) => {
      const name = place.name;
      const address = place.location?.address || place.address || '';
      const cost = place.pricing?.entry || place.estimatedCost || 0;
      const rating = place.ratings?.overall || place.rating || 0;

      prompt += `${i + 1}. ${name} (${address}) - Entry: ₹${cost}, Rating: ${rating}/5\n`;
    });
  }

  // Format restaurants
  if (placesData.restaurants && placesData.restaurants.length > 0) {
    prompt += '\n**Restaurants:**\n';
    placesData.restaurants.slice(0, 20).forEach((restaurant, i) => {
      const name = restaurant.name;
      const address = restaurant.location?.address || restaurant.address || '';
      const cost = restaurant.pricing?.costForTwo || restaurant.estimatedCost || 0;
      const rating = restaurant.ratings?.overall || restaurant.rating || 0;
      const cuisine = restaurant.cuisine ? `(${restaurant.cuisine.join(', ')})` : '';

      prompt += `${i + 1}. ${name} ${cuisine} (${address}) - ₹${cost} for two, Rating: ${rating}/5\n`;
    });
  }

  // Format hotels
  if (placesData.hotels && placesData.hotels.length > 0) {
    prompt += '\n**Hotels:**\n';
    placesData.hotels.slice(0, 15).forEach((hotel, i) => {
      const name = hotel.name;
      const address = hotel.location?.address || hotel.address || '';
      const cost = hotel.pricing?.pricePerNight || hotel.estimatedCost || 0;
      const rating = hotel.ratings?.overall || hotel.rating || 0;

      prompt += `${i + 1}. ${name} (${address}) - ₹${cost}/night, Rating: ${rating}/5\n`;
    });
  }

  prompt += `\n**CRITICAL: You MUST use these EXACT place names (not generic descriptions) in your itinerary.**\n`;
  prompt += `**Data Source: ${placesData.source} (Verified)**\n`;

  return prompt;
};

/**
 * Enhanced itinerary generation with real places
 */
const generateItinerary = async ({ destination, budget, duration, interests, startDate }) => {
  try {
    if (!genAI) {
      initializeGemini();
    }

    // STEP 1: Get real places data
    const placesData = await getRealPlacesForDestination(destination);
    const hasRealData = placesData && placesData.totalPlaces > 0;

    console.log(`\n🤖 Step 2: Generating AI itinerary with ${hasRealData ? 'REAL' : 'generic'} data...`);

    const interestsString = interests.join(', ');
    const dailyBudget = Math.floor(budget / duration);

    // Enhanced prompt with real places
    const realPlacesPrompt = hasRealData ? formatPlacesForPrompt(placesData) : '';

    const prompt = `You are a world-class Indian travel guide and local explorer.
Create an authentic, real-world, conflict-free ${duration}-day travel itinerary for ${destination}, India.

CRITICAL RULES FOR REAL-WORLD AUTHENTICITY:
1. Every activity MUST specify the EXACT REAL-WORLD VENUE NAME (e.g., "Marina Beach", "Murugan Idli Shop", "Hotel Savera"), NOT generic text like "Morning Exploration" or "Local Sightseeing".
2. Include authentic hotel stays, popular food spots with real local dishes, exact addresses, and verified costs in INR (₹).
3. Schedule activities in a geographically logical sequence (morning to night) to avoid traffic and backtracking.
4. Total estimated cost across all days must stay within ₹${budget.toLocaleString('en-IN')} (Daily ~₹${dailyBudget.toLocaleString('en-IN')}).
5. Tailor experiences to these interests: ${interestsString}.
${realPlacesPrompt}

Start Date: ${new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

**Response Format:**
Return ONLY valid JSON (no markdown, no explanations) in this exact structure:

{
  "days": [
    {
      "dayNumber": 1,
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Visit Marina Beach",
          "placeName": "Marina Beach",
          "address": "Beach Road, Chennai 600001",
          "description": "Detailed description with practical tips",
          "estimatedCost": 100,
          "category": "attraction"
        }
      ]
    }
  ]
}

**Important:**
- estimatedCost must be a number (Indian Rupees)
- Free activities should have estimatedCost: 0
- Include placeName and address for every activity
- category must be one of: "attraction", "restaurant", "hotel", "activity"
- Be realistic with costs (check 2026 prices)
- Total of all estimatedCost values must be ≤ ${budget}`;

    const startTime = Date.now();

    // Try multiple Gemini models
    const candidateModels = [
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest'
    ];

    let result = null;
    let lastModelError = null;
    let usedModel = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json'
          }
        });

        result = await model.generateContent(prompt);
        usedModel = modelName;
        console.log(`✅ Gemini model '${modelName}' succeeded!`);
        break;
      } catch (err) {
        console.warn(`⚠️ Gemini model '${modelName}' failed:`, err.message);
        lastModelError = err;
      }
    }

    if (!result) {
      throw lastModelError || new Error('All Gemini model attempts failed');
    }

    const response = await result.response;
    const text = response.text();

    const endTime = Date.now();
    console.log(`✅ Itinerary generated in ${endTime - startTime}ms`);

    // Parse JSON response
    let itineraryData;
    try {
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      itineraryData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text.substring(0, 500));
      throw new AppError('AI generated invalid response format. Please try again.', 500);
    }

    // Validate response structure
    if (!itineraryData.days || !Array.isArray(itineraryData.days)) {
      throw new AppError('AI response missing required "days" array', 500);
    }

    // Calculate total cost
    const totalCost = itineraryData.days.reduce((sum, day) => {
      return sum + day.activities.reduce((daySum, activity) => {
        return daySum + (activity.estimatedCost || 0);
      }, 0);
    }, 0);

    console.log(`💰 Total itinerary cost: ₹${totalCost.toLocaleString('en-IN')} (Budget: ₹${budget.toLocaleString('en-IN')})`);

    // Enrich activities with Google Maps links
    const enrichedDays = itineraryData.days.map(day => ({
      ...day,
      activities: day.activities.map(act => {
        const query = encodeURIComponent(`${act.placeName || act.title} ${act.address || destination}`);
        return {
          ...act,
          googleMapsUrl: act.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${query}`,
          verified: hasRealData,
          dataSource: hasRealData ? placesData.source : 'AI Generated'
        };
      })
    }));

    return {
      days: enrichedDays,
      metadata: {
        destination,
        budget,
        duration,
        interests,
        startDate,
        totalEstimatedCost: totalCost,
        generatedAt: new Date().toISOString(),
        isFallback: false,
        aiModel: usedModel,
        usedRealPlaces: hasRealData,
        dataSource: hasRealData ? placesData.source : 'AI Generated',
        placesCount: hasRealData ? placesData.totalPlaces : 0
      }
    };

  } catch (error) {
    console.error('Enhanced Gemini Service Error:', error.message);
    throw error;
  }
};

module.exports = {
  generateItinerary,
  initializeGemini
};
