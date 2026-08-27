/**
 * REAL BOOKING SERVICE (SANDBOX MODE)
 *
 * Integrates with real booking APIs in SANDBOX/TEST mode
 * Goes through real booking flow but stops before actual payment
 */

const axios = require('axios');

// Use SANDBOX/TEST URLs (not production!)
const REDBUS_SANDBOX = 'https://api.sandbox.redbus.in'; // Example - check RedBus docs
const RAZORPAY_TEST_KEY = process.env.RAZORPAY_TEST_KEY || 'rzp_test_xxxxx';

/**
 * Search real buses using RedBus Sandbox API
 */
const searchRealBuses = async ({ from, to, date }) => {
  console.log(`🚌 Searching REAL buses: ${from} → ${to}`);

  try {
    // NOTE: This is example structure - adjust based on actual RedBus API
    const response = await axios.get(`${REDBUS_SANDBOX}/v1/search`, {
      headers: {
        'Authorization': `Bearer ${process.env.REDBUS_SANDBOX_KEY}`,
        'Content-Type': 'application/json'
      },
      params: {
        source: from,
        destination: to,
        journey_date: date
      }
    });

    const buses = response.data.buses || [];

    console.log(`✅ Found ${buses.length} REAL buses`);

    return buses.map(bus => ({
      id: bus.id,
      operator: bus.operator_name,
      type: bus.bus_type,
      departure: bus.departure_time,
      arrival: bus.arrival_time,
      duration: bus.duration,
      price: bus.fare,
      seatsAvailable: bus.seats_available,
      rating: bus.rating,
      amenities: bus.amenities || [],
      isRealData: true,
      source: 'RedBus Sandbox API'
    }));

  } catch (error) {
    console.warn('⚠️ RedBus Sandbox not available, using fallback');

    // Fallback realistic data if sandbox not available
    return [
      {
        id: 'DEMO_BUS_1',
        operator: 'KPN Travels',
        type: 'A/C Sleeper',
        departure: '21:30',
        arrival: '06:00',
        duration: '8h 30m',
        price: 800,
        seatsAvailable: 18,
        rating: 4.2,
        amenities: ['WiFi', 'Charging Point', 'Water Bottle'],
        isRealData: false,
        source: 'Demo Data (Enable RedBus sandbox for real data)'
      },
      {
        id: 'DEMO_BUS_2',
        operator: 'VRL Travels',
        type: 'A/C Semi-Sleeper',
        departure: '22:00',
        arrival: '06:30',
        duration: '8h 30m',
        price: 650,
        seatsAvailable: 22,
        rating: 4.0,
        amenities: ['Charging Point', 'Water Bottle'],
        isRealData: false,
        source: 'Demo Data'
      }
    ];
  }
};

/**
 * Initiate booking (up to payment page)
 */
const initiateRealBooking = async ({ busId, seats, passengers, contactDetails }) => {
  console.log(`📝 Initiating REAL booking for bus: ${busId}`);

  try {
    // Step 1: Block seats (temporary hold)
    const blockResponse = await axios.post(`${REDBUS_SANDBOX}/v1/block-seats`, {
      bus_id: busId,
      seats: seats,
      contact: contactDetails
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.REDBUS_SANDBOX_KEY}`
      }
    });

    const blockingId = blockResponse.data.blocking_id;
    console.log(`✅ Seats blocked: ${blockingId}`);

    // Step 2: Create booking (not confirmed yet)
    const bookingResponse = await axios.post(`${REDBUS_SANDBOX}/v1/create-booking`, {
      blocking_id: blockingId,
      passengers: passengers
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.REDBUS_SANDBOX_KEY}`
      }
    });

    const bookingId = bookingResponse.data.booking_id;
    const amount = bookingResponse.data.total_amount;

    console.log(`✅ Booking created: ${bookingId}`);
    console.log(`💰 Amount: ₹${amount}`);

    // Step 3: Generate Razorpay payment link (TEST MODE)
    const paymentOrder = await createRazorpayTestOrder({
      amount: amount,
      bookingId: bookingId,
      description: `Bus Booking - ${busId}`
    });

    return {
      success: true,
      bookingId: bookingId,
      amount: amount,
      status: 'PENDING_PAYMENT',
      paymentOrder: paymentOrder,
      message: 'Booking created! Ready for payment (TEST MODE)',
      isTestMode: true
    };

  } catch (error) {
    console.warn('⚠️ Real booking API not available, using demo flow');

    // Fallback demo booking
    const demoBookingId = `DEMO_${Date.now()}`;
    const demoAmount = 800;

    const paymentOrder = await createRazorpayTestOrder({
      amount: demoAmount,
      bookingId: demoBookingId,
      description: 'Demo Bus Booking'
    });

    return {
      success: true,
      bookingId: demoBookingId,
      amount: demoAmount,
      status: 'PENDING_PAYMENT',
      paymentOrder: paymentOrder,
      message: 'Demo booking created! (Enable RedBus sandbox for real integration)',
      isTestMode: true,
      isDemoData: true
    };
  }
};

/**
 * Create Razorpay payment order (TEST MODE)
 */
const createRazorpayTestOrder = async ({ amount, bookingId, description }) => {
  console.log(`💳 Creating Razorpay TEST order: ₹${amount}`);

  // NOTE: In real implementation, use Razorpay SDK
  // const Razorpay = require('razorpay');
  // const razorpay = new Razorpay({
  //   key_id: RAZORPAY_TEST_KEY,
  //   key_secret: process.env.RAZORPAY_TEST_SECRET
  // });

  // For demo, return mock Razorpay order structure
  const orderId = `order_${Date.now()}`;

  return {
    id: orderId,
    amount: amount * 100, // Razorpay uses paise
    currency: 'INR',
    receipt: bookingId,
    description: description,
    key: RAZORPAY_TEST_KEY,
    testMode: true,
    paymentUrl: `https://api.razorpay.com/v1/checkout/${orderId}`,
    instructions: {
      message: '⚠️ TEST MODE - Use test card for demo',
      testCard: {
        number: '4111 1111 1111 1111',
        cvv: '123',
        expiry: 'Any future date',
        name: 'Test User'
      }
    }
  };
};

/**
 * Complete payment (TEST MODE ONLY - for demo)
 */
const completeTestPayment = async ({ orderId, paymentMethod }) => {
  console.log(`✅ Processing TEST payment: ${orderId}`);

  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    success: true,
    paymentId: `pay_${Date.now()}`,
    orderId: orderId,
    status: 'SUCCESS',
    method: paymentMethod,
    message: '✅ TEST Payment successful! (No real money charged)',
    isTestMode: true
  };
};

/**
 * Get booking status
 */
const getBookingStatus = async (bookingId) => {
  console.log(`🔍 Checking booking status: ${bookingId}`);

  // In real implementation, query RedBus API
  return {
    bookingId: bookingId,
    status: 'PENDING_PAYMENT',
    expiresIn: '15 minutes',
    message: 'Seats blocked. Complete payment to confirm.'
  };
};

module.exports = {
  searchRealBuses,
  initiateRealBooking,
  completeTestPayment,
  getBookingStatus,
  createRazorpayTestOrder
};
