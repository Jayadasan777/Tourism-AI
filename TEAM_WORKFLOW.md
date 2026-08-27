# 🚀 Smart Tour AI - Team Workflow (3-Person Parallel Development)

**Branch:** `working` ⚠️ **WORK ONLY ON THIS BRANCH!**
**Team:** Black Forge (3 developers)
**Timeline:** 2 weeks (10 working days)
**Strategy:** Parallel development with minimal blocking

## 🚨 CRITICAL: Branch Rules

**✅ ALWAYS:**
- Work on `working` branch
- Commit to `working` branch
- Push to `working` branch: `git push origin working`
- Pull from `working` branch: `git pull origin working`

**❌ NEVER:**
- Work on `main` branch
- Commit to `main` branch
- Push to `main` branch

**Before every session, verify your branch:**
```bash
git branch    # Must show: * working
```

---

## 👥 Team Assignments

### Person A - "Itinerary Track" 
**Primary Role:** Core Feature Development
**Modules:** 3, 6
**Time:** 18-22 hours

### Person B - "UI/UX Track"
**Primary Role:** Frontend & Design
**Modules:** 4, 5, 8
**Time:** 18-22 hours

### Person C - "Infrastructure Track"
**Primary Role:** Auth & Deployment
**Modules:** 2, 7, 9
**Time:** 18-22 hours

**Module 10 (Demo Prep):** All 3 together at the end

---

## 📋 File Ownership (Avoid Conflicts!)

### 🔵 Person A Owns These Files:
```
frontend/src/
  ├── components/itinerary/
  │   ├── ItineraryForm.jsx
  │   ├── ItineraryDisplay.jsx
  │   ├── GeneratingLoader.jsx
  │   ├── DayCard.jsx
  │   └── ActivityCard.jsx
  ├── pages/
  │   ├── PlanTripPage.jsx
  │   └── MyItinerariesPage.jsx

backend/
  ├── data/
  │   └── hidden-destinations.json
  ├── services/
  │   └── destinationService.js
  ├── controllers/
  │   └── destinationController.js
  └── routes/
      └── destinationRoutes.js
```

### 🟢 Person B Owns These Files:
```
frontend/src/
  ├── components/safety/
  │   ├── WeatherWidget.jsx
  │   ├── ForecastCard.jsx
  │   ├── HazardAlert.jsx
  │   ├── EmergencyContacts.jsx
  │   └── SafetyScore.jsx
  ├── components/common/
  │   ├── Button.jsx
  │   ├── Input.jsx
  │   ├── Card.jsx
  │   ├── Modal.jsx
  │   └── Toast.jsx
  ├── pages/
  │   ├── LandingPage.jsx
  │   └── SafetyPage.jsx
  ├── components/
  │   ├── Navbar.jsx
  │   └── Footer.jsx
```

### 🟡 Person C Owns These Files:
```
frontend/src/
  ├── components/auth/
  │   ├── LoginForm.jsx
  │   ├── RegisterForm.jsx
  │   ├── ProtectedRoute.jsx
  │   └── UserProfile.jsx
  ├── contexts/
  │   └── AuthContext.jsx
  ├── pages/
  │   ├── LoginPage.jsx
  │   └── RegisterPage.jsx
  ├── components/map/
  │   ├── MapView.jsx
  │   ├── MapMarker.jsx
  │   └── MapPopup.jsx
```

### ⚪ Shared Files (Need Coordination):
```
frontend/src/
  ├── App.jsx          # Person C updates routes
  ├── services/        # Already created, rarely edit
  └── index.css        # Person B for global styles
```

---

## 📅 2-Week Timeline

### Week 1: Core Features (Days 1-7)

#### Day 1
| Person A | Person B | Person C |
|----------|----------|----------|
| Create `ItineraryForm.jsx` skeleton | Create `WeatherWidget.jsx` | Create `AuthContext.jsx` |
| Add form fields (destination, budget, duration) | Fetch weather from API | Set up Firebase Auth |
| Basic styling | Display temp, condition | Create `LoginForm.jsx` |
| **Commit:** "Module 3: Add itinerary form skeleton" | **Commit:** "Module 4: Add weather widget" | **Commit:** "Module 2: Add auth context" |

