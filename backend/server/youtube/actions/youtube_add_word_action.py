from typing import List

from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled

from server.youtube.adapters.youtube_search_adapter import YouTubeSearchAdapter
from server.youtube.dtos.youtube_video_dto import YouTubeVideoDto
from server.youtube.models import YoutubeVideo, YoutubeWord


class YoutubeAddWordAction:
    def __init__(self):
        self.youtube_search_adapter = YouTubeSearchAdapter()

    def execute(self, youtube_word: str, languages: List[str]) -> List[YoutubeWord]:
        """
        Search YouTube for videos containing the given word, associate them with timestamped URLs, and save to the DB.
        """
        next_page_token = None
        youtube_words_list = []

        while len(youtube_words_list) < 10:
            youtube_search_dto = self.youtube_search_adapter.search(
                youtube_word=youtube_word, next_page_token=next_page_token
            )
            youtube_words_list.extend(
                self._process_search_results(
                    youtube_video_dto_list=youtube_search_dto.items,
                    youtube_word=youtube_word,
                    languages=languages
                )
            )
            next_page_token = youtube_search_dto.next_page_token
            if not next_page_token:
                break

        return YoutubeWord.objects.bulk_create(youtube_words_list)

    def _process_search_results(
            self, youtube_video_dto_list: List[YouTubeVideoDto], youtube_word: str, languages: List[str]
    ) -> List[YoutubeWord]:
        """
        Process YouTube search results: filter, save, and prepare words.
        """
        filtered_videos_dto = self._filter_existing_videos(youtube_video_dto_list)
        saved_videos = self._save_youtube_videos(filtered_videos_dto, languages)
        return self._prepare_youtube_words(saved_videos, youtube_word)

    def _filter_existing_videos(self, youtube_video_dto_list: List[YouTubeVideoDto]) -> List[YouTubeVideoDto]:
        """
        Exclude videos that already exist in the database.
        """
        existing_ids = set(
            YoutubeVideo.objects.filter(
                video_id__in=[dto.id.video_id for dto in youtube_video_dto_list]
            ).values_list("video_id", flat=True)
        )
        return [dto for dto in youtube_video_dto_list if dto.id.video_id not in existing_ids]

    def _save_youtube_videos(
            self, youtube_videos_dto: List[YouTubeVideoDto], languages: List[str]
    ) -> List[YoutubeVideo]:
        """
        Save new YouTube videos to the database.
        """
        youtube_videos = []
        for dto in youtube_videos_dto:
            try:
                transcript = YouTubeTranscriptApi.get_transcript(dto.id.video_id, languages=languages)
                youtube_videos.append(
                    YoutubeVideo(
                        video_id=dto.id.video_id,
                        title=dto.snippet.title,
                        description=dto.snippet.description,
                        transcript=transcript,
                    )
                )
            except (NoTranscriptFound, TranscriptsDisabled):
                continue
        return YoutubeVideo.objects.bulk_create(youtube_videos)

    def _prepare_youtube_words(self, youtube_videos: List[YoutubeVideo], youtube_word: str) -> List[YoutubeWord]:
        """
        Prepare YouTubeWord objects from video transcripts.
        """
        youtube_words = []
        for video in youtube_videos:
            for entry in video.transcript or []:
                if youtube_word.lower() in entry["text"].lower():
                    youtube_words.append(
                        YoutubeWord(
                            word=youtube_word,
                            timestamped_url=f"https://www.youtube.com/watch?v={video.video_id}&t={int(entry['start'])}s",
                            video=video,
                        )
                    )
        return youtube_words
