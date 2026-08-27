# Smart Tour AI - Backend API

Backend server for Smart Tour AI platform, built with Node.js and Express.

## 🏗️ Architecture

```
backend/
├── config/           # Firebase configuration
├── controllers/      # Request handlers
├── routes/          # API route definitions
├── services/        # External API integrations (Gemini, Weather)
├── data/            # Mock data (hazard alerts)
├── utils/           # Helper functions
└── server.js        # Express app entry point
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Get API Keys

#### A. Firebase (Auth + Database)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `backend/config/serviceAccountKey.json`

**⚠️ NEVER commit this file to Git!**

#### B. Google Gemini API (AI Brain)

1. Go to [Google AI Studio](https://ai.google.dev)
2. Click **Get API Key**
3. Create/select a project
4. Copy the API key
5. Add to `.env`: `GEMINI_API_KEY=your_key_here`

**Cost:** FREE - 1500 requests/day

#### C. OpenWeatherMap API (Weather Data)

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for free account
3. Go to **API Keys** tab
4. Copy your API key
5. Add to `.env`: `OPENWEATHER_API_KEY=your_key_here`

**Cost:** FREE - 60 calls/minute, 1M calls/month

### 4. Start Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server runs on `http://localhost:5000`

---

## 📡 API Endpoints

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Smart Tour AI Backend is running",
  "timestamp": "2026-08-27T10:30:00.000Z"
}
```

---

### Authentication

#### Verify User Token
```http
GET /api/auth/verify
Authorization: Bearer <firebase-token>
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <firebase-token>
```

#### Update User Profile
```http
PUT /api/auth/profile
Authorization: Bearer <firebase-token>
Content-Type: application/json

{
  "displayName": "John Doe",
  "preferences": {
    "language": "en",
    "currency": "INR"
  }
}
```

---

### Itinerary Generation

#### Generate New Itinerary (Core Feature)
```http
POST /api/itinerary/generate
Content-Type: application/json

{
  "destination": "Rishikesh",
  "budget": 25000,
  "duration": 4,
  "interests": ["adventure", "nature", "food"],
  "startDate": "2026-09-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Itinerary generated successfully",
  "data": {
    "itineraryId": "abc123",
    "days": [
      {
        "dayNumber": 1,
        "activities": [
          {
            "time": "09:00 AM",
            "title": "River Rafting",
            "description": "White water rafting on the Ganges...",
            "estimatedCost": 1500
          }
        ]
      }
    ],
    "metadata": {
      "destination": "Rishikesh",
      "totalEstimatedCost": 24800,
      "generatedAt": "2026-08-27T10:30:00.000Z"
    }
  }
}
```

**Validation Rules:**
- `destination`: 2-100 characters
- `budget`: ₹1,000 - ₹10,000,000
- `duration`: 1-30 days
- `interests`: 1-5 values from: `nature`, `history`, `adventure`, `food`, `culture`, `relaxation`, `spiritual`, `wildlife`
- `startDate`: ISO date format, cannot be in the past

#### Get User's Saved Itineraries
```http
GET /api/itinerary/my
Authorization: Bearer <firebase-token>
```

#### Get Specific Itinerary
```http
GET /api/itinerary/:id
```

#### Delete Itinerary
```http
DELETE /api/itinerary/:id
Authorization: Bearer <firebase-token>
```

---

### Safety Information

#### Get Complete Safety Info
```http
GET /api/safety?destination=Ladakh
```

**Response:**
```json
{
  "success": true,
  "data": {
    "destination": "Ladakh",
    "safetyLevel": "moderate",
    "safetyScore": 70,
    "weather": {
      "location": {
        "name": "Leh",
        "state": "Jammu & Kashmir"
      },
      "current": {
        "temperature": 15,
        "condition": "Clear",
        "description": "clear sky",
        "windSpeed": 12
      },
      "forecast": [...],
      "alerts": {
        "hasSevereWeather": false
      }
    },
    "hazards": {
      "hasAlerts": true,
      "alerts": [
        {
          "type": "Road Closure",
          "severity": "high",
          "title": "Khardung La Pass Temporarily Closed",
          "message": "Heavy snowfall...",
          "daysRemaining": 3
        }
      ],
      "disclaimer": "⚠️ This hazard data is simulated for demonstration purposes"
    },
    "emergency": {
      "national": [
        {
          "service": "National Emergency",
          "number": "112",
          "description": "All emergencies"
        }
      ]
    }
  }
}
```

#### Get Only Weather
```http
GET /api/safety/weather?destination=Goa
```

#### Get Only Hazard Alerts
```http
GET /api/safety/hazards?destination=Kerala
```

#### Get Emergency Contacts
```http
GET /api/safety/emergency?destination=Rishikesh
```

---

## 🧪 Testing the API

### Using cURL

**Generate Itinerary:**
```bash
curl -X POST http://localhost:5000/api/itinerary/generate \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Manali",
    "budget": 30000,
    "duration": 5,
    "interests": ["adventure", "nature"],
    "startDate": "2026-09-20"
  }'
