const { GoogleGenerativeAI } = require('@google/generative-ai');
const { AppError } = require('../utils/errorHandler');

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
 * Generate itinerary using Gemini API
 */
const generateItinerary = async ({ destination, budget, duration, interests, startDate }) => {
  try {
    if (!genAI) {
      initializeGemini();
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      }
    });

    const interestsString = interests.join(', ');
    const dailyBudget = Math.floor(budget / duration);

    const prompt = `You are an expert Indian travel planner with deep knowledge of tourist destinations, local experiences, and budget planning.

Create a detailed ${duration}-day travel itinerary for ${destination} with the following requirements:

**Budget Constraint (STRICT):**
- Total budget: ₹${budget.toLocaleString('en-IN')}
- Daily budget: ~₹${dailyBudget.toLocaleString('en-IN')}
- Total cost across all days MUST NOT exceed ₹${budget.toLocaleString('en-IN')}

**Traveler Interests:** ${interestsString}

**Start Date:** ${new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

**Instructions:**
1. Create ${duration} days of activities (2-4 activities per day)
2. Each activity must include: time, title, description, and realistic cost estimate
3. Mix of paid attractions and free experiences
4. Consider local transportation, meals, and accommodation in budget
5. Prioritize activities matching user interests: ${interestsString}
6. Include practical tips (best time to visit, booking requirements)
7. Ensure activities are geographically logical (minimize backtracking)

**Response Format:**
Return ONLY valid JSON (no markdown, no explanations) in this exact structure:

{
  "days": [
    {
      "dayNumber": 1,
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Activity name",
          "description": "Detailed description with practical tips",
          "estimatedCost": 500
        }
      ]
    }
  ]
}

**Important:**
- estimatedCost must be a number (Indian Rupees)
- Free activities should have estimatedCost: 0
- Be realistic with costs (check 2026 prices)
- Total of all estimatedCost values must be ≤ ${budget}`;

    console.log(`🤖 Generating itinerary for ${destination}...`);
    const startTime = Date.now();

    // List of model names to try in order
    const candidateModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-pro'];
    let result = null;
    let lastModelError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 2048,
          }
        });
        result = await model.generateContent(prompt);
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
      // Remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      itineraryData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
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

    // Add metadata
    return {
      ...itineraryData,
      metadata: {
        destination,
        budget,
        duration,
        interests,
        startDate,
        totalEstimatedCost: totalCost,
        generatedAt: new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('Gemini API Error message:', error.message);

    // Return fallback itinerary if API fails so user never gets a 500 error
    console.warn('⚠️ Serving structured fallback itinerary');
    return getFallbackItinerary({ destination, budget, duration, interests, startDate });
  }
};

/**
 * Fallback itinerary for demo/testing (in case API fails)
 */
