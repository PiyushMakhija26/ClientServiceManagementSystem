# API Documentation - Rating & Reopen Features

## New Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| PUT | `/api/requests/:id/rate` | User | Rate completed work |
| PUT | `/api/requests/:id/reopen` | User | Reopen request due to poor work |

---

## Detailed Endpoint Documentation

### 1. Rate Work Endpoint

**URL:** `/api/requests/:id/rate`  
**Method:** `PUT`  
**Authentication:** Required (Bearer Token)  
**Content-Type:** `application/json`

#### Request Parameters

- **URL Parameter:**
  - `id` (string, required) - MongoDB ObjectId of the request

- **Request Body:**
  ```json
  {
    "score": "excellent|good|poor",
    "feedback": "Optional user feedback about the work quality"
  }
  ```

#### Valid Values

- `score`: Must be one of:
  - `"excellent"` - Work exceeds expectations
  - `"good"` - Work meets expectations
  - `"poor"` - Work below expectations
- `feedback`: Optional string, max 500 characters

#### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "Request rated successfully",
  "request": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "title": "Fix broken electrical switch",
    "description": "Kitchen switch not working",
    "department": "electricity",
    "status": "completed",
    "rating": {
      "score": "excellent",
      "feedback": "Great work, very quick service!",
      "ratedAt": "2025-11-17T10:30:00Z",
      "ratedBy": "507f1f77bcf86cd799439012"
    },
    "allocatedTo": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "John Technician"
    }
  }
}
```

#### Error Responses

**Status Code:** `400 Bad Request`
```json
{
  "message": "Invalid rating. Must be: excellent, good, or poor"
}
```

**Status Code:** `400 Bad Request`
```json
{
  "message": "Can only rate completed or closed requests"
}
```

**Status Code:** `403 Forbidden`
```json
{
  "message": "Unauthorized"
}
```

**Status Code:** `404 Not Found`
```json
{
  "message": "Request not found"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "message": "Error rating request",
  "error": "Details of the error"
}
```

#### Constraints & Rules

1. **User Ownership:** The authenticated user must be the request creator (userId)
2. **Status Requirement:** Request must be in `completed` or `closed` status
3. **Single Rating:** Each request can only be rated once (update overwrites previous rating)
4. **Immutable:** Once rated, the rating persists unless the request is reopened

#### Example Curl Request

```bash
curl -X PUT http://localhost:5000/api/requests/507f1f77bcf86cd799439011/rate \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "score": "excellent",
    "feedback": "Outstanding work quality and quick turnaround!"
  }'
```

---

### 2. Reopen Request Endpoint

**URL:** `/api/requests/:id/reopen`  
**Method:** `PUT`  
**Authentication:** Required (Bearer Token)  
**Content-Type:** `application/json`

#### Request Parameters

- **URL Parameter:**
  - `id` (string, required) - MongoDB ObjectId of the request

- **Request Body:**
  ```json
  {
    "reopenReason": "Detailed reason why the work needs to be redone"
  }
  ```

#### Valid Values

- `reopenReason`: Required string, max 500 characters, must not be empty

#### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "Request reopened successfully",
  "request": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "title": "Fix broken electrical switch",
    "description": "Kitchen switch not working",
    "department": "electricity",
    "status": "in-progress",
    "reopenReason": "The switch still doesn't work properly, it keeps flipping on and off",
    "reopenedAt": "2025-11-17T11:00:00Z",
    "rating": {
      "score": null,
      "feedback": "",
      "ratedAt": null,
      "ratedBy": null
    },
    "statusUpdates": [
      {
        "status": "in-progress",
        "message": "Request reopened by user. Reason: The switch still doesn't work properly, it keeps flipping on and off",
        "updatedBy": "507f1f77bcf86cd799439012",
        "timestamp": "2025-11-17T11:00:00Z"
      }
    ],
    "allocatedTo": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "John Technician"
    }
  }
}
```

#### Error Responses

**Status Code:** `400 Bad Request`
```json
{
  "message": "Please provide reason for reopening"
}
```

**Status Code:** `400 Bad Request`
```json
{
  "message": "Can only reopen completed or closed requests"
}
```

**Status Code:** `403 Forbidden`
```json
{
  "message": "Unauthorized"
}
```

