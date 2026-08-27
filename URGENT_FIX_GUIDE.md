# 🚨 URGENT FIX - Real Places Not Showing

## Problem:
1. ❌ Itinerary shows "Local Sightseeing" instead of "Marina Beach"
2. ❌ Nearby page shows "Failed to fetch recommendations"
3. ❌ Inner pages have gray backgrounds (not obsidian)

## Root Cause:
**GOOGLE_PLACES_API_KEY is missing from `.env` file!**

---

## ✅ IMMEDIATE FIX (5 minutes):

### Step 1: Get Google Places API Key

1. Go to: https://console.cloud.google.com
2. Select your project (or create new)
3. Click "APIs & Services" → "Library"
4. Search "Places API (New)"
5. Click "Enable"
6. Go to "Credentials"
7. Click "Create Credentials" → "API Key"
8. Copy the key (starts with `AIza...`)

### Step 2: Add to Backend .env

```bash
# Open backend/.env file
cd E:/tourism/backend
notepad .env

# Add this line (replace with YOUR key):
GOOGLE_PLACES_API_KEY=AIzaSyC...your_actual_key_here
```

### Step 3: Restart Backend

```bash
# Kill current backend (Ctrl+C)
# Restart:
npm run dev
```

### Step 4: Test Itinerary Generation

1. Go to http://localhost:5173/plan
2. Enter "Chennai"
3. Generate itinerary
4. **Should now show:** "Marina Beach", "Murugan Idli Shop", etc.

### Step 5: Test Nearby Page

1. Go to http://localhost:5173/nearby
2. Click "Get My Location"
3. Click "Search Nearby"
4. **Should now show:** Real restaurants with ratings

---

## 🎨 Fix Inner Pages (Obsidian Black)

The itinerary display and nearby pages need obsidian styling. I'll fix this now...