#### Day 2
| Person A | Person B | Person C |
|----------|----------|----------|
| Add interests checkboxes | Create `ForecastCard.jsx` | Create `LoginPage.jsx` |
| Add date picker | Display 5-day forecast | Add email/password login |
| Form validation (Joi rules) | Horizontal scroll for mobile | Add Google Sign-In button |
| Test validation | **Commit:** "Module 4: Add forecast" | **Commit:** "Module 2: Add login page" |
| **Commit:** "Module 3: Add form validation" | | |

#### Day 3
| Person A | Person B | Person C |
|----------|----------|----------|
| Create `ItineraryDisplay.jsx` | Create `HazardAlert.jsx` | Create `RegisterPage.jsx` |
| Day-wise card layout | Color-coded alerts (red/yellow) | Email/password signup |
| Activity card component | Show disclaimer | Password confirmation |
| Display costs | **Commit:** "Module 4: Add hazard alerts" | Google Sign-Up |
| **Commit:** "Module 3: Add display component" | | **Commit:** "Module 2: Add register page" |

#### Day 4
| Person A | Person B | Person C |
|----------|----------|----------|
| Create `GeneratingLoader.jsx` | Create `EmergencyContacts.jsx` | Create `ProtectedRoute.jsx` |
| Loading animation | Clickable phone numbers (tel:) | Check auth state |
| Connect form to API | Copy button | Redirect to login if not auth |
| Handle API response | Create `SafetyScore.jsx` | **Commit:** "Module 2: Add protected routes" |
| **Commit:** "Module 3: Connect to backend" | **Commit:** "Module 4: Add emergency contacts" | |

#### Day 5
| Person A | Person B | Person C |
|----------|----------|----------|
| Error handling | Start `LandingPage.jsx` | Create `UserProfile.jsx` |
| Retry button | Hero section | Display name, email, photo |
| Test with multiple destinations | Tagline + CTA button | Logout button |
| **WAIT for auth to add save** | Features section (3-4 cards) | **INTEGRATE** with Person A |
| **Commit:** "Module 3: Add error handling" | **Commit:** "Module 5: Add landing page hero" | **Commit:** "Module 2: Complete auth flow" |

#### Day 6
| Person A | Person B | Person C |
|----------|----------|----------|
| **NOW HAS AUTH** | Create `Navbar.jsx` | Start `MapView.jsx` |
| Add "Save" button to itinerary | Logo, nav links | Install react-leaflet |
| Create `MyItinerariesPage.jsx` | User profile dropdown | Initialize OpenStreetMap |
| Fetch saved itineraries | Mobile hamburger menu | Set default center/zoom |
| **Commit:** "Module 3: Add save functionality" | **Commit:** "Module 5: Add navigation" | **Commit:** "Module 7: Initialize map" |

#### Day 7
| Person A | Person B | Person C |
|----------|----------|----------|
| Delete itinerary functionality | Create `Footer.jsx` | Create custom map markers |
| Click to view saved itinerary | Team name, SIH 2026 badge | Blue: Itinerary locations |
| **START Module 6** | Mobile responsive testing | Green: Hidden destinations |
| Create `hidden-destinations.json` | **Commit:** "Module 5: Complete landing page" | Red: Hazard zones |
| **Commit:** "Module 3: Complete itinerary UI" | | **Commit:** "Module 7: Add map markers" |

**End of Week 1 Status Check:**
- ✅ Itinerary generation working
- ✅ Safety info displaying
- ✅ Auth flow complete
- ✅ Landing page done
- ✅ Map started

---

### Week 2: Polish & Deploy (Days 8-14)

#### Day 8
| Person A | Person B | Person C |
|----------|----------|----------|
| Add 20-30 destinations to JSON | Start `Button.jsx` component | Plot locations on map |
| Tags, descriptions, images | Primary, secondary, danger variants | Extract from itinerary data |
| Create backend service | Create `Input.jsx` component | Add markers to map |
| Recommendation algorithm | Text, number, date variants | **Commit:** "Module 7: Plot locations" |
| **Commit:** "Module 6: Add destinations data" | **Commit:** "Module 8: Add reusable components" | |

