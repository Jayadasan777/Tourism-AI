# 🌿 Branch Guide - Smart Tour AI

**Repository:** https://github.com/Jayadasan777/Tourism-AI

---

## 📊 Branch Structure

### `main` Branch (Stable)
**Status:** ✅ Production-ready base
**Contains:**
- ✅ Complete backend (1,545+ lines, 12 API endpoints)
- ✅ Frontend setup (React + Vite + Tailwind CSS)
- ✅ Complete documentation
- ✅ Work module breakdown

**Use for:**
- Starting new work
- Reference implementation
- Deployment base

**Don't use for:**
- Active development (use `working` branch)

---

### `working` Branch (Active Development)
**Status:** 🔄 Active team development
**Based on:** `main` (all setup complete)
**Contains:** Everything from `main` PLUS:
- 📄 **TEAM_WORKFLOW.md** - Complete 2-week workflow
- 📋 **QUICK_REFERENCE.md** - Daily reference card
- 📖 **WORKING_BRANCH_README.md** - Branch guide

**Use for:**
- All team development
- Daily commits
- Feature integration

**Team members work here!**

---

## 🚀 Getting Started

### For Team Members (First Time)

```bash
# Clone repository
git clone https://github.com/Jayadasan777/Tourism-AI.git
cd Tourism-AI

# Switch to working branch
git checkout working

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Setup environment
cd backend && cp .env.example .env
# Add your API keys to backend/.env

cd ../frontend && cp .env.example .env
# Add your Firebase config to frontend/.env

# Start development
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Open browser
http://localhost:5173
```

### Daily Workflow

```bash
# Morning - Pull latest
git checkout working
git pull origin working

# Work - Commit frequently
git add .
git commit -m "Module X: Description"
git push origin working

# Evening - Push final work
git add .
git commit -m "Module X: Complete Day Y"
git push origin working
```

---

## 📚 What to Read

### On `working` Branch:

**1. QUICK_REFERENCE.md** (5 minutes)
- Print this or keep it open!
- Daily routine
- Git commands
- Common fixes

**2. TEAM_WORKFLOW.md** (30 minutes)
- Read before starting work
- Day-by-day tasks
- File ownership
- Integration points

**3. WORKING_BRANCH_README.md** (10 minutes)
- Branch overview
- Getting started
- Weekly goals

### On `main` Branch:

**4. WORK_MODULES.md**
- Detailed task breakdown
- Module specifications
- Track your progress

**5. CLAUDE.md**
- Architecture patterns
- Backend integration
- Design principles

**6. frontend/README.md**
- Frontend setup
- API usage examples
- Troubleshooting

---

## 👥 Team Roles (on `working` branch)

### Person A - Itinerary Track
**Modules:** 3, 6
**Files:** `components/itinerary/*`, `pages/PlanTripPage.jsx`, `backend/data/hidden-destinations.json`
**Focus:** Core AI feature + hidden destinations

### Person B - UI/UX Track
**Modules:** 4, 5, 8
**Files:** `components/safety/*`, `components/common/*`, `pages/LandingPage.jsx`
**Focus:** Safety alerts + landing page + design system

### Person C - Infrastructure Track
**Modules:** 2, 7, 9
**Files:** `components/auth/*`, `contexts/AuthContext.jsx`, `components/map/*`
**Focus:** Authentication + map + deployment

---

## 🔄 Branch Workflow

### Development Flow

```
main (stable)
  ↓
working (team development)
  ↓
(All 3 people commit here)
  ↓
(After 2 weeks)
  ↓
Merge back to main
```

### When to Merge `working` → `main`

**After these milestones:**
- ✅ All core features working
- ✅ Tested on production
- ✅ Demo ready
- ✅ All 3 people agree

**How to merge:**
```bash
# Person C (Infrastructure lead) does final merge
git checkout main
git merge working
git push origin main
```

---

## 🎯 Weekly Goals

### Week 1 - Core Features
**Goal:** Auth + Itinerary + Safety + Landing working

**On `working` branch:**
- Day 1-3: Build core components
- Day 4-5: API integration
- Day 6-7: Feature completion

**Check progress:**
```bash
git checkout working
git log --oneline --since="7 days ago"
```

### Week 2 - Polish & Deploy
**Goal:** Deployed and demo-ready

**On `working` branch:**
- Day 8-10: Phase 2 features
- Day 11-12: Deployment
- Day 13-14: Demo prep

---

## 📊 Compare Branches

### See what's different

```bash
# See commits on working not in main
git log main..working --oneline

# See files changed
git diff main..working --name-only

# See all changes
git diff main..working
```

### Current State

**`main` branch:**
- Backend: 100% complete ✅
- Frontend: Setup complete ✅
- Documentation: Complete ✅

