# 🗺️ Google Places API Setup Guide

This guide walks you through setting up the Google Places API to get **real place data** for itinerary generation.

---

## 📋 What You'll Get

After setup, your itineraries will include:
- ✅ **Real attraction names** (e.g., "Marina Beach" instead of "beach area")
- ✅ **Real restaurant names** (e.g., "Murugan Idli Shop" instead of "local restaurant")
- ✅ **Real hotel names** (e.g., "Hotel Savera" instead of "accommodation")
- ✅ **Exact addresses** for each place
- ✅ **Google Maps links** for navigation
- ✅ **Ratings** and price levels

---

## 🔑 Step 1: Enable Google Places API

### 1.1 Go to Google Cloud Console
Visit: https://console.cloud.google.com

### 1.2 Select Your Project
- If you already have a project for Gemini API, **use the same project**
- If not, create a new project: "Smart Tour AI"

### 1.3 Enable Places API
1. Click "APIs & Services" → "Library"
2. Search for **"Places API"**
3. Click on "Places API (New)"
4. Click **"Enable"**

---

## 🔑 Step 2: Get API Key

### 2.1 Create Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key

### 2.2 (Optional) Restrict API Key
For security in production:
1. Click on your API key
2. Under "API restrictions":
   - Select "Restrict key"
   - Check: **Places API**, **Geocoding API**
3. Save

---

## 🔧 Step 3: Add to Backend

### 3.1 Update `.env` File

```bash
cd backend
```

Edit your `.env` file and add:

```env
# Google Places API (same project as Gemini)
GOOGLE_PLACES_API_KEY=AIzaSyC...your_key_here
```

### 3.2 Verify Setup

Restart your backend server:

```bash
npm run dev
```

You should see in the logs:
```
🔍 Fetching real places for: Chennai
📍 Coordinates for Chennai: 13.0827, 80.2707
✅ Found 20 attractions, 15 restaurants, 10 hotels
```

---

## 💰 Pricing & Limits

### Free Tier:
- **Geocoding API:** Unlimited (free)
- **Places API - Nearby Search:** $32 per 1000 requests
- **Places API - Details:** $17 per 1000 requests

### Monthly Free Credit:
- Google Cloud gives **$300 free credits** for 90 days
- This equals **9,375 itineraries per month** before any charges

### For Hackathon:
- ✅ **You won't be charged** (under free credit limit)
- ✅ Safe for demo and testing
- ✅ No credit card required initially

---

## 🧪 Test the Integration

### Test with curl:

```bash
# Test itinerary generation with real places
curl -X POST http://localhost:5000/api/itinerary/generate \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Chennai",
    "budget": 15000,
    "duration": 3,
    "interests": ["food", "culture"],
    "startDate": "2026-09-01"
  }'
```

### Expected Response:

```json
{
  "success": true,
  "data": {
    "days": [
      {
        "dayNumber": 1,
        "activities": [
          {
            "time": "09:00 AM",
            "title": "Visit Marina Beach",
            "placeName": "Marina Beach",
            "address": "Beach Road, Chennai, Tamil Nadu 600001",
            "description": "Enjoy sunrise at India's longest urban beach...",
            "estimatedCost": 0,
            "category": "attraction",
            "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=Marina+Beach..."
          },
          {
            "time": "01:00 PM",
            "title": "Lunch at Murugan Idli Shop",
            "placeName": "Murugan Idli Shop",
            "address": "T Nagar, Chennai",
            "description": "Famous for soft idlis and authentic South Indian cuisine",
            "estimatedCost": 300,
            "category": "restaurant",
            "googleMapsUrl": "https://www.google.com/maps/search/..."
          }
        ]
      }
    ],
    "metadata": {
      "usedRealPlaces": true
    }
  }
}
```

---

## 🔍 How It Works

### Flow:

```
1. User requests itinerary for "Chennai"
   ↓
2. Backend calls Google Geocoding API
   → Gets coordinates: (13.0827, 80.2707)
   ↓
3. Backend calls Google Places API (3 requests in parallel)
   → Fetch top attractions within 15km
   → Fetch top restaurants within 10km
   → Fetch top hotels within 12km
   ↓
4. Backend gets real place data:
   - Names: "Marina Beach", "Kapaleeshwarar Temple", "Murugan Idli Shop"
   - Addresses: Full addresses
   - Ratings: 4.5, 4.7, etc.
   ↓
5. Backend sends this data to Gemini AI with instruction:
   "Use ONLY these real places. Do not make up generic names."
   ↓
6. Gemini generates itinerary using real place names
   ↓
7. Backend adds Google Maps URLs
   ↓
8. Frontend displays with place names, addresses, and map links
```

---

## 🐛 Troubleshooting

### Error: "API key not valid"
**Solution:**
- Wait 10-15 minutes after creating the key
- Ensure Places API is enabled
- Check for extra spaces in `.env` file

### Error: "This API project is not authorized"
**Solution:**
- Go to Google Cloud Console
- Enable "Places API" for your project
- Enable "Geocoding API" as well

### Warning: "No real places found"
**Solution:**
- Check API key is correct
- Verify internet connection
- Try a popular destination (Chennai, Mumbai, Goa)
- The system will fallback to AI's general knowledge

### Places are generic, not specific
**Solution:**
- Check console logs: should see "✅ Found X attractions, Y restaurants"
- If not, API key might be missing
- Restart backend after adding API key

---

## 📊 Comparing Results

### Before (Generic):
```
09:00 AM - Visit local beach
01:00 PM - Lunch at nearby restaurant
03:00 PM - Check into hotel
```

### After (Real Places):
```
09:00 AM - Visit Marina Beach
          📍 Beach Road, Chennai, Tamil Nadu 600001
          🗺️ View on Google Maps

01:00 PM - Lunch at Murugan Idli Shop
          📍 T Nagar, Chennai
          💰 ₹300
          🗺️ View on Google Maps

03:00 PM - Check into Hotel Savera
          📍 Dr. Radhakrishnan Salai, Mylapore
          🗺️ View on Google Maps
```

---

## ✅ Success Checklist

- [ ] Google Cloud project created
- [ ] Places API enabled
- [ ] API key created
- [ ] API key added to `.env`
- [ ] Backend restarted
- [ ] Test itinerary generated
- [ ] Console shows "Found X places"
- [ ] Response includes real place names
- [ ] Google Maps links working

---

## 🎯 Best Practices

### For Demo:
1. Test with popular cities (Chennai, Goa, Ladakh)
2. Keep some generated itineraries saved
3. Have backup screenshots if API fails
4. Mention "real-time place data" in presentation

### For Production:
1. Enable API key restrictions
2. Set up usage alerts (Google Cloud Console)
3. Monitor API quota usage
4. Consider caching popular destinations

---

## 💡 Alternative: Without Places API

If you can't set up Places API right now:
- System will fallback to Gemini's general knowledge
- AI will still suggest real places, but without verification
- No addresses or Google Maps links
- Set `GOOGLE_PLACES_API_KEY=` (empty) in `.env`

---

## 📚 Additional Resources

- **Places API Docs:** https://developers.google.com/maps/documentation/places/web-service
- **Geocoding API Docs:** https://developers.google.com/maps/documentation/geocoding
- **Pricing Calculator:** https://mapsplatform.google.com/pricing/
- **Free Credits:** https://cloud.google.com/free

---

**Questions?** Check backend console logs for detailed error messages.

**Ready!** Your itineraries will now feature real, verified places! 🎉