#### Day 9
| Person A | Person B | Person C |
|----------|----------|----------|
| Create API endpoint | Create `Card.jsx` component | Create map popups |
| `/api/destinations/hidden` | Create `Modal.jsx` component | Click marker → show info |
| Test recommendation logic | Create loading skeletons | Activity details for itinerary pins |
| **Commit:** "Module 6: Add backend API" | **Commit:** "Module 8: Add UI components" | **Commit:** "Module 7: Add map popups" |

#### Day 10
| Person A | Person B | Person C |
|----------|----------|----------|
| Create `DestinationCard.jsx` | Create error states | Route drawing (optional) |
| Create `HiddenGemsSection.jsx` | Empty state component | Connect locations with lines |
| Integrate with itinerary page | Mobile testing (375px+) | Different color per day |
| **Commit:** "Module 6: Complete hidden destinations" | **Commit:** "Module 8: Complete UI polish" | **Commit:** "Module 7: Complete map" |

#### Day 11
| Person A | Person B | Person C |
|----------|----------|----------|
| Integration testing | Fix mobile issues | **START DEPLOYMENT** |
| Test full itinerary flow | Accessibility check | Backend to Render/Railway |
| Test with hidden destinations | Add focus indicators | Set environment variables |
| Bug fixes | **Commit:** "Module 8: Mobile fixes" | Upload Firebase key |
| **Commit:** "Module 6: Bug fixes" | | **Commit:** "Module 9: Deploy backend" |

#### Day 12
| Person A | Person B | Person C |
|----------|----------|----------|
| Create demo test data | Take screenshots | Deploy frontend to Vercel |
| 3 sample itineraries | Document features | Set Firebase config env vars |
| Rishikesh, Goa, Ladakh | Create feature walkthrough | Update API URL |
| **Commit:** "Module 10: Add test data" | **Commit:** "Module 10: Add screenshots" | **Commit:** "Module 9: Deploy frontend" |

#### Day 13
| Person A | Person B | Person C |
|----------|----------|----------|
| **ALL: Module 10 - Demo Prep** | | |
| Write demo script (3-5 minutes) | | |
| Practice demo flow | | |
| Record backup video | | |
| Update presentation slides | | |
| Prepare Q&A responses | | |
| **Commit:** "Module 10: Demo preparation complete" | | |

#### Day 14
| Person A | Person B | Person C |
|----------|----------|----------|
| **ALL: Final Testing & Practice** | | |
| Test on production URL | | |
| Test on real mobile devices | | |
| Practice demo 3+ times | | |
| Polish presentation | | |
| **READY FOR DEMO** | | |

---

## 🔄 Daily Workflow

### Every Morning (9:00 AM - 15 minutes)

**Daily Standup Format:**

```
Person A:
✅ Yesterday: Created itinerary form skeleton
🎯 Today: Add form validation
🚫 Blockers: None

Person B:
✅ Yesterday: Weather widget displaying correctly
🎯 Today: Start forecast component
🚫 Blockers: Need weather API response format

Person C:
✅ Yesterday: Auth context 80% done
🎯 Today: Finish auth + start login page
🚫 Blockers: None

Quick sync:
- Person B: Check backend/services/weatherService.js line 45 for API format
- Person A: Once Person C finishes auth (Day 5), ping for integration
```

**After Standup:**
1. Update WORK_MODULES.md with today's tasks
2. Commit the updated checklist

---

### During Development

**Start of day:**
```bash
git checkout working
git pull origin working
```

**During work (every 2-3 hours):**
```bash
git add .
git commit -m "Module 3: Add form validation"
git push origin working
```

**End of day:**
```bash
# Final commit
git add .
git commit -m "Module 3: Complete form UI (Day 1)"
git push origin working

# Update team
# Post in group chat: "Day 1 done. Itinerary form UI complete. See commit abc123"
```

---

## 📝 Commit Message Format

