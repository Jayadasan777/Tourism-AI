# 🌿 Working Branch - Team Development

**Branch Name:** `working`
**Purpose:** Active development branch for 3-person team
**Base:** `main` (backend + frontend setup complete)

---

## 📋 What's in This Branch

### New Documentation Files

1. **TEAM_WORKFLOW.md** (7000+ words)
   - Complete 2-week timeline
   - Day-by-day tasks for each person
   - File ownership map
   - Integration points
   - Git strategy
   - Communication protocol
   - **Read this first!**

2. **QUICK_REFERENCE.md** (Reference Card)
   - Daily routine
   - Git commands
   - Common fixes
   - Checklists
   - **Keep this open while working!**

3. **This file** (WORKING_BRANCH_README.md)
   - Branch overview

---

## 🎯 Team Roles

### Person A - Itinerary Track
**Modules:** 3 (Itinerary UI), 6 (Hidden Destinations)
**Files:** `components/itinerary/*`, `pages/PlanTripPage.jsx`, `backend/data/hidden-destinations.json`

### Person B - UI/UX Track  
**Modules:** 4 (Safety UI), 5 (Landing), 8 (Polish)
**Files:** `components/safety/*`, `components/common/*`, `pages/LandingPage.jsx`, `Navbar.jsx`, `Footer.jsx`

### Person C - Infrastructure Track
**Modules:** 2 (Auth), 7 (Map), 9 (Deployment)
**Files:** `components/auth/*`, `contexts/AuthContext.jsx`, `pages/Login+Register`, `components/map/*`

---

## 🚀 Getting Started

### First Time Setup

```bash
# Clone repo (if not done)
git clone https://github.com/Jayadasan777/Tourism-AI.git
cd Tourism-AI

# Switch to working branch
git checkout working

# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install

# Copy environment files
cd backend
cp .env.example .env
# Edit .env and add your API keys

cd ../frontend
cp .env.example .env
# Edit .env and add your Firebase config
```

### Daily Workflow

```bash
# Morning - Pull latest
git checkout working
git pull origin working

# During work - Commit frequently
git add .
git commit -m "Module X: What you did"
git push origin working

# Evening - Final push
git add .
git commit -m "Module X: Complete Day Y"
git push origin working
```

---

## 📅 Timeline

### Week 1 (Days 1-7): Core Features
- **Day 1:** Start itinerary form, weather widget, auth context
- **Day 2:** Form validation, forecast, login page
- **Day 3:** Itinerary display, hazard alerts, register page
- **Day 4:** Loading states, emergency contacts, protected routes
- **Day 5:** API integration, landing page hero, user profile
- **Day 6:** Save functionality, navigation, map init
- **Day 7:** My itineraries, footer, map markers

**Goal:** Auth + Itinerary + Safety + Landing all working

### Week 2 (Days 8-14): Polish & Deploy
- **Day 8:** Hidden destinations data, reusable components, map plotting
- **Day 9:** Destinations API, UI components, map popups
- **Day 10:** Frontend integration, mobile testing, route drawing
- **Day 11:** Testing, mobile fixes, backend deployment
- **Day 12:** Test data, screenshots, frontend deployment
- **Day 13-14:** Demo prep, practice, final testing

**Goal:** Deployed and demo-ready

---

## 🔄 Git Strategy

### Branch Rules

- ✅ **DO** work on `working` branch
- ✅ **DO** pull before pushing
- ✅ **DO** commit frequently (every 2-3 hours)
- ❌ **DON'T** work on `main` branch
- ❌ **DON'T** force push
- ❌ **DON'T** edit others' files without asking

### Avoiding Conflicts

**File ownership prevents most conflicts:**
- Person A owns `components/itinerary/*`
- Person B owns `components/safety/*`, `components/common/*`
- Person C owns `components/auth/*`, `components/map/*`

**Shared files (need coordination):**
- `App.jsx` - Person C manages routes
- `index.css` - Person B manages global styles

### If You Get a Conflict

```bash
git pull origin working
# Conflict appears

# Option 1: Keep your version
git checkout --ours path/to/file

# Option 2: Keep their version  
git checkout --theirs path/to/file

# Option 3: Merge manually
# Open file, look for <<<<<<< markers
# Keep both changes, remove markers

git add .
git commit -m "Merge: Resolve conflict"
git push origin working
```

---

## 📞 Communication

### Daily Standup (9:00 AM - 15 minutes)

**Format:**
```
Person A:
✅ Yesterday: [What you completed]
🎯 Today: [What you'll work on]
🚫 Blockers: [Any issues]

Person B: [Same format]
Person C: [Same format]

Quick sync: [Resolve blockers]
```

### Group Chat

**Use for:**
- Daily updates (end of day)
- Questions/help needed
- Integration coordination
- Merge warnings
- Celebration! 🎉

**Don't use for:**
- Code reviews (use git commits)
- Long discussions (call instead)
- Debugging (screen share)

---

## ✅ Definition of Done

