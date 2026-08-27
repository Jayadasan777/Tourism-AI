/**
 * ROUTE OPTIMIZATION AGENT
 * Finds best route between destinations with stops
 */

// Tamil Nadu cities with coordinates
const TN_CITIES = {
  chennai: { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  madurai: { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
  rameswaram: { name: 'Rameswaram', lat: 9.2876, lng: 79.3129 },
  coimbatore: { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
  ooty: { name: 'Ooty', lat: 11.4102, lng: 76.6950 },
  trichy: { name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047 },
  thanjavur: { name: 'Thanjavur', lat: 10.7870, lng: 79.1378 },
  kanyakumari: { name: 'Kanyakumari', lat: 8.0883, lng: 77.5385 },
  salem: { name: 'Salem', lat: 11.6643, lng: 78.1460 },
  kodaikanal: { name: 'Kodaikanal', lat: 10.2381, lng: 77.4892 }
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Find cities along the route
 */
function findCitiesAlongRoute(start, end) {
  const startCity = TN_CITIES[start.toLowerCase()] || TN_CITIES.chennai;
  const endCity = TN_CITIES[end.toLowerCase()] || TN_CITIES.madurai;

  const stops = [];

  // Calculate which cities are roughly on the path
  Object.entries(TN_CITIES).forEach(([id, city]) => {
    if (id === start.toLowerCase() || id === end.toLowerCase()) return;

    const distFromStart = calculateDistance(startCity.lat, startCity.lng, city.lat, city.lng);
    const distToEnd = calculateDistance(city.lat, city.lng, endCity.lat, endCity.lng);
    const directDist = calculateDistance(startCity.lat, startCity.lng, endCity.lat, endCity.lng);

    // Check if city is roughly on the path (within 20% deviation)
    const totalDist = distFromStart + distToEnd;
    const deviation = (totalDist - directDist) / directDist;

    if (deviation < 0.3) {
      stops.push({
        id,
        name: city.name,
        distanceFromStart: Math.round(distFromStart),
        distanceToEnd: Math.round(distToEnd),
        deviation: Math.round(deviation * 100)
      });
    }
  });

  // Sort by distance from start
  stops.sort((a, b) => a.distanceFromStart - b.distanceFromStart);

  return stops;
}

/**
 * Generate route options
 */
function generateRouteOptions(start, end, budget, duration) {
  const startCity = TN_CITIES[start.toLowerCase()] || TN_CITIES.chennai;
  const endCity = TN_CITIES[end.toLowerCase()] || TN_CITIES.madurai;

  const directDistance = calculateDistance(startCity.lat, startCity.lng, endCity.lat, endCity.lng);
  const stops = findCitiesAlongRoute(start, end);

  const routes = [];

  // Route 1: Direct (fastest)
  routes.push({
    id: 'direct',
    name: 'Direct Route',
    description: 'Fastest way to reach your destination',
    path: [start, end],
    distance: Math.round(directDistance),
    estimatedTime: Math.round(directDistance / 50), // Assume 50km/h average
    estimatedCost: Math.round(directDistance * 2), // ₹2 per km
    stops: [],
    score: 85,
    pros: ['Fastest', 'Cheapest'],
    cons: ['No sightseeing stops']
  });

  // Route 2: With stops (scenic)
  if (stops.length > 0) {
    const topStops = stops.slice(0, Math.min(2, stops.length));
    const totalDistance = topStops.reduce((sum, stop) => sum + stop.distanceFromStart, 0) +
                         topStops[topStops.length - 1].distanceToEnd;

    routes.push({
      id: 'scenic',
      name: 'Scenic Route',
      description: 'Explore interesting places along the way',
      path: [start, ...topStops.map(s => s.name), end],
      distance: Math.round(totalDistance),
      estimatedTime: Math.round(totalDistance / 50),
      estimatedCost: Math.round(totalDistance * 2),
      stops: topStops.map(s => ({
        name: s.name,
        distance: s.distanceFromStart,
        suggestedDuration: '3-4 hours'
      })),
      score: 92,
      pros: ['Sightseeing', 'Cultural experience'],
      cons: ['Takes longer']
    });
  }

  // Route 3: Budget route
  routes.push({
    id: 'budget',
    name: 'Budget Route',
    description: 'Most economical option',
    path: [start, end],
    distance: Math.round(directDistance),
    estimatedTime: Math.round(directDistance / 40), // Slower buses
    estimatedCost: Math.round(directDistance * 1.5), // Cheaper transport
    stops: [],
    score: 78,
    pros: ['Cheapest', 'Direct'],
    cons: ['Slower transport', 'Less comfortable']
  });

  return routes;
}

/**
 * Main route optimization function
 */
const optimizeRoute = async ({ from, to, budget, duration }) => {
  console.log(`🗺️ Route Agent: Optimizing route from ${from} to ${to}`);

  // Generate route options
  const routes = generateRouteOptions(from, to, budget, duration);

  // Pick recommended based on score and budget
  const recommended = routes.reduce((best, route) => {
    if (route.estimatedCost <= budget && route.score > best.score) {
      return route;
    }
    return best;
  }, routes[0]);

  return {
    recommended,
    alternatives: routes.filter(r => r.id !== recommended.id),
    analysis: {
      totalOptions: routes.length,
      budgetCheck: recommended.estimatedCost <= budget ? 'Within budget' : 'Over budget',
      timeCheck: recommended.estimatedTime <= (duration * 10) ? 'Fits timeline' : 'Tight schedule'
    }
  };
};

module.exports = {
  optimizeRoute,
  calculateDistance,
  TN_CITIES
};
