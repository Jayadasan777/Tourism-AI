# 🚀 Complete Deployment Guide

## Overview

We'll deploy:
- **Backend** → Render.com (Free tier, auto-sleep after 15 min inactivity)
- **Frontend** → Vercel (Free tier, unlimited)

**Total Cost:** ₹0 (Free forever)

---

## PART 1: Backend Deployment (Render.com)

### Step 1: Create Render Account

1. Go to: https://render.com
2. Click **"Get Started"**
3. Sign up with **GitHub** (easiest)
4. Authorize Render to access your GitHub

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository:
   - If first time: Click **"Connect GitHub"** → Authorize
   - Select: **Jayadasan777/Tourism-AI**
3. Click **"Connect"**

### Step 3: Configure Service

**Basic Settings:**
```
Name: smart-tour-ai-backend
Region: Singapore (closest to India)
Branch: working (or main)
Root Directory: backend
Runtime: Node
```

**Build & Deploy Settings:**
```
Build Command: npm install
Start Command: npm start
```

**Instance Type:**
```
Free (shared CPU, 512 MB RAM)
```

### Step 4: Add Environment Variables

Click **"Environment"** → Add these variables:

```bash
# Required Environment Variables

GEMINI_API_KEY=your_gemini_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
NODE_ENV=production
PORT=10000
```

**Get Your API Keys:**

1. **Gemini API Key:**
   - Go to: https://makersuite.google.com/app/apikey
   - Create API key
   - Copy it

2. **OpenWeather API Key:**
   - Already in your `.env`: Check `backend/.env`
   - Or get from: https://home.openweathermap.org/api_keys

### Step 5: Firebase Service Account (CRITICAL)

You need to upload Firebase credentials. Two options:

**Option A: Environment Variable (Recommended for Render)**

1. Copy content of `backend/config/serviceAccountKey.json`
2. In Render, add environment variable:
   ```
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"smart-tour-ai-b20ba",...}
   ```
   (Paste the ENTIRE JSON as one line)

3. Update `backend/config/firebase.js`:
   ```javascript
   // At the top
   let serviceAccount;
   
   if (process.env.FIREBASE_SERVICE_ACCOUNT) {
     // Production: JSON from environment variable
     serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
   } else {
     // Development: File path
     const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './config/serviceAccountKey.json';
     serviceAccount = require(serviceAccountPath);
   }
   
   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
   });
   ```

**Option B: Upload File (Alternative)**

1. In Render Dashboard → Your Service → Settings
2. Under "Disk", add persistent disk (if available on free tier)
3. Upload `serviceAccountKey.json` via Render Shell
4. Set environment variable: `FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/file`

**For Now: Use Option A** (easier)

### Step 6: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for build and deploy
3. Watch logs for errors

### Step 7: Test Backend

Once deployed, you'll get a URL like:
```
https://smart-tour-ai-backend.onrender.com
```

Test it:
```bash
# Health check
https://smart-tour-ai-backend.onrender.com/health

# Expected response:
{"status":"ok","message":"Smart Tour AI Backend is running","timestamp":"..."}
```

**⚠️ First Request May Take 30-60 Seconds** (cold start from sleep)

### Step 8: Note Your Backend URL

Copy your backend URL:
```
https://smart-tour-ai-backend-XXXX.onrender.com
```

You'll need this for frontend deployment!

---

## PART 2: Frontend Deployment (Vercel)

### Step 1: Update Frontend Config

First, let's prepare the frontend for production:

**Update `frontend/.env`:**
```bash
# Production Backend URL (from Render)
VITE_API_URL=https://your-backend.onrender.com/api

# Firebase Config (same as development)
VITE_FIREBASE_API_KEY=AIzaSyDb0qcMPM5W-cttr3ZHAwHp9RPwtPf9Tmc
VITE_FIREBASE_AUTH_DOMAIN=smart-tour-ai-b20ba.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=smart-tour-ai-b20ba
VITE_FIREBASE_STORAGE_BUCKET=smart-tour-ai-b20ba.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=793193364173
VITE_FIREBASE_APP_ID=1:793193364173:web:6c1280221bea56a8e74784
```

### Step 2: Create Vercel Account

1. Go to: https://vercel.com
2. Click **"Sign Up"**
3. Sign up with **GitHub** (easiest)
4. Authorize Vercel

### Step 3: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import from GitHub:
   - Find: **Jayadasan777/Tourism-AI**
   - Click **"Import"**

### Step 4: Configure Project

**Framework Preset:**
```
Vite (auto-detected)
```

**Root Directory:**
```
frontend
```

**Build Settings:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 5: Add Environment Variables

Click **"Environment Variables"** → Add:

```bash
VITE_API_URL=https://your-backend.onrender.com/api
VITE_FIREBASE_API_KEY=AIzaSyDb0qcMPM5W-cttr3ZHAwHp9RPwtPf9Tmc
VITE_FIREBASE_AUTH_DOMAIN=smart-tour-ai-b20ba.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=smart-tour-ai-b20ba
VITE_FIREBASE_STORAGE_BUCKET=smart-tour-ai-b20ba.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=793193364173
VITE_FIREBASE_APP_ID=1:793193364173:web:6c1280221bea56a8e74784
```