```

**Get Safety Info:**
```bash
curl "http://localhost:5000/api/safety?destination=Ladakh"
```

### Using Postman

1. Import the API collection (create one based on endpoints above)
2. Set base URL: `http://localhost:5000`
3. For authenticated routes, add header:
   - Key: `Authorization`
   - Value: `Bearer <your-firebase-token>`

---

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | No | Environment (development/production) |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Yes | Path to Firebase service account JSON |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `OPENWEATHER_API_KEY` | Yes | OpenWeatherMap API key |
| `FRONTEND_URL` | No | Frontend URL for CORS (default: http://localhost:5173) |

---

## 🛡️ Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here",
  "stack": "Stack trace (only in development)"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Resource created
- `400` - Validation error / Bad request
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (don't have permission)
- `404` - Resource not found
- `500` - Server error

---

## 📊 API Rate Limits

**Free Tier Limits:**
- Gemini API: 1500 requests/day
- OpenWeatherMap: 60 calls/minute, 1M/month
- Firebase: 50K reads/day, 20K writes/day

**For hackathon demo:** These limits are MORE than sufficient.

---

## 🔐 Security Best Practices

✅ **DO:**
- Keep `.env` and `serviceAccountKey.json` in `.gitignore`
- Use Firebase token verification for protected routes
- Validate all user inputs
- Use HTTPS in production

❌ **DON'T:**
- Commit API keys to Git
- Expose service account keys in frontend
- Skip input validation
- Return sensitive data in error messages

---

## 🐛 Troubleshooting

### Firebase Error: "Cannot find module './config/serviceAccountKey.json'"

**Solution:** Download your Firebase service account key and place it at `backend/config/serviceAccountKey.json`

### Gemini API Error: "API key not valid"

**Solution:** 
1. Verify your API key at https://ai.google.dev
2. Check if key is correctly set in `.env`
3. Restart the server after updating `.env`

### Weather API Error: "Invalid API key"

**Solution:**
1. Verify key at https://openweathermap.org/api-keys
2. Wait 10-15 minutes after generating new key (activation time)

### Port Already in Use

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill
```

Or change `PORT` in `.env` to a different number.

---

## 📈 Performance Tips

1. **Enable request caching** for weather data (same destination within 1 hour)
2. **Implement rate limiting** to prevent API abuse
3. **Use connection pooling** for database queries
4. **Add Redis** for session management (production)
5. **Monitor API usage** to stay within free tier limits

---

## 🚀 Deployment

### Render / Railway (Recommended)

1. Push code to GitHub
2. Create new Web Service
3. Select repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables in dashboard
7. Deploy

**Note:** For Firebase, upload `serviceAccountKey.json` as a secret file, not an environment variable.

---

## 📝 Next Steps

- [ ] Add request rate limiting
- [ ] Implement caching for weather data
- [ ] Add user feedback endpoints
- [ ] Create hidden destinations recommender endpoint
- [ ] Add itinerary sharing functionality
- [ ] Implement PDF export for itineraries

---

## 👥 Team Black Forge

Built for Smart India Hackathon 2026 - Problem Statement SIH26056

**Need Help?** Check the main project README or contact the team.
