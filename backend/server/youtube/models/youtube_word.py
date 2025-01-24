from django.db import models

from server.youtube.models.youtube_video import YoutubeVideo


class YoutubeWord(models.Model):
    ENGLISH = "ENG"
    LANGUAGE_CHOICES = {
        ENGLISH: "English",
    }

    word = models.CharField(max_length=100, db_index=True)
    language = models.CharField(max_length=3, choices=LANGUAGE_CHOICES, default=ENGLISH)
    timestamped_url = models.CharField(max_length=500)
    video = models.ForeignKey(YoutubeVideo, on_delete=models.CASCADE)
