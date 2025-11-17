# API Testing Guide - Status Update & Password Reset

## Quick Start

**Backend:** Running on `http://localhost:5000`
**Frontend:** Running on `http://localhost:3000`

---

## Test 1: Register User → Get Token → Test Password Reset

### Step 1: Register a User
```bash
curl -X POST http://localhost:5000/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "address": "123 Main St",
    "state": "CA",
    "city": "Los Angeles",
    "phone": "555-1234"
  }'
```

**Expected Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f...",
    "name": "John Doe",
    "email": "john@example.com",
    "userType": "user"
  }
}
```

### Step 2: User Forgot Password
```bash
curl -X POST http://localhost:5000/api/auth/user/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

**Expected Response (200):**
```json
{
  "message": "Password reset link sent to your email",
  "resetLink": "http://localhost:3000/reset-password?token=abc123def456&email=john@example.com"
}
```

**Copy the token from resetLink** (in production, this comes via email)

### Step 3: User Reset Password
```bash
curl -X POST http://localhost:5000/api/auth/user/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "token": "abc123def456",
    "newPassword": "NewPassword456"
  }'
```

**Expected Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

### Step 4: Login with New Password
```bash
curl -X POST http://localhost:5000/api/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "NewPassword456"
  }'
```

**Expected Response (200):** ✅ Success with new token

---

## Test 2: Admin Register → Allocate Request → Update Status to Completed

### Step 1: Register Admin
```bash
curl -X POST http://localhost:5000/api/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Officer",
    "email": "admin@example.com",
    "password": "AdminPass123",
    "department": "electricity",
    "phone": "555-5678",
    "designation": "Senior Officer"
  }'
```

**Expected Response (201):** Admin token

### Step 2: Create a Request (as User)
First, login as the user from Test 1 and get their token, then:

```bash
curl -X POST http://localhost:5000/api/requests/create \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Broken Power Line",
    "description": "Power line down on Main Street",
    "department": "electricity",
    "images": []
  }'
```

**Expected Response (201):**
```json
{
  "message": "Request created successfully",
  "request": {
    "_id": "607f...",
    "status": "raised",
    "title": "Broken Power Line",
    ...
  }
}
```

**Copy the request `_id`**

### Step 3: Allocate Request to Admin
```bash
curl -X PUT http://localhost:5000/api/requests/607f.../allocate \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"allocatedToAdminId": "<ADMIN_ID>"}'
```

**Expected Response (200):**
```json
{
  "message": "Request allocated successfully",
  "request": {
    "_id": "607f...",
    "status": "in-progress",
    ...
  }
}
```

### Step 4: Update Status to "completed"
```bash
curl -X PUT http://localhost:5000/api/requests/607f.../status \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "message": "Work completed successfully"
  }'
```

**Expected Response (200):**
```json
{
  "message": "Request status updated successfully",
  "oldStatus": "in-progress",
  "newStatus": "completed",
  "request": {
    "_id": "607f...",
    "status": "completed",
    "statusUpdates": [
      {
        "status": "in-progress",
        "message": "Request allocated to admin",
        "updatedBy": "...",
        "timestamp": "2025-11-17T..."
      },
      {
        "status": "completed",
        "message": "Work completed successfully",
        "updatedBy": "...",
        "timestamp": "2025-11-17T..."
      }
    ],
    ...
  }
}
```

✅ **Status successfully updated to "completed"**

---

## Test 3: Admin Forgot Password

### Step 1: Admin Forgot Password
```bash
curl -X POST http://localhost:5000/api/auth/admin/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com"}'
```

**Expected Response (200):**
```json
{
  "message": "Password reset link sent to your email",
  "resetLink": "http://localhost:3000/admin/reset-password?token=xyz789&email=admin@example.com"
}
```

### Step 2: Admin Reset Password
```bash
curl -X POST http://localhost:5000/api/auth/admin/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "token": "xyz789",
    "newPassword": "NewAdminPass789"
  }'
```

**Expected Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

---

## Status Values

The following status values are now supported and validated:

1. **raised** - Initial status when request is created
2. **in-progress** - Admin has taken the request
3. **completed** - Work is finished ✅ NOW WORKING
4. **closed** - User has closed the request
5. **clarification-needed** - Admin needs more info

---

## Error Responses

### Invalid Status
```bash
curl -X PUT http://localhost:5000/api/requests/607f.../status \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status": "invalid-status"}'
```

**Response (400):**
```json
{
  "message": "Invalid status. Must be one of: raised, in-progress, completed, closed, clarification-needed"
}
```

### Invalid/Expired Reset Token
```bash
curl -X POST http://localhost:5000/api/auth/user/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "token": "invalid-token",
    "newPassword": "NewPass"
  }'
```

**Response (400):**
```json
{
  "message": "Invalid or expired reset token"
}
```

### Not Authorized to Update Request
```bash
curl -X PUT http://localhost:5000/api/requests/607f.../status \
  -H "Authorization: Bearer <OTHER_ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

**Response (403):**
```json
{
  "message": "Not authorized to update this request"
}
```

---

## Key Points

✅ **Both issues are now fixed:**

1. **Admin CAN update status to "completed"**
   - Endpoint: `PUT /api/requests/:id/status`
   - Authorization: Admin must be from same department or be allocated admin
   - Status validation ensures only valid values are accepted

2. **Password forget/reset is available**
   - User endpoints: `/api/auth/user/forgot-password` and `/api/auth/user/reset-password`
   - Admin endpoints: `/api/auth/admin/forgot-password` and `/api/auth/admin/reset-password`
   - Tokens expire after 10 minutes
   - One-time use only

---

## Postman Collection

Import this into Postman to test all endpoints:

```json
{
  "info": {
    "name": "Citizen Requests API - Fixes",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "User Register",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/auth/user/register",
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"John\", \"email\": \"john@test.com\", \"password\": \"Pass123\", \"address\": \"123 Main\", \"state\": \"CA\", \"city\": \"LA\", \"phone\": \"555-1234\"}"
        }
      }
    },
    {
      "name": "User Forgot Password",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/auth/user/forgot-password",
        "body": {"mode": "raw", "raw": "{\"email\": \"john@test.com\"}"}
      }
    },
    {
      "name": "Update Request Status",
      "request": {
        "method": "PUT",
        "url": "{{baseUrl}}/api/requests/{{requestId}}/status",
        "header": [{"key": "Authorization", "value": "Bearer {{adminToken}}"}],
        "body": {"mode": "raw", "raw": "{\"status\": \"completed\", \"message\": \"Done\"}"}
      }
    }
  ]
}
```

Set `baseUrl = http://localhost:5000` in Postman

---

**Last Updated:** November 17, 2025
**Status:** ✅ All fixes verified and tested
