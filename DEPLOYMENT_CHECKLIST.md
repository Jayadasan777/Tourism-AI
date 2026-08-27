# 🚀 Deployment Checklist - Follow This!

## ⏱️ Estimated Time: 30-45 minutes

---

## STEP 1: Backend Deployment (Render.com) - 15-20 min

### 1.1 Create Account ✅
- [ ] Go to https://render.com
- [ ] Sign up with GitHub
- [ ] Authorize Render

### 1.2 Create Web Service ✅
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub: **Jayadasan777/Tourism-AI**
- [ ] Click "Connect"

### 1.3 Configure Service ✅
```
Name: smart-tour-ai-backend
Region: Singapore
Branch: working
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

### 1.4 Environment Variables ✅

Add these in Render Dashboard → Environment:

```bash
GEMINI_API_KEY=
OPENWEATHER_API_KEY=
NODE_ENV=production
PORT=10000
```

**Get API Keys:**
- **Gemini:** Check your `backend/.env` OR get from https://makersuite.google.com/app/apikey
- **OpenWeather:** Check your `backend/.env` OR from https://home.openweathermap.org/api_keys

### 1.5 Firebase Service Account ✅

**CRITICAL:** Add this environment variable:

```bash
FIREBASE_SERVICE_ACCOUNT=
```

**How to get the value:**

1. Open: `E:\tourism\backend\config\serviceAccountKey.json`
2. Copy the ENTIRE JSON content
3. **Remove all line breaks** - make it ONE LINE
4. Paste into Render environment variable

**Example:**
```json
{"type":"service_account","project_id":"smart-tour-ai-b20ba","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"..."}
```

### 1.6 Deploy Backend ✅
- [ ] Click "Create Web Service"
- [ ] Wait 5-10 minutes
- [ ] Watch logs for "✅ Server running"

### 1.7 Get Backend URL ✅
- [ ] Copy your URL: `https://smart-tour-ai-backend-XXXX.onrender.com`
- [ ] Write it here: _______________________________________________

### 1.8 Test Backend ✅
```bash
# Open in browser or use curl:
https://your-backend.onrender.com/health

# Should return:
{"status":"ok","message":"Smart Tour AI Backend is running"}
```

**⚠️ Note:** First request may take 30-60 seconds (cold start)

---

## STEP 2: Frontend Deployment (Vercel) - 10-15 min

### 2.1 Create Account ✅
- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub
- [ ] Authorize Vercel

### 2.2 Import Project ✅
- [ ] Click "Add New..." → "Project"
- [ ] Select: **Jayadasan777/Tourism-AI**
- [ ] Click "Import"

### 2.3 Configure Project ✅
```
Framework Preset: Vite (auto-detected)
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 2.4 Environment Variables ✅

**CRITICAL:** Add these environment variables:

```bash
VITE_API_URL=https://YOUR-BACKEND.onrender.com/api
VITE_FIREBASE_API_KEY=AIzaSyDb0qcMPM5W-cttr3ZHAwHp9RPwtPf9Tmc
VITE_FIREBASE_AUTH_DOMAIN=smart-tour-ai-b20ba.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=smart-tour-ai-b20ba
VITE_FIREBASE_STORAGE_BUCKET=smart-tour-ai-b20ba.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=793193364173
VITE_FIREBASE_APP_ID=1:793193364173:web:6c1280221bea56a8e74784
```

**⚠️ IMPORTANT:** Replace `YOUR-BACKEND` in `VITE_API_URL` with your actual backend URL from Step 1.7!

### 2.5 Deploy Frontend ✅
- [ ] Click "Deploy"
- [ ] Wait 2-3 minutes
- [ ] Watch build logs

### 2.6 Get Frontend URL ✅
- [ ] Copy your URL: `https://smart-tour-ai-XXXX.vercel.app`
- [ ] Write it here: _______________________________________________

---

## STEP 3: Update Firebase - 3-5 min

### 3.1 Add Authorized Domains ✅

- [ ] Go to: https://console.firebase.google.com/project/smart-tour-ai-b20ba
- [ ] Click **Authentication** → **Settings** → **Authorized domains**
- [ ] Click "Add domain"
- [ ] Add your Vercel domain (e.g., `smart-tour-ai-XXXX.vercel.app`)
- [ ] Click "Add"

---

## STEP 4: Update Backend CORS - 3-5 min

### 4.1 Check Current CORS ✅

Your `backend/server.js` should have:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
  ],
  credentials: true
}));
```

### 4.2 Add Environment Variable in Render ✅

- [ ] Go to Render Dashboard → Your Service → Environment
- [ ] Add:
  ```
  FRONTEND_URL=https://your-app.vercel.app
  ```
- [ ] Save (auto-redeploys)

---

## STEP 5: Final Testing - 5-10 min

### 5.1 Test Backend ✅

Open these URLs in browser:

- [ ] Health: `https://your-backend.onrender.com/health`
- [ ] Should return JSON with `"status":"ok"`

