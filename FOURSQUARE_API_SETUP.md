# 🗺️ FOURSQUARE API SETUP - GET YOUR KEY!

## 🚨 CRITICAL: Your Nearby Radar needs this!

Without Foursquare API key, Nearby Radar shows NO results!

---

## ⚡ QUICK SETUP (5 MINUTES):

### **Step 1: Create Foursquare Account**

Go to: **https://foursquare.com/developers/signup**

1. Click "Sign Up"
2. Use your email
3. Verify email

---

### **Step 2: Create App**

1. Go to: **https://foursquare.com/developers/apps**
2. Click "Create a new app"
3. Fill form:
   - **App Name:** Smart Tour AI
   - **App Website:** http://localhost:5173
   - **Category:** Travel & Tourism
4. Click "Create App"

---

### **Step 3: Get API Key**

1. You'll see your new app
2. Find section: **"API Keys"**
3. Copy the **API Key** (starts with `fsq3...`)

Example:
```
fsq3AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
```

---

### **Step 4: Add to Backend .env**

1. Open: `E:\tourism\backend\.env`
2. Add this line:
   ```
   FOURSQUARE_API_KEY=fsq3AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
   ```
   (Replace with YOUR actual key!)

---

### **Step 5: Restart Backend**

```bash
cd E:/tourism/backend
# Stop current server (Ctrl+C)
npm run dev
```

---

### **Step 6: Test!**

1. Go to: `http://localhost:5173/nearby`
2. Click "Get My Location"
3. Click "Search Nearby"
4. **You'll see 100+ REAL places!** 🎉

---

## 📊 FREE TIER LIMITS:

```
✅ 100,000 API calls/month
✅ 50 requests/second
✅ No credit card required
✅ Perfect for hackathon & demo!
```

---

## 🔧 FOR RENDER DEPLOYMENT:

### **Add Environment Variable:**

1. Go to Render dashboard
2. Click your backend service
3. Go to "Environment"
4. Add:
   - **Key:** `FOURSQUARE_API_KEY`
   - **Value:** `fsq3AbCdEfGhIjKlMnOpQrStUvWxYz1234567890`
5. Click "Save"
6. Render will auto-redeploy

---

## ✅ HOW TO VERIFY IT'S WORKING:

### **Check Backend Logs:**

```bash
# You should see:
🔍 Foursquare: Searching near (12.8696, 80.2198), radius: 500000m
✅ Found 100 venues from Foursquare
📊 Returning 100 places to frontend
```

### **Check Frontend:**

```
Nearby Radar shows:
✅ 100 attractions
✅ 100 restaurants
✅ 50 hotels
✅ 50 cafes

Total: 300+ real verified venues!
```

---

## 🚨 TROUBLESHOOTING:

### **Problem: Still no results**

**Check:**
```bash
# 1. Is key in .env?
cat backend/.env | grep FOURSQUARE

# 2. Restart backend
cd backend
npm run dev

# 3. Check logs
# Look for "FOURSQUARE_API_KEY not set" warning
```

### **Problem: "Invalid API key"**

**Solution:**
- New keys take 2-3 minutes to activate
- Wait and try again
- Check you copied the full key (no spaces!)

### **Problem: "Rate limit exceeded"**

**Solution:**
- Free tier: 100k calls/month
- You're probably fine
- Check dashboard: https://foursquare.com/developers/apps

---

## 💡 QUICK REFERENCE:

**Foursquare Dashboard:** https://foursquare.com/developers/apps  
**API Docs:** https://developer.foursquare.com/docs/places-api-overview  
**Get Key:** https://foursquare.com/developers/signup

---

## ✅ CHECKLIST:

- [ ] Created Foursquare account
- [ ] Created app on dashboard
- [ ] Copied API key
- [ ] Added to `backend/.env`
- [ ] Restarted backend server
- [ ] Tested Nearby Radar
- [ ] Seeing 100+ real places! 🎉

---

**AFTER SETUP:** Your Nearby Radar will show REAL restaurants, hotels, attractions across Tamil Nadu! 🚀
