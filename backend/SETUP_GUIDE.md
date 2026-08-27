# 🚀 Backend Setup Guide - Step by Step

Follow these steps in order to get the backend running.

---

## ✅ Step 1: Install Node.js

**Check if you have Node.js:**
```bash
node --version
```

Should show v18.x.x or higher.

**If not installed:** Download from [nodejs.org](https://nodejs.org/) (LTS version)

---

## ✅ Step 2: Install Dependencies

```bash
cd backend
npm install
```

This will install:
- Express.js (web framework)
- Firebase Admin SDK (auth + database)
- Google Generative AI SDK (Gemini)
- Axios (HTTP client)
- Joi (validation)
- Other utilities

**Expected output:** `added X packages` (should complete in 1-2 minutes)

---

## ✅ Step 3: Get Firebase Credentials

### A. Create Firebase Project

1. Go to: https://console.firebase.google.com/
2. Click **"Add project"**
3. Project name: `smart-tour-ai` (or any name)
4. Disable Google Analytics (not needed for hackathon)
5. Click **"Create project"**

### B. Enable Authentication

1. In Firebase Console, click **"Authentication"** in left sidebar
2. Click **"Get started"**
3. Enable **Email/Password** provider
4. Enable **Google** provider
   - Add your email as authorized domain
5. Click **"Save"**

### C. Create Firestore Database

1. Click **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose location: `asia-south1` (Mumbai) or closest
5. Click **"Enable"**

### D. Download Service Account Key

1. Click **⚙️ (Settings)** icon > **"Project settings"**
2. Go to **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** in the popup
5. A JSON file will download (e.g., `smart-tour-ai-firebase-adminsdk-xxxxx.json`)
6. **IMPORTANT:** Rename it to `serviceAccountKey.json`
7. **IMPORTANT:** Move it to `backend/config/serviceAccountKey.json`

**File structure should be:**
```
backend/
  config/
    serviceAccountKey.json  ← Your downloaded file here
    firebase.js
```

### E. Get Firebase Web Config (for frontend later)

1. In Project Settings, scroll to **"Your apps"**
2. Click **web icon** (</>) to add a web app
3. Name: `Smart Tour AI Web`
4. **Don't** check "Firebase Hosting"
5. Click **"Register app"**
6. Copy the `firebaseConfig` object - you'll need this for the frontend
7. Save it in a text file for now

---

## ✅ Step 4: Get Gemini API Key

1. Go to: https://ai.google.dev
2. Click **"Get API key in Google AI Studio"**
3. Sign in with Google account
4. Click **"Get API key"**
5. Click **"Create API key in new project"** or select existing project
6. Copy the API key (starts with `AIza...`)

**Save this key** - you'll add it to `.env` in the next step.

---

## ✅ Step 5: Get OpenWeatherMap API Key

1. Go to: https://openweathermap.org/api
2. Click **"Sign Up"** (top right)
3. Fill in:
   - Username
   - Email
   - Password
4. Check email for verification link
5. After verification, go to: https://home.openweathermap.org/api_keys
6. Copy the **"Key"** (should be auto-generated)

**Note:** New keys take 10-15 minutes to activate. You can proceed with setup.

---

## ✅ Step 6: Create .env File

1. In `backend/` folder, copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` in your text editor

3. Fill in your API keys:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json

# Google Gemini API
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXX

# OpenWeatherMap API
OPENWEATHER_API_KEY=your_openweather_key_here

# CORS Settings
FRONTEND_URL=http://localhost:5173
```

**Replace:**
- `AIzaSyXXXXXXXXXXXXXXXXXXXXXXX` with your actual Gemini key
- `your_openweather_key_here` with your actual OpenWeather key

4. Save the file

---

## ✅ Step 7: Verify Setup

Run this command to check if all files are in place:

```bash
# Windows
dir config\serviceAccountKey.json
type .env

# Linux/Mac
ls -l config/serviceAccountKey.json
cat .env
```

You should see:
- ✅ `serviceAccountKey.json` exists
- ✅ `.env` file contains your API keys

---

## ✅ Step 8: Start the Server

### Development Mode (with auto-restart on file changes):

```bash
npm run dev
```

### Production Mode:

```bash
npm start
```

**Expected output:**
```
==================================================
🚀 Smart Tour AI Backend
📡 Server running on port 5000
🌍 Environment: development
🔗 Health check: http://localhost:5000/health
==================================================
✅ Firebase Admin SDK initialized
✅ Gemini API initialized
```

---

## ✅ Step 9: Test the API

### Test 1: Health Check

Open your browser and go to:
```
http://localhost:5000/health
```

Should see:
```json
{
  "status": "ok",
  "message": "Smart Tour AI Backend is running",
  "timestamp": "2026-08-27T..."
}
```

### Test 2: Generate Itinerary

**Using cURL (in new terminal):**

```bash
curl -X POST http://localhost:5000/api/itinerary/generate \
  -H "Content-Type: application/json" \
  -d "{\"destination\": \"Rishikesh\", \"budget\": 20000, \"duration\": 3, \"interests\": [\"adventure\", \"nature\"], \"startDate\": \"2026-09-15\"}"
```

**Using Postman/Thunder Client:**

```http
POST http://localhost:5000/api/itinerary/generate
Content-Type: application/json

{
  "destination": "Rishikesh",
  "budget": 20000,
  "duration": 3,
  "interests": ["adventure", "nature"],
  "startDate": "2026-09-15"
}
```

**Expected:** JSON response with 3-day itinerary (takes 3-7 seconds)

### Test 3: Get Safety Info

```bash
curl "http://localhost:5000/api/safety?destination=Ladakh"
```

**Expected:** Weather data + hazard alerts

---

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot find module './config/serviceAccountKey.json'"

**Fix:**
- Make sure you downloaded the Firebase service account key
- Check it's saved as `backend/config/serviceAccountKey.json` (exact path)
- Restart the server

### Issue 2: "GEMINI_API_KEY is not set"

**Fix:**
- Open `.env` file
- Make sure `GEMINI_API_KEY=...` has your actual key (no spaces around `=`)
- Restart the server after editing `.env`

### Issue 3: "API key not valid. Please pass a valid API key."

**Fix:**
- Verify your Gemini API key at https://ai.google.dev
- Make sure there are no extra spaces in `.env`
- Try regenerating the API key

### Issue 4: Weather API returns 401 Unauthorized

**Fix:**
- Wait 10-15 minutes after creating OpenWeather API key (activation time)
- Verify key at https://home.openweathermap.org/api_keys
- Check for typos in `.env`

### Issue 5: Port 5000 already in use

**Fix:**

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

**Linux/Mac:**
```bash
lsof -ti:5000 | xargs kill
```

Or change port in `.env`:
```env
PORT=5001
```

### Issue 6: npm install fails

**Fix:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## 📋 Checklist Before Moving to Frontend

- [ ] Server starts without errors
- [ ] `/health` endpoint returns 200 OK
- [ ] Itinerary generation works (POST `/api/itinerary/generate`)
- [ ] Safety endpoint works (GET `/api/safety?destination=Goa`)
- [ ] No console errors about missing API keys
- [ ] Firebase initialized successfully
- [ ] Gemini API initialized successfully

**If all checked ✅, backend is ready!**

---

## 🎯 Next Steps

1. **Test all API endpoints** using Postman or cURL
2. **Save your Firebase web config** (you'll need it for frontend)
3. **Keep the backend server running** while developing frontend
4. **Start building the React frontend** (Phase 1)

---

## 📞 Need Help?

**Error still not resolved?**
- Check the server console logs carefully
- Google the exact error message
- Check Firebase quotas (Console > Usage tab)
- Verify all API keys are active

**API Usage:**
- Gemini: https://ai.google.dev → Check usage
- OpenWeather: https://home.openweathermap.org/api_keys → Check calls
- Firebase: Console → Usage tab

---

**🎉 Backend Setup Complete!** You're ready to build the frontend.
