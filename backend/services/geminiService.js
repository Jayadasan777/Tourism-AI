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

    let model;
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    } catch {
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    }

    const interestsString = interests.join(', ');
    const dailyBudget = Math.floor(budget / duration);

    const prompt = `You are a world-class Indian travel guide and local explorer.
Create an authentic, real-world, conflict-free ${duration}-day travel itinerary for ${destination}, India.

CRITICAL RULES FOR REAL-WORLD AUTHENTICITY:
1. Every activity MUST specify the EXACT REAL-WORLD VENUE NAME (e.g., "Meenakshi Amman Temple", "Murugan Idli Shop", "Heritage Madurai Hotel", "Thirumalai Nayakkar Mahal"), NOT generic text like "Morning Exploration" or "Local Sightseeing".
2. Include authentic hotel stays, popular iconic food spots with real local dishes, exact street names, and verified entry fees / food costs in INR (₹).
3. Schedule activities in a geographically logical sequence (morning to night) to avoid traffic and backtracking.
4. Total estimated cost across all days must stay within ₹${budget.toLocaleString('en-IN')} (Daily ~₹${dailyBudget.toLocaleString('en-IN')}).
5. Tailor experiences to these interests: ${interestsString}.

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

    // List of model names to try in order (using verified supported models)
    const candidateModels = [
      'gemini-2.5-flash',
      'gemini-3.7-flash',
      'gemini-flash-latest',
      'gemini-2.5-pro',
      'gemini-pro-latest',
      'gemini-2.5-flash-lite',
      'gemini-1.5-flash'
    ];
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
            maxOutputTokens: 8192,
            responseMimeType: 'application/json'
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

    // Add metadata and enrich activities with maps links and categories
    const enrichedDays = (itineraryData.days || []).map(day => ({
      ...day,
      activities: (day.activities || []).map(act => {
        const query = encodeURIComponent(`${act.title} ${act.placeName || ''} ${destination}`);
        return {
          ...act,
          category: act.category || (
            act.title.toLowerCase().includes('hotel') || act.title.toLowerCase().includes('stay') ? 'hotel' :
            act.title.toLowerCase().includes('lunch') || act.title.toLowerCase().includes('dinner') || act.title.toLowerCase().includes('breakfast') || act.title.toLowerCase().includes('restaurant') || act.title.toLowerCase().includes('mess') ? 'restaurant' :
            act.title.toLowerCase().includes('trek') || act.title.toLowerCase().includes('boating') || act.title.toLowerCase().includes('sports') || act.title.toLowerCase().includes('shopping') ? 'activity' : 'attraction'
          ),
          googleMapsUrl: act.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${query}`
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
        aiModel: 'gemini-2.5-flash-live'
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

  // ============================================================
  // REAL LANDMARK DATABASE FOR POPULAR INDIAN DESTINATIONS
  // ============================================================
  const cityData = {
    chennai: [
      {
        activities: [
          { time: '07:30 AM', title: 'Marina Beach Sunrise Walk', description: 'Experience the world\'s second-longest natural urban beach stretching 13 km. Enjoy hot filter coffee from beach vendors and watch fishermen haul in their morning catch.', estimatedCost: 50 },
          { time: '10:00 AM', title: 'Kapaleeshwarar Temple, Mylapore', description: '7th-century Dravidian masterpiece dedicated to Lord Shiva with stunning 40m Gopuram towers. Free entry, shoes must be removed.', estimatedCost: 0 },
          { time: '01:00 PM', title: 'Lunch at Saravana Bhavan, Mylapore', description: 'World-famous vegetarian restaurant chain. Try the unlimited banana-leaf thali with sambar, rasam, kootu, and payasam. ₹180-350 per person.', estimatedCost: 300 },
          { time: '03:30 PM', title: 'San Thome Cathedral & Chennai Lighthouse', description: 'Neo-Gothic basilica built over the tomb of St. Thomas the Apostle. Then climb 143 steps to Chennai Lighthouse for panoramic city views. Entry ₹20.', estimatedCost: 100 },
          { time: '06:30 PM', title: 'Sunset at Elliot\'s Beach, Besant Nagar', description: 'Quieter alternative to Marina Beach. Visit the Karl Schmidt Memorial, enjoy bhajji & sundal from street vendors.', estimatedCost: 150 }
        ]
      },
      {
        activities: [
          { time: '09:00 AM', title: 'Fort St. George & Museum', description: 'India\'s first English fortress built in 1644. Houses Fort Museum with colonial artifacts, Clive\'s Corner, and St. Mary\'s Church (oldest Anglican church in India). Entry ₹25.', estimatedCost: 100 },
          { time: '12:00 PM', title: 'Government Museum, Egmore', description: 'Second oldest museum in India (est. 1851). Famous Bronze Gallery has the world\'s finest collection of Chola bronzes including Nataraja. Entry ₹50.', estimatedCost: 100 },
          { time: '02:00 PM', title: 'Shore Temple & Pancha Rathas, Mahabalipuram', description: 'UNESCO World Heritage Site 60km south of Chennai. 7th-century Pallava stone temples carved from monolithic rock. Arjuna\'s Penance bas-relief is the world\'s largest. Entry ₹40.', estimatedCost: 500 },
          { time: '07:00 PM', title: 'Seafood Dinner on ECR', description: 'East Coast Road is lined with seafood restaurants. Try Fisherman\'s Cove or Kipling Cafe for fresh Bay of Bengal catch with traditional Chettinad masala.', estimatedCost: 700 }
        ]
      },
      {
        activities: [
          { time: '08:30 AM', title: 'Guindy National Park', description: 'One of the smallest national parks in India but located inside a metro city. Spot blackbuck, spotted deer, and over 130 bird species. Entry ₹30.', estimatedCost: 50 },
          { time: '11:00 AM', title: 'Shopping at T. Nagar, Ranganathan Street', description: 'India\'s busiest shopping street by revenue. Buy Kanchipuram silk sarees from Nalli Silks (est. 1928), gold jewelry, and filter coffee powder.', estimatedCost: 500 },
          { time: '02:30 PM', title: 'Lunch at Murugan Idli Shop', description: 'Legendary restaurant known for the softest idlis in Chennai. Pair with their signature podi and ghee. Budget meal under ₹150.', estimatedCost: 150 },
          { time: '04:30 PM', title: 'Valluvar Kottam', description: 'Monument shaped like a temple chariot dedicated to Tamil poet Thiruvalluvar. The auditorium here is Asia\'s largest. Entry ₹10.', estimatedCost: 50 },
          { time: '07:00 PM', title: 'Dinner at Dakshin, ITC Grand Chola', description: 'Award-winning South Indian fine dining. Experience Chettinad, Kerala, Andhra, and Karnataka cuisines served on traditional tableware.', estimatedCost: 800 }
        ]
      }
    ],
    rishikesh: [
      {
        activities: [
          { time: '06:30 AM', title: 'Yoga Session at Parmarth Niketan Ashram', description: 'Join free morning yoga and meditation at the Ganga riverbank. One of the largest ashrams in Rishikesh with 1,000+ rooms.', estimatedCost: 0 },
          { time: '10:00 AM', title: 'Laxman Jhula & Ram Jhula', description: 'Walk across these iconic iron suspension bridges spanning the Ganges at 450ft. Visit the 13-story Trimbakeshwar Temple (Tera Manzil) nearby.', estimatedCost: 0 },
          { time: '01:00 PM', title: 'Lunch at Chotiwala Restaurant', description: 'Operating since 1958 — the man in makeup sitting at the entrance is a Rishikesh legend. Try aloo paratha, chole bhature, and fresh lime soda.', estimatedCost: 250 },
          { time: '03:00 PM', title: 'Beatles Ashram (Chaurasi Kutia)', description: 'The abandoned ashram where The Beatles stayed in 1968 with Maharishi Mahesh Yogi. Now features Beatles-themed graffiti art. Entry ₹150 (Indians).', estimatedCost: 150 },
          { time: '06:30 PM', title: 'Triveni Ghat Ganga Aarti', description: 'Mesmerizing fire ceremony at sunset. Hundreds of oil lamps floated on the Ganges with Sanskrit chanting echoing through the valley. Free entry.', estimatedCost: 100 }
        ]
      },
      {
        activities: [
          { time: '07:00 AM', title: 'White Water Rafting, Shivpuri to Rishikesh', description: '16km Grade III-IV rapids including Roller Coaster, Golf Course, and Club House. Includes cliff jumping and body surfing. ₹800-1500 per person.', estimatedCost: 1200 },
          { time: '01:00 PM', title: 'Lunch at Little Buddha Cafe', description: 'Famous cliffside cafe overlooking the Ganges. Israeli-Indian fusion food, fresh hummus, shakshuka, and Ganga-view seating.', estimatedCost: 400 },
          { time: '04:00 PM', title: 'Neer Garh Waterfall Trek', description: '2km scenic forest trail to a cascading 25ft waterfall with natural pools for swimming. Entry ₹30. Best visited after monsoon.', estimatedCost: 100 },
          { time: '07:30 PM', title: 'Bonfire & Camping at Shivpuri', description: 'Riverside camping with bonfire, stargazing, and dinner under the Himalayan sky. Package includes tent, meals, and morning tea.', estimatedCost: 800 }
        ]
      }
    ],
    goa: [
      {
        activities: [
          { time: '08:00 AM', title: 'Baga Beach Morning & Water Sports', description: 'Parasailing (₹500), jet ski (₹400), banana boat (₹300) at Goa\'s most popular beach. Breakfast at Britto\'s beach shack.', estimatedCost: 800 },
          { time: '01:00 PM', title: 'Goan Fish Curry Rice at Fishka, Baga', description: 'Authentic Goan thali with fried kingfish, prawn curry, red rice, sol kadi, and kokum juice. The quintessential Goan meal.', estimatedCost: 500 },
          { time: '04:00 PM', title: 'Fort Aguada & Sinquerim Beach', description: '17th-century Portuguese fortress with a 4-story lighthouse offering panoramic Arabian Sea views. Adjacent to Sinquerim Beach. Free entry.', estimatedCost: 100 },
          { time: '07:30 PM', title: 'Tito\'s Lane & Calangute Nightlife', description: 'Goa\'s most famous nightlife strip. Live music, cocktails, and beach parties. Cover charge varies ₹500-2000 on weekends.', estimatedCost: 1000 }
        ]
      },
      {
        activities: [
          { time: '09:00 AM', title: 'Basilica of Bom Jesus, Old Goa', description: 'UNESCO World Heritage Site (1605). Houses the mortal remains of St. Francis Xavier in a silver casket. Baroque architecture at its finest. Free entry.', estimatedCost: 0 },
          { time: '11:30 AM', title: 'Se Cathedral & Church of St. Francis of Assisi', description: 'Largest church in Asia with its famous Golden Bell (the largest in Goa). Adjacent archaeological museum. Free entry.', estimatedCost: 50 },
          { time: '02:00 PM', title: 'Sahakari Spice Farm Tour', description: 'Guided tour of cardamom, vanilla, pepper, and nutmeg plantations. Includes traditional Goan buffet lunch, local feni tasting, and elephant bath.', estimatedCost: 700 },
          { time: '06:00 PM', title: 'Mandovi River Sunset Cruise', description: '1-hour GTDC cruise with live Goan folk dances (Fugdi & Dekhnni), music, and unlimited drinks. Departs from Panaji jetty. ₹300-500.', estimatedCost: 500 }
        ]
      }
    ],
    jaipur: [
      {
        activities: [
          { time: '08:00 AM', title: 'Amber Fort (Amer Fort)', description: 'Magnificent 16th-century hilltop fortress with Sheesh Mahal (Mirror Palace). Optional elephant ride to the top ₹1100. Entry ₹200 (Indians).', estimatedCost: 500 },
          { time: '12:00 PM', title: 'Lunch at LMB (Laxmi Mishthan Bhandar)', description: 'Operating since 1727 on Johari Bazaar. Famous for dal baati churma, ghevar, and pyaaz kachori. A must-visit Jaipur institution.', estimatedCost: 350 },
          { time: '02:30 PM', title: 'Hawa Mahal (Palace of Winds)', description: '953-window pink sandstone facade built in 1799 by Maharaja Sawai Pratap Singh. Designed so royal women could observe street festivals. Entry ₹50.', estimatedCost: 100 },
          { time: '05:00 PM', title: 'Nahargarh Fort Sunset', description: 'Drive up to this hilltop fort for the most spectacular sunset view over the entire Pink City. Popular spot for photography and chai. Entry ₹50.', estimatedCost: 200 }
        ]
      },
      {
        activities: [
          { time: '09:00 AM', title: 'City Palace & Museum', description: 'Still home to the royal family. Houses the world\'s largest sterling silver vessels (Gangajalis) in Guinness Records. Entry ₹300.', estimatedCost: 400 },
          { time: '12:00 PM', title: 'Jantar Mantar Observatory', description: 'UNESCO World Heritage Site. World\'s largest stone sundial (Samrat Yantra) accurate to 2 seconds. Built by Maharaja Jai Singh II in 1734. Entry ₹50.', estimatedCost: 100 },
          { time: '02:30 PM', title: 'Johari Bazaar Shopping', description: 'Jaipur\'s famous jewelry market. Browse traditional kundan, meenakari, and lac bangles. Bargain hard — start at 40% of asking price.', estimatedCost: 500 },
          { time: '06:00 PM', title: 'Chokhi Dhani Village Experience', description: 'Traditional Rajasthani village-themed resort 20km from city. Unlimited thali dinner, folk dances, puppet shows, camel rides. ₹700-1100.', estimatedCost: 900 }
        ]
      }
    ],
    mumbai: [
      {
        activities: [
          { time: '08:00 AM', title: 'Gateway of India & Taj Mahal Palace Hotel', description: 'Iconic 26m basalt arch built in 1924. Adjacent to the legendary Taj Mahal Palace Hotel (1903). Free to visit.', estimatedCost: 0 },
          { time: '10:30 AM', title: 'Elephanta Caves Ferry', description: 'UNESCO World Heritage rock-cut temples on Elephanta Island. 1-hour ferry from Gateway. 7th-century Trimurti Shiva sculpture. Ferry ₹200, Entry ₹40.', estimatedCost: 400 },
          { time: '02:00 PM', title: 'Street Food at Mohammed Ali Road', description: 'Mumbai\'s most legendary food street. Nalli nihari, seekh kebabs, malpua, and phirni. Budget ₹200-400 for a full feast.', estimatedCost: 400 },
          { time: '05:00 PM', title: 'Marine Drive Sunset (Queen\'s Necklace)', description: '3.6km promenade along the Arabian Sea. Iconic C-shaped road lit up at night. Grab cutting chai and bhelpuri from Chowpatty Beach.', estimatedCost: 100 }
        ]
      }
    ],
    delhi: [
      {
        activities: [
          { time: '08:00 AM', title: 'India Gate & Rajpath', description: '42m war memorial honoring 90,000 Indian soldiers. Morning walk along the ceremonial Rajpath boulevard to Rashtrapati Bhavan. Free.', estimatedCost: 0 },
          { time: '10:30 AM', title: 'Humayun\'s Tomb', description: 'UNESCO World Heritage Site (1570). The architectural precursor to the Taj Mahal with Persian-style char-bagh gardens. Entry ₹40 (Indians).', estimatedCost: 100 },
          { time: '01:00 PM', title: 'Lunch at Karim\'s, Jama Masjid', description: 'Operating since 1913, near Jama Masjid. Mughlai cuisine legends — mutton burra, biryani, and seekh kabab. Budget ₹300-500.', estimatedCost: 450 },
          { time: '04:00 PM', title: 'Chandni Chowk Walk & Red Fort', description: 'Explore Asia\'s oldest market (1650) by rickshaw. Paranthe Wali Gali for stuffed paranthas. Red Fort entry ₹35. Photography ₹25.', estimatedCost: 300 }
        ]
      }
    ],
    bengaluru: [
      {
        activities: [
          { time: '08:00 AM', title: 'Lalbagh Botanical Garden', description: 'Sprawling 240-acre garden established in 1760 by Hyder Ali. Famous Glass House, 3000-million-year-old rock formation, and India\'s largest flower show. Entry ₹30.', estimatedCost: 50 },
          { time: '11:00 AM', title: 'Bangalore Palace', description: 'Tudor-style palace inspired by England\'s Windsor Castle. Built in 1887 with fortified towers, turrets, and green lawns. Entry ₹230.', estimatedCost: 300 },
          { time: '01:30 PM', title: 'Lunch at MTR (Mavalli Tiffin Rooms)', description: 'Bengaluru\'s most iconic restaurant since 1924. Famous for rava idli (invented here), masala dosa, and filter coffee. Expect queues.', estimatedCost: 250 },
          { time: '04:00 PM', title: 'Cubbon Park & Vidhana Soudha', description: '300-acre green lung of Bengaluru with Neo-Dravidian legislative building. Walk or cycle through tree-lined paths.', estimatedCost: 0 }
        ]
      }
    ],
    kerala: [
      {
        activities: [
          { time: '08:00 AM', title: 'Alleppey Houseboat Cruise', description: 'Cruise through the UNESCO-listed backwaters of Vembanad Lake on a traditional kettuvallam (rice barge). Full-day cruise with freshly cooked Kerala fish curry.', estimatedCost: 3000 },
          { time: '01:00 PM', title: 'Kerala Sadhya Lunch on Houseboat', description: 'Traditional 26-dish vegetarian feast served on banana leaf. Avial, olan, sambar, payasam, and parippu curry.', estimatedCost: 0 },
          { time: '04:00 PM', title: 'Kumarakom Bird Sanctuary Visit', description: 'Home to migratory birds from Siberia. Spot cormorants, herons, egrets, and Indian darters in 14-acre mangrove wetlands. Entry ₹50.', estimatedCost: 100 }
        ]
      }
    ]
  };

  // Find matching city data
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
          estimatedCost: Math.min(act.estimatedCost, Math.floor(dailyBudget * 0.45))
        }))
      });
    }
  } else {
    // Generic template for unlisted cities
    const genericTemplates = [
      {
        activities: [
          { time: '09:00 AM', title: `Heritage Walk in ${destination}`, description: `Explore the most iconic heritage sites, temples, forts, and monuments of ${destination}. Guided walking tour recommended.`, estimatedCost: Math.floor(dailyBudget * 0.2) },
          { time: '01:00 PM', title: 'Local Cuisine Experience', description: 'Enjoy the region\'s most famous dishes at a top-rated local restaurant. Ask locals for their personal recommendations.', estimatedCost: Math.floor(dailyBudget * 0.25) },
          { time: '04:00 PM', title: 'Local Markets & Cultural Centers', description: `Visit traditional bazaars, artisan workshops, and craft centers unique to ${destination}.`, estimatedCost: Math.floor(dailyBudget * 0.2) },
          { time: '07:00 PM', title: 'Sunset Viewpoint & Dinner', description: `End the day at ${destination}'s best sunset viewpoint followed by dinner at a highly-rated restaurant.`, estimatedCost: Math.floor(dailyBudget * 0.25) }
        ]
      },
      {
        activities: [
          { time: '08:00 AM', title: 'Nature & Parks', description: `Morning visit to botanical gardens, national parks, or lakes in and around ${destination}.`, estimatedCost: Math.floor(dailyBudget * 0.15) },
          { time: '12:00 PM', title: 'Museum & Art Gallery', description: 'Discover local art, history, and archaeological treasures at the region\'s best museums.', estimatedCost: Math.floor(dailyBudget * 0.2) },
          { time: '04:00 PM', title: 'Adventure Activity', description: `Outdoor activity suited to ${destination}'s geography — trekking, boating, cycling, or water sports.`, estimatedCost: Math.floor(dailyBudget * 0.35) },
          { time: '08:00 PM', title: 'Street Food Tour & Night Walk', description: 'Explore vibrant night markets and street food stalls for an authentic local experience.', estimatedCost: Math.floor(dailyBudget * 0.2) }
        ]
      }
    ];

    for (let i = 1; i <= duration; i++) {
      const template = genericTemplates[(i - 1) % genericTemplates.length];
      days.push({ dayNumber: i, activities: template.activities });
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

