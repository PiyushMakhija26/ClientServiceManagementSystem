# 🏛️ Citizen Request Management System - Complete Setup Guide

## 📋 Project Overview

This is a full-stack web application for managing citizen requests to government departments. Citizens can raise service requests, track their status, and communicate with administrators. Administrators can manage requests specific to their department.

---

## 🎯 Quick Start (5 Minutes)

### Windows Users:
1. Double-click `start.bat` in the project root
2. Choose option 4 to install dependencies
3. Choose option 3 to start both servers
4. Open browser to `http://localhost:3000`

### Mac/Linux Users:
```bash
chmod +x start.sh
./start.sh
```

---

## 📁 Project Structure

```
Epics/
├── backend/                          # Node.js Express Server
│   ├── models/
│   │   ├── User.js                  # Citizen user model
│   │   ├── Admin.js                 # Administrator model
│   │   └── Request.js               # Service request model
│   ├── routes/
│   │   ├── authRoutes.js            # Authentication endpoints
│   │   ├── userRoutes.js            # Citizen endpoints
│   │   ├── adminRoutes.js           # Admin endpoints
│   │   └── requestRoutes.js         # Request management endpoints
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication middleware
│   ├── server.js                    # Main server file
│   ├── package.json
│   ├── .env.example                 # Environment variables template
│   └── README.md
│
├── frontend/                         # React Application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.js       # Initial role selection
│   │   │   ├── UserAuthPage.js      # Citizen login/register
│   │   │   ├── AdminAuthPage.js     # Admin login/register
│   │   │   ├── UserDashboard.js     # Citizen main dashboard
│   │   │   └── AdminDashboard.js    # Admin main dashboard
│   │   ├── components/
│   │   │   ├── RaiseRequest.js      # Create new requests
│   │   │   ├── ReviewRequest.js     # Track request status
│   │   │   ├── CloseRequest.js      # Complete/close requests
│   │   │   ├── HelpSection.js       # Support & contact info
│   │   │   ├── UserProfile.js       # Citizen profile management
│   │   │   ├── AdminRaisedRequests.js
│   │   │   ├── AdminAllocateWork.js
│   │   │   ├── AdminUpdateStatus.js
│   │   │   └── AdminProfile.js
│   │   ├── styles/
│   │   │   ├── LandingPage.css
│   │   │   ├── AuthPage.css
│   │   │   └── Dashboard.css
│   │   ├── App.js                   # Router setup
│   │   ├── index.js                 # React entry point
│   │   └── index.css
│   ├── package.json
│   ├── README.md
│   └── .gitignore
│
├── .vscode/
│   └── launch.json                  # Debug configuration
├── .gitignore
├── README.md                         # Project overview
├── INSTALLATION.md                   # Detailed setup guide
├── start.bat                        # Windows startup script
├── start.sh                         # Unix startup script
└── QUICK_START.md                   # This file
```

---

## 🛠️ Installation

