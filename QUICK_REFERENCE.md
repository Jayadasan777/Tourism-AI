# ⚡ Quick Reference Card - Smart Tour AI

**Print this out or keep it open!**

---

## 👥 Who Owns What

| Person | Components | Backend |
|--------|-----------|---------|
| **A** | `components/itinerary/*`, `pages/PlanTripPage.jsx`, `pages/MyItinerariesPage.jsx` | `data/hidden-destinations.json`, `services/destinationService.js` |
| **B** | `components/safety/*`, `components/common/*`, `pages/LandingPage.jsx`, `Navbar.jsx`, `Footer.jsx` | None |
| **C** | `components/auth/*`, `contexts/AuthContext.jsx`, `pages/Login+Register`, `components/map/*` | None |

---

## 🔄 Daily Routine

### Morning (9:00 AM)
```bash
# 1. Pull latest
git checkout working
git pull origin working

# 2. Daily standup (15 min)
# 3. Update WORK_MODULES.md
# 4. Start coding
```

### During Work
```bash
# Every 2-3 hours
git add .
git commit -m "Module X: What you did"
git push origin working
```

### Evening (6:00 PM)
```bash
# 1. Final push
git add .
git commit -m "Module X: Complete Day Y"
git push origin working

# 2. Update team in chat
# 3. Update WORK_MODULES.md
```

---

## 🚀 Start Work

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend  
npm run dev

# Browser
http://localhost:5173
```

---

## 📝 Commit Format

```bash
✅ "Module 3: Add itinerary form"
✅ "Module 4: Connect weather API"
✅ "Module 2: Implement Google Sign-In"
✅ "Fix: Form validation bug"

❌ "Update"
❌ "Changes"
❌ "WIP"
```

---

## 🔀 Git Commands

```bash
# Start day
git checkout working
git pull origin working

# Save work
git add .
git commit -m "Module X: Description"
git push origin working

# If conflict
git pull origin working
# Fix conflicts in VS Code
git add .
git commit -m "Merge: Resolve conflicts"
git push origin working

# See your changes
git status
git log --oneline -5

# Undo last commit (not pushed)
git reset --soft HEAD~1
```

---

## 🐛 Common Fixes

### "API not responding"
```bash
# Check backend running
cd backend
npm run dev

# Check .env
VITE_API_URL=http://localhost:5000/api
```

### "Firebase error"
```bash
# Check .env has all VITE_FIREBASE_* variables
# Check Firebase Console - auth enabled?
# Clear browser cache
```

### "Port in use"
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill
```

### "Module not found"
```bash
cd frontend
npm install
```

---

## 📞 Need Help?

**0-5 minutes:** Post in group chat
**5-15 minutes:** Quick call with 1 person
**15-30 minutes:** Team call
**>30 minutes:** Move to next task, discuss in standup

---

## ✅ Daily Checklist

### Morning
- [ ] Pull latest code
- [ ] Daily standup
- [ ] Know today's tasks

### During
- [ ] Code assigned module
- [ ] Test locally
- [ ] Commit every 2-3 hours

### Evening
- [ ] Test feature end-to-end
- [ ] Update WORK_MODULES.md
- [ ] Push code
- [ ] Message team

---

## 🧪 Test Your Work

**Person A:**
```bash
# Test itinerary generation
1. Fill form
2. Click generate
3. Wait 5 seconds
4. See day-wise result
5. Check costs add up
```

**Person B:**
```bash
# Test safety widget
1. Enter destination
2. See weather
3. See hazard alerts
4. Click emergency numbers
```

**Person C:**
```bash
# Test auth
1. Sign up new user
2. Log out
3. Log in
4. Try protected route
5. Should redirect if not logged in
```

---

## 📊 Progress Tracking

**Update daily in WORK_MODULES.md:**

```markdown
## Person A - Day 3
- [x] Create form ✅
- [x] Add validation ✅
- [x] Create display ✅
- [ ] Add loading ← Working on this
- [ ] Connect API

Progress: 60%
```

---

## 🎯 This Week's Goals

### Week 1 (Days 1-7)
- Auth works
- Itinerary generates
- Safety displays
- Landing page done

### Week 2 (Days 8-14)
- Hidden destinations
- Map interactive
- UI polished
- Deployed
- Demo ready

---

## 🔥 Critical Rules

1. **DON'T** edit files owned by others
2. **DON'T** push broken code
3. **DON'T** force push
4. **DON'T** work on `main` branch
5. **DO** pull before push
6. **DO** commit frequently
7. **DO** communicate blockers
8. **DO** help teammates

---

## 📱 Group Chat Format

**Daily Update:**
```
✅ Day 3 complete
📝 Itinerary display working
🔗 Commit: abc123
🚀 Tomorrow: Connect to API
```

**Need Help:**
```
🚨 Weather API returning undefined
📍 Line 45 in WeatherWidget.jsx
❓ Anyone seen this?
```

**Integration:**
```
🎉 Auth is ready!
📢 @PersonA can add save button now
📖 Check AuthContext.jsx for usage
```

---

## 🏁 Launch Checklist

### Day 13
- [ ] 3 test accounts created
- [ ] 3 sample itineraries saved
- [ ] Screenshots taken
- [ ] Demo script written
- [ ] Practice once

### Day 14
- [ ] Production tested
- [ ] Demo practiced 3x
- [ ] Q&A prep done
- [ ] Backup video recorded
- [ ] **READY! 🚀**

---

## 📞 Emergency

**Can't commit:**
```bash
git status
# Fix any issues
git add .
git commit -m "Message"
```

**Can't push:**
```bash
git pull origin working
# Resolve conflicts
git push origin working
```

**Everything broken:**
```bash
# Reset to last working commit
git log --oneline
git reset --hard <commit-hash>
```

**Still stuck:**
Call team meeting NOW! 📞

---

## 💡 Pro Tips

✅ Commit small, commit often
✅ Test before pushing
✅ Read error messages carefully
✅ Google the error
✅ Check browser console
✅ Check backend console
✅ Ask for help early
✅ Take breaks!

---

## 🎯 Success Metrics

**Good Day:**
- Completed 1-2 tasks from checklist
- Code pushed and working
- No blockers
- Team updated

**Great Day:**
- Completed 3+ tasks
- Helped a teammate
- Found and fixed bug
- Module XX% done

---

**Keep this open while working! 💪**

**Questions? Check:**
- TEAM_WORKFLOW.md (detailed)
- WORK_MODULES.md (task lists)
- CLAUDE.md (architecture)
- frontend/README.md (setup)
