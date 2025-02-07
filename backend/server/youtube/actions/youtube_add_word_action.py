import re
from django.db import transaction
from server.youtube.models import YoutubeVideo, YoutubeWord


class YouTubeAddWordAction:
    def execute(self, youtube_word: str):
        """
        Search for the given youtube_word in video transcripts and create YoutubeWord entries
        only if they do not already exist in the database.
        """
        youtube_videos = YoutubeVideo.search_videos_by_transcript(youtube_word=youtube_word)

        # Store existing YoutubeWord records to avoid duplicates
        existing_words = set(
            YoutubeWord.objects.filter(word=youtube_word).values_list("word", "timestamped_url", "video_id")
        )

        # Use the same regex pattern for whole word matching
        regex_pattern = re.compile(rf'\b{re.escape(youtube_word)}\b', re.IGNORECASE)

        new_words = []
        for youtube_video in youtube_videos:
            for entry in youtube_video.transcript or []:
                if regex_pattern.search(entry["text"]):
                    timestamped_url = f"https://www.youtube.com/watch?v={youtube_video.video_id}&t={int(entry['start'])}s"

                    # Ensure uniqueness before inserting
                    key = (youtube_word, timestamped_url, youtube_video.id)
                    if key not in existing_words:
                        new_words.append(
                            YoutubeWord(
                                word=youtube_word,
                                timestamped_url=timestamped_url,
                                video=youtube_video
                            )
                        )
                        existing_words.add(key)  # Update cache to prevent duplicates

        # Bulk insert only new records
        with transaction.atomic():
            return YoutubeWord.objects.bulk_create(new_words, ignore_conflicts=True)
