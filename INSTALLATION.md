# Citizen Request Management System

## Installation & Running Guide

### Step 1: Install MongoDB

Download and install MongoDB Community Edition from https://www.mongodb.com/try/download/community

### Step 2: Start MongoDB

#### Windows
```powershell
# If installed as service, it should start automatically
# Or manually start:
mongod
```

#### Verify MongoDB is running
Open another terminal and run:
```bash
mongo
# or
mongosh
```

### Step 3: Backend Setup

1. Open Terminal 1 and navigate to backend:
   ```powershell
   cd c:\Users\piyu4\OneDrive\Desktop\Epics\backend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Create .env file (copy from .env.example):
   ```powershell
   copy .env.example .env
   ```

4. Update .env if needed (default values should work):
   ```
   MONGODB_URI=mongodb://localhost:27017/citizen-requests
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```

5. Start the backend server:
   ```powershell
   npm start
   ```
   
   You should see: `Server running on port 5000`
   And: `MongoDB connected`

### Step 4: Frontend Setup

1. Open Terminal 2 and navigate to frontend:
   ```powershell
   cd c:\Users\piyu4\OneDrive\Desktop\Epics\frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the frontend development server:
   ```powershell
   npm start
   ```
   
   This will automatically open `http://localhost:3000` in your browser

### Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Testing the System

### Test Citizen Flow:
1. Click "Citizen" on landing page
2. Click "Register" 
3. Fill in details:
   - Name: John Doe
   - Email: john@example.com
   - Password: Test@123
   - Address: 123 Main St
   - State: California
   - City: Los Angeles
   - Phone: 9876543210

4. You'll be logged in to the citizen dashboard
5. Try "Raise Request" - fill out and submit
6. Check "Review Request" to see your request
7. Use "Help Section" to see recent requests

### Test Admin Flow:
1. Click "Administrator" on landing page
2. Click "Register"
3. Fill in details:
   - Name: Jane Admin
   - Email: admin@example.com
   - Password: Admin@123
   - Department: electricity
   - Designation: Senior Officer
   - Phone: 9876543210

4. You'll be logged in to the admin dashboard
5. Check "Raised Requests" to see citizen requests
6. Use "Allocate Work" to assign requests
7. Use "Update Status" to mark requests as complete

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Try: `mongosh` to test connection

### Port Already in Use
- Backend: Change PORT in .env file
- Frontend: It will automatically use a different port

### Dependencies Not Installing
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### CORS Issues
- Ensure backend is running on port 5000
- Check that frontend proxy in package.json points to correct backend URL

## Project Structure Overview

```
Epics/
├── backend/
│   ├── models/          # Database schemas (User, Admin, Request)
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Express server
│   ├── package.json     # Backend dependencies
│   └── .env            # Configuration
│
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # React components (Raise, Review, Close, Help, Profile)
│   │   ├── pages/       # Page components (Auth, Dashboard, Landing)
│   │   ├── styles/      # CSS stylesheets
│   │   ├── App.js       # Main router
│   │   └── index.js     # Entry point
│   └── package.json     # Frontend dependencies
│
└── README.md           # This file
```

## Key Features Implemented

✅ User & Admin Authentication
✅ Role-based Dashboard
✅ Request Lifecycle Management
✅ Status Tracking & Updates
✅ Image Upload Support (Base64)
✅ Alarm/Notification System
✅ Department-based Admin Management
✅ Profile Management
✅ Responsive Design
✅ Form Validation
✅ Error Handling

## Next Steps for Enhancement

1. **Email Notifications**: Add nodemailer for email alerts
2. **File Storage**: Use AWS S3 or Cloud Storage for images
3. **Real-time Updates**: Implement Socket.io for live notifications
4. **Admin Dashboard**: Add analytics and reporting
5. **Mobile App**: Create React Native version
6. **Deployment**: Deploy to AWS, Azure, or Heroku
7. **Testing**: Add Jest and React Testing Library tests
8. **Documentation**: API documentation with Swagger

---

**For Support**: Contact development team

**Last Updated**: November 2024
