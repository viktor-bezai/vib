from xml.etree.ElementTree import ParseError
from typing import Optional, List

from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled

from server.youtube.adapters.youtube_search_adapter import YouTubeSearchAdapter
from server.youtube.models import YoutubeVideo
from server.youtube.models.youtube_word import YoutubeWord


class YoutubeAddWordAction:
    def __init__(self):
        self.youtube_search_adapter = YouTubeSearchAdapter()

    def execute(self, youtube_word: str) -> None:
        """
        Search YouTube for videos containing the given word and associate them with timestamped URLs.
        """
        next_page_token = None
        while True:
            youtube_search_dto = self.youtube_search_adapter.search(youtube_word=youtube_word, next_page_token=next_page_token)

            youtube_videos = self._filter_and_prepare_youtube_videos(items=youtube_search_dto.items)
            YoutubeVideo.objects.bulk_create(youtube_videos)

            youtube_words = self._prepare_youtube_words(youtube_videos, youtube_word)
            if youtube_words:
                YoutubeWord.objects.bulk_create(youtube_words)

            # Stop fetching additional pages if we have 5 or more words or no next page token
            if len(youtube_words) >= 5 or not youtube_search_dto.next_page_token:
                break
            next_page_token = youtube_search_dto.next_page_token

    def _filter_and_prepare_youtube_videos(self, items) -> List[YoutubeVideo]:
        """
        Prepare YoutubeVideo instances for bulk creation, excluding already existing videos.
        """
        existing_video_ids = set(
            YoutubeVideo.objects.filter(
                video_id__in=[item.id.video_id for item in items]
            ).values_list('video_id', flat=True)
        )
        return [
            YoutubeVideo(
                video_id=item.id.video_id,
                title=item.snippet.title,
                description=item.snippet.description,
            )
            for item in items if item.id.video_id not in existing_video_ids
        ]

    def _prepare_youtube_words(self, youtube_videos: List[YoutubeVideo], youtube_word: str) -> List[YoutubeWord]:
        """
        Prepare YoutubeWord instances for bulk creation, linking to videos with timestamped URLs.
        """
        youtube_words = [
            YoutubeWord(
                word=youtube_word,
                timestamped_url=timestamped_url,
                video=youtube_video,
            )
            for youtube_video in youtube_videos
            if (timestamped_url := self._get_timestamped_url(youtube_video.video_id, youtube_word))
        ]
        return youtube_words

    @staticmethod
    def _get_timestamped_url(youtube_video_id: str, youtube_word: str) -> Optional[str]:
        """
        Get a timestamped URL for a video containing the specified word.
        """
        try:
            transcript = YouTubeTranscriptApi.get_transcript(youtube_video_id)
            for entry in transcript:
                if youtube_word.lower() in entry["text"].lower():
                    timestamp = int(entry["start"])
                    return f"https://www.youtube.com/watch?v={youtube_video_id}&t={timestamp}s"
        except (NoTranscriptFound, TranscriptsDisabled, ParseError):
            return None
        return None
