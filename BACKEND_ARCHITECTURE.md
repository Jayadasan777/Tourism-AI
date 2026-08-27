# 🏗️ Smart Tour AI - Backend Architecture

Complete technical architecture documentation for the backend system.

---

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (React Frontend)                        │
└────────────────┬────────────────────────────────────────────────────────┘
                 │
                 │ HTTP/HTTPS Requests
                 │
┌────────────────▼────────────────────────────────────────────────────────┐
│                         EXPRESS.JS SERVER (Port 5000)                    │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        MIDDLEWARE LAYER                          │   │
│  │  • CORS (origin validation)                                      │   │
│  │  • JSON body parser                                              │   │
│  │  • Request logger                                                │   │
│  │  • Firebase token verifier (authentication)                      │   │
│  │  • Input validator (Joi schemas)                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                         ROUTE HANDLERS                           │   │
│  │                                                                   │   │
│  │  /api/itinerary/generate  ──► Itinerary Controller              │   │
│  │  /api/itinerary/my        ──► Get User Itineraries              │   │
│  │  /api/safety              ──► Safety Controller                 │   │
│  │  /api/auth/verify         ──► Auth Controller                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       CONTROLLER LAYER                           │   │
│  │                                                                   │   │
│  │  itineraryController.js  ─► Business logic for trips            │   │
│  │  safetyController.js     ─► Aggregate safety data               │   │
│  │  authController.js       ─► User management                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        SERVICE LAYER                             │   │
│  │                                                                   │   │
│  │  geminiService.js   ──► AI itinerary generation                 │   │
│  │  weatherService.js  ──► Real-time weather data                  │   │
│  │  hazardService.js   ──► Mock disaster alerts                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└───────────────────────────┬───────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐  ┌────────────────┐  ┌─────────────────┐
│  Google       │  │ OpenWeatherMap │  │    Firebase     │
│  Gemini API   │  │      API       │  │   (Firestore +  │
│               │  │                │  │   Auth)         │
│ • Itinerary   │  │ • Current      │  │ • User auth     │
│   generation  │  │   weather      │  │ • Itineraries   │
│ • JSON output │  │ • 5-day        │  │   storage       │
│ • 1500/day    │  │   forecast     │  │ • User profiles │
│   FREE        │  │ • Alerts       │  │                 │
└───────────────┘  └────────────────┘  └─────────────────┘
```

---

## 🔄 Request Flow Example: Generate Itinerary

```
1. CLIENT REQUEST
   POST /api/itinerary/generate
   {
     destination: "Rishikesh",
     budget: 25000,
     duration: 4,
     interests: ["adventure", "nature"]
   }
   ↓

2. MIDDLEWARE CHAIN
   ├─► CORS check (allow origin)
   ├─► Parse JSON body
   ├─► Validate schema (Joi)
   │   • Budget: 1000-10M ✓
   │   • Duration: 1-30 days ✓
   │   • Interests: valid array ✓
   ├─► Verify Firebase token (optional for this endpoint)
   ↓

3. ROUTE HANDLER
   /routes/itineraryRoutes.js
   ├─► Match route to controller
   └─► Call: createItinerary()
   ↓

4. CONTROLLER
   /controllers/itineraryController.js
   ├─► Extract user ID (if authenticated)
   ├─► Call service: generateItinerary()
   ├─► Save to Firestore
   └─► Return response
   ↓

5. SERVICE LAYER
   /services/geminiService.js
   ├─► Construct AI prompt with budget constraints
   ├─► Call Gemini API
   │   • Model: gemini-1.5-flash
   │   • Temperature: 0.7
   │   • Output: JSON mode
   ├─► Wait for response (3-7 seconds)
   ├─► Parse JSON
   ├─► Validate structure
   └─► Calculate total cost
   ↓

6. EXTERNAL API
   Google Gemini
   ├─► Process prompt
   ├─► Generate 4-day itinerary
   └─► Return structured JSON
   ↓

7. DATABASE STORAGE
   Firestore
   ├─► Create document in /itineraries collection
   ├─► Store: destination, budget, days[], userId
   └─► Return document ID
   ↓

8. RESPONSE TO CLIENT
   {
     success: true,
     data: {
       itineraryId: "abc123",
       days: [...],
       metadata: {
         totalEstimatedCost: 24800,
         generatedAt: "2026-08-27T..."
       }
     }
   }
```

---

## 🔄 Request Flow Example: Get Safety Info

```
1. CLIENT REQUEST
   GET /api/safety?destination=Ladakh
   ↓

2. ROUTE HANDLER
   /routes/safetyRoutes.js → getSafetyInfo()
   ↓

3. CONTROLLER
   /controllers/safetyController.js
   ├─► Parallel API calls:
   │   ├─► weatherService.getWeatherData()
   │   └─► hazardService.getHazardAlerts()
   ├─► Get emergency contacts
   ├─► Calculate safety score
   └─► Return aggregated data
   ↓

