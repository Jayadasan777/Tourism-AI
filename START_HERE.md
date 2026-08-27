# ⚠️ IMPORTANT - START HERE

## 🚨 You MUST Work on the `working` Branch

**DO NOT work on `main` branch!**

---

## 🌿 Cloning Instructions

### ✅ Correct Way (Clone and switch to working)

```bash
# Step 1: Clone repository
git clone https://github.com/Jayadasan777/Tourism-AI.git
cd Tourism-AI

# Step 2: IMMEDIATELY switch to working branch
git checkout working

# Step 3: Verify you're on working
git branch
# Should show: * working

# Step 4: Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### ❌ Wrong Way (Working on main)

```bash
# DON'T DO THIS:
git clone https://github.com/Jayadasan777/Tourism-AI.git
cd Tourism-AI
# Start coding here ← WRONG! You're on main!
```

---

## 🔴 Critical Rules

### ✅ ALWAYS:
1. **Clone and immediately** `git checkout working`
2. **Work ONLY on** `working` branch
3. **Commit to** `working` branch
4. **Push to** `working` branch: `git push origin working`
5. **Pull from** `working` branch: `git pull origin working`

### ❌ NEVER:
1. **Work on `main` branch**
2. **Commit to `main` branch**
3. **Push to `main` branch**
4. Force push to any branch

---

## 📋 Quick Verification

**Before you start coding, verify you're on the right branch:**

```bash
# Check current branch
git branch

# You should see:
  main
* working    ← The * should be here!

# If you see * main, switch now:
git checkout working
```

---

## 🔄 Daily Workflow

### Every Morning:
```bash
# 1. Make sure you're on working
git checkout working

# 2. Pull latest changes
git pull origin working

# 3. Start coding
```

### While Working:
```bash
# Commit frequently
git add .
git commit -m "Module X: What you did"
git push origin working    # ← Push to WORKING, not main!
```

### Before Leaving:
```bash
# Final push
git add .
git commit -m "Module X: Complete Day Y"
git push origin working    # ← WORKING branch!
```

---

## 🆘 "Help! I Committed to Main by Mistake!"

**Don't panic. Fix it:**

```bash
# 1. Check what you committed
git log -1

# 2. Copy the commit message

# 3. Switch to working
git checkout working

# 4. Cherry-pick your commit
git cherry-pick main

# 5. Push to working
git push origin working

# 6. Reset main (only if you haven't pushed!)
git checkout main
git reset --hard origin/main

# 7. Go back to working
git checkout working
```

**If you already pushed to main:** Tell team immediately in group chat!

---

## 📚 What to Read (On Working Branch)

**Read these files in order:**

1. **START_HERE.md** ← You are here ✅
2. **QUICK_REFERENCE.md** (5 min) - Daily reference
3. **TEAM_WORKFLOW.md** (30 min) - Complete workflow
4. **WORKING_BRANCH_README.md** (10 min) - Branch guide

---

## 🎯 Why This Matters

**The `main` branch is:**
- Stable base
- Reference only
- Not for development

**The `working` branch is:**
- Where you code
- Where team collaborates
- Where all features are built

**Mixing them up will:**
- ❌ Create merge conflicts
- ❌ Break the stable base
- ❌ Confuse the team
- ❌ Cause lost work

---

## ✅ Pre-Start Checklist

Before you write any code:

- [ ] Cloned repository
- [ ] Switched to `working` branch
- [ ] Verified with `git branch` (see `* working`)
- [ ] Installed backend dependencies
- [ ] Installed frontend dependencies
- [ ] Created `.env` files
- [ ] Read QUICK_REFERENCE.md
- [ ] Read TEAM_WORKFLOW.md
- [ ] Know your role (Person A/B/C)

**All checked?** Start coding! 🚀

---

## 🔥 Remember

```
┌─────────────────────────────────────┐
│                                     │
│   ALWAYS WORK ON `working` BRANCH   │
│                                     │
│   git checkout working              │
│   git pull origin working           │
│   git push origin working           │
│                                     │
└─────────────────────────────────────┘
```

**Next:** Read `QUICK_REFERENCE.md` for daily commands!
