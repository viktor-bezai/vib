from django.db import models

from backend.video.models.video import Video


class Word(models.Model):
    ENGLISH = "ENG"
    LANGUAGE_CHOICES = {
        ENGLISH: "English",
    }

    word = models.CharField(max_length=100)
    language = models.CharField(max_length=3, choices=LANGUAGE_CHOICES, default=ENGLISH)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    timestamp = models.CharField(max_length=100)
