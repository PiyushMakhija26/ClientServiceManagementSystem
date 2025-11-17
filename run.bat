@echo off
REM Start Citizen Request Management System

set NODE_PATH=C:\Program Files\nodejs
set PATH=%NODE_PATH%;%PATH%

echo.
echo ========================================
echo Citizen Request Management System
echo ========================================
echo.
echo Starting MongoDB service...
net start MongoDB >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB is running
) else (
    echo [OK] MongoDB service already running
)

echo.
echo Starting Backend Server (Port 5000)...
cd /d "%~dp0backend"
start "Backend Server" cmd /k "%NODE_PATH%\npm.cmd start"

echo.
echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak

echo.
echo Starting Frontend Server (Port 3000)...
cd /d "%~dp0frontend"
start "Frontend Server" cmd /k "%NODE_PATH%\npm.cmd start"

echo.
echo ========================================
echo Services Starting...
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Note: Check the opened windows for server output
timeout /t 5