**Good commit messages:**
```
✅ "Module 3: Add itinerary form with validation"
✅ "Module 4: Connect weather widget to API"
✅ "Module 2: Implement Google Sign-In"
✅ "Module 6: Add hidden destinations dataset"
✅ "Fix: Itinerary form validation bug"
✅ "Module 3: Complete itinerary display (Day 3)"
```

**Bad commit messages:**
```
❌ "Update"
❌ "Changes"
❌ "WIP"
❌ "Fix bug"
❌ "More work"
```

---

## 🔀 Git Strategy

### Branch Structure

```
main          ← Production-ready code (backend + frontend setup)
  ↓
working       ← Development branch (all 3 work here)
  ↓
(optional feature branches if needed)
```

### Handling Merge Conflicts

**If you get a conflict:**

1. **Don't panic** - Conflicts are normal with 3 people

2. **Check what conflicted:**
```bash
git pull origin working
# Shows conflicted files
```

3. **If it's YOUR file:**
```bash
# Keep your version
git checkout --ours path/to/file
git add path/to/file
```

4. **If it's THEIR file:**
```bash
# Keep their version
git checkout --theirs path/to/file
git add path/to/file
```

5. **If it's a SHARED file (App.jsx):**
```bash
# Open file in VS Code
# Look for <<<<<<< markers
# Manually merge both changes
# Remove conflict markers
git add path/to/file
```

6. **Complete the merge:**
```bash
git commit -m "Merge: Resolve conflict in App.jsx"
git push origin working
```

7. **Tell team in group chat:**
```
"Resolved merge conflict in App.jsx. Kept both route additions. All good!"
```

---

## 🧪 Testing Checklist

### Person A - Test Itinerary
- [ ] Form validates correctly (budget, duration, interests)
- [ ] Loading animation shows during API call
- [ ] Itinerary displays with all days
- [ ] Activities show time, title, description, cost
- [ ] Total cost displayed correctly
- [ ] Budget comparison works
- [ ] Save button works (after auth integrated)
- [ ] My Itineraries page loads
- [ ] Can delete itinerary
- [ ] Hidden destinations show below itinerary

### Person B - Test Safety & UI
- [ ] Weather widget shows current conditions
- [ ] 5-day forecast displays correctly
- [ ] Hazard alerts show with correct colors
- [ ] Emergency contacts are clickable
- [ ] Safety score displays with color
- [ ] Landing page looks good on mobile
- [ ] Navigation menu works
- [ ] Footer displays correctly
- [ ] All buttons have consistent styling
- [ ] Loading states work
- [ ] Error messages display properly

### Person C - Test Auth & Infrastructure
- [ ] Can sign up with email/password
- [ ] Can log in with email/password
- [ ] Google Sign-In works
- [ ] Protected routes redirect to login
- [ ] User profile displays correctly
- [ ] Logout clears session
- [ ] Token persists across page refresh
- [ ] Map displays with correct tiles
- [ ] Markers show on map
- [ ] Popups appear on click
- [ ] Production deployment works
- [ ] All env variables set correctly

---

## 📞 Communication Protocol

### Group Chat (WhatsApp/Slack)

**Daily updates (End of day):**
```
Person A: ✅ Day 1 complete. Form UI done. Commit: abc123
Person B: ✅ Day 1 complete. Weather widget working. Commit: def456
Person C: ✅ Day 1 complete. Auth context setup. Commit: ghi789
```

**When you need help:**
```
Person B: "Need help - weather API returning undefined. Anyone seen this?"
Person A: "Check if backend is running on port 5000"
Person C: "Also check the API_URL in your .env file"
```

**Before pushing breaking changes:**
```
Person C: "About to update App.jsx to add auth routes. Will push in 10 min."
Person A: "👍 I'll pull after you push"
Person B: "Same here"
```

**Integration points:**
```
Person C: "@Person A - Auth is ready! You can now add the save button."
Person A: "Perfect timing! Will integrate today."
```

---

## 🚨 Blockers & Solutions

### Common Blocker: "API not responding"

