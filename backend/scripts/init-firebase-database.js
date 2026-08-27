/**
 * FIREBASE FIRESTORE DATABASE INITIALIZATION
 *
 * This script sets up the Tamil Nadu Tourism Database structure
 * Run once to create collections and indexes
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../config/serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

/**
 * Create Firestore collections and indexes
 */
async function initializeDatabase() {
  console.log('🚀 Initializing Tamil Nadu Tourism Database...\n');

  try {
    // 1. Create Districts Collection
    console.log('📍 Creating districts collection...');
    const districtsRef = db.collection('districts');
    await districtsRef.doc('_metadata').set({
      totalDistricts: 38,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      version: '1.0.0',
      description: 'All 38 Tamil Nadu districts'
    });
    console.log('✅ Districts collection created\n');

    // 2. Create Places Collection
    console.log('🏛️ Creating places collection...');
    const placesRef = db.collection('places');
    await placesRef.doc('_metadata').set({
      totalPlaces: 0,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      categories: ['attraction', 'temple', 'beach', 'museum', 'park', 'monument'],
      description: 'Tourist attractions across Tamil Nadu'
    });
    console.log('✅ Places collection created\n');

    // 3. Create Restaurants Collection
    console.log('🍽️ Creating restaurants collection...');
    const restaurantsRef = db.collection('restaurants');
    await restaurantsRef.doc('_metadata').set({
      totalRestaurants: 0,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      cuisines: ['South Indian', 'Tamil', 'North Indian', 'Chinese', 'Continental'],
      description: 'Restaurants and eateries across Tamil Nadu'
    });
    console.log('✅ Restaurants collection created\n');

    // 4. Create Hotels Collection
    console.log('🏨 Creating hotels collection...');
    const hotelsRef = db.collection('hotels');
    await hotelsRef.doc('_metadata').set({
      totalHotels: 0,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      categories: ['luxury', 'mid-range', 'budget', 'homestay', 'hostel', 'resort'],
      description: 'Hotels and accommodations across Tamil Nadu'
    });
    console.log('✅ Hotels collection created\n');

    // 5. Create Distance Matrix Collection
    console.log('📏 Creating distances collection...');
    const distancesRef = db.collection('distances');
    await distancesRef.doc('_metadata').set({
      totalMatrices: 0,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      description: 'Pre-calculated distances between places'
    });
    console.log('✅ Distances collection created\n');

    // 6. Create Verification Logs Collection
    console.log('✅ Creating verification_logs collection...');
    const verificationRef = db.collection('verification_logs');
    await verificationRef.doc('_metadata').set({
      totalVerifications: 0,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      levels: ['API_VERIFIED', 'MULTI_SOURCE', 'PHONE_VERIFIED', 'GROUND_VERIFIED', 'COMMUNITY_VERIFIED'],
      description: 'Verification audit trail for all data'
    });
    console.log('✅ Verification logs collection created\n');

    // 7. Create User Feedback Collection
    console.log('💬 Creating user_feedback collection...');
    const feedbackRef = db.collection('user_feedback');
    await feedbackRef.doc('_metadata').set({
      totalFeedback: 0,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      description: 'User reports and confirmations of data accuracy'
    });
    console.log('✅ User feedback collection created\n');

    console.log('═'.repeat(70));
    console.log('🎉 DATABASE INITIALIZED SUCCESSFULLY!\n');
    console.log('Collections created:');
    console.log('  ✅ districts');
    console.log('  ✅ places');
    console.log('  ✅ restaurants');
    console.log('  ✅ hotels');
    console.log('  ✅ distances');
    console.log('  ✅ verification_logs');
    console.log('  ✅ user_feedback\n');
    console.log('Next step: Run data collection scripts');
    console.log('═'.repeat(70));

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

/**
 * Create composite indexes (run manually in Firebase Console)
 */
function printIndexInstructions() {
  console.log('\n📝 MANUAL INDEX CREATION REQUIRED:\n');
  console.log('Go to Firebase Console > Firestore > Indexes\n');
  console.log('Create these composite indexes:\n');

  console.log('1. places collection:');
  console.log('   - district (Ascending) + verified (Descending) + rating (Descending)');
  console.log('   - district (Ascending) + category (Ascending) + rating (Descending)');
  console.log('   - coordinates.lat (Ascending) + coordinates.lng (Ascending)\n');

  console.log('2. restaurants collection:');
  console.log('   - district (Ascending) + verified (Descending) + rating (Descending)');
  console.log('   - district (Ascending) + cuisine (Ascending) + rating (Descending)');
  console.log('   - pricing.costForTwo (Ascending) + rating (Descending)\n');

  console.log('3. hotels collection:');
  console.log('   - district (Ascending) + verified (Descending) + rating (Descending)');
  console.log('   - district (Ascending) + category (Ascending) + rating (Descending)');
  console.log('   - rooms.pricePerNight (Ascending) + rating (Descending)\n');
}

// Run initialization
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      printIndexInstructions();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