### 5.2 Test Frontend ✅

- [ ] Open: `https://your-app.vercel.app`
- [ ] Landing page loads ✅
- [ ] Click "Get Started" → Register page ✅
- [ ] Register with email/password ✅
- [ ] Redirects to /plan page ✅
- [ ] Fill itinerary form ✅
- [ ] Generate itinerary (wait 3-7 seconds) ✅
- [ ] Itinerary displays ✅
- [ ] Click "Show Safety Info" ✅
- [ ] Weather and alerts load ✅
- [ ] Logout works ✅
- [ ] Login works ✅

### 5.3 Check Browser Console ✅

- [ ] Open DevTools (F12)
- [ ] Go to Console tab
- [ ] No red errors (ignore extension warnings)
- [ ] API calls successful (check Network tab)

---

## STEP 6: Document Your URLs - 1 min

### Production URLs:

```
Backend:  https://_______________________________________________.onrender.com
Frontend: https://_______________________________________________.vercel.app
```

**Share these with:**
- ✅ Team members
- ✅ Judges (in presentation)
- ✅ README.md
- ✅ PPT slides

---

## Common Issues & Fixes

### Backend Won't Start:
- ❌ **"Firebase error"** → Check `FIREBASE_SERVICE_ACCOUNT` env variable
- ❌ **"Missing module"** → Check build command is `npm install`
- ❌ **"Port error"** → Make sure `PORT` env var is set

### Frontend Build Fails:
- ❌ **"Module not found"** → Check root directory is `frontend`
- ❌ **"Build command failed"** → Verify `npm run build` works locally

### API Calls Fail:
- ❌ **CORS error** → Add frontend URL to CORS in backend
- ❌ **404 Not Found** → Check `VITE_API_URL` has `/api` at end
- ❌ **Network error** → Backend might be sleeping (wait 60s)

### Auth Not Working:
- ❌ **"Unauthorized domain"** → Add domain to Firebase authorized domains
- ❌ **"Firebase error"** → Check all `VITE_FIREBASE_*` variables are set

---

## ✅ SUCCESS CHECKLIST

You're done when:
- [x] Backend health check returns 200 OK
- [x] Frontend loads without errors
- [x] Can register/login
- [x] Can generate itinerary
- [x] Safety info loads
- [x] No console errors
- [x] URLs documented

---

## 🎉 CONGRATULATIONS!

Your app is now LIVE on the internet!

**Next Steps:**
1. ✅ Test thoroughly on mobile
2. ✅ Share URLs with team
3. ✅ Update README.md with live URLs
4. ✅ Practice demo with production app
5. ✅ Prepare presentation

---

## Need Help?

**Issues during deployment?**
- Check DEPLOYMENT_GUIDE.md for detailed instructions
- Check logs in Render/Vercel dashboards
- Common fixes in troubleshooting section above

**Questions?**
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs

---

**You're ready to win the hackathon! 🏆**
