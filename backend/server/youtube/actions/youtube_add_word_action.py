from typing import List

from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled

from server.youtube.adapters.youtube_search_adapter import YouTubeSearchAdapter
from server.youtube.dtos.youtube_video_dto import YouTubeVideoDto
from server.youtube.models import YoutubeVideo
from server.youtube.models.youtube_word import YoutubeWord


class YoutubeAddWordAction:
    def __init__(self):
        self.youtube_search_adapter = YouTubeSearchAdapter()

    def execute(self, youtube_word: str, languages: List[str]) -> List[YoutubeWord]:
        """
        Search YouTube for videos containing the given word, associate them with timestamped URLs and
        save to the DB.
        """
        next_page_token = None
        youtube_words_list = []
        while len(youtube_words_list) < 10:
            youtube_search_dto = self.youtube_search_adapter.search(
                youtube_word=youtube_word, next_page_token=next_page_token
            )

            filtered_youtube_videos_dto = self._filter_existing(youtube_video_dto_list=youtube_search_dto.items)
            youtube_videos = self._save_youtube_videos(
                youtube_videos_dto=filtered_youtube_videos_dto,
                languages=languages
            )

            youtube_words = self._prepare_youtube_words(
                youtube_videos=youtube_videos, youtube_word=youtube_word
            )
            youtube_words_list.extend(youtube_words)
            next_page_token = youtube_search_dto.next_page_token
            if next_page_token is None:
                break

        created_youtube_words = YoutubeWord.objects.bulk_create(youtube_words)
        return created_youtube_words

    def _filter_existing(self, youtube_video_dto_list: List[YouTubeVideoDto]) -> List[YouTubeVideoDto]:
        """
        Excluding already existing videos in the Database.
        """
        existing_videos = set(
            YoutubeVideo.objects.filter(
                video_id__in=[youtube_video_dto.id.video_id for youtube_video_dto in youtube_video_dto_list]
            ).values_list('video_id', flat=True)
        )

        filtered_youtube_videos = [
            youtube_video_dto for youtube_video_dto in youtube_video_dto_list
            if youtube_video_dto.id.video_id not in existing_videos
        ]

        return filtered_youtube_videos

    def _save_youtube_videos(
            self,
            youtube_videos_dto: List[YouTubeVideoDto],
            languages: List[str]
    ) -> List[YoutubeVideo]:
        """
        Bulk creation YoutubeVideo.
        """
        youtube_videos_list = []

        for youtube_video_dto in youtube_videos_dto:
            youtube_video_id = youtube_video_dto.id.video_id

            try:
                transcript = YouTubeTranscriptApi.get_transcript(
                    video_id=youtube_video_id,
                    languages=languages,
                )

                youtube_videos_list.append(
                    YoutubeVideo(
                        video_id=youtube_video_id,
                        title=youtube_video_dto.snippet.title,
                        description=youtube_video_dto.snippet.description,
                        transcript=transcript,
                    )
                )
            except TranscriptsDisabled:
                pass
            except NoTranscriptFound:
                pass

        youtube_videos = YoutubeVideo.objects.bulk_create(youtube_videos_list)

        return youtube_videos

    def _prepare_youtube_words(self, youtube_videos: List[YoutubeVideo], youtube_word: str) -> List[YoutubeWord]:
        """
        Prepare YoutubeWord instances for bulk creation, linking to videos with timestamped URLs.
        """
        youtube_words_list = []
        timestamped_url = None

        for youtube_video in youtube_videos:
            transcript = youtube_video.transcript

            if transcript:
                for entry in transcript:
                    if youtube_word.lower() in entry["text"].lower():
                        timestamp = int(entry["start"])
                        timestamped_url = f"https://www.youtube.com/watch?v={youtube_video.video_id}&t={timestamp}s"

                        youtube_words_list.append(
                            YoutubeWord(
                                word=youtube_word,
                                timestamped_url=timestamped_url,
                                video=youtube_video,
                            )
                        )

        return youtube_words_list
