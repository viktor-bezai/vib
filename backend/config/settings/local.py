"""Local development and CI."""

from pathlib import Path

from dotenv import load_dotenv

# The repo root's .env, loaded before base.py reads the environment. Values already set (by
# Compose or CI) win.
load_dotenv(Path(__file__).resolve().parents[3] / ".env")

from config.settings.base import *  # noqa: E402

# Debug pages list every URL pattern and, on errors, settings and stack traces: local only.
DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "vib-backend", "vib-backend:8000"]
# The dev stack's host ports (docker/docker-compose.yml).
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3200",
    "http://localhost:8200",
]
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS

CSRF_COOKIE_SECURE = False
