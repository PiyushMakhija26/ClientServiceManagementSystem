#!/usr/bin/env bash
# Start backend and frontend in background for local development (UNIX/macOS)
# Usage: ./scripts/start-all.sh
set -e
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Starting backend..."
nohup node "$ROOT_DIR/backend/server.js" > "$ROOT_DIR/logs/backend.log" 2>&1 &

sleep 1
echo "Starting frontend (CRA)..."
cd "$ROOT_DIR/frontend"
nohup npm start > "$ROOT_DIR/logs/frontend.log" 2>&1 &

echo "Started backend and frontend."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
