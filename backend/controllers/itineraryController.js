const { generateItinerary } = require('../services/geminiService');
const { getFirestore } = require('../config/firebase');
const { AppError } = require('../utils/errorHandler');

/**
 * Generate new itinerary
 */
const createItinerary = async (req, res, next) => {
  try {
    const { destination, budget, duration, interests, startDate } = req.body;
    const userId = req.user?.uid || null;

    console.log(`📝 Creating itinerary for user: ${userId || 'anonymous'}`);

    // Generate itinerary using Gemini
    const itinerary = await generateItinerary({
      destination,
      budget,
      duration,
      interests,
      startDate
    });

    // Save to Firestore if user is authenticated
    if (userId) {
      const db = getFirestore();
      const itineraryRef = db.collection('itineraries').doc();

      const itineraryData = {
        id: itineraryRef.id,
        userId,
        destination,
        budget,
        duration,
        interests,
        startDate,
        days: itinerary.days,
        totalEstimatedCost: itinerary.metadata.totalEstimatedCost,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await itineraryRef.set(itineraryData);
      console.log(`✅ Itinerary saved with ID: ${itineraryRef.id}`);

      return res.status(201).json({
        success: true,
        message: 'Itinerary generated successfully',
        data: {
          itineraryId: itineraryRef.id,
          ...itinerary
        }
      });
    }

    // Return itinerary without saving for anonymous users
    res.status(201).json({
      success: true,
      message: 'Itinerary generated successfully (not saved - user not authenticated)',
      data: itinerary
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get user's saved itineraries
 */
const getUserItineraries = async (req, res, next) => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    const db = getFirestore();
    const snapshot = await db
      .collection('itineraries')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const itineraries = [];
    snapshot.forEach(doc => {
      itineraries.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      success: true,
      count: itineraries.length,
      data: itineraries
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get specific itinerary by ID
 */
const getItineraryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;

    const db = getFirestore();
    const doc = await db.collection('itineraries').doc(id).get();

    if (!doc.exists) {
      throw new AppError('Itinerary not found', 404);
    }

    const itinerary = doc.data();

    // Check if user owns this itinerary
    if (userId && itinerary.userId !== userId) {
      throw new AppError('Unauthorized access', 403);
    }

    res.status(200).json({
      success: true,
      data: {
        id: doc.id,
        ...itinerary
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Delete itinerary
 */
const deleteItinerary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    const db = getFirestore();
    const doc = await db.collection('itineraries').doc(id).get();

    if (!doc.exists) {
      throw new AppError('Itinerary not found', 404);
    }

    const itinerary = doc.data();

    // Check ownership
    if (itinerary.userId !== userId) {
      throw new AppError('Unauthorized - you can only delete your own itineraries', 403);
    }

    await db.collection('itineraries').doc(id).delete();

    res.status(200).json({
      success: true,
      message: 'Itinerary deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createItinerary,
  getUserItineraries,
  getItineraryById,
  deleteItinerary
};
