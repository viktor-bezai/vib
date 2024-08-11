from backend.youtube.apis.youtube_search_api import YoutubeSearchAPI
from backend.youtube.assemblers.youtube_search_assembler import YouTubeSearchAssembler
from backend.youtube.dtos.youtube_search_dto import YouTubeSearchDTO


class YouTubeSearchAdapter:
    def __init__(self):
        self.youtube_search_api = YoutubeSearchAPI()
        self.youtube_search_assembler = YouTubeSearchAssembler()

    def search(self, query: str, next_page_token: str) -> YouTubeSearchDTO:
        youtube_search = self.youtube_search_api.search(query=query, page_token=next_page_token)

        youtube_search_dto = self.youtube_search_assembler.assemble_response(youtube_search=youtube_search)

        return youtube_search_dto
