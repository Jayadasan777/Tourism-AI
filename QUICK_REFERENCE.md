# ⚡ Quick Reference Card - Smart Tour AI

**Print this out or keep it open!**

## 🚨 CRITICAL RULE
**⚠️ Work on YOUR branch (`feature/YOUR-NAME`), create PRs to `working`!**

**NEVER commit directly to `main` or `working`!**

Check your branch before every commit:
```bash
git branch    # Must show: * feature/YOUR-NAME
```

---

## 🌿 Branch Strategy

```
main → DO NOT TOUCH
  ↓
working → PR target only (don't commit directly)
  ↓
feature/YOUR-NAME → WORK HERE! (your personal branch)
```

**Your workflow:**
1. Work on `feature/YOUR-NAME`
2. Push to `feature/YOUR-NAME`
3. Create PR to `working` (NOT main)
4. Get review & approval
5. Merge PR
6. Sync YOUR branch with working

---

## 👥 Who Owns What (Avoid Conflicts!)

| Person | Branch | Components | Backend |
|--------|--------|-----------|---------|
| **A** | `feature/person-a` | `components/itinerary/*`, `pages/PlanTripPage.jsx`, `pages/MyItinerariesPage.jsx` | `data/hidden-destinations.json`, `services/destinationService.js` |
| **B** | `feature/person-b` | `components/safety/*`, `components/common/*`, `pages/LandingPage.jsx`, `Navbar.jsx`, `Footer.jsx` | None |
| **C** | `feature/person-c` | `components/auth/*`, `contexts/AuthContext.jsx`, `pages/Login+Register`, `components/map/*` | None |

---

## 🔄 Daily Routine

### Morning (9:00 AM)
```bash
# 1. Sync with working
git checkout working
git pull origin working

# 2. Merge into YOUR branch
git checkout feature/YOUR-NAME
git merge working

# 3. Push YOUR branch
git push origin feature/YOUR-NAME

# 4. Daily standup (15 min)
# 5. Update WORK_MODULES.md
# 6. Start coding on YOUR branch
```

### During Work
```bash
# Verify YOUR branch
git branch    # Must show: * feature/YOUR-NAME

# Every 2-3 hours
git add .
git commit -m "Module X: What you did"
git push origin feature/YOUR-NAME    # ← YOUR branch!
```

### Evening (6:00 PM)
```bash
# 1. Final push to YOUR branch
git add .
git commit -m "Module X: Complete Day Y"
git push origin feature/YOUR-NAME

# 2. If feature complete: Create PR on GitHub
# Base: working ← Compare: feature/YOUR-NAME
# Request review from teammates

# 3. Update team in chat
# 4. Update WORK_MODULES.md
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
# Start day - Sync with working
git checkout working && git pull origin working
git checkout feature/YOUR-NAME && git merge working
git push origin feature/YOUR-NAME

# Save work to YOUR branch
git add .
git commit -m "Module X: Description"
git push origin feature/YOUR-NAME    # ← YOUR branch!

# If conflict during merge
git merge working
# Fix conflicts in VS Code (remove <<<, ===, >>> markers)
git add .
git commit -m "Merge working, resolve conflicts"
git push origin feature/YOUR-NAME

# See your changes
git status
git log --oneline -5

# Undo last commit (not pushed)
git reset --soft HEAD~1

# Create PR (on GitHub)
# 1. Push to YOUR branch
# 2. GitHub → "Compare & pull request"
# 3. Base: working ← Compare: feature/YOUR-NAME
# 4. Fill title, description, request reviewers
# 5. Create pull request

# After PR merged
git checkout working && git pull origin working
git checkout feature/YOUR-NAME && git merge working
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
