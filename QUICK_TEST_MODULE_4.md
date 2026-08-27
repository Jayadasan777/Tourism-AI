# 🧪 Quick Test Guide - Module 4 (Safety UI)

## Prerequisites
- Backend running on http://localhost:5000
- Frontend running on http://localhost:5173

## Start Servers

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

## Test Scenarios

### Scenario 1: Ladakh (High Risk)
1. Navigate to: http://localhost:5173/safety
2. Enter destination: **Ladakh**
3. Click "Check Safety"

**Expected Results:**
- ⚠️ Safety Score: ~60-70 (Yellow/Orange)
- 🚨 Active hazard alert: "Khardung La Pass Temporarily Closed"
- ❄️ Cold weather conditions
- 📞 Regional contacts displayed

---

### Scenario 2: Kerala (Monsoon Alert)
1. Search for: **Kerala**
2. Click "Check Safety"

**Expected Results:**
- ⚠️ Safety Score: ~65-75 (Yellow)
- 🌧️ Monsoon warning alert (medium severity)
- 🌴 Regional emergency contacts
- 💧 High humidity readings

---

### Scenario 3: Goa (Safe)
1. Search for: **Goa**
2. Click "Check Safety"

**Expected Results:**
- ✅ Safety Score: 85-95 (Green)
- ✅ No active alerts message
- 🏖️ Beach safety in general risks
- ☀️ Good weather conditions

---

### Scenario 4: Custom Destination
1. Enter any Indian city: **Mumbai**, **Delhi**, **Bangalore**
2. Click "Check Safety"

**Expected Results:**
- ✅ Real weather data loads
- 🌤️ 5-day forecast displays
- 📞 National emergency contacts
- ℹ️ No mock hazard data (only weather)

---

## Features to Test

### Tab Navigation
- [ ] Click "Overview" tab → See safety score + summaries
- [ ] Click "Weather" tab → See weather widget + forecast
- [ ] Click "Alerts" tab → See hazard list + general risks
- [ ] Click "Emergency" tab → See contact numbers

### Weather Widget
- [ ] Temperature displays in °C
- [ ] Sunrise/sunset times shown
- [ ] Weather icon matches condition
- [ ] Severe weather alert banner (if applicable)

### Forecast Card
- [ ] 5 days displayed
- [ ] Horizontal scroll works on mobile
- [ ] Each day shows temp, icon, condition

### Hazard Alerts
- [ ] Severity colors correct (red/yellow/blue)
- [ ] Affected areas show as chips
- [ ] Days remaining countdown accurate
- [ ] Disclaimer banner visible
- [ ] "No Active Alerts" for safe destinations

### Emergency Contacts
- [ ] Click phone icon → Opens phone dialer
- [ ] Click copy icon → Copies number
- [ ] Copy feedback shows green checkmark
- [ ] All 6 national numbers present

### Safety Score
- [ ] Circular progress matches score
- [ ] Color changes based on score level
- [ ] Weather + hazard factors shown
- [ ] "How is this calculated?" expands

### Loading States
- [ ] Search shows loading spinner
- [ ] Weather loads with skeleton
- [ ] Alerts load with skeleton

### Error Handling
- [ ] Invalid destination shows error
- [ ] Backend offline shows retry button
- [ ] Network error has clear message

### Mobile Responsive
- [ ] Open on phone (or browser DevTools mobile view)
- [ ] Tabs scroll horizontally
- [ ] Cards stack vertically
- [ ] Buttons are large enough (44px+)

---

## Quick Checks

### Visual Polish
- [ ] Colors match Tailwind theme
- [ ] Spacing is consistent
- [ ] Text is readable
- [ ] Icons are clear

### Performance
- [ ] Page loads in < 2 seconds
- [ ] No console errors
- [ ] Smooth transitions
- [ ] No layout shifts

### Accessibility
- [ ] Can tab through elements
- [ ] Buttons have hover states
- [ ] Colors have good contrast
- [ ] Text is legible

---

## Expected Console Logs

```
🌍 Fetching coordinates for Ladakh...
✅ Found: Leh, Ladakh (34.15, 77.57)
🌤️ Fetching weather data...
✅ Weather data retrieved: 15°C, Clear
```

---

## Common Issues

### "Failed to fetch"
- ✅ Check backend is running on port 5000
- ✅ Check CORS is enabled in backend
- ✅ Verify API URL in frontend

### "Destination not found"
- ✅ Try exact city names
- ✅ Try state names (Kerala, Rajasthan)
- ✅ Check OpenWeatherMap API key is valid

### Hazard data not showing
- ✅ Only 10 destinations have mock data
- ✅ Try: Ladakh, Kerala, Rishikesh, Goa, Manali
- ✅ Other cities will show weather only

---

## Success Criteria

✅ All 4 tabs load without errors
✅ Real weather data displays
✅ Hazard alerts show for supported destinations
✅ Emergency contacts are clickable
✅ Safety score calculates correctly
✅ Mobile responsive on all screen sizes
✅ No console errors
✅ Page loads fast (< 3 seconds)

**Module 4 is production-ready!** 🎉
