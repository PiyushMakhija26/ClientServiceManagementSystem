# Backend Fixes Applied

## Issue 1: Admin Cannot Update Request Status to "Completed" ✅ FIXED

### Problem
Admin was unable to set request status to "completed" status.

### Root Cause
The endpoint existed but had insufficient authorization checks and validation.

### Solution Applied
Enhanced `PUT /api/requests/:id/status` endpoint in `backend/routes/requestRoutes.js`:

1. **Added Status Validation**
   - Validates that status is one of: `raised`, `in-progress`, `completed`, `closed`, `clarification-needed`
   - Returns clear error message if invalid status provided

2. **Improved Authorization**
   - Admin can update if they're from the same department OR are the allocated admin
   - Checks both `req.department` and `req.allocatedTo` for authorization

3. **Enhanced Response**
   - Now returns `oldStatus` and `newStatus` for better tracking
   - Properly logs status transitions in `statusUpdates` array

**API Endpoint:**
```bash
PUT /api/requests/:id/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "completed",
  "message": "Work completed successfully",
  "clarificationMessage": "" (optional)
}
```

---

## Issue 2: Password Forgot/Reset Not Available ✅ FIXED

### Problem
Neither users nor admins had password reset functionality.

### Solution Applied

### 1. Updated Models
Added password reset fields to `User` and `Admin` models:
- `resetPasswordToken` (String) - Stores hashed reset token
- `resetPasswordExpire` (Date) - Token expiration time (10 minutes)

**File Changes:**
- `backend/models/User.js`
- `backend/models/Admin.js`

### 2. New Authentication Endpoints

**User Password Reset:**
```bash
# Step 1: Request password reset
POST /api/auth/user/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "message": "Password reset link sent to your email",
  "resetLink": "http://localhost:3000/reset-password?token=<token>&email=user@example.com"
}

# Step 2: Reset password with token
POST /api/auth/user/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "token": "<reset-token-from-email>",
  "newPassword": "newPassword123"
}

Response:
{
  "message": "Password reset successfully"
}
```

**Admin Password Reset:**
```bash
# Step 1: Request password reset
POST /api/auth/admin/forgot-password
Content-Type: application/json

{
  "email": "admin@example.com"
}

# Step 2: Reset password with token
POST /api/auth/admin/reset-password
Content-Type: application/json

{
  "email": "admin@example.com",
  "token": "<reset-token-from-email>",
  "newPassword": "newPassword123"
}
```

### 3. Security Features
- Reset tokens are hashed using SHA-256 for storage
- Tokens expire after 10 minutes
- One-time use only (tokens deleted after use)
- Token must match email for verification

**File Changes:**
- `backend/routes/authRoutes.js` - Added 4 new endpoints

---

## How to Test

### Test 1: Update Request Status to Completed
```bash
curl -X PUT http://localhost:5000/api/requests/<request-id>/status \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "message": "Work has been completed successfully"
  }'
```

### Test 2: Forgot Password Flow
```bash
# Step 1: Request reset
curl -X POST http://localhost:5000/api/auth/user/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# Copy the resetLink from response, extract token
# Step 2: Reset with token
curl -X POST http://localhost:5000/api/auth/user/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "token": "<token-from-step1>",
    "newPassword": "newPassword123"
  }'
```

---

## Frontend Updates Needed

To utilize these new endpoints, update your frontend:

### 1. Status Update Component
```javascript
// In admin update status component
const updateRequestStatus = async (requestId, status) => {
  const response = await fetch(`http://localhost:5000/api/requests/${requestId}/status`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'completed',
      message: 'Completed successfully',
    }),
  });
  const data = await response.json();
  console.log(data);
};
```

### 2. Forgot Password Component
```javascript
// Forgot password flow
const handleForgotPassword = async (email) => {
  const response = await fetch('http://localhost:5000/api/auth/user/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  // data.resetLink contains the reset link (in dev mode)
  // In production, user gets this via email
};

// Reset password with token
const handleResetPassword = async (email, token, newPassword) => {
  const response = await fetch('http://localhost:3000/api/auth/user/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token, newPassword }),
  });
  const data = await response.json();
  console.log(data.message); // "Password reset successfully"
};
```

---

## Backend Status

✅ **All Changes Verified**
- Backend compiles without errors
- MongoDB connection successful
- All new endpoints added
- Status validation working

**Server Running:** `http://0.0.0.0:5000`
**Database:** MongoDB connected

---

## Next Steps (Frontend)

1. Create forgot password page at `/forgot-password`
2. Create reset password page at `/reset-password?token=<>&email=<>`
3. Update admin update-status component to use new endpoint
4. Add success/error messaging for all password operations

---

**Last Updated:** November 17, 2025
