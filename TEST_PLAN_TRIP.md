# 🔍 Trip Plan Debugging Guide

## Quick Diagnosis Steps

### Step 1: Open Browser Console
1. Open your app: http://localhost:5173/plan
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Try to submit the form
5. **Look for errors** (red text)

### Step 2: Check Network Tab
1. In DevTools, go to **Network** tab
2. Clear all (trash icon)
3. Submit the form
4. Look for a request to `/itinerary/generate`
5. Click on it
6. Check the response

---

## Common Issues & Fixes

### Issue 1: Form Validation Errors
**Symptoms:** Form doesn't submit, shows red error messages

**Check:**
- Destination: At least 2 characters
- Budget: Between ₹1,000 and ₹10,000,000
- Duration: Between 1 and 30 days
- Interests: Select 1-5 interests
- Start Date: Must be today or future

**Fix:** Fill the form correctly

---

### Issue 2: Network Error (Cannot reach backend)
**Symptoms:** Error says "Cannot reach server"

**Check in Console:**
```
Network error: No response from server
```

**Fix:**
1. Check backend is running:
   ```powershell
   curl http://localhost:5000/health
   ```
2. If not running, start it:
   ```powershell
   cd E:\tourism\backend
   npm run dev
   ```

---

### Issue 3: CORS Error
**Symptoms:** Console shows CORS policy error

**Check in Console:**
```
Access to fetch at 'http://localhost:5000/api/itinerary/generate' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Fix:** Backend CORS should allow localhost:5173. Check `backend/server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

---

### Issue 4: 401 Unauthorized (Protected Route)
**Symptoms:** Redirects to login, or shows "Unauthorized"

**This is expected!** The `/plan` route is protected.

**Fix:** 
1. Make sure you're logged in
2. Check localStorage has authToken:
   - Open Console
   - Type: `localStorage.getItem('authToken')`
   - Should return a token string
3. If no token, login first at `/login`

---

### Issue 5: 400 Bad Request (Validation Error)
**Symptoms:** Backend returns 400 error

**Check in Network tab:** Response shows validation error

**Common causes:**
- Budget too low (< ₹1,000)
- Duration too long (> 30 days)
- No interests selected
- Start date in the past

**Fix:** Check form values match backend validation

---

### Issue 6: 500 Server Error
**Symptoms:** Shows "Server error. Please try again."

**Possible causes:**
- Gemini API key not set in backend
- Backend crash
- Database connection issue

**Check backend logs:**
```powershell
# Look at backend console for errors
```

**Fix:**
1. Check backend .env has GEMINI_API_KEY
2. Restart backend

---

### Issue 7: Loading Forever (Never finishes)
**Symptoms:** Shows loading animation, never shows itinerary

**Check in Network tab:**
- Is the request pending?
- Did it complete?
- What's the response status?

**Possible causes:**
1. **Timeout (30s):** Gemini API is slow
2. **No response:** Backend crashed
3. **CORS:** Request blocked

**Fix:**
- Wait up to 30 seconds
- Check backend console for errors
- Check Network tab for actual response

---

### Issue 8: Itinerary Doesn't Display
**Symptoms:** Loading finishes, but no itinerary shows

**Check in Console:**
- Any JavaScript errors?
- Check the response data structure

**Debug in Console:**
```javascript
// After form submission, check:
console.log('Itinerary state:', itinerary);
```

**Possible causes:**
- Response format doesn't match expected structure
- Component rendering error
- Data is null/undefined

---

## Test Commands

### Test 1: Backend Health
```powershell
curl http://localhost:5000/health
```
**Expected:** `{"status":"ok",...}`

### Test 2: Generate Itinerary (Backend Direct)
```powershell
curl -X POST http://localhost:5000/api/itinerary/generate \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Rishikesh",
    "budget": 25000,
    "duration": 4,
    "interests": ["adventure", "nature"],
    "startDate": "2026-09-15"
  }'
```
**Expected:** JSON with itinerary data

### Test 3: Check Frontend API URL
```powershell
cat E:\tourism\frontend\.env | grep VITE_API_URL
```
**Expected:** `VITE_API_URL=http://localhost:5000/api`

---

## Quick Test Form Values

Use these values to test:

```
Destination: Rishikesh
Budget: 25000
Duration: 4
Start Date: Tomorrow's date
Interests: Adventure, Nature (select 2)
```

Click "Generate Itinerary"

**Expected time:** 3-7 seconds
**Expected result:** Itinerary with 4 days of activities

---

## Browser Console Debug Commands

Open Console (F12) and run these:

### Check if API URL is correct:
```javascript
import.meta.env.VITE_API_URL
```

### Check if user is authenticated:
```javascript
localStorage.getItem('authToken')
```

### Check current page state:
```javascript
// This won't work in production, but helps debug
// Check React DevTools instead
```

---

## What to Share for Help

If still not working, share:

1. **Console Errors:** Screenshot of Console tab (F12)
2. **Network Request:** Screenshot of Network tab showing the failing request
3. **Form Values:** What you entered in the form
4. **Expected vs Actual:** What should happen vs what actually happens

Example:
```
Console shows: [Error message here]
Network tab: [Screenshot or status code]
Form values: Rishikesh, ₹25000, 4 days
Expected: Itinerary displays
Actual: Shows error "Cannot reach server"
```

---

## Most Common Solution

**90% of "not working" issues are:**

1. **Backend not running**
   - Solution: `cd backend && npm run dev`

2. **Not logged in**
   - Solution: Go to `/login` and login first

3. **Form validation errors**
   - Solution: Check all fields are filled correctly

4. **Wrong API URL**
   - Solution: Check `.env` has `http://localhost:5000/api`

---

## Emergency Reset

If nothing works, try this:

```powershell
# 1. Stop both servers (Ctrl+C)

# 2. Kill all node processes
taskkill /F /IM node.exe

# 3. Restart backend
cd E:\tourism\backend
npm run dev

# 4. Restart frontend (in new terminal)
cd E:\tourism\frontend
npm run dev

# 5. Clear browser cache
# In browser: Ctrl+Shift+Delete → Clear cache

# 6. Refresh page: Ctrl+F5
```

---

**Now try the form again and let me know what specific error you see!**
