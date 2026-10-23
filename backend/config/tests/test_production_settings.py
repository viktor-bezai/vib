"""Pins the production-only settings, which no other test runs under."""

import importlib
import os
import sys
from unittest.mock import patch

from django.test import SimpleTestCase


def _load_production():
    """Import base and production fresh, as a server start would."""
    with patch.dict(os.environ, {"SECRET_KEY": "test"}):
        for name in ("config.settings.production", "config.settings.base"):
            sys.modules.pop(name, None)
        try:
            return importlib.import_module("config.settings.production")
        finally:
            sys.modules.pop("config.settings.production", None)


class ProductionSettingsTests(SimpleTestCase):
    def test_production_is_locked_down(self):
        production = _load_production()
        # Debug pages would show every URL pattern, settings and stack traces to anyone.
        self.assertFalse(production.DEBUG)
        self.assertTrue(production.CSRF_COOKIE_SECURE)
        self.assertNotIn("*", production.ALLOWED_HOSTS)
        self.assertIn("viktorbezai.com", production.ALLOWED_HOSTS)
