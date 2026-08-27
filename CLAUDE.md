# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Smart Tour AI** is a unified intelligent tourism platform for India built for Smart India Hackathon 2026 (Problem Statement SIH26056). It combines AI-powered itinerary generation with real-time safety alerts to solve the fragmented travel-app problem.

**Core Innovation:** Uses Google Gemini AI to generate personalized day-wise itineraries within strict budget constraints, layered with real-time weather data (OpenWeatherMap) and simulated disaster alerts to keep tourists safe.

**Current Status:** Backend complete (Node.js + Express), frontend not yet started.

---

## Development Commands

### Backend

```bash
# Setup & verification
cd backend
npm install
cp .env.example .env          # Then add API keys
npm run check                 # Verify all configs before starting

# Development
npm run dev                   # Start with auto-reload (nodemon)
npm start                     # Start production server

# Testing (manual via HTTP files)
# Use backend/API_TESTS.http with REST Client extension
```

### Required Environment Variables

Backend requires three API keys in `.env`:
- `GEMINI_API_KEY` - Google Gemini 1.5 Flash (free tier: 1500/day)
- `OPENWEATHER_API_KEY` - OpenWeatherMap (free tier: 60/min)
- `FIREBASE_SERVICE_ACCOUNT_PATH` - Path to Firebase Admin SDK JSON

**Critical:** Never commit `.env` or `serviceAccountKey.json` - protected by `.gitignore`.

---

## Architecture

### Request Flow (Routes → Controllers → Services → External APIs)

```
Express Server (server.js)
    ↓
Middleware (CORS, JSON parser, Firebase auth, Joi validation)
    ↓
Routes (/routes/*.js) - Define endpoints
    ↓
Controllers (/controllers/*.js) - Business logic
    ↓
Services (/services/*.js) - External API calls
    ↓
External APIs (Gemini, OpenWeather, Firebase)
```

### Key Patterns

**1. Service Layer Pattern**
- Services (`/services/*.js`) encapsulate all external API calls
- Each service handles its own initialization, error handling, and fallback data
- Controllers never call external APIs directly

**2. Structured JSON from AI**
- Gemini API is configured to return **only valid JSON** (no markdown wrappers)
- Response validation happens in `geminiService.js` before returning to controller
- If invalid JSON returned, retry once, then return fallback itinerary

**3. Safety Data Aggregation**
- `safetyController.js` makes parallel calls to `weatherService` and `hazardService`
- Calculates composite safety score (0-100) based on weather severity + active hazards
- Weather data is live (OpenWeatherMap), hazard data is mock (local JSON)

**4. Mock Data Transparency**
- `backend/data/mock-hazards.json` contains simulated disaster alerts
- Labeled with `_disclaimer` field and in API responses (`isMockData: true`)
- Based on historical patterns for 10+ Indian destinations

**5. Firebase Integration**
- `config/firebase.js` initializes Firebase Admin SDK on first use
- `verifyToken` middleware extracts user ID from JWT for protected routes
- Firestore collections: `/users` and `/itineraries`

---

## API Design Principles

### Endpoint Structure

```
/api/auth/*          - User authentication (Firebase JWT)
/api/itinerary/*     - Trip generation and management
/api/safety/*        - Weather + hazard alerts
/health              - Server health check
```

### Core Endpoints

**POST /api/itinerary/generate** (Primary feature)
- Accepts: destination, budget, duration, interests, startDate
- Validates budget range (₹1,000 - ₹10M), duration (1-30 days)
- Calls Gemini with structured prompt enforcing budget constraints
- Returns day-wise itinerary with activities, costs, and metadata
- Authentication optional (saves to DB if user authenticated)

**GET /api/safety?destination=Ladakh** (Safety layer)
- Parallel fetches: weather + hazards + emergency contacts
- Geocodes destination via OpenWeatherMap
- Returns current weather, 5-day forecast, active alerts, safety score

### Error Handling

Centralized in `utils/errorHandler.js`:
- `AppError` class for operational errors (400-level)
- `errorHandler` middleware catches all errors
- Maps Firebase auth errors to user-friendly messages
- Returns `{success: false, error: "message"}` format

---

## Validation & Constraints

### Input Validation (Joi Schemas)

Defined in `utils/validateSchema.js`:
- `itineraryRequestSchema` - Validates all itinerary inputs
- Budget: min ₹1,000, max ₹10M
- Duration: 1-30 days
- Interests: must be from allowed list (nature, history, adventure, food, culture, relaxation, spiritual, wildlife)
- Start date: ISO format, cannot be in the past

Applied via `validateRequest` middleware before controller execution.

### AI Prompt Constraints

**Critical for itinerary generation:**
- Prompt explicitly states total cost MUST NOT exceed budget
- Calculates daily budget (total/duration) and includes in prompt
- Requests JSON-only response (no markdown)
- Provides exact schema structure in prompt
- If AI violates budget, calculate total in service and flag in metadata

---

## Data Models

### Itinerary Document (Firestore)