### Prerequisites
- **Node.js** v14+ (Download from https://nodejs.org/)
- **MongoDB** (Download from https://www.mongodb.com/try/download/community)
- **Git** (Optional, for version control)

### Step-by-Step Setup

#### 1. **Ensure MongoDB is Running**
```powershell
# Windows - If installed as service, it should auto-start
# Or manually start MongoDB shell
mongod

# Verify in another terminal
mongosh
```

#### 2. **Backend Setup**
```powershell
cd backend
npm install
copy .env.example .env
# Edit .env if needed (defaults should work)
npm start
```

Expected output:
```
Server running on port 5000
MongoDB connected
```

#### 3. **Frontend Setup** (New Terminal)
```powershell
cd frontend
npm install
npm start
```

Browser will automatically open to `http://localhost:3000`

---

## 🚀 Running the Application

### Option 1: Using Start Scripts (Recommended)

**Windows:**
```bash
start.bat
# Then select option 3 to start both servers
```

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
# Then select option 3
```

### Option 2: Manual Terminal Commands

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

### Option 3: Development Mode with Auto-reload

**Backend (with nodemon):**
```powershell
cd backend
npm run dev
```

**Frontend:**
```powershell
cd frontend
npm start
```

---

## 🎭 User Roles & Features

### 👤 CITIZEN (User) Features

**Registration:**
- Full Name
- Email & Password
- Address, State, City
- Phone Number

**Dashboard Sections:**

1. **➕ Raise Request**
   - Title of the issue
   - Detailed description (max 150 characters)
   - Select target department (Electricity, Water, Agriculture, Law, Medical, Services)
   - Upload multiple images
   - Submit for processing

2. **🔍 Review Request**
   - View all active requests
   - Check current status (Raised, In Progress, Completed, Clarification Needed)
   - See status update history
   - Send alarms to administrators
   - View assigned officer information

3. **✅ Close Request**
   - View completed requests
   - Close requests after confirmation
   - View previously closed requests

4. **ℹ️ Help & Support**
   - Helpline number and email
   - Office hours
   - FAQ section
   - Recent request updates
   - Officer contact information

5. **👤 Profile**
   - View and edit personal information
   - Account creation date
   - Account status

---

### ⚙️ ADMINISTRATOR Features

**Registration:**
- Full Name
- Email & Password
- Select Department (Electricity, Water, Agriculture, Law, Medical, Services)
- Designation
- Phone Number

**Dashboard Sections:**

1. **📥 Raised Requests**
   - View all new requests in their department
   - See citizen details (name, address, contact)
   - Request descriptions and submitted images

2. **👥 Allocate Work**
   - View unallocated requests
   - Assign to other admins in same department
   - Track allocation history

3. **📊 Update Status**
   - View assigned requests
   - Update status to: In Progress, Completed, Clarification Needed
   - Add update messages
   - Send clarification requests to citizens
   - Track all updates with timestamps

4. **👤 Profile**
   - View and edit admin information
   - View department assignment
   - Account status and creation date

---

## 📊 Data Models

### User (Citizen)
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  address: String,
  state: String,
  city: String,
  phone: String,
  userType: "user",
  createdAt: Date,
  updatedAt: Date
}
```

### Admin
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  department: String (enum),
  phone: String,
  designation: String,
  userType: "admin",
  createdAt: Date,
  updatedAt: Date
}
```

### Request
```javascript
{
  userId: ObjectId (ref User),
  title: String,
  description: String (max 150 chars),
  department: String (enum),
  images: [String] (base64 encoded),
  status: String (raised/in-progress/completed/closed/clarification-needed),
  allocatedTo: ObjectId (ref Admin),
  priority: String (low/medium/high),
  statusUpdates: [{
    status: String,
    message: String,
    updatedBy: ObjectId,
    timestamp: Date
  }],
  alarms: [{
    sentAt: Date,
    message: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/user/register` | Register as citizen |
| POST | `/api/auth/user/login` | Citizen login |
| POST | `/api/auth/admin/register` | Register as admin |
| POST | `/api/auth/admin/login` | Admin login |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update user profile |

### Admin Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admins/profile` | Get admin profile |
| PUT | `/api/admins/profile` | Update admin profile |
| GET | `/api/admins/department` | Get dept admins |

### Request Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/requests/create` | Create new request |
| GET | `/api/requests/user/all` | Get all user requests |
| GET | `/api/requests/user/:status` | Get requests by status |
| GET | `/api/requests/:id` | Get request details |
| GET | `/api/requests/admin/raised` | Get raised requests |
| GET | `/api/requests/admin/assigned` | Get assigned requests |
| PUT | `/api/requests/:id/allocate` | Allocate to admin |
| PUT | `/api/requests/:id/status` | Update status |
| POST | `/api/requests/:id/alarm` | Send alarm |
| PUT | `/api/requests/:id/close` | Close request |

---

## 🔐 Authentication & Security

- **JWT Tokens**: 7-day expiration
- **Password Hashing**: bcryptjs with salt rounds = 10
- **CORS**: Enabled for frontend-backend communication
- **Protected Routes**: All routes require valid JWT token
- **Role-Based Access**: Admins can only access admin routes

---

## 🎨 UI/UX Features

✅ Modern gradient design with purple/blue theme
✅ Responsive layout (works on desktop, tablet, mobile)
✅ Smooth transitions and hover effects
✅ Form validation with error messages
✅ Status-based color coding (raised, in-progress, completed, etc.)
✅ Expandable request cards for detailed view
✅ Empty states with helpful messages
✅ Loading indicators for async operations
✅ Success/error notification system

---

## 🧪 Test Data

### Test Citizen Account
- Email: test@citizen.com
- Password: Test@123

### Test Admin Account
- Email: test@admin.com
- Password: Admin@123
- Department: electricity

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process or change PORT in .env
# Then restart
```

### MongoDB connection error
```bash
# Ensure MongoDB is running
mongosh

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/citizen-requests
```

### Frontend shows blank page
```bash
# Check browser console for errors (F12)
# Ensure backend is running on port 5000
# Clear browser cache: Ctrl+Shift+Delete
```

### Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rmdir /s node_modules
del package-lock.json

# Reinstall
npm install
```

---

## 📈 Future Enhancements

1. **Email Notifications**
   - Automatic emails on request status changes
   - Daily digest for administrators

2. **SMS Alerts**
   - Urgent notifications via SMS
   - OTP verification during registration

3. **Real-time Updates**
   - WebSocket for live notifications
   - Real-time status synchronization

4. **Advanced Analytics**
   - Admin dashboard with metrics
   - Request completion rate graphs
   - Performance analytics

5. **File Storage**
   - AWS S3 integration for images
   - Cloud-based backup

6. **Mobile App**
   - React Native version
   - Native iOS and Android apps

7. **Multi-language Support**
   - Internationalization (i18n)
   - Hindi, regional languages

8. **API Documentation**
   - Swagger/OpenAPI docs
   - Postman collection

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review component README files
3. Check browser console for errors (F12)
4. Check backend console output

---

## 📝 Version History

**v1.0.0** (November 2024)
- ✅ Initial release
- ✅ Core citizen features
- ✅ Core admin features
- ✅ Full request lifecycle
- ✅ Authentication system
- ✅ Responsive UI

---

## 📄 License

This project is proprietary and for authorized use only.

---

**Ready to run?** Start with: `start.bat` (Windows) or `./start.sh` (Mac/Linux)

**Questions?** Refer to README.md, backend/README.md, or frontend/README.md
