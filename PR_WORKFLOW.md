# 🔀 Pull Request Workflow Guide

## Overview

**You work on YOUR branch. When ready, create a Pull Request to merge into `working`.**

This prevents merge conflicts and enables code review!

---

## 🌿 Branch Structure

```
main
  └── Stable reference, never touch
  
working  
  └── Integration branch, only receives PRs
  
feature/person-a ← Person A works here
feature/person-b ← Person B works here  
feature/person-c ← Person C works here
```

**Rule:** All work happens on `feature/*` branches, merged via PR into `working`.

---

## 🚀 First Time Setup

### Step 1: Clone and Create YOUR Branch

```bash
# Clone repository
git clone https://github.com/Jayadasan777/Tourism-AI.git
cd Tourism-AI

# Switch to working branch
git checkout working
git pull origin working

# Create YOUR personal branch from working
git checkout -b feature/YOUR-NAME    # e.g., feature/jay

# Push YOUR branch to GitHub
git push -u origin feature/YOUR-NAME

# Verify
git branch
# Should show: * feature/YOUR-NAME
```

### Step 2: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 3: Start Working!

You're now on YOUR branch. All commits go here!

---

## 📅 Daily Workflow

### Every Morning (Sync with working)

```bash
# 1. Switch to YOUR branch
git checkout feature/YOUR-NAME

# 2. Pull latest from working
git checkout working
git pull origin working

# 3. Merge working into YOUR branch
git checkout feature/YOUR-NAME
git merge working

# 4. If conflicts, resolve them:
# - Open conflicted files
# - Fix conflicts (choose which code to keep)
# - git add <resolved-files>
# - git commit -m "Merge working into feature/YOUR-NAME"

# 5. Push to YOUR branch
git push origin feature/YOUR-NAME
```

### While Working

```bash
# Always verify you're on YOUR branch
git branch    # Should show: * feature/YOUR-NAME

# Make changes, test locally
# ...

# Commit frequently
git add .
git commit -m "Module X: Add feature Y"

# Push to YOUR branch
git push origin feature/YOUR-NAME
```

### Multiple Commits Per Day (Good Practice!)

```bash
# Small feature 1
git add frontend/src/components/itinerary/ItineraryForm.jsx
git commit -m "Add form validation for budget field"
git push origin feature/YOUR-NAME

# Small feature 2
git add frontend/src/components/itinerary/ItineraryDisplay.jsx
git commit -m "Add loading spinner to itinerary display"
git push origin feature/YOUR-NAME

# Bug fix
git add frontend/src/services/itineraryService.js
git commit -m "Fix: Handle empty response from API"
git push origin feature/YOUR-NAME
```

---

## 🔀 Creating a Pull Request

### When to Create a PR:
- ✅ Feature is complete and tested
- ✅ Code is committed and pushed to YOUR branch
- ✅ No console errors
- ✅ Follows file ownership (you only edited your files)
- ✅ Synced with latest `working` (no conflicts)

### Step-by-Step:

#### 1. Final Push
```bash
# Make sure all work is committed
git status    # Should be clean

# Push to YOUR branch
git push origin feature/YOUR-NAME
```

#### 2. Go to GitHub
- Navigate to: https://github.com/Jayadasan777/Tourism-AI
- You'll see a yellow banner: **"feature/YOUR-NAME had recent pushes"**
- Click **"Compare & pull request"**

OR manually:
- Click **"Pull requests"** tab
- Click **"New pull request"**

#### 3. Set Base and Compare
- **base:** `working` ← (Target branch, NOT main!)
- **compare:** `feature/YOUR-NAME` ← (Your branch)

Verify it shows: `working ← feature/YOUR-NAME`

#### 4. Fill PR Details

**Title:** Use this format:
```
[Module X] Short description
```

Examples:
```
[Module 3] Add itinerary form with validation
[Module 2] Implement Firebase authentication
[Module 4] Add weather widget and safety alerts
```

**Description:** Use this template:
```markdown
## What was built
- Feature 1
- Feature 2
- Bug fix X

## Module
Module X: [Module Name]

## Files changed
- `frontend/src/components/...`
- `frontend/src/pages/...`

## Testing done
- [ ] Tested in browser (Chrome)
- [ ] No console errors
- [ ] Backend API calls working
- [ ] Mobile responsive (if UI)
- [ ] Edge cases handled

## Screenshots (if UI changes)
[Attach screenshots]

## Notes
Any caveats, TODOs, or things reviewers should know.
```

#### 5. Request Reviewers
- Click **"Reviewers"** on the right
- Select your teammates (Person A, B, C)
- They'll get notified

