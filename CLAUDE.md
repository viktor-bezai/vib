# CLAUDE.md

VIB is Viktor Bezai's personal site: who he is, his projects (EnvolPrep, Anna-Egypt) and his
resume. It follows EnvolPrep's setup (CI, review, deploy gate, Docker layout), so the same habits
work in all of Viktor's projects.

**Production**: https://viktorbezai.com (viktorbezai.online redirects there)

## General Principles

- **Clean over simple.** Choose the cleanest solution, not the quickest or the shortest. Clear names, small focused units, one home for each rule. Skip an abstraction only when it has a single user and no real second case.
- **Useful tests, not more tests.** Each test guards a real failure that a user or a later change could cause. Test behaviour through the public surface (API, page), not private details. No tests of the framework, of constants or of plain wiring.
- Do not change fields, default values, or make edits beyond what was explicitly requested. Ask first.
- Comments explain *why*, not *what*. Docstrings for classes and public functions. Keep inline comments to one line.
- When adding a library, check and use the latest stable version.
- **Every claim on the site must be true.** Experience, skills and project facts come from LinkedIn or from work that can be shown. Never add a skill, number or date from memory.
- **Privacy:** never show more personal data than Viktor already shows on the site, and never log it.
- **Writing style:** simple English, short sentences. Never use em-dashes; use "-".

## Code Style

- Absolute imports only (`accounts.models...` in Python, `@/...` in TypeScript). All imports at the top.
- Package-based Django apps: `models/`, `admin/`, `serializers/`, `views/`, `managers/`, each with an `__init__.py` that exports its classes.
- DRF: `serializer.is_valid(raise_exception=True)`, `query_params` over `request.GET`, `select_related` / `prefetch_related` against N+1 queries. Every endpoint is described for drf-spectacular (CI validates the schema with `--fail-on-warn`).
- **One home for site facts.** The domain, name and role live in `frontend/src/constants/site.ts`; the projects in `projects.ts`; career, skills, education and languages in `profile.ts`. Pages, the sitemap and the JSON-LD (`utils/structuredData.ts`) read from there. Never repeat a fact in a page.
- Styles are CSS modules in `frontend/src/styles/`.

## Contribution flow

- **Never push directly to `master`.** Flow: feature branch -> PR -> `preview` -> release PR -> `master` -> deploy.
- **CI runs tests only on release PRs into `master`** (to save Actions minutes, as in EnvolPrep). A PR into `preview` runs only `Lint (Ruff + Prettier)` and the Claude review, so **run `./scripts/check-local.sh` before opening or updating one** (add `--build` when routes, `next.config.ts` or dependencies change). It runs every CI check on this machine, in about 15 seconds.
- The deploy gate (`.github/actions/verify-release`, shared with EnvolPrep and Egypt) deploys only a merge commit of a release PR whose four checks were green: `Lint (Ruff + Prettier)`, `Frontend lint (ESLint)`, `Backend tests`, `Frontend build`.
- **Merge commits only** (`gh pr merge --merge`). The repo allows nothing else, and the gate refuses a squashed release.
- The Claude review skips a PR that changes `.github/workflows/claude-code-review.yml` itself (a rule of the action), so such a PR needs another review.

## Commands

All development runs through Docker, from the `docker/` folder.

```bash
cd docker && docker compose up -d           # Start the dev stack
cd docker && docker compose logs -f vib-backend
cd docker && docker compose exec vib-backend python manage.py makemigrations
cd docker && docker compose exec vib-backend python manage.py migrate
./scripts/check-local.sh [--build]          # Every CI check, before a PR into preview
./scripts/dev/doctor.sh                     # Is the local stack ready? Says how to fix what is not
./scripts/format-all.sh                     # Prettier + Ruff (Ruff from .venv, see below)
./scripts/format-all.sh --check             # What CI runs
cd frontend && npm run lint                 # ESLint, zero warnings
cd frontend && npm run typecheck            # next typegen + tsc
```

`check-local.sh` and `format-all.sh` use `.venv`, with the packages `backend/requirements-dev.txt` locks.
Create it, and sync it after a pull that changes the lockfile:
`uv venv .venv --python 3.13 && uv pip sync backend/requirements-dev.txt --python .venv/bin/python`.

Dev ports (each project has its own block, so all run at once; BucketList's are never touched):
frontend http://localhost:3200, backend http://localhost:8200, Postgres 5434 (`vib-db`).

## Dependencies

- Backend: add a package to `backend/requirements.in`, then relock from `backend/`:
  `uv pip compile requirements.in -o requirements.txt --python-version 3.13` (and the same for `requirements-dev.in`).
- Dependabot opens weekly grouped updates into `preview`. Majors are planned upgrades, done one at a time.

## Project structure

- **Backend** (`backend/`): Django 5.2 LTS, DRF, drf-spectacular, PostgreSQL. One app, `accounts`: the custom `VIBUser` (email login) and `ResumeDownloadView` (`/api/v1/accounts/resume/<email>/download/`). Health check at `/api/health/`, schema at `/api/schema/`, Swagger at `/api/swagger-ui/`.
- **Frontend** (`frontend/`): Next.js 15 (pages router), React 19, TypeScript, CSS modules. Pages: `/`, `/about`, `/projects`, `/projects/[slug]`, `/sitemap.xml`.
- **Docker** (`docker/`): `docker-compose.yml` (dev), `docker-compose.prod.yml` (prod).
- **Shared scripts**: `scripts/check-local.sh`, `scripts/dev/doctor.sh` and `scripts/prod/exec-backend.sh` are the same file in EnvolPrep, VIB and Egypt; change them in EnvolPrep first. VIB's own part of them is `scripts/project.sh`.

## Deploy and production

- A merge into `master` deploys: GitHub Actions builds `ghcr.io/viktor-bezai/vib-{backend,frontend}:<sha>`, the server only pulls. How it works and how to roll back: `server-configs/DEPLOY.md`.
- One DigitalOcean droplet, shared with EnvolPrep and Egypt. Host nginx (not in Docker) proxies to `vib-backend` (8002) and `vib-frontend` (3002).
- Claude may SSH to the server and run read-only commands (logs, `docker ps`) without asking. Anything that writes to prod (restarts, file edits, data) needs Viktor's approval first.

```bash
ssh root@174.138.113.224
cd /home/deploy/vib
docker compose --project-directory . -f docker/docker-compose.prod.yml ps
scripts/prod/exec-backend.sh python manage.py shell   # Django shell in the live backend
docker logs vib-backend --tail 100
```