**For each task:**
- [ ] Code written and tested
- [ ] Works on desktop (1920px)
- [ ] Works on mobile (375px)
- [ ] No console errors
- [ ] Committed with clear message
- [ ] Pushed to `working` branch
- [ ] Team notified in chat
- [ ] WORK_MODULES.md updated

---

## 🧪 Testing Before Push

### Person A
```bash
# Test itinerary flow
1. Open http://localhost:5173/plan
2. Fill form with valid data
3. Submit and wait
4. Check itinerary displays
5. Check all costs show
```

### Person B
```bash
# Test safety widget
1. Open browser console
2. Load safety component
3. Check API call succeeds
4. Verify data displays
5. Test on mobile width (375px)
```

### Person C
```bash
# Test auth flow
1. Sign up new user
2. Check token in localStorage
3. Logout
4. Login again
5. Try accessing protected route
```

---

## 📊 Progress Tracking

### Check Progress Anytime

```bash
# See your commits
git log --oneline --author="Your Name" -10

# See team's commits today
git log --oneline --since="today" -20

# See what changed
git diff main..working
```

### Update WORK_MODULES.md

**Daily after standup:**
1. Open WORK_MODULES.md
2. Find your module section
3. Check off completed tasks: `- [ ]` → `- [x]`
4. Update progress %
5. Commit: `git commit -m "Update progress: Module 3 at 60%"`

---

## 🚨 Emergency Procedures

### "I can't push!"

```bash
# Pull first
git pull origin working

# If conflict, resolve and try again
git push origin working
```

### "I pushed broken code!"

```bash
# Quick fix and push again
git add .
git commit -m "Fix: Broken thing"
git push origin working

# Tell team in chat immediately
```

### "Everything is broken!"

1. **Don't panic**
2. Check error messages
3. Ask in group chat
4. If urgent, call team meeting
5. Worst case: `git reset --hard origin/working`

### "Merge conflict hell!"

1. **Stop pushing**
2. Save your changes: `git stash`
3. Pull fresh: `git pull origin working`
4. Apply changes: `git stash pop`
5. If still conflicted, call team

---

## 🎯 Weekly Goals

### End of Week 1 (Day 7)
- [ ] User can sign up and log in
- [ ] User can generate AI itinerary
- [ ] Safety info displays for any destination
- [ ] Landing page looks professional
- [ ] Basic map shows (can be incomplete)

### End of Week 2 (Day 14)
- [ ] Hidden destinations show
- [ ] Map fully interactive
- [ ] UI polished and responsive
- [ ] Deployed to production
- [ ] Demo script ready
- [ ] Practice completed

---

## 📚 Documentation Reference

**Read in this order:**

1. **QUICK_REFERENCE.md** (5 min)
   - Daily routine
   - Git commands
   - Common fixes

2. **TEAM_WORKFLOW.md** (30 min)
   - Complete timeline
   - Detailed tasks
   - Integration points

3. **WORK_MODULES.md** (As needed)
   - Your specific module details
   - Task checklists

4. **CLAUDE.md** (As needed)
   - Architecture patterns
   - Backend integration

5. **frontend/README.md** (As needed)
   - Setup instructions
   - API usage examples

---

## 🔥 Important Reminders

### Before You Start
- [ ] Pull latest code
- [ ] Backend running (port 5000)
- [ ] Frontend running (port 5173)
- [ ] Know today's tasks

### While Working
- [ ] Only edit your own files
- [ ] Test before committing
- [ ] Commit every 2-3 hours
- [ ] Push at least daily

### Before You Leave
- [ ] All code committed
- [ ] Pushed to working branch
- [ ] Team updated in chat
- [ ] WORK_MODULES.md updated

---

## 💪 Team Values

1. **Communicate early and often**
2. **Help each other succeed**
3. **Test your code**
4. **Ask for help if stuck > 30 min**
5. **Celebrate small wins**
6. **Trust the process**
7. **We're in this together!**

---

## 🎉 Success Metrics

**You're doing great if:**
- ✅ Completing 1-2 tasks per day
- ✅ Code working locally
- ✅ No blockers > 1 day
- ✅ Team knows your status
- ✅ Having fun!

**You're crushing it if:**
- 🔥 Completing 3+ tasks per day
- 🔥 Helping teammates
- 🔥 Finding and fixing bugs
- 🔥 Ahead of schedule
- 🔥 Learning new skills!

---

## 📞 Questions?

**Quick questions:** Group chat
**Need help:** Post in chat + call if needed
**Architecture questions:** Check CLAUDE.md
**Git issues:** Check QUICK_REFERENCE.md
**Everything on fire:** Team call NOW!

---

**🚀 Let's build something amazing together! 🚀**

**Next Steps:**
1. Read QUICK_REFERENCE.md (5 min)
2. Read TEAM_WORKFLOW.md (30 min)
3. Set up environment (20 min)
4. First team meeting (30 min)
5. Start coding! 💻

**Good luck, Team Black Forge! 🔥**
