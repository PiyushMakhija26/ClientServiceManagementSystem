# Citizen Request Management System

This repository contains the backend (Node/Express) and the legacy frontend (React CRA) for the Citizen Request Management System. The modern Next.js frontend (`frontend_modern`) was removed by request; this README documents running the legacy frontend + backend and Docker-based local deployment.

---

## What I changed for you
- Consolidated Docker Compose to a single `docker-compose.yml` that builds `./backend` and `./frontend`.
- Added start scripts in `scripts/` for Windows (PowerShell) and Unix (bash).
- Added `.env.example` for local environment variables.
- Updated CI workflow to build the legacy `frontend` Dockerfile.
- Added basic Docker logging and restart policies.

---

## Local development (Node.js)

Prerequisites
- Node.js v16+ (install if missing)
- npm (bundled with Node)
- MongoDB running locally (or use Docker Compose)

Start backend

```powershell
cd backend
npm install
copy ..\.env.example .env
# (edit .env if you want custom values)
npm start
```

Start frontend

```powershell
cd frontend
npm install
npm start
```

Open: http://localhost:3000 — the frontend proxies API calls to `http://localhost:5000`.

### One-command dev start (Windows)
Run the helper to start both services in background (PowerShell):

```powershell
.\scripts\start-all.ps1
```

Or on macOS/Linux:

```bash
./scripts/start-all.sh
```

Logs (bash helper) are written to `logs/backend.log` and `logs/frontend.log`.

---

## Docker (recommended for local reproducible runs)

Requirements
- Docker Engine / Docker Desktop

Start the full stack (MongoDB + backend + frontend):

```bash
docker compose up --build -d
# check status
docker compose ps
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

Stop and remove containers + volumes:

```bash
docker compose down -v
```

Notes on the Compose file
- Uses `restart: unless-stopped` for auto-restart
- Logging configured with rotation (`max-size: 10m`, `max-file: 3`)
- Healthcheck for MongoDB
- Uses local mounts for easier dev iteration

---

## CI / Publishing

A GitHub Actions workflow at `.github/workflows/build-and-push.yml` builds backend and frontend Docker images and pushes them to GitHub Container Registry (GHCR). The workflow has been updated to build the legacy `./frontend` directory.

Set `GHCR_OWNER` in repo secrets if you want to customize image names.

---

## Project structure (trimmed)

```
├── backend/           # Node.js/Express API
├── frontend/          # Legacy React (CRA) app
├── docker-compose.yml # Single compose file to run full stack
├── scripts/           # start helpers
├── .github/workflows/ # CI workflows
├── .env.example       # example env vars
```

---

## Troubleshooting
- If `docker compose up` fails, ensure Docker is running and ports `3000/5000/27017` are free.
- If the frontend proxy shows `ECONNREFUSED`, ensure the backend is running on port 5000.
- For Node.js issues, verify Node is on PATH: `node --version`.

If you'd like, I can also:
- Restore `frontend_modern` from git history (if you want it back alongside the legacy app).
- Add a single `Makefile` or npm top-level script to start everything.

---

**Updated**: November 17, 2025