**⚠️ Important:** Replace `https://your-backend.onrender.com/api` with your ACTUAL backend URL from Render!

### Step 6: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Watch build logs

### Step 7: Get Your URL

You'll get a URL like:
```
https://smart-tour-ai.vercel.app
```

### Step 8: Test Frontend

1. Open your Vercel URL
2. Test:
   - ✅ Landing page loads
   - ✅ Register/Login works
   - ✅ Can generate itinerary
   - ✅ Safety info loads

---

## PART 3: Update Backend CORS

After deploying frontend, update backend CORS to allow your production domain:

1. Go to Render → Your Backend Service → Environment
2. Add/Update:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```

3. Update `backend/server.js` (if not already dynamic):
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'http://localhost:3000',
       process.env.FRONTEND_URL,
       'https://smart-tour-ai.vercel.app'
     ],
     credentials: true
   }));
   ```

4. Commit and push (triggers auto-redeploy)

---

## PART 4: Final Checks

### Backend Checks:
```bash
# 1. Health check
curl https://your-backend.onrender.com/health

# 2. Test itinerary generation
curl -X POST https://your-backend.onrender.com/api/itinerary/generate \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Rishikesh",
    "budget": 25000,
    "duration": 4,
    "interests": ["adventure"],
    "startDate": "2026-09-15"
  }'

# 3. Test safety endpoint
curl https://your-backend.onrender.com/api/safety?destination=Ladakh
```

### Frontend Checks:
1. Visit your Vercel URL
2. Open browser DevTools (F12)
3. Check Console for errors
4. Test user flow:
   - Register → Login → Generate Itinerary → View Safety Info

---

## PART 5: Firebase Configuration

### Add Production Domains to Firebase:

1. Go to: https://console.firebase.google.com/project/smart-tour-ai-b20ba
2. **Authentication** → **Settings** → **Authorized domains**
3. Add your domains:
   ```
   your-app.vercel.app
   your-backend.onrender.com (if needed)
   ```
4. Save

---

## Troubleshooting

### Backend Issues:

**"Cannot find module"**
- Check `package.json` is in backend folder
- Verify build command: `npm install`

**"Firebase error"**
- Check `FIREBASE_SERVICE_ACCOUNT` env variable is set
- Verify JSON is valid (no line breaks)

**"Port already in use"**
- Render automatically sets PORT env variable
- Make sure `server.js` uses `process.env.PORT`

**"Cold start timeout"**
- First request after 15 min inactivity takes 30-60s
- This is normal for free tier
- Keep service "warm" by pinging every 10 minutes (optional)

### Frontend Issues:

**"API calls failing"**
- Check `VITE_API_URL` is correct
- Verify backend CORS allows your domain
- Check Network tab for actual error

**"Firebase auth not working"**
- Verify all `VITE_FIREBASE_*` variables are set
- Check authorized domains in Firebase Console

**"Build failed"**
- Check build logs
- Verify all dependencies in `package.json`
- Try building locally first: `npm run build`

---

## Auto-Deploy Setup

Both Render and Vercel support auto-deploy:

1. Push to `main` or `working` branch
2. Services auto-detect and redeploy
3. Check deployment logs

To disable:
- Render: Settings → Build & Deploy → Turn off auto-deploy
- Vercel: Settings → Git → Disable

---

## Cost & Limits

### Render (Free Tier):
- ✅ 750 hours/month (enough for 24/7)
- ✅ 512 MB RAM
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ Wakes up in 30-60s (cold start)

### Vercel (Free Tier):
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ No sleep time
- ✅ Global CDN

### APIs:
- **Gemini:** 1500 requests/day (free)
- **OpenWeather:** 60 calls/min (free)
- **Firebase:** 50K users (free)

---

## Domain Setup (Optional)

If you have a custom domain:

### Vercel:
1. Settings → Domains → Add Domain
2. Add DNS records (Vercel provides instructions)

### Render:
1. Settings → Custom Domain
2. Add CNAME record: `backend.yourdomain.com`

---

## Monitoring

### Render:
- Dashboard shows: CPU, Memory, Bandwidth
- Logs: Real-time logs available
- Metrics: Response times, error rates

### Vercel:
- Analytics: Page views, visitors
- Logs: Function logs, build logs
- Performance: Core Web Vitals

---

## Quick Commands

### Update Backend:
```bash
git add backend/
git commit -m "Update backend"
git push origin working
# Render auto-deploys
```

### Update Frontend:
```bash
git add frontend/
git commit -m "Update frontend"
git push origin working
# Vercel auto-deploys
```

### Manual Redeploy:
- **Render:** Dashboard → Manual Deploy → Deploy Latest Commit
- **Vercel:** Deployments → Redeploy

---

## Your Production URLs

After deployment, fill these in:

```
Backend:  https://_______________.onrender.com
Frontend: https://_______________.vercel.app
```

Share these URLs with:
- Judges
- Team members
- README.md

---

## Next Steps After Deployment

1. ✅ Test all features in production
2. ✅ Fix any issues
3. ✅ Update README.md with live URLs
4. ✅ Practice demo with production app
5. ✅ Prepare for presentation

---

**You're almost there! Let's deploy! 🚀**