4A. WEATHER SERVICE              4B. HAZARD SERVICE
    ├─► Geocode destination           ├─► Load mock-hazards.json
    ├─► Call OpenWeatherMap           ├─► Normalize destination name
    ├─► Get current weather           ├─► Match to dataset
    ├─► Get 5-day forecast            ├─► Filter active alerts
    └─► Check severe alerts           └─► Return alerts + risks
   ↓                                 ↓

5. AGGREGATE RESPONSE
   {
     destination: "Ladakh",
     safetyLevel: "moderate",
     safetyScore: 70,
     weather: {...},
     hazards: {...},
     emergency: {...}
   }
```

---

## 📁 File Structure & Responsibilities

```
backend/
│
├── server.js                      # 🚀 Application entry point
│   • Initialize Express app
│   • Register middleware (CORS, JSON parser)
│   • Mount route handlers
│   • Start server on port 5000
│   • Global error handling
│
├── config/
│   └── firebase.js                # 🔥 Firebase Admin SDK setup
│       • Initialize Firebase app
│       • Get Firestore instance
│       • Get Auth instance
│       • verifyToken middleware (JWT validation)
│
├── controllers/                   # 🎮 Business logic layer
│   ├── authController.js
│   │   • verifyUser() - validate Firebase token
│   │   • getProfile() - retrieve user from Firestore
│   │   • updateProfile() - update user data
│   │
│   ├── itineraryController.js
│   │   • createItinerary() - generate + save
│   │   • getUserItineraries() - fetch user's trips
│   │   • getItineraryById() - single itinerary
│   │   • deleteItinerary() - remove with ownership check
│   │
│   └── safetyController.js
│       • getSafetyInfo() - aggregate all safety data
│       • getWeather() - weather only
│       • getHazards() - hazards only
│       • getEmergency() - contacts only
│
├── routes/                        # 🛣️ API endpoint definitions
│   ├── authRoutes.js              → /api/auth/*
│   ├── itineraryRoutes.js         → /api/itinerary/*
│   └── safetyRoutes.js            → /api/safety/*
│
├── services/                      # 🔌 External API integrations
│   ├── geminiService.js
│   │   • initializeGemini() - setup Gemini client
│   │   • generateItinerary() - AI prompt + call
│   │   • getFallbackItinerary() - demo data if API fails
│   │
│   ├── weatherService.js
│   │   • getWeatherData() - geocode + weather + forecast
│   │   • getMockWeatherData() - fallback
│   │
│   └── hazardService.js
│       • getHazardAlerts() - load JSON + filter active
│       • getEmergencyContacts() - return contact list
│
├── data/
│   └── mock-hazards.json          # 🚨 Simulated disaster data
│       • Region-based alerts (Ladakh, Kerala, etc.)
│       • Seasonal risk patterns
│       • Clearly labeled as simulated
│
└── utils/                         # 🛠️ Helper functions
    ├── errorHandler.js
    │   • AppError class (custom errors)
    │   • errorHandler middleware
    │   • Firebase error mapping
    │
    └── validateSchema.js
        • Joi schemas (input validation)
        • Request validator middleware
        • Response structure validation
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER SIGNS IN (Frontend)                                 │
│    • Firebase Auth SDK (email/Google)                       │
│    • Returns: Firebase ID token (JWT)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. FRONTEND STORES TOKEN                                    │
│    • localStorage / sessionStorage                          │
│    • Add to all authenticated requests:                     │
│      Authorization: Bearer <token>                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. BACKEND RECEIVES REQUEST                                 │
│    • Extract token from Authorization header                │
│    • verifyToken middleware called                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. FIREBASE ADMIN SDK VERIFIES TOKEN                        │
│    • Decode JWT                                             │
│    • Verify signature                                       │
│    • Check expiration                                       │
│    • Extract user ID (uid)                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴────────────┐
         │                        │
         ▼                        ▼
    ✅ Valid                 ❌ Invalid
    • req.user = decoded    • Return 401 Unauthorized
    • Continue to handler   • Stop request
```

---

## 📊 Data Models

### Itinerary Document (Firestore)
```javascript
{
  id: "abc123",                    // Auto-generated
  userId: "firebase-uid-here",     // Owner
  destination: "Rishikesh",
  budget: 25000,
  duration: 4,
  interests: ["adventure", "nature"],
  startDate: "2026-09-15",
  days: [
    {
      dayNumber: 1,
      activities: [
        {
          time: "09:00 AM",
          title: "River Rafting",
          description: "White water rafting...",
          estimatedCost: 1500
        }
      ]
    }
  ],
  totalEstimatedCost: 24800,
  createdAt: "2026-08-27T10:00:00Z",
  updatedAt: "2026-08-27T10:00:00Z"
}
```

### User Profile Document (Firestore)
```javascript
{
  uid: "firebase-uid-here",
  displayName: "John Doe",
  preferences: {
    language: "en",
    currency: "INR",
    notifications: true
  },
  createdAt: "2026-08-27T09:00:00Z",
  updatedAt: "2026-08-27T10:00:00Z"
}
```

---

## 🔌 External API Integration Details

### 1. Google Gemini API

**Model:** `gemini-1.5-flash`
**Endpoint:** `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent`

**Request:**
```javascript
{
  contents: [{
    parts: [{
      text: "Create a 4-day itinerary for Rishikesh..."
    }]
  }],
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048
  }
}
```

**Response Time:** 3-7 seconds
**Rate Limit:** 1500 requests/day (FREE)
**Error Handling:** Fallback to cached sample itinerary

---

### 2. OpenWeatherMap API

**Endpoints Used:**
1. **Geocoding:** `http://api.openweathermap.org/geo/1.0/direct`
2. **Current Weather:** `https://api.openweathermap.org/data/2.5/weather`
3. **5-Day Forecast:** `https://api.openweathermap.org/data/2.5/forecast`

**Request Flow:**
```
Destination "Ladakh"
  ↓
1. Geocode: "Ladakh" → {lat: 34.15, lon: 77.58}
  ↓
2. Current weather at (34.15, 77.58)
  ↓
3. 5-day forecast at (34.15, 77.58)
  ↓
Return aggregated data
```

**Response Time:** 1-2 seconds (parallel calls)
**Rate Limit:** 60 calls/minute (FREE)
**Error Handling:** Return mock weather data with flag

---

### 3. Firebase Firestore

**Collections:**
- `/users` - User profiles
- `/itineraries` - Generated trips

**Operations:**
- `set()` - Create/update document
- `get()` - Read document
- `where()` - Query with filters
- `delete()` - Remove document

**Security Rules (to be set in Firebase Console):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /itineraries/{itineraryId} {
      allow read: if true; // Public read (for sharing)
      allow write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## ⚡ Performance Optimizations

### Current Implementation:
- [x] Parallel API calls (weather + hazards)
- [x] Firestore indexing on `userId` + `createdAt`
- [x] JSON response compression (gzip via Express)
- [x] Error caching (fallback data for demo)

### Future Improvements:
- [ ] Redis caching for weather data (1-hour TTL)
- [ ] Rate limiting per IP (100 req/15min)
- [ ] Request deduplication (same params within 5s)
- [ ] CDN for static data (hazard JSON)
- [ ] Connection pooling for database

---

## 🛡️ Security Measures

| Layer | Security Measure | Implementation |
|-------|------------------|----------------|
| **Network** | HTTPS only | Enforce in production |
| **CORS** | Origin whitelist | Only frontend domain allowed |
| **Authentication** | Firebase JWT | Token verification on protected routes |
| **Authorization** | Ownership checks | Users can only access their data |
| **Input Validation** | Joi schemas | Validate all request bodies |
| **Secrets** | Environment variables | Never commit `.env` or service account keys |
| **SQL Injection** | N/A | NoSQL database (Firestore) |
| **XSS** | N/A | Backend doesn't render HTML |
| **Rate Limiting** | TODO | Implement before production |

---

## 📈 Monitoring & Logging

### Current Logging:
```javascript
console.log(`[${timestamp}] ${method} ${path}`);  // Request logs
console.log(`✅ Itinerary generated in ${time}ms`); // Performance
console.error('Error:', error.message);            // Errors
```

### Production Recommendations:
- Use **Winston** or **Pino** for structured logging
- Send logs to **CloudWatch** / **Logtail** / **Papertrail**
- Set up alerts for:
  - 5xx error rate > 1%
  - API response time > 10s
  - Firebase quota warnings

---

## 🚀 Deployment Checklist

- [ ] Set `NODE_ENV=production` in environment
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set `FRONTEND_URL` to production domain
- [ ] Upload Firebase service account as secret
- [ ] Verify all API keys work in production
- [ ] Set Firestore security rules (not test mode)
- [ ] Enable Firebase authentication providers
- [ ] Set up monitoring/logging
- [ ] Configure auto-scaling (if using cloud)
- [ ] Test all endpoints from production frontend

---

## 📊 API Usage Tracking

| Service | Free Tier | Current Usage | Alert Threshold |
|---------|-----------|---------------|-----------------|
| Gemini | 1500/day | ~50-100/day | 1200/day |
| OpenWeatherMap | 60/min, 1M/month | ~200/day | 50K/month |
| Firebase Firestore | 50K reads/day | ~500/day | 40K/day |
| Firebase Auth | 50K users | ~10 users | N/A |

---

**Next:** [Frontend Setup Guide](../frontend/README.md)
