# 🌍 Smart Tour AI

**Intelligent Tourism Platform for India** — Solving the fragmented travel-app problem with AI-powered personalized trip planning and real-time safety alerts.

![SIH 2026](https://img.shields.io/badge/SIH-2026-blue)
![Team](https://img.shields.io/badge/Team-Black%20Forge-orange)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

---

## 📌 Problem Statement

**SIH26056** — Travel & Tourism

Tourists in India rely on multiple disconnected platforms (navigation, booking, weather, safety) making travel fragmented and difficult. Popular destinations face overcrowding, traffic congestion, and safety hazards that affect tourist experience.

---

## 💡 Our Solution

A **unified intelligent tourism platform** providing:

- ✅ **AI-Powered Itinerary Generation** (Google Gemini)
- ✅ **Real-Time Safety Alerts** (Weather + Disaster warnings)
- ✅ **Smart Route Optimization**
- ✅ **Hidden Destination Discovery** (Reduce overcrowding)
- ✅ **Multilingual Assistance**
- ✅ **Emergency SOS Features**

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- Git
- Google Gemini API key
- OpenWeatherMap API key
- Firebase account

### Backend Setup

```bash
# Clone repository
git clone https://github.com/Jayadasan777/Tourism-AI.git
cd Tourism-AI/backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your API keys to .env

# Verify setup
npm run check

# Start development server
npm run dev
```

📖 **Detailed setup:** See `backend/QUICK_START.md`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

📖 **Coming soon** — Frontend in development

---

## 📂 Project Structure

```
Tourism-AI/
├── backend/                 # Node.js + Express API
│   ├── config/             # Firebase configuration
│   ├── controllers/        # Request handlers
│   ├── routes/            # API endpoints
│   ├── services/          # External API integrations
│   ├── data/              # Mock hazard data
│   └── utils/             # Helper functions
│
├── frontend/               # React + Vite (Coming soon)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── public/
│
├── docs/                   # Documentation
└── README.md              # This file
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **AI/LLM:** Google Gemini 1.5 Flash
- **Weather API:** OpenWeatherMap
- **Auth:** Firebase Authentication
- **Database:** Cloud Firestore
- **Validation:** Joi

### Frontend (Planned)
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **Maps:** OpenStreetMap + Leaflet.js
- **State Management:** React Context API
- **HTTP Client:** Axios

---

## 🔌 API Endpoints

### Core Features

```http
POST /api/itinerary/generate
GET  /api/safety?destination=Ladakh
GET  /api/itinerary/my
GET  /api/auth/verify
```

📖 **Full API docs:** See `backend/README.md`

---

## 🎯 Features Status

| Feature | Backend | Frontend | Status |
|---------|---------|----------|--------|
| User Authentication | ✅ | ⏳ | 50% |
| AI Itinerary Generator | ✅ | ⏳ | 50% |
| Safety Alerts | ✅ | ⏳ | 50% |
| Weather Integration | ✅ | ⏳ | 50% |
| Hidden Destinations | ⏳ | ⏳ | 0% |
| Interactive Map | ⏳ | ⏳ | 0% |

**Overall Progress:** 30%

---

## 📊 Architecture

```
┌─────────────┐
│   React UI  │
└──────┬──────┘
       │ HTTPS
┌──────▼──────────────────────┐
│   Express.js Backend        │
│                             │
│  ┌──────────────────────┐  │
│  │  Routes              │  │
│  │  Controllers         │  │
│  │  Services            │  │
│  └──────────────────────┘  │
└──────┬────────┬────────┬───┘
       │        │        │
   ┌───▼──┐ ┌──▼───┐ ┌──▼────┐
   │Gemini│ │Weather│ │Firebase│
   │ AI   │ │  API  │ │Auth+DB│
   └──────┘ └───────┘ └────────┘
```

---

## 💰 Cost Breakdown

| Service | Tier | Cost |
|---------|------|------|
| Google Gemini | Free (1500/day) | ₹0 |
| OpenWeatherMap | Free (60/min) | ₹0 |
| Firebase | Free (50K users) | ₹0 |
| Hosting | Free tier | ₹0 |

**Total Cost:** ₹0 for hackathon period ✅

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Health check
curl http://localhost:5000/health

# Generate itinerary
npm run test:itinerary

# Check safety info
npm run test:safety
```

📖 **All test cases:** See `backend/API_TESTS.http`

---

## 📚 Documentation

- **[Get Started Guide](GET_STARTED.md)** — Setup checklist
- **[Backend API Docs](backend/README.md)** — Complete API reference
- **[Backend Architecture](BACKEND_ARCHITECTURE.md)** — System design
- **[Project Status](PROJECT_STATUS.md)** — Current progress
- **[Quick Start](backend/QUICK_START.md)** — 10-minute setup

---

## 🔐 Security

⚠️ **NEVER commit these files:**
- `.env` (contains API keys)
- `serviceAccountKey.json` (Firebase credentials)
- Any file with "secret" or "credential" in the name

✅ **Safe to commit:**
- `.env.example` (template only)
- All code files
- Documentation
- Mock data (clearly labeled)

---

## 🤝 Contributing

This is a **Smart India Hackathon 2026** project by Team Black Forge.

### Team Members
- [Add team member names]
- [Add team member names]
- [Add team member names]

---

## 📄 License

This project is built for **Smart India Hackathon 2026**.

---

## 🎯 Hackathon Details

- **Event:** Smart India Hackathon 2026
- **Problem Statement:** SIH26056
- **Category:** Software
- **Theme:** Travel & Tourism
- **Team:** Black Forge

---

## 🆘 Support

**Setup issues?**
- Check `GET_STARTED.md` for step-by-step guide
- Run `npm run check` in backend folder
- Read error messages carefully

**API questions?**
- See `backend/README.md` for all endpoints
- Use `backend/API_TESTS.http` for examples

**Architecture questions?**
- Read `BACKEND_ARCHITECTURE.md` for system design

---

## 🏆 Project Goals

1. ✅ Unified platform (replace 5-8 apps with one)
2. ✅ AI-powered personalization (Gemini integration)
3. ✅ Real-time safety layer (weather + hazards)
4. ⏳ Reduce overcrowding (hidden destination recommender)
5. ⏳ Multilingual support (Phase 3)
6. ⏳ Accessibility features (Phase 3)

---

## 🎬 Demo Scenario

**Judge:** "Show me your AI itinerary generator."

**Response:** [Live demo in 30 seconds]
- User enters: Rishikesh, ₹25,000, 4 days, adventure
- AI generates detailed day-wise itinerary
- Safety alerts show weather + hazards
- Total cost stays within budget

**Judge:** "Is this real or fake data?"

**Response:**
- Itinerary: ✅ Real AI (Google Gemini)
- Weather: ✅ Real API (OpenWeatherMap)
- Hazards: ⚠️ Simulated (labeled in UI)

---

## 🔗 Links

- **GitHub:** https://github.com/Jayadasan777/Tourism-AI
- **Documentation:** See `/docs` folder
- **API Reference:** `backend/README.md`

---

**Built with ❤️ by Team Black Forge for Smart India Hackathon 2026**
