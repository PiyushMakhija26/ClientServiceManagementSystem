#!/bin/bash

echo "========================================"
echo "Citizen Request Management System"
echo "========================================"
echo ""
echo "Starting the application..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js is installed: $(node --version)"
echo ""

# Check if MongoDB is running
echo "Checking MongoDB connection..."
if ! mongosh --eval "db.version()" &> /dev/null; then
    echo "WARNING: MongoDB may not be running!"
    echo "Please start MongoDB before running the application."
    echo ""
fi

echo ""
echo "Choose what to run:"
echo "1. Start Backend Only"
echo "2. Start Frontend Only"
echo "3. Start Both (in separate terminals)"
echo "4. Install Dependencies"
echo "5. Exit"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        cd backend
        echo "Starting Backend on port 5000..."
        npm start
        ;;
    2)
        cd frontend
        echo "Starting Frontend on port 3000..."
        npm start
        ;;
    3)
        echo "Starting Backend..."
        cd backend
        npm start &
        BACKEND_PID=$!
        cd ..
        sleep 3
        echo "Starting Frontend..."
        cd frontend
        npm start &
        FRONTEND_PID=$!
        echo ""
        echo "Both servers are starting!"
        echo "Backend: http://localhost:5000"
        echo "Frontend: http://localhost:3000"
        echo ""
        wait $BACKEND_PID $FRONTEND_PID
        ;;
    4)
        echo "Installing Backend dependencies..."
        cd backend
        npm install
        cd ..
        echo ""
        echo "Installing Frontend dependencies..."
        cd frontend
        npm install
        cd ..
        echo ""
        echo "Dependencies installed!"
        ;;
    5)
        exit 0
        ;;
    *)
        echo "Invalid choice!"
        ;;
esac