**`working` branch:**
- Everything from main ✅
- Team workflow docs ✅
- Ready for development ✅

---

## 🚨 Important Rules

### On `working` Branch:

✅ **DO:**
- Commit frequently (every 2-3 hours)
- Pull before pushing
- Only edit your assigned files
- Test before committing
- Update WORK_MODULES.md daily
- Communicate in group chat

❌ **DON'T:**
- Edit files owned by others
- Force push (ever!)
- Commit broken code
- Skip daily standups
- Merge without pulling first

### On `main` Branch:

- Don't commit directly (use `working`)
- Used for reference only
- Merge from `working` only at milestones

---

## 🔥 Quick Commands

### Switch Branches

```bash
# Go to working (development)
git checkout working

# Go to main (reference)
git checkout main

# See which branch you're on
git branch
```

### Update Your Branch

```bash
# On working branch
git checkout working
git pull origin working

# If main was updated
git checkout working
git merge main
```

### See Branch Status

```bash
# See all branches
git branch -a

# See branch history
git log --graph --oneline --all -10

# Compare branches
git diff main..working --stat
```

---

## 📞 Need Help?

### "Which branch should I use?"

**For development:** `working`
**For reference:** `main`

### "I'm on the wrong branch!"

```bash
# Save your work
git stash

# Switch to correct branch
git checkout working

# Get your work back
git stash pop
```

### "I committed to main by mistake!"

```bash
# On main, save commit hash
git log -1
# Copy the commit hash

# Switch to working
git checkout working

# Apply the commit
git cherry-pick <commit-hash>

# Reset main
git checkout main
git reset --hard origin/main
```

---

## ✅ Pre-Start Checklist

Before you begin development:

### Environment
- [ ] Cloned repository
- [ ] Switched to `working` branch
- [ ] Installed backend dependencies
- [ ] Installed frontend dependencies
- [ ] Created backend `.env` with API keys
- [ ] Created frontend `.env` with Firebase config

### Reading
- [ ] Read QUICK_REFERENCE.md
- [ ] Read TEAM_WORKFLOW.md
- [ ] Read WORKING_BRANCH_README.md
- [ ] Know your role (A/B/C)
- [ ] Know your assigned modules

### Team
- [ ] Group chat created
- [ ] Daily standup time agreed (9 AM?)
- [ ] Roles assigned (Person A/B/C)
- [ ] First team meeting scheduled

### Testing
- [ ] Backend runs on port 5000
- [ ] Frontend runs on port 5173
- [ ] Can access http://localhost:5173
- [ ] No errors in console

**All checked?** You're ready to start! 🚀

---

## 🎯 Success Path

### Day 1 (Today)
1. ✅ Read this guide
2. ✅ Switch to `working` branch
3. ✅ Set up environment
4. ✅ Team meeting (30 min)
5. ✅ Start coding your first task!

### Day 7 (End of Week 1)
- ✅ Core features working
- ✅ Team synced up
- ✅ Ready for Week 2

### Day 14 (Demo Day)
- ✅ Everything deployed
- ✅ Demo practiced
- ✅ Ready to present

---

## 📊 Progress Tracking

### Check Overall Progress

```bash
# On working branch
git checkout working

# See what everyone did today
git log --oneline --since="today" --all

# See who worked on what
git shortlog --since="7 days ago" -s -n

# See current status
git status
```

### Update Team Progress

**After daily standup:**
1. Open WORK_MODULES.md
2. Update your module checkboxes
3. Commit: `git commit -m "Update progress: Module 3 at 60%"`

---

## 🌟 Tips for Success

### Git Tips
- Commit small and often
- Write clear commit messages
- Pull before you push
- Test before you commit

### Team Tips
- Communicate early and often
- Help each other
- Ask questions in chat
- Celebrate small wins

### Development Tips
- Only edit your files
- Test on mobile (375px)
- Check browser console
- Read error messages carefully

---

## 📚 Full Document List

### On `working` Branch:
- TEAM_WORKFLOW.md - Complete workflow (7000+ words)
- QUICK_REFERENCE.md - Quick reference card
- WORKING_BRANCH_README.md - Branch overview

### On `main` Branch:
- README.md - Project overview
- WORK_MODULES.md - Module breakdown
- CLAUDE.md - Architecture guide
- BACKEND_ARCHITECTURE.md - Backend design
- GET_STARTED.md - Setup guide
- PROJECT_STATUS.md - Progress tracker
- backend/README.md - API documentation
- frontend/README.md - Frontend setup

---

**🚀 Ready to build! Switch to `working` branch and start coding! 🚀**

```bash
git checkout working
# Read TEAM_WORKFLOW.md
# Start your first task!
```

**Good luck, Team Black Forge! 💪**
