from django.contrib.postgres.indexes import GinIndex
from django.db import models
from django.db.models import JSONField


class YoutubeVideo(models.Model):
    video_id = models.CharField(max_length=300, db_index=True, unique=True)
    title = models.CharField(max_length=300)
    description = models.TextField()
    transcript = JSONField(blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'youtube_video'
        indexes = [
            GinIndex(fields=['transcript']),
        ]

    @classmethod
    def search_videos_by_transcript(cls, youtube_word: str):
        """
        Perform a whole word match search inside transcript JSON field.
        Works only for PostgreSQL JSONB fields.
        """

        # Define regex pattern to match whole words (including punctuation and spaces)
        regex_pattern = rf'\m{youtube_word}\M'

        query = """
                SELECT * FROM youtube_video
                WHERE EXISTS (
                    SELECT 1 FROM jsonb_array_elements(transcript) AS elem
                    WHERE elem->>'text' ~* %s
                )
            """
        return cls.objects.raw(query, [regex_pattern])