```javascript
{
  id: string,              // Auto-generated
  userId: string,          // Firebase UID
  destination: string,
  budget: number,          // Total budget in INR
  duration: number,        // Days
  interests: string[],
  startDate: ISO date,
  days: [{
    dayNumber: number,
    activities: [{
      time: string,        // "09:00 AM"
      title: string,
      description: string,
      estimatedCost: number
    }]
  }],
  totalEstimatedCost: number,  // Sum of all activities
  createdAt: ISO timestamp,
  updatedAt: ISO timestamp
}
```

### Mock Hazard Data Structure

Stored in `backend/data/mock-hazards.json`:
- Keys are normalized destination names (lowercase)
- Each location has: region, alerts[], generalRisks{}
- Alerts have validFrom/validUntil dates
- `hazardService.js` filters by current date to return only active alerts

---

## External Service Integration

### Google Gemini (AI Itinerary Generator)

- Model: `gemini-1.5-flash`
- Temperature: 0.7 (balanced creativity/consistency)
- Max tokens: 2048
- Free tier: 1500 requests/day
- Typical response time: 3-7 seconds
- Fallback: `getFallbackItinerary()` returns sample data if API fails

### OpenWeatherMap (Weather & Safety)

- Endpoints used:
  1. Geocoding API - Convert "Ladakh" → coordinates
  2. Current Weather API - Live conditions
  3. 5-Day Forecast API - Future predictions
- Free tier: 60 calls/minute
- Fallback: `getMockWeatherData()` returns sample data

### Firebase (Auth + Database)

- Authentication: Firebase Admin SDK verifies JWT tokens
- Database: Firestore with collections `/users` and `/itineraries`
- Indexes: `userId` + `createdAt` (for user itinerary queries)
- Security rules: Users can only read/write their own data

---

## Adding New Features

### Adding a New API Endpoint

1. Create controller function in `/controllers/`
2. Add route in `/routes/` with appropriate middleware
3. If external API needed, create service in `/services/`
4. Add Joi validation schema in `utils/validateSchema.js`
5. Register route in `server.js` (already done for auth/itinerary/safety)
6. Document in `backend/README.md`

### Adding a New Destination to Mock Data

Edit `backend/data/mock-hazards.json`:
- Use lowercase key (e.g., "goa", "manali")
- Include region, alerts array, generalRisks object
- Alerts must have validFrom/validUntil ISO dates
- Add seasonal patterns in historicalPattern field

### Modifying AI Prompt

Edit `services/geminiService.js` → `generateItinerary()`:
- Prompt is in template literal starting at line ~39
- Maintain JSON schema specification in prompt
- Test changes thoroughly (AI output can be unpredictable)
- Ensure budget constraint language remains strict

---

## Testing & Debugging

### Manual API Testing

Use `backend/API_TESTS.http` with VS Code REST Client extension:
- Contains test cases for all endpoints
- Includes validation error test cases
- Replace `{{token}}` with actual Firebase token for auth tests

### Setup Verification

Run `npm run check` before starting:
- Verifies Node.js version
- Checks `.env` file exists and has all keys
- Validates Firebase service account key
- Confirms dependencies installed
- Tests port availability

### Common Issues

**"API key not valid"** (Gemini)
- Verify key at https://ai.google.dev
- Check `.env` has no extra spaces
- Restart server after `.env` changes

**"Invalid API key"** (OpenWeather)
- New keys take 10-15 min to activate
- Verify at https://home.openweathermap.org/api_keys

**"Cannot find serviceAccountKey.json"**
- Download from Firebase Console → Project Settings → Service Accounts
- Place at `backend/config/serviceAccountKey.json` (exact path)

---

## Project Constraints & Context

### Hackathon-Specific Decisions

**Why mock hazard data?**
- No public real-time disaster API exists in India
- Mock data based on historical patterns (clearly labeled)
- Judges are informed this is simulated

**Why free-tier APIs only?**
- Zero-cost requirement for hackathon
- All services (Gemini, OpenWeather, Firebase) stay within free limits

**Why separate Express backend?**
- Team's tech stack choice from project requirements
- Could use Next.js API routes, but team is experienced with Express

### Phase Planning

**Phase 1 (Complete):** Backend
**Phase 2 (Next):** React + Vite frontend, Tailwind CSS, Firebase client SDK
**Phase 3 (Future):** Hidden destinations recommender, interactive map (Leaflet + OSM)

---

## Important Files

**Setup & Configuration:**
- `backend/.env.example` - Template for environment variables
- `backend/scripts/check-setup.js` - Automated setup verification
- `.gitignore` - Protects secrets (`.env`, `serviceAccountKey.json`)

**Architecture Documentation:**
- `BACKEND_ARCHITECTURE.md` - Complete system design with diagrams
- `PROJECT_STATUS.md` - Current progress and feature status
- `GET_STARTED.md` - Step-by-step setup checklist

**API Reference:**
- `backend/README.md` - Complete endpoint documentation
- `backend/API_TESTS.http` - Test cases for all endpoints

---

## Team Context

**Event:** Smart India Hackathon 2026
**Problem Statement:** SIH26056 (Travel & Tourism)
**Team:** Black Forge
**Demo Focus:** AI itinerary generation + safety alerts working end-to-end
