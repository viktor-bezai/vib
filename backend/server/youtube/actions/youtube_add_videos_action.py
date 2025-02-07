from typing import List

from django.conf import settings
from django.db import transaction
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound

from server.youtube.adapters.youtube_search_adapter import YouTubeSearchAdapter
from server.youtube.dtos.youtube_search_dto import YouTubeSearchDTO
from server.youtube.dtos.youtube_video_dto import YouTubeVideoDto
from server.youtube.models import YoutubeWord, YoutubeVideo


class YoutubeAddVideosAction:
    def __init__(self):
        self.youtube_search_adapter = YouTubeSearchAdapter()

    def execute(self, youtube_word: str) -> List[YoutubeWord]:
        """
        Search YouTube for videos containing the given word, associate them with timestamped URLs, and save to the DB.
        """
        new_youtube_videos_to_create = []
        next_page_token = None
        counter = 0

        while len(new_youtube_videos_to_create) < 5 or counter >= 3:
            youtube_search_dto = self.youtube_search_adapter.search(
                youtube_word=youtube_word, next_page_token=next_page_token
            )
            new_youtube_videos_dto = self._exclude_existing_videos(youtube_search_dto=youtube_search_dto)

            for youtube_video_dto in new_youtube_videos_dto:
                proxy_connection = {
                    "https": f"https://{settings.PROXY_USERNAME}:{settings.PROXY_PASS}@{settings.PROXY_HOST}"
                }
                proxies = None if settings.IS_LOCAL else proxy_connection

                try:
                    transcript = YouTubeTranscriptApi.get_transcript(
                        video_id=youtube_video_dto.id.video_id,
                        languages=['en'],
                        proxies=proxies
                    )
                except NoTranscriptFound as e:
                    print("Transcripts are disabled for this video")
                    transcript = None
                except Exception as e:
                    print(f"Error fetching transcript: {e}")
                    transcript = None

                new_youtube_videos_to_create.append(
                    YoutubeVideo(
                        video_id=youtube_video_dto.id.video_id,
                        title=youtube_video_dto.snippet.title,
                        description=youtube_video_dto.snippet.description,
                        transcript=transcript,
                    )
                )

            next_page_token = youtube_search_dto.next_page_token
            counter += 1
            if not next_page_token:
                break
        with transaction.atomic():
            return YoutubeVideo.objects.bulk_create(new_youtube_videos_to_create, ignore_conflicts=True)

    def _exclude_existing_videos(self, youtube_search_dto: YouTubeSearchDTO) -> List[YouTubeVideoDto]:
        """
        Exclude videos that already exist in the database.
        """
        existing_ids = set(
            YoutubeVideo.objects.filter(
                video_id__in=[dto.id.video_id for dto in youtube_search_dto.items]
            ).values_list("video_id", flat=True)
        )
        return [youtube_video_dto for youtube_video_dto in youtube_search_dto.items
                if youtube_video_dto.id.video_id not in existing_ids]
