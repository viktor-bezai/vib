from typing import List

from server.youtube.assemblers.youtube_video_assembler import YouTubeVideoAssembler
from server.youtube.dtos.youtube_video_dto import YouTubeVideoDto


class YouTubeListVideosAssembler(object):
    def __init__(self):
        self.youtube_video_assembler = YouTubeVideoAssembler()

    def assemble_response(self, youtube_videos: List[dict]) -> List[YouTubeVideoDto]:
        youtube_videos_dtos = []
        for youtube_video in youtube_videos:
            youtube_video_dto = self.youtube_video_assembler.assemble_response(youtube_video)
            youtube_videos_dtos.append(youtube_video_dto)

        return youtube_videos_dtos
