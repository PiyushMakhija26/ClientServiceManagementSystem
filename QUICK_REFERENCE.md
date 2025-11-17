# 🚀 Quick Start - Rating & Reopen Feature

## ⚡ 30-Second Overview

Users can now:
- ⭐ **Rate** completed work (Excellent/Good/Poor)
- 💬 **Comment** on quality with optional feedback
- 🔄 **Reopen** requests if unsatisfied
- 📊 Admins **see** the rating and reason for reopening

---

## 🎯 Where to Find It

### In the Frontend
Go to: **"Review Your Requests"** section
- Completed requests show: "⭐ Rate Work" button (GREEN)
- After rating as Poor: "🔄 Reopen Request" button (ORANGE)

### In the Backend
New endpoints:
- `PUT /api/requests/:id/rate` - Submit a rating
- `PUT /api/requests/:id/reopen` - Reopen a request

---

## 💻 Running It Locally

### Option 1: Individual Services
```bash
# Terminal 1 - Backend
cd backend && npm start
# Runs on http://localhost:5000

# Terminal 2 - Frontend  
cd frontend && npm start
# Runs on http://localhost:3000
```

### Option 2: One Command (Windows)
```powershell
.\scripts\start-all.ps1
```

### Option 3: One Command (Mac/Linux)
```bash
./scripts/start-all.sh
```

---

## 🧪 Testing the Feature

### Step 1: Register & Login
1. Open http://localhost:3000
2. Register as a user
3. Register as an admin (different email)

### Step 2: Create a Request
1. Login as user
2. Go to "Raise Request"
3. Fill in details and submit

### Step 3: Complete the Request
1. Login as admin
2. Go to "Allocate Work"
3. Assign the request to yourself
4. Go to "Update Status" → mark as Completed

### Step 4: Rate the Work
1. Login as user again
2. Go to "Review Your Requests"
3. Find the completed request
4. Click "⭐ Rate Work"
5. Select: Excellent, Good, or Poor
6. (Optional) Add feedback
7. Click Submit

### Step 5: Reopen if Needed
1. If you rated as "Poor"
2. You'll see "🔄 Reopen Request" button
3. Explain why (required)
4. Click "Reopen Request"
5. Admin will see it reopened in their list

---

## 📡 API Quick Reference

### Rate a Request
```bash
curl -X PUT http://localhost:5000/api/requests/REQUEST_ID/rate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "score": "excellent",
    "feedback": "Great work!"
  }'
```

**Scores:** `excellent`, `good`, `poor`

### Reopen a Request
```bash
curl -X PUT http://localhost:5000/api/requests/REQUEST_ID/reopen \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reopenReason": "Work is not complete"
  }'
```

---

## 🎨 UI Overview

### Rating Button (GREEN)
- Appears on: Completed/Closed requests without rating
- Click to: Opens rating modal

### Reopen Button (ORANGE)  
- Appears on: Completed/Closed requests
- Click to: Opens reopen modal

### Rating Display
- Shows: "Your Rating: EXCELLENT ⭐"
- Shows: Your feedback text
- Blue box with border

---

## ✅ Validation Rules

**Rating:**
- ✅ User must own the request
- ✅ Request must be completed or closed
- ✅ Must pick excellent/good/poor
- ✅ Can rate only once (overwrites if rated again)

**Reopening:**
- ✅ User must own the request
- ✅ Request must be completed or closed
- ✅ Reason is required (not empty)
- ✅ Moves status back to "in-progress"

---

## 📊 What Gets Stored

When user rates:
```json
{
  "rating": {
    "score": "excellent",
    "feedback": "Great work!",
    "ratedAt": "2025-11-17T10:30:00Z",
    "ratedBy": "user_id"
  }
}
```

When user reopens:
```json
{
  "status": "in-progress",
  "reopenReason": "Still not working",
  "reopenedAt": "2025-11-17T11:00:00Z"
}
```

---

## 🛠️ Troubleshooting

**Issue:** Can't see "Rate Work" button
- Solution: Make sure request status is "completed" or "closed"
- Solution: Refresh the page

**Issue:** Rating doesn't save
- Solution: Check if you're logged in (look for token)
- Solution: Make sure backend is running on port 5000
- Solution: Check browser console for errors

**Issue:** Can't reopen request
- Solution: Must rate as "Poor" first (or close to it)
- Solution: Make sure you provide a reason
- Solution: Request must be already completed

**Issue:** Proxy error in frontend
- Solution: Start backend first
- Solution: Make sure backend is running on port 5000
- Solution: Restart frontend: `npm start`

---

## 📁 File Changes

### Modified Files:
- `backend/models/Request.js` - Added rating fields
- `backend/routes/requestRoutes.js` - Added rating endpoints
- `frontend/src/components/ReviewRequest.js` - Added rating UI

### New Documentation:
- `RATING_SYSTEM.md` - Overview
- `API_RATING_ENDPOINTS.md` - Full API docs
- `RATING_IMPLEMENTATION_COMPLETE.md` - Technical details
- `FEATURE_COMPLETE.md` - Summary

---

## 🚀 Ready to Deploy?

### Production Build
```bash
# Backend
npm run build

# Frontend
npm run build
```

### Docker
```bash
docker compose up --build
```

### GitHub
```bash
git add .
git commit -m "feat: Add rating and reopen system"
git push origin main
```

---

## 📞 Need Help?

Check the detailed documentation:
- 📄 `API_RATING_ENDPOINTS.md` - Full API reference
- 📄 `RATING_SYSTEM.md` - Feature details
- 📄 Code comments in JavaScript files

---

## ✨ Feature Highlights

🌟 **Why This Matters:**
- Users can provide feedback on work quality
- Poor ratings can trigger request reopening
- Admins get visibility into satisfaction
- Quality metrics become trackable
- Creates accountability system
- Drives continuous improvement

---

**Status:** ✅ Complete & Ready  
**Backend:** Running on http://localhost:5000  
**Frontend:** Running on http://localhost:3000  
**Documentation:** Complete
