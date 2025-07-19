from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone

from accounts.managers.vib_user_manager import VIBUserManager


class VIBUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, max_length=255)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    
    objects = VIBUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'vib_users'
        verbose_name = 'VIB User'
        verbose_name_plural = 'VIB Users'

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.email

    def get_short_name(self):
        return self.first_name or self.email