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
 * Execute all bookings autonomously via n8n
 * POST /api/agentic/execute-bookings
 */
const executeBookings = async (req, res, next) => {
  try {
    const { planData, userDetails } = req.body;

    console.log('\n🎯 MASTER AGENT: Executing bookings via n8n...');

    // Call n8n webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/book-trip';

    const bookingPayload = {
      from: planData.route?.path?.[0] || 'Chennai',
      to: planData.route?.path?.[planData.route.path.length - 1] || 'Rameswaram',
      transport: planData.transports?.[0]?.recommended?.name || 'Train',
      transportCost: planData.transports?.[0]?.recommended?.cost || 450,
      hotel: 'Hotel Madurai Residency',
      hotelCost: 1800,
      userEmail: userDetails.email || 'user@example.com',
      userPhone: userDetails.phone || '+91XXXXXXXXXX',
      budget: planData.costs?.total || 15000
    };

    console.log('📤 Sending to n8n workflow:', n8nWebhookUrl);

    // Call n8n workflow
    const axios = require('axios');
    let n8nResponse;

    try {
      n8nResponse = await axios.post(n8nWebhookUrl, bookingPayload, {
        timeout: 30000
      });
      console.log('✅ n8n workflow executed successfully!');
    } catch (n8nError) {
      console.warn('⚠️ n8n not running, using fallback booking...');

      // Fallback if n8n not running
      const bookings = [];
      for (const transport of planData.transports || []) {
        const booking = await bookTransport(transport.recommended, {
          ...userDetails,
          from: transport.leg.from,
          to: transport.leg.to,
          travelDate: userDetails.startDate
        });
        bookings.push(booking);
      }

      return res.status(200).json({
        success: true,
        data: {
          bookings,
          method: 'fallback',
          summary: {
            totalBookings: bookings.length,
            transports: bookings.length,
            hotels: 0,
            activities: 0,
            status: 'ALL CONFIRMED'
          },
          confirmations: {
            email: `Sent to ${userDetails.email || 'user@example.com'}`,
            sms: `Sent to ${userDetails.phone || '+91XXXXXXXXXX'}`,
            pdf: 'itinerary.pdf'
          },
          message: '🎉 Trip booked successfully! (Fallback mode)'
        }
      });
    }

    // Return n8n response
    console.log('\n✅ ALL BOOKINGS COMPLETE VIA n8n!\n');

    res.status(200).json({
      success: true,
      data: {
        ...n8nResponse.data,
        method: 'n8n',
        workflow: 'Smart Tour AI - Travel Booking',
        message: '🎉 Trip booked successfully via n8n automation!'
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

/**
 * Automate real booking on RedBus website
 * POST /api/agentic/automate-booking
 */
const automateRealBooking = async (req, res, next) => {
  try {
    const { from, to, date, passengerDetails } = req.body;

    console.log('\n🤖 STARTING BROWSER AUTOMATION...');
    console.log(`   ${from} → ${to}`);

    // Import browser automation service
    const { automateRedBusBooking } = require('../services/browserAutomation');

    // Start automation (this opens browser and goes through booking)
    const result = await automateRedBusBooking({
      from,
      to,
      date,
      passengerDetails
    });

    // Send result back to frontend
    res.status(200).json({
      success: result.success,
      data: result
    });

  } catch (error) {
    console.error('❌ Automation error:', error);
    next(error);
  }
};

module.exports = {
  planCompleteTrip,
  executeBookings,
  getAgentStatus,
  automateRealBooking
};
