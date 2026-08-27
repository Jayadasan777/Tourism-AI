# 🚀 Get Started - Smart Tour AI Backend

**Welcome Team Black Forge!** Follow these steps to get the backend running.

---

## ✅ Step-by-Step Checklist

### Prerequisites (5 minutes)

- [ ] **Node.js installed** (v18 or higher)
  - Check: `node --version`
  - If not installed: Download from [nodejs.org](https://nodejs.org/)

- [ ] **Code editor ready** (VS Code recommended)

- [ ] **Terminal/Command Prompt open**

---

### Phase 1: Install Dependencies (1 minute)

```bash
cd backend
npm install
```

- [ ] Wait for "added XXX packages"
- [ ] No errors during installation

---

### Phase 2: Get API Keys (10 minutes)

Follow links in order. Open each in a new browser tab:

#### Tab 1: Google Gemini
1. [ ] Go to https://ai.google.dev
2. [ ] Click "Get API key"
3. [ ] Sign in with Google
4. [ ] Click "Create API key"
5. [ ] Copy key (starts with `AIza...`)
6. [ ] Save in notepad temporarily

#### Tab 2: OpenWeatherMap
1. [ ] Go to https://openweathermap.org/api
2. [ ] Click "Sign Up"
3. [ ] Fill form and verify email
4. [ ] Go to https://home.openweathermap.org/api_keys
5. [ ] Copy the API key
6. [ ] Save in notepad
7. [ ] ⏰ **Wait 10-15 minutes for activation** (continue with Firebase)

#### Tab 3: Firebase
1. [ ] Go to https://console.firebase.google.com/
2. [ ] Click "Create a project"
3. [ ] Project name: `smart-tour-ai`
4. [ ] Skip Google Analytics
5. [ ] Wait for project creation

**Enable Authentication:**
6. [ ] Click "Authentication" in left menu
7. [ ] Click "Get started"
8. [ ] Enable "Email/Password" provider
9. [ ] Enable "Google" provider
10. [ ] Click "Save"

**Create Database:**
11. [ ] Click "Firestore Database" in left menu
12. [ ] Click "Create database"
13. [ ] Select "Start in test mode"
14. [ ] Choose location: `asia-south1` (Mumbai)
15. [ ] Click "Enable"

**Download Service Account:**
16. [ ] Click ⚙️ (Settings) icon → "Project settings"
17. [ ] Go to "Service accounts" tab
18. [ ] Click "Generate new private key"
19. [ ] Click "Generate key" in popup
20. [ ] JSON file downloads
21. [ ] Rename to `serviceAccountKey.json`
22. [ ] Move to `backend/config/serviceAccountKey.json`

---

### Phase 3: Configure Environment (2 minutes)

1. [ ] Copy the template:
   ```bash
   cp .env.example .env
   ```

2. [ ] Open `.env` in your editor

3. [ ] Replace placeholders with your actual keys:
   ```env
   GEMINI_API_KEY=AIzaSy________________  # Your Gemini key
   OPENWEATHER_API_KEY=__________________  # Your OpenWeather key
   ```

4. [ ] Save the file

---

### Phase 4: Verify Setup (1 minute)

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
✓ All checks passed!
```

**If you see ❌ errors:**
- [ ] Read the error message carefully
- [ ] Fix the issue mentioned
- [ ] Run `npm run check` again

---

### Phase 5: Start Server (30 seconds)

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

**Leave this terminal window open!**

---

### Phase 6: Test It (2 minutes)

Open a **NEW terminal window** (keep server running in the first).

**Test 1: Health Check**
```bash
curl http://localhost:5000/health
```
- [ ] Returns JSON with `"status": "ok"`

**Test 2: Generate Itinerary**
```bash
curl -X POST http://localhost:5000/api/itinerary/generate \
  -H "Content-Type: application/json" \
  -d '{"destination":"Goa","budget":30000,"duration":5,"interests":["relaxation","food"],"startDate":"2026-09-15"}'
```
- [ ] Wait 5-7 seconds
- [ ] Returns JSON with `"days"` array
- [ ] Check server terminal - should show "Itinerary generated in XXXms"

**Test 3: Safety Info**
```bash
curl "http://localhost:5000/api/safety?destination=Ladakh"
```
- [ ] Returns JSON with `"weather"` and `"hazards"` objects

**If all 3 tests pass: ✅ Backend is working!**

---

## 🎯 You're Done When...

- [x] Server starts without errors
- [x] Health check returns 200 OK
- [x] Can generate itinerary
- [x] Can fetch safety info
- [x] No API key errors in console
- [x] Firebase and Gemini show "initialized"

**All checked? Congratulations! Backend is ready. 🎉**

---

## 🐛 Quick Troubleshooting

### "Port 5000 already in use"
**Fix:** Kill the process or change port in `.env` to 5001

### "Cannot find serviceAccountKey.json"
**Fix:** Make sure the file is at `backend/config/serviceAccountKey.json` (exact path)

### "API key not valid"
**Gemini Fix:** Verify at https://ai.google.dev, regenerate if needed, restart server
**Weather Fix:** Wait 15 minutes after creating key, then try again

### "npm install fails"
**Fix:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Next: Read the Docs

Now that backend is running, understand what you built:

1. **API Endpoints** → `backend/README.md`
2. **Architecture** → `BACKEND_ARCHITECTURE.md`
3. **Test APIs** → `backend/API_TESTS.http`

---

## 🚀 Next: Build Frontend

Backend is done. Time to build the React frontend:

**In a NEW terminal** (keep backend running):
```bash
cd ..              # Go back to project root
# Ready for frontend setup
```

---

## 💡 Pro Tips

1. **Keep backend running** while developing frontend
2. **Check server logs** if APIs fail (terminal where `npm run dev` is running)
3. **Use API_TESTS.http** to test endpoints without curl
4. **Backend auto-restarts** on code changes (nodemon)

---

## ✅ Final Check

Before moving to frontend:

```bash
# In backend terminal, you should see:
✅ Firebase Admin SDK initialized
✅ Gemini API initialized

# No errors like:
❌ API key not valid
❌ Cannot find module
❌ Port in use
```

**All good?** You're ready for the frontend! 🎉

---

**Time taken:** ~15-20 minutes
**Status:** ✅ Backend production-ready
**Next:** Frontend development
