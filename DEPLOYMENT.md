Deployment guide

This repository is prepared to build and publish Docker images for the backend and frontend to GitHub Container Registry (GHCR) via GitHub Actions, and to run a production stack using `docker compose`.

What the workflow does

- On push to `main` (or via manual dispatch), `.github/workflows/build-and-push.yml` builds two images and pushes them to GHCR:
  - `ghcr.io/<GHCR_OWNER>/citizen-backend:latest`
  - `ghcr.io/<GHCR_OWNER>/citizen-frontend:latest`

Preparing your GitHub repository

1. Push your code to GitHub (to `main`) — the workflow will run automatically.
2. Ensure GitHub Actions are enabled for your repo.
3. Optionally, grant the workflow permission to publish packages (the `GITHUB_TOKEN` used in the workflow already has `packages: write` scope by default for standard repos).

Deploying the production stack on a server

On your target server (must have Docker Engine / Docker Compose installed):

1. Create an environment file which defines your GHCR owner (replace `your-gh-user` with your GitHub username or org):

```bash
# In the project directory
cat > .env.production <<'EOF'
GHCR_OWNER=your-gh-user
EOF
```

2. Pull images and start the stack:

```powershell
# From repository root
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

3. Verify services:

```powershell
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs --tail 200
```

Notes & troubleshooting

- If you don't want to use GHCR, you can still run the stack locally with the source-based `docker-compose.yml` (it builds from `./backend` and `./frontend_modern`).
- If your hosted environment requires different env vars (JWT secret, DB password, etc.), update the `docker-compose.prod.yml` file or provide them via environment secrets on the host.
- For a development container with hot reload, consider using a separate compose override and a `Dockerfile.dev` (I can add this if you want).

Next steps I can do for you

- Add a small healthcheck for the backend container.
- Create a `docker-compose.override.yml` for development mode (hot reload).
- Add a GitHub Actions workflow that runs the smoke test using the published images.

Tell me which of those you'd like next and I'll implement it.