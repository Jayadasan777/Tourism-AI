# ⚠️ IMPORTANT - START HERE

## 🚨 Branch Strategy: Personal Branches + Pull Requests

**You will work on YOUR OWN branch and create PRs to merge into `working`!**

**DO NOT work on `main` or directly on `working`!**

---

## 👥 Team Members - Branch Names

- **Person A:** `feature/person-a` (Itinerary features)
- **Person B:** `feature/person-b` (Safety features)
- **Person C:** `feature/person-c` (Auth features)

**Replace "person-a/b/c" with your actual name** (e.g., `feature/jay`, `feature/rahul`)

---

## 🌿 Cloning Instructions

### ✅ Correct Way (Clone + Create YOUR branch from working)

```bash
# Step 1: Clone repository
git clone https://github.com/Jayadasan777/Tourism-AI.git
cd Tourism-AI

# Step 2: Switch to working branch first
git checkout working

# Step 3: Pull latest working
git pull origin working

# Step 4: Create YOUR personal branch from working
git checkout -b feature/YOUR-NAME    # e.g., feature/jay

# Step 5: Verify you're on YOUR branch
git branch
# Should show: * feature/YOUR-NAME

# Step 6: Push your branch to GitHub
git push -u origin feature/YOUR-NAME

# Step 7: Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### ❌ Wrong Way (Working directly on main or working)

```bash
# DON'T DO THIS:
git clone https://github.com/Jayadasan777/Tourism-AI.git
cd Tourism-AI
# Start coding here ← WRONG! You're on main!

# ALSO DON'T DO THIS:
git checkout working
# Start coding here ← WRONG! Work on YOUR branch, not working directly!
```

---

## 🔴 Critical Rules

### ✅ ALWAYS:
1. **Work ONLY on YOUR personal branch** (`feature/YOUR-NAME`)
2. **Commit to YOUR branch**: `git commit -m "..."`
3. **Push to YOUR branch**: `git push origin feature/YOUR-NAME`
4. **Create Pull Request** from YOUR branch → `working` (NOT to `main`!)
5. **Pull latest working** before starting work: `git checkout working && git pull origin working`
6. **Sync YOUR branch** with working regularly: `git merge working`

### ❌ NEVER:
1. **Work on `main` branch**
2. **Work directly on `working` branch**
3. **Commit directly to `main` or `working`**
4. **Create PR to `main`** (always PR to `working`!)
5. Force push to any branch
6. Merge without code review

---

## 📋 Quick Verification

**Before you start coding, verify you're on YOUR branch:**

```bash
# Check current branch
git branch

# You should see:
  main
  working
* feature/YOUR-NAME    ← The * should be here!

# If you see * main or * working, switch to YOUR branch:
git checkout feature/YOUR-NAME
```

---

## 🔄 Daily Workflow

### Every Morning (Sync with working):
```bash
# 1. Switch to YOUR branch
git checkout feature/YOUR-NAME

# 2. Update working branch
git checkout working
git pull origin working

# 3. Switch back to YOUR branch and merge latest working
git checkout feature/YOUR-NAME
git merge working

# 4. If there are merge conflicts, resolve them
# 5. Push your branch
git push origin feature/YOUR-NAME
```

### While Working:
```bash
# Verify you're on YOUR branch
git branch    # Should show: * feature/YOUR-NAME

# Commit frequently to YOUR branch
git add .
git commit -m "Module X: What you did"
git push origin feature/YOUR-NAME    # ← Push to YOUR branch!
```

### End of Day:
```bash
# Push all your work to YOUR branch
git add .
git commit -m "Module X: Complete Day Y"
git push origin feature/YOUR-NAME

# Create Pull Request (if work is ready for review)
# Go to GitHub → Your branch → "Compare & pull request"
# Base: working ← Compare: feature/YOUR-NAME
# Add description, request review from team
```

---

## 🔀 Creating a Pull Request

**When your feature is ready:**

1. **Push your branch to GitHub:**
   ```bash
   git push origin feature/YOUR-NAME
   ```

2. **Go to GitHub repository**

3. **Click "Compare & pull request"** (or "Pull requests" → "New pull request")

4. **Set base and compare:**
   - **Base:** `working` ← (NOT main!)
   - **Compare:** `feature/YOUR-NAME`

5. **Add PR details:**
   - **Title:** `[Module X] Feature description`
   - **Description:** What you built, what was tested
   - **Request reviewers:** Tag team members

6. **Create pull request**

7. **Wait for review** - teammates will review and approve

8. **After approval:** Click "Merge pull request"

9. **After merge:** Update your branch
   ```bash
   git checkout working
   git pull origin working
   git checkout feature/YOUR-NAME
   git merge working
   ```

---

## 🆘 Emergency: "I Committed to Wrong Branch!"

### If you committed to `main`:

```bash
# 1. Check what you committed
git log -1

# 2. Switch to YOUR branch
git checkout feature/YOUR-NAME

# 3. Cherry-pick your commit from main
git cherry-pick main

# 4. Push to YOUR branch
git push origin feature/YOUR-NAME

# 5. Reset main (only if you haven't pushed!)
git checkout main
git reset --hard origin/main

# 6. Go back to YOUR branch
git checkout feature/YOUR-NAME
```

### If you committed to `working`:

```bash
# 1. Switch to YOUR branch
git checkout feature/YOUR-NAME

# 2. Cherry-pick from working
git cherry-pick working

# 3. Push to YOUR branch
git push origin feature/YOUR-NAME

# 4. Tell team in group chat!
```

**If you already pushed to main/working:** Tell team immediately!

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
