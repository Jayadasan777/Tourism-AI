/**
 * AGENTIC AI CONTROLLER
 * Orchestrates AI agents for autonomous travel planning
 */

const { optimizeRoute } = require('../services/routeAgent');
const { findTransport, bookTransport } = require('../services/transportAgent');

/**
 * Plan complete trip using AI agents
 * POST /api/agentic/plan-trip
 */
const planCompleteTrip = async (req, res, next) => {
  try {
    const { from, to, budget, duration, interests, startDate } = req.body;

    console.log('\n🤖 MASTER AGENT: Starting autonomous trip planning...');
    console.log(`   From: ${from} → To: ${to}`);
    console.log(`   Budget: ₹${budget} | Duration: ${duration} days\n`);

    // STEP 1: Route Agent - Find best route
    console.log('📍 Step 1: Route Agent optimizing route...');
    const routeResult = await optimizeRoute({ from, to, budget, duration });
    console.log(`✅ Route optimized: ${routeResult.recommended.name}`);

    // STEP 2: Transport Agent - Find transport for each leg
    console.log('\n🚂 Step 2: Transport Agent finding transport...');
    const transportPromises = [];

    // For recommended route, find transport
    const path = routeResult.recommended.path;
    for (let i = 0; i < path.length - 1; i++) {
      const leg = {
        from: path[i],
        to: path[i + 1],
        budget: Math.floor(budget * 0.3 / (path.length - 1)) // 30% of budget for transport
      };
      transportPromises.push(findTransport(leg));
    }

    const transports = await Promise.all(transportPromises);
    console.log(`✅ Found ${transports.length} transport options`);

    // STEP 3: Calculate costs
    console.log('\n💰 Step 3: Calculating total costs...');
    const transportCost = transports.reduce((sum, t) => sum + t.recommended.cost, 0);
    const routeCost = routeResult.recommended.estimatedCost;
    const totalCost = transportCost;
    const remainingBudget = budget - totalCost;

    console.log(`   Transport: ₹${transportCost}`);
    console.log(`   Remaining for hotels/activities: ₹${remainingBudget}`);

    // STEP 4: Prepare response
    console.log('\n✅ MASTER AGENT: Trip planning complete!\n');

    const response = {
      success: true,
      data: {
        route: {
          ...routeResult.recommended,
          alternatives: routeResult.alternatives
        },
        transports: transports.map(t => ({
          leg: { from: t.from, to: t.to },
          recommended: t.recommended,
          alternatives: t.alternatives.slice(0, 2) // Top 2 alternatives
        })),
        costs: {
          transport: transportCost,
          hotels: Math.floor(remainingBudget * 0.6), // Estimate
          activities: Math.floor(remainingBudget * 0.4), // Estimate
          total: totalCost + remainingBudget,
          remaining: budget - (totalCost + remainingBudget)
        },
        timeline: {
          totalDays: duration,
          travelDays: Math.ceil(routeResult.recommended.estimatedTime / 10),
          explorationDays: duration - Math.ceil(routeResult.recommended.estimatedTime / 10)
        },
        agentDecisions: [
          {
            agent: 'Route Agent',
            decision: `Selected ${routeResult.recommended.name}`,
            reason: `${routeResult.recommended.pros.join(', ')}`,
            score: routeResult.recommended.score
          },
          {
            agent: 'Transport Agent',
            decision: `Selected ${transports[0].recommended.name} (${transports[0].recommended.icon})`,
            reason: `Best value: ₹${transports[0].recommended.cost}, ${transports[0].recommended.reviews}★ rating`,
            score: Math.round(transports[0].recommended.reviews * 20)
          }
        ],
        readyToBook: true,
        metadata: {
          generatedAt: new Date().toISOString(),
          agentsUsed: ['Route Agent', 'Transport Agent'],
          totalOptionsEvaluated: transports.reduce((sum, t) => sum + t.alternatives.length + 1, 0) + routeResult.alternatives.length + 1
        }
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('❌ Agentic planning error:', error);
    next(error);
  }
};

/**
 * Execute all bookings autonomously
 * POST /api/agentic/execute-bookings
 */
const executeBookings = async (req, res, next) => {
  try {
    const { planData, userDetails } = req.body;

    console.log('\n🎯 MASTER AGENT: Executing autonomous bookings...');

    const bookings = [];

    // Book transports
    console.log('\n🚂 Booking transports...');
    for (const transport of planData.transports || []) {
      const booking = await bookTransport(transport.recommended, {
        ...userDetails,
        from: transport.leg.from,
        to: transport.leg.to,
        travelDate: userDetails.startDate
      });
      bookings.push(booking);
      console.log(`✅ ${booking.type} booked: ${booking.bookingId}`);
    }

    // Simulate delay for other bookings
    console.log('\n🏨 Simulating hotel bookings...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('\n🎯 Simulating activity bookings...');
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log('\n📧 Sending confirmations...');
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('\n✅ ALL BOOKINGS COMPLETE!\n');

    res.status(200).json({
      success: true,
      data: {
        bookings,
        summary: {
          totalBookings: bookings.length,
          transports: bookings.length,
          hotels: 0, // Mock
          activities: 0, // Mock
          status: 'ALL CONFIRMED'
        },
        confirmations: {
          email: `Sent to ${userDetails.email || 'user@email.com'}`,
          sms: `Sent to ${userDetails.phone || '+91XXXXXXXXXX'}`,
          pdf: 'itinerary.pdf'
        },
        message: '🎉 Trip booked successfully! All confirmations sent.'
      }
    });

  } catch (error) {
    console.error('❌ Booking execution error:', error);
    next(error);
  }
};

/**
 * Get agent status (for live updates)
 * GET /api/agentic/status/:taskId
 */
const getAgentStatus = async (req, res, next) => {
  try {
    // Mock status for demo
    const statuses = [
      { agent: 'Route Agent', status: 'completed', progress: 100 },
      { agent: 'Transport Agent', status: 'in_progress', progress: 75 },
      { agent: 'Hotel Agent', status: 'queued', progress: 0 }
    ];

    res.status(200).json({
      success: true,
      data: { agents: statuses }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  planCompleteTrip,
  executeBookings,
  getAgentStatus
};
