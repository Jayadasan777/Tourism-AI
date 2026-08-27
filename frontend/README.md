# Smart Tour AI - Frontend

React + Vite frontend for Smart Tour AI platform.

## ✅ Module 1 Complete

- [x] React + Vite project scaffolding
- [x] Tailwind CSS configuration
- [x] Firebase client SDK setup
- [x] API service layer with axios
- [x] React Router DOM setup
- [x] Project folder structure
- [x] Environment variable configuration

## 📦 Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **Authentication:** Firebase Auth (client SDK)
- **Database:** Firebase Firestore (client SDK)

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- Backend server running on `http://localhost:5000`

### Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Firebase config to .env
# Get from: Firebase Console > Project Settings > Your apps > Web app

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 📁 Project Structure

```
frontend/src/
├── components/
│   ├── auth/              # Authentication components (Module 2)
│   ├── itinerary/         # Itinerary components (Module 3)
│   ├── safety/            # Safety components (Module 4)
│   └── common/            # Reusable components (Module 8)
├── pages/                 # Page components (Module 5)
├── services/              # API service layer ✅
│   ├── api.js            # Axios instance with interceptors
│   ├── authService.js    # Auth API calls
│   ├── itineraryService.js # Itinerary API calls
│   └── safetyService.js  # Safety API calls
├── contexts/              # React Context providers (Module 2)
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
└── config/
    └── firebase.js       # Firebase initialization ✅
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔗 API Integration

The frontend connects to the backend API at:
- **Development:** `http://localhost:5000/api`
- **Production:** Set `VITE_API_URL` in `.env`

All API calls go through `src/services/api.js` which handles:
- Auth token injection
- Global error handling
- Request/response interceptors

### Usage Example

```javascript
import { generateItinerary } from './services/itineraryService';

const data = {
  destination: 'Rishikesh',
  budget: 25000,
  duration: 4,
  interests: ['adventure', 'nature'],
  startDate: '2026-09-15'
};

const result = await generateItinerary(data);
```

## 🎨 Tailwind Configuration

Custom color palette configured in `tailwind.config.js`:

```javascript
colors: {
  primary: { ... },    // Blue shades
  secondary: { ... },  // Green shades
  accent: { ... },     // Orange shades
  danger: { ... }      // Red shades
}
```

### Utility Classes

```css
.btn-primary     - Primary button style
.btn-secondary   - Secondary button style
.input-field     - Input field style
.card            - Card container style
```

## 🔐 Environment Variables

Required in `.env`:

```bash
# Backend API
VITE_API_URL=http://localhost:5000/api

# Firebase Config (from Firebase Console)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

**Get Firebase config:**
1. Go to Firebase Console
2. Project Settings > General
3. Scroll to "Your apps" section
4. Select web app or create one
5. Copy the config object values

## 📝 Next Steps

### Module 2: Authentication UI (Assign to: [NAME])
- [ ] Login/Register pages
- [ ] Auth context provider
- [ ] Protected routes
- [ ] Google Sign-In integration

### Module 3: Itinerary UI (Assign to: [NAME])
- [ ] Itinerary form component
- [ ] Itinerary display component
- [ ] Loading states
- [ ] Save/regenerate functionality

### Module 4: Safety UI (Assign to: [NAME])
- [ ] Weather widget
- [ ] Hazard alert component
- [ ] Emergency contacts
- [ ] Safety score display

## 🐛 Troubleshooting

### Port 5173 already in use

```bash
# Kill process on port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill
```

### API calls failing

1. Check backend is running on `http://localhost:5000`
2. Check `VITE_API_URL` in `.env`
3. Check browser console for CORS errors
4. Verify backend CORS allows `http://localhost:5173`

### Firebase errors

1. Verify all Firebase env variables are set
2. Check Firebase project is active
3. Verify authentication methods are enabled in Firebase Console
4. Check browser console for specific Firebase errors

## 📚 Documentation

- **Backend API:** See `../backend/README.md`
- **Architecture:** See `../BACKEND_ARCHITECTURE.md`
- **Work Modules:** See `../WORK_MODULES.md`
- **CLAUDE.md:** See `../CLAUDE.md` for patterns

## ✅ Module 1 Deliverables

- [x] Frontend runs on http://localhost:5173
- [x] Can make API call to backend health check
- [x] Tailwind CSS working (check landing page)
- [x] Firebase initialized (no console errors)
- [x] Routing works (try /login, /register, /plan)

---

**Status:** Module 1 Complete ✅
**Next:** Module 2 (Authentication UI)
