from django.db import models


class YoutubeVideo(models.Model):
    video_id = models.CharField(max_length=300, db_index=True, unique=True)
    title = models.CharField(max_length=300)
    description = models.TextField()

    def __str__(self):
        return self.title
