# ⚡ Quick Start - Get Backend Running in 10 Minutes

This is the **fastest path** from zero to running backend. Follow these steps in order.

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- [ ] Node.js v18 or higher installed ([download](https://nodejs.org/))
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt
- [ ] Internet connection (to get API keys)

---

## 🚀 10-Minute Setup

### Step 1: Install Dependencies (1 minute)

```bash
cd backend
npm install
```

**Expected output:** `added 150+ packages`

---

### Step 2: Get API Keys (5 minutes)

You need **3 API keys**. Open these links in browser:

#### A. **Gemini API** (2 min)
1. Go to: https://ai.google.dev
2. Click "Get API key"
3. Sign in with Google
4. Click "Create API key"
5. Copy the key (starts with `AIza...`)

#### B. **OpenWeatherMap API** (2 min)
1. Go to: https://openweathermap.org/api
2. Click "Sign Up" (top right)
3. Verify email
4. Go to: https://home.openweathermap.org/api_keys
5. Copy the key

⏰ **Wait 10-15 minutes for OpenWeather key to activate** (you can continue setup)

#### C. **Firebase** (3 min)
1. Go to: https://console.firebase.google.com/
2. Click "Create a project"
3. Name: `smart-tour-ai`
4. Skip Google Analytics
5. After project created:
   - Click **Authentication** → Get started → Enable **Email/Password** and **Google**
   - Click **Firestore Database** → Create database → Test mode → Enable
   - Click **⚙️ Settings** → **Service accounts** → **Generate new private key**
   - Download JSON file → Rename to `serviceAccountKey.json`
   - Move to `backend/config/serviceAccountKey.json`

---

### Step 3: Configure Environment (1 minute)

```bash
# Copy the example file
cp .env.example .env

# Edit .env (use any text editor)
notepad .env      # Windows
nano .env         # Linux/Mac
```

Replace the placeholder values:

```env
PORT=5000
NODE_ENV=development

FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json

GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXX    # ← Your Gemini key here
OPENWEATHER_API_KEY=your_key_here        # ← Your OpenWeather key here

FRONTEND_URL=http://localhost:5173
```

**Save and close.**

---

### Step 4: Verify Setup (30 seconds)

```bash
npm run check
```

**Expected output:**
```
✓ Node.js version OK
✓ .env file exists
✓ All environment variables set
✓ Firebase service account found
✓ All dependencies installed
✓ Port 5000 available
✓ Mock data exists

✓ All checks passed! You're ready to start.
```

If you see ❌ errors, fix them before continuing.

---

### Step 5: Start the Server (10 seconds)

```bash
npm run dev
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

**Keep this terminal open!**

---

### Step 6: Test It (1 minute)

Open a **new terminal** (keep server running in first one) and test:

```bash
# Test 1: Health check
curl http://localhost:5000/health

# Test 2: Generate itinerary
curl -X POST http://localhost:5000/api/itinerary/generate \
  -H "Content-Type: application/json" \
  -d '{"destination":"Goa","budget":30000,"duration":5,"interests":["relaxation","food"],"startDate":"2026-09-15"}'

# Test 3: Get safety info
curl "http://localhost:5000/api/safety?destination=Ladakh"
```

**If all 3 tests return JSON (not errors), you're done! ✅**

---

## 🎯 Next Steps

Now that backend is running:

1. **Keep the server running** (don't close the terminal)
2. **Start building frontend** (in a new terminal)
3. **Test API endpoints** using the `API_TESTS.http` file

---

## 🐛 Common Issues

### "Port 5000 already in use"

**Solution 1:** Kill the process using port 5000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

**Solution 2:** Change port in `.env`:
```env
PORT=5001
```

---

### "Cannot find module './config/serviceAccountKey.json'"

**Solution:** Make sure you:
1. Downloaded the Firebase service account key
2. Renamed it to exactly `serviceAccountKey.json`
3. Placed it in `backend/config/` folder

Check file path:
```bash
# Should show the file
ls backend/config/serviceAccountKey.json    # Mac/Linux
dir backend\config\serviceAccountKey.json   # Windows
```

---

### "API key not valid" (Gemini)

**Solution:**
1. Go to https://ai.google.dev
2. Verify your API key is active
3. Copy it again (no extra spaces)
4. Update `.env`
5. Restart server (`Ctrl+C`, then `npm run dev`)

---

### "Invalid API key" (OpenWeather)

**Solution:**
1. Wait 10-15 minutes after creating key (activation time)
2. Verify at https://home.openweathermap.org/api_keys
3. If still not working after 15 min, regenerate key

---

### Server starts but API calls fail

**Check:**
```bash
# Verify .env has correct keys (no placeholder text)
cat .env

# Should NOT see "your_key_here" or "XXXX"
```

**Fix:** Replace placeholders with actual API keys, restart server.

---

## 📚 Additional Resources

- **Full Setup Guide:** `SETUP_GUIDE.md` (step-by-step with screenshots)
- **API Documentation:** `README.md` (all endpoints)
- **Architecture:** `../BACKEND_ARCHITECTURE.md` (how it works)
- **Testing:** `API_TESTS.http` (all test cases)

---

## ✅ Success Checklist

Before moving to frontend, verify:

- [ ] Server starts without errors
- [ ] Firebase initialized successfully
- [ ] Gemini API initialized successfully
- [ ] `/health` endpoint returns 200 OK
- [ ] Can generate itinerary (POST `/api/itinerary/generate`)
- [ ] Can get safety info (GET `/api/safety?destination=...`)
- [ ] No "API key" errors in console

**All checked?** You're ready to build the frontend! 🎉

---

## 🆘 Still Stuck?

1. **Re-run setup check:**
   ```bash
   npm run check
   ```

2. **Check server logs** for specific error messages

3. **Verify all 3 API services:**
   - Gemini: https://ai.google.dev
   - OpenWeather: https://openweathermap.org
   - Firebase: https://console.firebase.google.com

4. **Read detailed setup:** `SETUP_GUIDE.md`

---

**Ready?** Keep this terminal running and start the frontend setup in a new terminal window.
