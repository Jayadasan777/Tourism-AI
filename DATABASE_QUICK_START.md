# ⚡ QUICK START - Tamil Nadu Database

## 🚀 Get Started in 5 Minutes

---

## STEP 1: Initialize Database

```bash
cd E:/tourism/backend
npm run db:init
```

**Expected:** ✅ 7 collections created

---

## STEP 2: Add Foursquare API Key

```bash
# Edit .env
notepad .env

# Add this line:
FOURSQUARE_API_KEY=fsq3...YOUR_KEY
```

**Get key:** https://foursquare.com/developers/signup (FREE)

---

## STEP 3: Collect Chennai Data (Test)

```bash
npm run db:collect chennai
```

**Expected:** 200-300 Chennai places in 2-3 minutes

---

## STEP 4: Verify in Firebase

1. Go to: https://console.firebase.google.com
2. Your project → Firestore
3. Check collections: `places`, `restaurants`, `hotels`
4. Should see Chennai data!

---

## ✅ SUCCESS!

You now have:
- ✅ Database initialized
- ✅ Chennai data collected (200-300 places)
- ✅ Ready for more districts

---

## Next Steps:

### **Collect More Districts:**

```bash
# Individual districts
npm run db:collect coimbatore
npm run db:collect madurai
npm run db:collect tiruchirappalli

# OR collect all 38 at once (30 minutes)
npm run db:collect-all
```

### **Check Database Stats:**

```bash
npm run db:stats
```

---

## 📊 What You'll Have:

| Action | Result | Time |
|--------|--------|------|
| `db:collect chennai` | 200-300 places | 2 min |
| `db:collect coimbatore` | 150-250 places | 2 min |
| `db:collect madurai` | 120-200 places | 2 min |
| `db:collect-all` | 3,000-4,000 places | 30 min |

---

## 🎯 For SIH 2026 Demo:

### **Minimum (NOW):**
```bash
npm run db:collect chennai
npm run db:collect coimbatore
npm run db:collect madurai
```

**Result:** 500-750 places in 3 major cities
**Time:** 6 minutes
**Good for:** Basic demo

### **Recommended (TODAY):**
```bash
npm run db:collect-all
```

**Result:** 3,000-4,000 places in all 38 districts
**Time:** 30 minutes
**Good for:** Complete demo + judges

---

## 💡 Pro Tips:

1. **Start Small:** Test with Chennai first
2. **Check Firebase:** Verify data shows up
3. **Then Scale:** Run `db:collect-all` for all districts
4. **Monitor:** Watch console for errors

---

## 🆘 Issues?

**No data collected?**
- Check FOURSQUARE_API_KEY in .env
- Verify API key at https://foursquare.com/developers

**Firebase error?**
- Check serviceAccountKey.json exists
- Verify Firebase project is active

**Want help?**
- See full guide: `DATABASE_SETUP_GUIDE.md`

---

**Ready? Run the commands above!** 🚀
