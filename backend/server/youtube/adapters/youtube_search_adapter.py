from server.youtube.api.youtube_search_api import YoutubeSearchAPI
from server.youtube.assemblers.youtube_search_assembler import YouTubeSearchAssembler
from server.youtube.dtos.youtube_search_dto import YouTubeSearchDTO


class YouTubeSearchAdapter:
    def __init__(self):
        self.youtube_search_api = YoutubeSearchAPI()
        self.youtube_search_assembler = YouTubeSearchAssembler()

    def search(self, youtube_word: str, next_page_token: str = None) -> YouTubeSearchDTO:
        """
        Search YouTube using the API and assemble the response into a DTO.
        """
        response = self.youtube_search_api.search(youtube_word, page_token=next_page_token)
        return self.youtube_search_assembler.assemble_response(response)