#### 6. Create Pull Request
- Click **"Create pull request"**
- ✅ PR is now open!

---

## 👀 Code Review Process

### As a Reviewer:

#### When you receive a PR notification:

1. **Go to the PR page**

2. **Click "Files changed" tab**

3. **Review the code:**
   - Does it follow file ownership? (Person shouldn't edit others' files)
   - Is the code clean and readable?
   - Any console.logs left behind?
   - Any hardcoded values that should be in .env?
   - Does it match the module requirements?

4. **Add comments:**
   - Click on a line number to add inline comment
   - Ask questions, suggest improvements
   - Use **"Start a review"** (not "Add single comment")

5. **Submit your review:**
   - **Approve:** Click "Review changes" → "Approve" → "Submit review"
   - **Request changes:** Click "Review changes" → "Request changes" → Explain what needs fixing

#### Approval Rules:
- ✅ **At least 1 approval required** before merge
- ✅ Best: Get 2 approvals (both teammates)
- ❌ **Don't approve if there are issues** - request changes instead

### As the PR Author (After Review):

#### If changes requested:

```bash
# Make the requested changes on YOUR branch
git checkout feature/YOUR-NAME

# Edit files
# ...

# Commit and push
git add .
git commit -m "Fix: Address review comments - Add error handling"
git push origin feature/YOUR-NAME

# PR automatically updates! Notify reviewers.
```

#### If approved:

**Wait for 2nd approval** (if possible), then:

1. Go to PR page
2. Click **"Merge pull request"** (green button)
3. **Confirm merge**
4. **Delete YOUR branch on GitHub** (optional, GitHub suggests this)

**DON'T delete your local branch yet!** You'll reuse it.

---

## ✅ After Your PR is Merged

### Update Your Local Branches

```bash
# 1. Switch to working
git checkout working

# 2. Pull the merged changes
git pull origin working

# 3. Switch back to YOUR branch
git checkout feature/YOUR-NAME

# 4. Merge latest working into YOUR branch
git merge working

# 5. Push to YOUR branch
git push origin feature/YOUR-NAME

# You're synced! Continue working on YOUR branch.
```

### If You Deleted YOUR Branch on GitHub:

You can recreate it or keep using local:

```bash
# Push it again
git push -u origin feature/YOUR-NAME
```

---

## 🚨 Handling Merge Conflicts

### When do conflicts happen?
- Two people edited the same file
- Two people edited the same line
- You didn't sync with `working` regularly

### How to resolve:

#### During `git merge working`:

```bash
git merge working

# If conflict:
# Auto-merging frontend/src/App.jsx
# CONFLICT (content): Merge conflict in frontend/src/App.jsx
# Automatic merge failed; fix conflicts and then commit the result.

# 1. Check conflicted files
git status
# Unmerged paths:
#   both modified:   frontend/src/App.jsx

# 2. Open the conflicted file
# You'll see:
# <<<<<<< HEAD
# Your changes
# =======
# Working branch changes
# >>>>>>> working

# 3. Edit the file:
# - Remove the markers (<<<, ===, >>>)
# - Keep the correct code (or combine both)
# - Save the file

# 4. Mark as resolved
git add frontend/src/App.jsx

# 5. Commit the merge
git commit -m "Merge working into feature/YOUR-NAME, resolve conflicts"

# 6. Push
git push origin feature/YOUR-NAME
```

#### During PR (GitHub shows conflict):

If GitHub says **"This branch has conflicts that must be resolved"**:

```bash
# 1. Sync with working locally
git checkout working
git pull origin working

git checkout feature/YOUR-NAME
git merge working

# 2. Resolve conflicts (see above)

# 3. Push
git push origin feature/YOUR-NAME

# PR will update and conflicts will be gone!
```

---

## 📊 PR Best Practices

### ✅ DO:
- **Create PRs early and often** (1 PR per feature/module)
- **Keep PRs small** (easier to review)
- **Write clear PR titles and descriptions**
- **Test before creating PR**
- **Sync with working daily** (prevents conflicts)
- **Respond to review comments quickly**
- **Request review from both teammates**

### ❌ DON'T:
- **Create massive PRs** (1000+ lines = hard to review)
- **Push untested code**
- **Edit files owned by others** (causes conflicts)
- **Ignore review comments**
- **Merge your own PR without approval**
- **Force push** (`git push -f`) to your branch

---

## 🔄 Example: Full Cycle

### Day 1 - Start Module 3

