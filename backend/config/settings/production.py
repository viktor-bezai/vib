"""Production: viktorbezai.com. Compose sets the secrets and the database through .env."""

from config.settings.base import *

DEBUG = False

ALLOWED_HOSTS = [
    "viktorbezai.com",
    "www.viktorbezai.com",
    # Legacy hosts: kept while their 301s are still live (at least 12 months).
    "viktorbezai.online",
    "www.viktorbezai.online",
    "vib-backend",
    "localhost",
]
CORS_ALLOWED_ORIGINS = [
    "https://viktorbezai.com",
    "https://www.viktorbezai.com",
]
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS

CSRF_COOKIE_SECURE = True