**Solution:**
1. Check backend is running: `cd backend && npm run dev`
2. Check backend URL in `.env`: `VITE_API_URL=http://localhost:5000/api`
3. Check browser console for CORS errors
4. Verify backend CORS allows `http://localhost:5173`

### Common Blocker: "Firebase error"

**Solution:**
1. Check all Firebase env variables are set
2. Check Firebase console - project active?
3. Check auth methods enabled (Email/Password, Google)
4. Clear browser cache and cookies
5. Check browser console for specific error

### Common Blocker: "Merge conflict"

**Solution:**
1. Follow Git Strategy section above
2. If stuck > 15 min, call quick team meeting
3. Worst case: create new branch from last working commit

### Common Blocker: "Waiting for another person's work"

**Solution:**
1. **If waiting for auth:** Use mock user object temporarily
2. **If waiting for API:** Use mock data in component
3. **If truly blocked:** Help with testing or documentation
4. **If still blocked:** Work on Module 10 (demo prep) early

---

## 📊 Progress Tracking

### Update WORK_MODULES.md Daily

**After standup each morning:**

1. Open `WORK_MODULES.md`
2. Find your module section
3. Check off completed tasks: `- [ ]` → `- [x]`
4. Update progress %: `Progress: 30%` → `Progress: 50%`
5. Commit: `git commit -m "Update progress: Module 3 at 50%"`

**Example update:**
```markdown
### Person A Progress (Day 3)
- [x] Create ItineraryForm.jsx
- [x] Add form fields
- [x] Add validation
- [x] Create ItineraryDisplay.jsx  ← Just finished
- [ ] Create loading component      ← Working on tomorrow
- [ ] Connect to API

Progress: 50% (Day 3 of 7)
```

---

## 🎯 Integration Points (Must Coordinate)

### Integration 1: Auth + Itinerary (Day 5)

**Person C completes auth → Person A adds save feature**

**Person C does:**
```javascript
// Export from AuthContext
export const useAuth = () => useContext(AuthContext);

// Provides: user, isAuthenticated, login, logout
```

**Person A uses:**
```javascript
import { useAuth } from '../contexts/AuthContext';

const { user, isAuthenticated } = useAuth();

// Show save button only if authenticated
{isAuthenticated && <button onClick={handleSave}>Save</button>}
```

**Communication:**
```
Day 5, 5 PM:
Person C: "Auth is done! Check src/contexts/AuthContext.jsx for usage."
Person A: "Got it! Will add save button tomorrow morning."
```

---

### Integration 2: Safety + Itinerary (Day 4)

**Person B completes safety → Person A adds to itinerary page**

**Person B does:**
```javascript
// Export SafetyWidget component
export const SafetyWidget = ({ destination }) => {
  // Fetches and displays safety info
};
```

**Person A uses:**
```javascript
import { SafetyWidget } from '../components/safety/SafetyWidget';

// In ItineraryDisplay.jsx
<SafetyWidget destination={itinerary.destination} />
```

**Communication:**
```
Day 4, 4 PM:
Person B: "Safety widget ready! Pass it a destination prop."
Person A: "Perfect! Will add to itinerary display."
```

---

### Integration 3: Map + Itinerary (Day 9)

**Person C completes map → Person A passes location data**

**Person C does:**
```javascript
// MapView expects array of locations
export const MapView = ({ locations, hiddenDestinations, hazards }) => {
  // Plots all on map
};
```

**Person A uses:**
```javascript
import { MapView } from '../components/map/MapView';

// Extract locations from itinerary
const locations = itinerary.days.flatMap(day => 
  day.activities.map(a => ({ name: a.title, coords: a.coords }))
);

<MapView locations={locations} />
```

---

## ✅ Definition of Done

### For Each Module:

**Code Complete:**
- [ ] All tasks in WORK_MODULES.md checked off
- [ ] Component renders without errors
- [ ] No console errors or warnings
- [ ] Committed to `working` branch

**Tested:**
- [ ] Works on desktop (1920px)
- [ ] Works on mobile (375px)
- [ ] Error cases handled
- [ ] Loading states work
- [ ] API integration tested

**Documented:**
- [ ] Code has clear comments
- [ ] Complex logic explained
- [ ] Integration points documented
- [ ] Commit message descriptive

