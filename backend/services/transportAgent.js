/**
 * TRANSPORT AGENT
 * Suggests best transport options with mock booking capability
 */

const { calculateDistance } = require('./routeAgent');

// Mock transport database
const TRANSPORT_OPTIONS = {
  bus: {
    name: 'Bus',
    icon: '🚌',
    speedKmh: 50,
    costPerKm: 1.5,
    comfort: 3,
    reviews: 4.1
  },
  train: {
    name: 'Train',
    icon: '🚂',
    speedKmh: 60,
    costPerKm: 2,
    comfort: 4,
    reviews: 4.3
  },
  flight: {
    name: 'Flight',
    icon: '✈️',
    speedKmh: 500,
    costPerKm: 8,
    comfort: 5,
    reviews: 4.5
  },
  cab: {
    name: 'Cab',
    icon: '🚗',
    speedKmh: 70,
    costPerKm: 12,
    comfort: 5,
    reviews: 4.4
  }
};

/**
 * Find transport options between two cities
 */
const findTransport = async ({ from, to, budget, preferences = {} }) => {
  console.log(`🚂 Transport Agent: Finding transport from ${from} to ${to}`);

  // Mock city coordinates (simplified)
  const cities = {
    chennai: { lat: 13.0827, lng: 80.2707 },
    madurai: { lat: 9.9252, lng: 78.1198 },
    rameswaram: { lat: 9.2876, lng: 79.3129 }
  };

  const fromCity = cities[from.toLowerCase()] || cities.chennai;
  const toCity = cities[to.toLowerCase()] || cities.madurai;

  const distance = calculateDistance(fromCity.lat, fromCity.lng, toCity.lat, toCity.lng);

  // Generate options for each transport type
  const options = [];

  Object.entries(TRANSPORT_OPTIONS).forEach(([type, transport]) => {
    const cost = Math.round(distance * transport.costPerKm);
    const duration = Math.round((distance / transport.speedKmh) * 60); // in minutes

    // Skip flight for short distances
    if (type === 'flight' && distance < 200) return;

    // Generate mock service names
    const services = generateMockServices(type, from, to);

    options.push({
      type,
      name: transport.name,
      icon: transport.icon,
      distance: Math.round(distance),
      cost,
      duration,
      durationText: formatDuration(duration),
      comfort: transport.comfort,
      reviews: transport.reviews,
      reviewCount: Math.floor(Math.random() * 2000) + 500,
      services,
      withinBudget: cost <= budget
    });
  });

  // Sort by score (cost + reviews + comfort)
  options.sort((a, b) => {
    const scoreA = (a.reviews * 20) + (a.comfort * 10) - (a.cost / 100);
    const scoreB = (b.reviews * 20) + (b.comfort * 10) - (b.cost / 100);
    return scoreB - scoreA;
  });

  // Pick recommended (best value within budget)
  const affordableOptions = options.filter(o => o.withinBudget);
  const recommended = affordableOptions.length > 0 ? affordableOptions[0] : options[0];

  return {
    recommended,
    alternatives: options.filter(o => o.type !== recommended.type),
    analysis: {
      distance: Math.round(distance),
      totalOptions: options.length,
      affordableOptions: affordableOptions.length
    }
  };
};

/**
 * Generate mock service providers
 */
function generateMockServices(type, from, to) {
  const services = {
    bus: [
      { name: 'KPN Travels', rating: 4.2, seats: 18 },
      { name: 'VRL Travels', rating: 4.3, seats: 22 },
      { name: 'SRS Travels', rating: 4.1, seats: 15 }
    ],
    train: [
      { name: 'Pandian Express', rating: 4.4, seats: 42 },
      { name: 'Vaigai Express', rating: 4.2, seats: 38 },
      { name: 'Sethu Express', rating: 4.3, seats: 35 }
    ],
    flight: [
      { name: 'IndiGo', rating: 4.5, seats: 8 },
      { name: 'Air India', rating: 4.3, seats: 12 }
    ],
    cab: [
      { name: 'Ola', rating: 4.4, seats: 1 },
      { name: 'Uber', rating: 4.3, seats: 1 }
    ]
  };

  return services[type] || [];
}

/**
 * Format duration in minutes to readable text
 */
function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes} mins`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Mock booking function
 */
const bookTransport = async (transportOption, userDetails) => {
  console.log(`📝 Booking ${transportOption.name}...`);

  // Simulate booking delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    success: true,
    bookingId: `TRN${Date.now().toString().slice(-8)}`,
    pnr: Math.floor(Math.random() * 9000000000) + 1000000000,
    status: 'CONFIRMED',
    type: transportOption.type,
    from: userDetails.from,
    to: userDetails.to,
    service: transportOption.services[0]?.name || transportOption.name,
    cost: transportOption.cost,
    seats: ['A1-23', 'A1-24'],
    bookingDate: new Date().toISOString(),
    travelDate: userDetails.travelDate,
    message: `✅ ${transportOption.name} booked successfully!`
  };
};

module.exports = {
  findTransport,
  bookTransport
};
