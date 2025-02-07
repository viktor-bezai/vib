from server.youtube.actions.youtube_add_videos_action import YoutubeAddVideosAction
from server.youtube.actions.youtube_add_word_action import YouTubeAddWordAction


class YouTubeAddWordService:
    def __init__(self):
        self.youtube_add_video_action = YoutubeAddVideosAction()
        self.youtube_add_word_action = YouTubeAddWordAction()

    def add_word(self, youtube_word: str):
        self.youtube_add_video_action.execute(youtube_word=youtube_word)
        youtube_words = self.youtube_add_word_action.execute(youtube_word=youtube_word)

        return youtube_words