```bash
# Morning: Sync
git checkout working && git pull origin working
git checkout feature/jay && git merge working

# Work on itinerary form
# Edit: frontend/src/components/itinerary/ItineraryForm.jsx

git add frontend/src/components/itinerary/ItineraryForm.jsx
git commit -m "Module 3: Add itinerary form skeleton"
git push origin feature/jay
```

### Day 2 - Continue Module 3

```bash
# Morning: Sync
git checkout working && git pull origin working
git checkout feature/jay && git merge working

# Add form validation
git commit -m "Module 3: Add form validation with Joi"
git push origin feature/jay
```

### Day 3 - Complete Module 3

```bash
# Finish form
git commit -m "Module 3: Connect form to API"
git push origin feature/jay

# Create PR
# Go to GitHub → "Compare & pull request"
# Base: working ← Compare: feature/jay
# Title: [Module 3] Add itinerary generation form
# Description: (use template above)
# Request reviewers: Person B, Person C
# Create pull request
```

### Day 4 - Review and Merge

```bash
# Person B and Person C review
# Person B: "Approved"
# Person C: "Request changes - Add error handling"

# Fix issues
git checkout feature/jay
# Edit files...
git commit -m "Fix: Add error handling for API failures"
git push origin feature/jay

# Person C: "Approved"

# Merge PR on GitHub

# Sync local
git checkout working && git pull origin working
git checkout feature/jay && git merge working

# Start Module 6 on same branch!
```

---

## 🎯 Quick Reference

### Daily Commands

```bash
# Start of day
git checkout working && git pull origin working
git checkout feature/YOUR-NAME && git merge working

# While working
git add .
git commit -m "Module X: What you did"
git push origin feature/YOUR-NAME

# End of day
git push origin feature/YOUR-NAME
# Create PR if feature is complete
```

### PR Commands (on GitHub)

```
1. Push to YOUR branch
2. GitHub → "Compare & pull request"
3. Base: working ← Compare: feature/YOUR-NAME
4. Fill title and description
5. Request reviewers
6. Create pull request
7. Wait for approval
8. Merge pull request
9. Sync local: git pull origin working
```

---

## 🆘 Troubleshooting

### "I'm on the wrong branch!"

```bash
# Check current branch
git branch

# If on main or working:
git checkout feature/YOUR-NAME
```

### "I committed to working by mistake!"

```bash
# Don't push yet!

# Copy your changes to YOUR branch
git checkout feature/YOUR-NAME
git cherry-pick working

# Push to YOUR branch
git push origin feature/YOUR-NAME

# Reset working
git checkout working
git reset --hard origin/working

# Tell team in chat!
```

### "I can't push to working!"

**Good!** That's intentional. You should never push directly to `working`.

**Instead:** Create a Pull Request from YOUR branch.

### "My PR has conflicts!"

```bash
# Sync with working
git checkout working && git pull origin working
git checkout feature/YOUR-NAME && git merge working

# Resolve conflicts
# Edit conflicted files, remove <<<, ===, >>> markers

git add <resolved-files>
git commit -m "Merge working, resolve conflicts"
git push origin feature/YOUR-NAME

# PR will update automatically
```

### "Person B edited my file!"

**Talk to them!** This breaks file ownership.

**Solutions:**
1. **Coordinate in chat** - "I'm editing App.jsx now"
2. **One person edits, creates PR, other person syncs** - Sequential
3. **Split the file** - Separate components

---

## ✅ Checklist Before Creating PR

- [ ] All changes committed: `git status` is clean
- [ ] Pushed to YOUR branch: `git push origin feature/YOUR-NAME`
- [ ] Synced with working: `git merge working` (no conflicts)
- [ ] Tested locally: Backend running, frontend working
- [ ] No console errors
- [ ] Followed file ownership (only edited your files)
- [ ] Code is clean (no console.logs, TODOs removed)
- [ ] Environment variables in .env (not hardcoded)

**If all checked: Create PR! 🎉**

---

## 🎓 Summary

**Your workflow:**
1. Work on `feature/YOUR-NAME` branch
2. Commit and push to YOUR branch daily
3. Sync with `working` every morning
4. When feature complete: Create PR to `working`
5. Request review from teammates
6. Address review comments
7. After approval: Merge PR
8. Sync your branch with merged `working`
9. Continue on YOUR branch for next feature

**Never:**
- Commit directly to `main` or `working`
- Create PR to `main`
- Merge without review
- Edit files owned by others

**Result:**
- ✅ No merge conflicts (file ownership)
- ✅ Code review catches bugs
- ✅ Clean git history
- ✅ Everyone works in parallel
- ✅ Easy to revert if needed

---

**Questions?** Ask in team chat!

**Repository:** https://github.com/Jayadasan777/Tourism-AI
