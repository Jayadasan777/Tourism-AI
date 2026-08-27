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
  const dayTemplates = [
    {
      activities: [
        { time: '09:00 AM', title: `Arrival in ${destination}`, description: 'Check into hotel and acclimatize. Explore nearby areas and local markets.', estimatedCost: 0 },
        { time: '02:00 PM', title: 'Local Sightseeing', description: 'Visit popular landmarks and attractions nearby. Take photos and enjoy local cuisine.', estimatedCost: Math.floor(dailyBudget * 0.3) },
        { time: '07:00 PM', title: 'Evening Relaxation', description: 'Enjoy sunset views and try authentic local restaurants.', estimatedCost: Math.floor(dailyBudget * 0.2) },
      ]
    },
    {
      activities: [
        { time: '07:00 AM', title: 'Morning Exploration', description: 'Start your day early with a guided tour of the main attractions.', estimatedCost: Math.floor(dailyBudget * 0.25) },
        { time: '12:00 PM', title: 'Cultural Experience', description: 'Visit museums, temples, or local markets to experience the culture.', estimatedCost: Math.floor(dailyBudget * 0.15) },
        { time: '04:00 PM', title: 'Adventure Activity', description: `Enjoy an adventure activity suited to ${destination}'s terrain and your interests.`, estimatedCost: Math.floor(dailyBudget * 0.35) },
        { time: '08:00 PM', title: 'Dinner', description: 'Try local specialties at a recommended restaurant.', estimatedCost: Math.floor(dailyBudget * 0.15) },
      ]
    },
    {
      activities: [
        { time: '08:00 AM', title: 'Nature Walk', description: 'Morning nature walk or trek to nearby scenic spots.', estimatedCost: 0 },
        { time: '01:00 PM', title: 'Lunch Break', description: 'Enjoy a relaxed lunch at a local eatery with views.', estimatedCost: Math.floor(dailyBudget * 0.1) },
        { time: '03:00 PM', title: 'Departure Preparation', description: 'Visit remaining spots, shop for souvenirs, and prepare for departure.', estimatedCost: Math.floor(dailyBudget * 0.2) },
      ]
    }
  ];

  const days = [];
  for (let i = 1; i <= duration; i++) {
    const template = dayTemplates[(i - 1) % dayTemplates.length];
    days.push({
      dayNumber: i,
      activities: template.activities
    });
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