**Team Informed:**
- [ ] Posted completion in group chat
- [ ] Shared screenshot/video
- [ ] Integration points communicated
- [ ] Blockers resolved

---

## 📅 Weekly Reviews

### Friday End-of-Week Review (30 minutes)

**Week 1 (Day 7):**
```
Person A demos: Itinerary generation working
Person B demos: Safety info + landing page
Person C demos: Auth flow + map started

Discuss:
- What went well?
- Any blockers for next week?
- Any changes needed to plan?

Update:
- Overall progress % in WORK_MODULES.md
- Adjust Week 2 plan if needed
```

**Week 2 (Day 14):**
```
Full app demo
- Test all features together
- Test on production
- Practice final demo
- Verify all modules complete
```

---

## 🏆 Definition of Success

### Day 7 (End of Week 1):
- ✅ Can sign up and log in
- ✅ Can generate itinerary (AI works)
- ✅ Safety info displays
- ✅ Landing page looks professional
- ✅ Basic map shows

### Day 11 (Mid Week 2):
- ✅ Hidden destinations show
- ✅ UI is polished and responsive
- ✅ Map fully interactive
- ✅ Deployed to production

### Day 14 (Demo Day):
- ✅ All features working on live site
- ✅ Demo practiced 3+ times
- ✅ Screenshots ready
- ✅ Presentation polished
- ✅ Q&A prep done

---

## 🚀 Launch Day Checklist

### Day Before Demo:

**Person A:**
- [ ] Create 3 test accounts
- [ ] Generate 3 sample itineraries (Rishikesh, Goa, Ladakh)
- [ ] Test hidden destinations show correctly
- [ ] Take screenshots of itinerary flow

**Person B:**
- [ ] Test all pages on mobile device
- [ ] Screenshot landing page
- [ ] Screenshot safety alerts
- [ ] Verify all links work

**Person C:**
- [ ] Verify production deployment
- [ ] Test auth on production
- [ ] Check all env variables set
- [ ] Record backup demo video

**All Together:**
- [ ] Practice demo 3 times
- [ ] Time it (should be 3-5 minutes)
- [ ] Prepare for judge questions
- [ ] Review presentation slides

---

## 📞 Emergency Contacts

**If someone is blocked and needs immediate help:**

1. **Post in group chat** with:
   - What you're trying to do
   - What error you're seeing
   - What you've already tried

2. **If urgent (blocking work):**
   - Call quick team meeting (5-15 min)
   - Screen share to debug together

3. **If still stuck after 30 min:**
   - Move to next task
   - Raise in daily standup
   - Team helps debug together

---

## 🎯 Remember

✅ **DO:**
- Commit frequently (every 2-3 hours)
- Update WORK_MODULES.md daily
- Test your code before pushing
- Communicate in group chat
- Help teammates when they're blocked
- Ask for help if stuck > 30 min

❌ **DON'T:**
- Edit files owned by others (without asking)
- Push broken code
- Work on `main` branch (use `working`)
- Skip daily standup
- Merge without pulling first
- Force push (ever!)

---

## 📚 Quick Reference

**Backend running:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Frontend running:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

**Pull latest code:**
```bash
git checkout working
git pull origin working
```

**Commit and push:**
```bash
git add .
git commit -m "Module X: Description"
git push origin working
```

**Check backend API:**
```bash
curl http://localhost:5000/health
```

**Check if backend allows frontend:**
- Backend CORS must allow `http://localhost:5173`
- Check `backend/.env` has `FRONTEND_URL=http://localhost:5173`

---

**🎉 You're Ready to Build! Let's create something amazing! 🚀**

**Next Steps:**
1. Team meeting (30 min) - Assign A/B/C roles
2. Everyone: Clone repo, run backend, run frontend
3. Person A: Start `src/components/itinerary/ItineraryForm.jsx`
4. Person B: Start `src/components/safety/WeatherWidget.jsx`
5. Person C: Start `src/contexts/AuthContext.jsx`

**See you at Daily Standup tomorrow at 9 AM! 💪**
