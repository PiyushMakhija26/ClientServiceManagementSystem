@echo off
echo ========================================
echo Citizen Request Management System
echo ========================================
echo.
echo Starting the application...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js is installed: 
node --version
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
mongosh --eval "db.version()" >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MongoDB may not be running!
    echo Please start MongoDB before running the application.
    echo.
    pause
)

echo.
echo Choose what to run:
echo 1. Start Backend Only
echo 2. Start Frontend Only
echo 3. Start Both (in separate windows)
echo 4. Install Dependencies
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    cd backend
    echo Starting Backend on port 5000...
    npm start
) else if "%choice%"=="2" (
    cd frontend
    echo Starting Frontend on port 3000...
    npm start
) else if "%choice%"=="3" (
    echo Starting Backend...
    start cmd /k "cd backend && npm start"
    timeout /t 3
    echo Starting Frontend...
    start cmd /k "cd frontend && npm start"
    echo.
    echo Both servers are starting!
    echo Backend: http://localhost:5000
    echo Frontend: http://localhost:3000
) else if "%choice%"=="4" (
    echo Installing Backend dependencies...
    cd backend
    call npm install
    cd..
    echo.
    echo Installing Frontend dependencies...
    cd frontend
    call npm install
    cd..
    echo.
    echo Dependencies installed!
) else if "%choice%"=="5" (
    exit /b 0
) else (
    echo Invalid choice!
)
