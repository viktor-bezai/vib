from server.youtube.actions.youtube_add_videos_action import YoutubeAddVideosAction
from server.youtube.actions.youtube_add_word_action import YouTubeAddWordAction
from server.youtube.models import YoutubeWord


class YouTubeAddWordService:
    def __init__(self):
        self.youtube_add_video_action = YoutubeAddVideosAction()
        self.youtube_add_word_action = YouTubeAddWordAction()

    def add_word(self, youtube_word: str, force=False):
        if force:
            self.youtube_add_video_action.execute(youtube_word=youtube_word)

        youtube_words = self.youtube_add_word_action.execute(youtube_word=youtube_word)
        if len(youtube_words) < 20:
            self.youtube_add_video_action.execute(youtube_word=youtube_word)
            self.youtube_add_word_action.execute(youtube_word=youtube_word)
            youtube_words = YoutubeWord.objects.filter(word=youtube_word)

        return youtube_words
