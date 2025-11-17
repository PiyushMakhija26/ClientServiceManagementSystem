# Work Rating & Request Reopen System

## Overview
New features added to allow users to rate completed work and reopen requests if unsatisfied with the work quality.

## Backend Changes

### 1. Request Model (`backend/models/Request.js`)
Added new fields to track work quality ratings and reopen requests:

```javascript
rating: {
  score: {
    type: String,
    enum: ['excellent', 'good', 'poor', null],
    default: null,
  },
  feedback: String,
  ratedAt: Date,
  ratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
},
reopenReason: String,
reopenedAt: Date,
```

### 2. New API Endpoints (`backend/routes/requestRoutes.js`)

#### Rate Work
- **Endpoint:** `PUT /api/requests/:id/rate`
- **Auth:** User (requires authentication)
- **Request Body:**
  ```json
  {
    "score": "excellent|good|poor",
    "feedback": "Optional feedback about the work"
  }
  ```
- **Response:** Updated request object with rating
- **Restrictions:** 
  - User must own the request
  - Request must be in "completed" or "closed" status
  - Each request can only be rated once

#### Reopen Request
- **Endpoint:** `PUT /api/requests/:id/reopen`
- **Auth:** User (requires authentication)
- **Request Body:**
  ```json
  {
    "reopenReason": "Why the work needs to be redone"
  }
  ```
- **Response:** Updated request object with status back to "in-progress"
- **Restrictions:**
  - User must own the request
  - Request must be in "completed" or "closed" status
  - Reason is mandatory
- **Side Effects:**
  - Status reverts to "in-progress"
  - Rating is cleared
  - Status update is logged with the reopen reason

---

## Frontend Changes

### ReviewRequest Component (`frontend/src/components/ReviewRequest.js`)

#### New Features:

1. **Rating Modal**
   - Appears when user clicks "⭐ Rate Work" button
   - Offers three rating options: Excellent, Good, Poor
   - Optional feedback textarea
   - Displays confirmation message after submission

2. **Reopen Modal**
   - Appears when user clicks "🔄 Reopen Request" button
   - Requires mandatory reason text
   - Buttons: Cancel or Reopen Request

3. **Rating Display**
   - Shows user's rating on the request card
   - Displays the score (EXCELLENT, GOOD, POOR) with star emoji
   - Shows user feedback if provided
   - Highlighted box with blue border for visibility

4. **Button Logic**
   - "⭐ Rate Work" button appears only for completed/closed requests without a rating
   - "🔄 Reopen Request" button appears only for completed/closed requests that haven't been reopened
   - Buttons are color-coded (green for rating, orange for reopen)

---

## User Workflows

### Workflow 1: Rate Completed Work
1. User views a completed request in "Review Your Requests"
2. User clicks "⭐ Rate Work" button
3. Modal opens with three rating options
4. User selects rating (Excellent, Good, Poor)
5. User optionally adds feedback
6. User clicks "Submit Rating"
7. Request page refreshes showing the rating

### Workflow 2: Reopen Request Due to Poor Work
1. User views a completed/closed request
2. User identifies the work doesn't meet expectations
3. User clicks "🔄 Reopen Request" button
4. Modal opens asking for reason
5. User provides detailed reason for reopening
6. User clicks "Reopen Request"
7. Request status returns to "in-progress"
8. Admin receives the reopened request with reason in status updates
9. Admin can then re-allocate or take additional action

### Workflow 3: Excellent Work Satisfaction
1. User rates work as "Excellent"
2. Rating is recorded in system
3. Can be used for admin performance analytics (future feature)
4. Request remains in closed state

---

## API Testing

### Test Rating Endpoint
```bash
curl -X PUT http://localhost:5000/api/requests/<REQUEST_ID>/rate \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "score": "excellent",
    "feedback": "Great work, very satisfied!"
  }'
```

### Test Reopen Endpoint
```bash
curl -X PUT http://localhost:5000/api/requests/<REQUEST_ID>/reopen \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "reopenReason": "Work was not completed to satisfaction. Electrical connections are still faulty."
  }'
```

---

## Error Handling

### Rating Errors:
- `Invalid rating. Must be: excellent, good, or poor` - Invalid score value
- `Can only rate completed or closed requests` - Request not completed
- `Unauthorized` - User doesn't own the request

### Reopen Errors:
- `Please provide reason for reopening` - Empty reason
- `Can only reopen completed or closed requests` - Request not in correct status
- `Unauthorized` - User doesn't own the request

---

## Database Impact

### New Fields in Request Collection:
- `rating.score` - User's quality rating
- `rating.feedback` - Optional user feedback
- `rating.ratedAt` - Timestamp of rating
- `rating.ratedBy` - User ID who rated
- `reopenReason` - Reason for reopening
- `reopenedAt` - Timestamp of reopen

### Backward Compatibility:
- Existing requests have `rating: { score: null }` and `reopenReason: undefined`
- No migration needed; new fields are optional

---

## Future Enhancements

1. **Admin Analytics Dashboard**
   - Track ratings by department
   - Identify underperforming admins
   - Quality metrics dashboard

2. **Automatic Follow-ups**
   - Auto-send reminder after work completion
   - Prompt for rating after 24 hours

3. **Public Profiles**
   - Show admin rating statistics
   - Public satisfaction scores

4. **Feedback Comments**
   - Allow admins to respond to ratings
   - Threaded discussion on poor ratings

5. **Rating History**
   - Display previous ratings on request history page
   - Filter by rating score

---

## Status: ✅ COMPLETE
- Backend endpoints: Implemented & tested
- Frontend UI: Implemented & styled
- Error handling: Complete
- Ready for production deployment
