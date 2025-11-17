# ⚠️ SETUP REQUIRED BEFORE RUNNING

Your system is missing **Node.js** and **MongoDB**. Follow these steps to install them:

---

## 🔧 STEP 1: Install Node.js

### Windows:
1. Go to https://nodejs.org/
2. Download **LTS version** (recommended)
3. Run the installer and follow the steps
4. **Restart your computer** after installation
5. Verify: Open PowerShell and run:
   ```powershell
   node --version
   npm --version
   ```

### Mac:
```bash
# Using Homebrew (if installed)
brew install node
```

### Linux:
```bash
sudo apt-get update
sudo apt-get install nodejs npm
```

---

## 🔧 STEP 2: Install MongoDB

### Windows:
1. Go to https://www.mongodb.com/try/download/community
2. Download **Community Server** (Windows 64-bit)
3. Run the installer
4. Choose "Install MongoDB as a Service"
5. Complete the installation
6. Start MongoDB Service:
   - Open Services (services.msc)
   - Find "MongoDB Server"
   - Make sure it's running (status should show "Running")

### Verify MongoDB is running:
```powershell
mongosh
# You should see a connection prompt
```

### Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux:
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

---

## ✅ VERIFICATION CHECKLIST

After installation, verify in PowerShell:

```powershell
# Check Node.js
node --version
# Should show: v18.x.x or higher

# Check npm
npm --version
# Should show: 9.x.x or higher

# Check MongoDB
mongosh
# Should show: MongoDB shell prompt
# Type: exit
```

---

## 🚀 AFTER INSTALLATION

Once both are installed and verified:

1. **Restart your computer** (important!)
2. Navigate to the Epics folder
3. Run the startup script:
   - **Windows**: Double-click `start.bat`
   - **Mac/Linux**: Run `./start.sh`
4. Choose option **3** to start both servers
5. Browser will open automatically at http://localhost:3000

---

## 📋 QUICK TROUBLESHOOTING

**"node is not recognized":**
- Node.js not installed OR
- Need to restart your computer after installation
- Try: `powershell -Command "node --version"`

**"mongosh is not recognized":**
- MongoDB not installed OR
- MongoDB service not running
- Try: Open Services → Look for "MongoDB Server" → Right-click → Start

**"Cannot connect to MongoDB":**
- Make sure MongoDB service is running in Windows Services
- Or run: `mongod` in a separate terminal

**"Port 3000 or 5000 already in use":**
- Close other applications using these ports
- Or edit `.env` file to use different ports

---

## ⏱️ ESTIMATED TIME
- Node.js installation: 5-10 minutes
- MongoDB installation: 10-15 minutes
- **Total setup time: 20-25 minutes**

---

## 🎯 NEXT STEPS

1. ✅ Install Node.js
2. ✅ Install MongoDB
3. ✅ Verify both are working
4. ✅ Restart your computer
5. ✅ Run `start.bat` and choose option 3
6. ✅ Test the application at http://localhost:3000

**You're almost there! Once setup is complete, the app will run perfectly.** 🎉