**Status Code:** `404 Not Found`
```json
{
  "message": "Request not found"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "message": "Error reopening request",
  "error": "Details of the error"
}
```

#### Constraints & Rules

1. **User Ownership:** The authenticated user must be the request creator
2. **Status Requirement:** Request must be in `completed` or `closed` status
3. **Mandatory Reason:** Reason cannot be empty
4. **One Reopen:** Request can only be reopened once (checked via reopenReason field)
5. **Status Transition:** Moves request back to `in-progress` status
6. **Rating Reset:** Any existing rating is cleared when reopening

#### Side Effects When Reopening

- Request status changes from `completed/closed` → `in-progress`
- Rating object is reset to null values
- New status update entry is created with the reopen reason
- Admin sees the request in their unfinished tasks list
- Original allocation may be retained or reassigned

#### Example Curl Request

```bash
curl -X PUT http://localhost:5000/api/requests/507f1f77bcf86cd799439011/reopen \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "reopenReason": "The electrical connection is still not properly insulated. There are visible sparks when the switch is used."
  }'
```

---

## Integration with Frontend

### ReviewRequest Component Integration

The frontend `ReviewRequest.js` component automatically:

1. **Detects completed/closed requests** and offers rating/reopen buttons
2. **Displays ratings** when present
3. **Manages modals** for user input
4. **Refreshes data** after rating or reopening
5. **Shows error messages** with helpful feedback

### Button Availability Logic

```javascript
// "Rate Work" button shown if:
- Request status is 'completed' OR 'closed'
- AND no rating exists yet (rating.score === null)

// "Reopen Request" button shown if:
- Request status is 'completed' OR 'closed'
- AND no reopenReason exists yet
```

---

## Workflow Examples

### Complete Workflow: Excellent Work

```
1. User creates request → Status: "raised"
2. Admin allocates → Status: "in-progress"
3. Admin completes → Status: "completed"
4. Frontend shows "Rate Work" button
5. User clicks and selects "excellent" with feedback
6. PUT /api/requests/:id/rate executed
7. Frontend displays rating on card
```

### Complete Workflow: Poor Work & Reopen

```
1. User creates request → Status: "raised"
2. Admin allocates → Status: "in-progress"
3. Admin completes → Status: "completed"
4. User rates as "poor"
5. Frontend shows "Reopen Request" button
6. User provides detailed reason
7. PUT /api/requests/:id/reopen executed
8. Status changes back to "in-progress"
9. Admin sees reopened request with reason
10. Admin can now reassign or fix the issue
```

---

## Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer <JWT_TOKEN>
```

The token is obtained from:
- `POST /api/auth/user/login` for regular users
- `POST /api/auth/admin/login` for admins

---

## Rate Limiting

Currently no rate limiting is applied. Consider implementing in production:
- Max 5 ratings per hour per user
- Max 10 reopens per day per user

---

## Monitoring & Analytics

### Metrics to Track

1. **Rating Distribution:**
   - % Excellent vs Good vs Poor
   - By department
   - By admin performance

2. **Reopen Rate:**
   - How many requests are reopened
   - Reopen frequency by admin
   - Time-to-reopen metric

3. **User Satisfaction:**
   - Average rating score
   - Feedback sentiment analysis
   - Trends over time

---

## Future Enhancements

1. **Rating History:** Store and display past ratings
2. **Admin Response:** Allow admins to respond to poor ratings
3. **Auto-Notifications:** Notify admin when request is rated poorly
4. **Rating Expiry:** Clear rating after 30 days if unchanged
5. **Weighted Ratings:** Different weights for different rating values
6. **Department Analytics:** Dashboard showing dept-wide ratings

---

## Testing Checklist

- [ ] Test rating with token
- [ ] Test rating without token (should fail)
- [ ] Test rating with invalid score (should fail)
- [ ] Test rating completed request
- [ ] Test rating in-progress request (should fail)
- [ ] Test reopen with valid reason
- [ ] Test reopen without reason (should fail)
- [ ] Test reopen on in-progress request (should fail)
- [ ] Test multiple ratings on same request (should overwrite)
- [ ] Verify status updates are logged
- [ ] Verify rating data persists after page refresh

---

**Last Updated:** November 17, 2025  
**Version:** 1.0  
**Status:** Production Ready
