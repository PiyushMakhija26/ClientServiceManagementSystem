# Citizen Request Management System - Frontend

A modern React-based frontend for the Citizen Request Management System.

## Setup Instructions

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## Features

### For Citizens:
- ✅ Register/Login
- ✅ Raise new requests with image uploads
- ✅ Review request status and updates
- ✅ Send alarms for urgent attention
- ✅ Close completed requests
- ✅ Help section with contact info and recent updates
- ✅ Manage profile information

### For Administrators:
- ✅ Register/Login by department
- ✅ View raised requests in their department
- ✅ Allocate work to other admins
- ✅ Update request status
- ✅ Track clarification requests
- ✅ Manage admin profile

## Technology Stack

- React 18
- React Router v6
- Axios (API calls)
- CSS (custom styling)

## Environment Variables

The frontend connects to the backend API running on `http://localhost:5000` by default.