const getFallbackItinerary = ({ destination, budget, duration, interests, startDate }) => {
  const dailyBudget = Math.floor(budget / duration);
  const destLower = (destination || '').toLowerCase().trim();

  // Real landmark databases for popular destinations
  const cityData = {
    chennai: [
      {
        dayNumber: 1,
        activities: [
          { time: '07:30 AM', title: 'Marina Beach & Morning Sunrise Walk', description: 'Experience the world\'s second-longest natural urban beach. Enjoy hot filter coffee and ocean breeze.', estimatedCost: 50 },
          { time: '10:00 AM', title: 'Kapaleeshwarar Temple, Mylapore', description: '7th-century Dravidian architecture dedicated to Lord Shiva. Marvel at the intricate Gopuram towers.', estimatedCost: 100 },
          { time: '01:00 PM', title: 'Authentic South Indian Lunch at Saravana Bhavan', description: 'Traditional banana-leaf meals with unlimited thali, sambar, and rasam.', estimatedCost: 250 },
          { time: '03:30 PM', title: 'San Thome Cathedral Basilica & Light House', description: 'Neo-Gothic church built over St. Thomas\'s tomb, followed by panoramic views from Chennai Lighthouse.', estimatedCost: 100 },
          { time: '06:30 PM', title: 'Sunset at Eliot\'s Beach (Besant Nagar)', description: 'Relaxed beach vibe, Schmidt Memorial, and vibrant street food stalls.', estimatedCost: 150 }
        ]
      },
      {
        dayNumber: 2,
        activities: [
          { time: '09:00 AM', title: 'Fort St. George & Government Museum', description: 'Explore India\'s first British fortress built in 1644 and the Bronze Gallery museum.', estimatedCost: 150 },
          { time: '12:30 PM', title: 'DakshinaChitra Living Traditions Village', description: 'Heritage museum showcasing traditional architecture and crafts of South India on ECR.', estimatedCost: 250 },
          { time: '03:30 PM', title: 'Shore Temple & Pancha Rathas, Mahabalipuram', description: 'UNESCO World Heritage rock-cut monuments carved out of monolithic granite.', estimatedCost: 350 },
          { time: '07:30 PM', title: 'Coastal Seafood Dinner along East Coast Road (ECR)', description: 'Enjoy fresh Bay of Bengal catch with traditional spices at a sea-view restaurant.', estimatedCost: 600 }
        ]
      },
      {
        dayNumber: 3,
        activities: [
          { time: '08:30 AM', title: 'Guindy National Park & Children\'s Park', description: 'One of the few national parks situated inside a major Indian metro city.', estimatedCost: 50 },
          { time: '11:30 AM', title: 'Shopping at T. Nagar (Ranganathan Street)', description: 'Bustling shopping hub for silk sarees, handicrafts, and local souvenirs.', estimatedCost: 500 },
          { time: '03:00 PM', title: 'Phoenix Marketcity or Express Avenue', description: 'Premier shopping and entertainment destination with air-conditioned comfort.', estimatedCost: 300 },
          { time: '06:30 PM', title: 'Valluvar Kottam & Evening Departure', description: 'Monument dedicated to classical Tamil poet Thiruvalluvar shaped like a temple chariot.', estimatedCost: 50 }
        ]
      }
    ],
    rishikesh: [
      {
        dayNumber: 1,
        activities: [
          { time: '08:00 AM', title: 'Laxman Jhula & Ram Jhula Suspension Bridges', description: 'Walk across iconic iron suspension bridges spanning the holy Ganges river.', estimatedCost: 0 },
          { time: '11:00 AM', title: 'Beatles Ashram (Chaurasi Kutia)', description: 'Historic eco-center where The Beatles stayed in 1968 to learn Transcendental Meditation.', estimatedCost: 150 },
          { time: '02:00 PM', title: 'Cafe Hopping in Tapovan', description: 'Organic smoothie bowls and wood-fired pizzas with river views.', estimatedCost: 400 },
          { time: '06:00 PM', title: 'Triveni Ghat Evening Ganga Aarti', description: 'Witness spiritual oil lamp ceremony accompanied by chanting and bells.', estimatedCost: 100 }
        ]
      },
      {
        dayNumber: 2,
        activities: [
          { time: '08:00 AM', title: 'White Water River Rafting at Shivpuri', description: '16 km thrill down Grade III & IV Ganges rapids including Roller Coaster & Golf Course.', estimatedCost: 1000 },
          { time: '01:30 PM', title: 'Lunch at Little Buddha Cafe', description: 'Famous balcony cafe directly overlooking the Ganges river.', estimatedCost: 350 },
          { time: '04:00 PM', title: 'Neer Garh Waterfall Trek', description: 'Short scenic nature trail up to cascading natural turquoise pools.', estimatedCost: 100 }
        ]
      }
    ],
    goa: [
      {
        dayNumber: 1,
        activities: [
          { time: '09:00 AM', title: 'Baga & Calangute Beach Sunbathing', description: 'Famous North Goa beaches with water sports and beach shacks.', estimatedCost: 200 },
          { time: '01:00 PM', title: 'Goan Fish Curry Thali at Britto\'s', description: 'Authentic kingfish curry with coconut rice and local spices.', estimatedCost: 500 },
          { time: '04:30 PM', title: 'Fort Aguada & Lighthouse Sunset', description: '17th-century Portuguese fortress commanding panoramic Arabian Sea views.', estimatedCost: 100 },
          { time: '08:00 PM', title: 'Tito\'s Lane Nightlife & Beach Shacks', description: 'Vibrant music and evening seaside ambiance.', estimatedCost: 800 }
        ]
      },
      {
        dayNumber: 2,
        activities: [
          { time: '09:30 AM', title: 'Basilica of Bom Jesus & Old Goa Churches', description: 'UNESCO World Heritage site holding the mortal remains of St. Francis Xavier.', estimatedCost: 50 },
          { time: '02:00 PM', title: 'Spice Plantation Tour with Buffet Lunch', description: 'Guided tour of cardamom, vanilla, and pepper farms with traditional Goan lunch.', estimatedCost: 600 },
          { time: '06:00 PM', title: 'Mandovi River Sunset Sunset Cruise', description: '1-hour boat cruise with live traditional Dekhnni & Fugdi folk dances.', estimatedCost: 500 }
        ]
      }
    ]
  };

  // Find matching city data or fallback to generic N-day template
  let selectedDays = null;
  for (const cityKey in cityData) {
    if (destLower.includes(cityKey)) {
      selectedDays = cityData[cityKey];
      break;
    }
  }

  const days = [];
  if (selectedDays) {
    for (let i = 1; i <= duration; i++) {
      const template = selectedDays[(i - 1) % selectedDays.length];
      days.push({
        dayNumber: i,
        activities: template.activities.map(act => ({
          ...act,
          // Scale cost according to budget ratio if needed
          estimatedCost: Math.min(act.estimatedCost, Math.floor(dailyBudget * 0.4))
        }))
      });
    }
  } else {
    // Universal template for any other city
    const genericTemplates = [
      {
        activities: [
          { time: '09:00 AM', title: `Morning Sightseeing in ${destination}`, description: `Explore primary historic landmarks, heritage monuments, and central square in ${destination}.`, estimatedCost: Math.floor(dailyBudget * 0.2) },
          { time: '01:00 PM', title: 'Local Cuisine Lunch', description: `Savor famous regional specialties and street food at popular local eateries.`, estimatedCost: Math.floor(dailyBudget * 0.25) },
          { time: '04:00 PM', title: 'Cultural Center & Local Markets', description: `Browse traditional bazaars, artisan shops, and regional craft centers.`, estimatedCost: Math.floor(dailyBudget * 0.2) },
          { time: '07:30 PM', title: 'Evening Viewpoint & Dinner', description: `Enjoy sunset views from a prominent viewpoint followed by local dinner.`, estimatedCost: Math.floor(dailyBudget * 0.25) }
        ]
      },
      {
        activities: [
          { time: '08:30 AM', title: 'Nature Trail & Garden Visit', description: `Morning visit to top botanical gardens, lakes, or eco-parks in ${destination}.`, estimatedCost: Math.floor(dailyBudget * 0.15) },
          { time: '12:30 PM', title: 'Museum & Art Gallery Tour', description: `Discover the art, history, and royal heritage of the region.`, estimatedCost: Math.floor(dailyBudget * 0.2) },
          { time: '04:30 PM', title: 'Adventure / Outdoor Experience', description: `Enjoy regional outdoor activities tailored to ${destination}'s geography.`, estimatedCost: Math.floor(dailyBudget * 0.3) },
          { time: '08:00 PM', title: 'Dinner & Evening Promenade Walk', description: `Relaxed evening walk along popular city promenades and vibrant night markets.`, estimatedCost: Math.floor(dailyBudget * 0.2) }
        ]
      }
    ];

    for (let i = 1; i <= duration; i++) {
      const template = genericTemplates[(i - 1) % genericTemplates.length];
      days.push({
        dayNumber: i,
        activities: template.activities
      });
    }
  }

  const totalEstimatedCost = days.reduce((sum, day) =>
    sum + day.activities.reduce((s, a) => s + (a.estimatedCost || 0), 0), 0);

  return {
    days,
    metadata: {
      destination,
      budget,
      duration,
      interests,
      startDate,
      totalEstimatedCost,
      generatedAt: new Date().toISOString(),
      isFallback: true
    }
  };
};

module.exports = {
  initializeGemini,
  generateItinerary
};
