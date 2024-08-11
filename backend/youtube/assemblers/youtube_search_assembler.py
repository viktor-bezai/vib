from backend.youtube.assemblers.youtube_list_videos_assembler import YouTubeListVideosAssembler
from backend.youtube.dtos.youtube_search_dto import YouTubeSearchDTO, YouTubeSearchPageInfoDTO


class YouTubeSearchAssembler(object):
    def __init__(self):
        self.youtube_list_videos_assembler = YouTubeListVideosAssembler()

    def assemble_response(self, youtube_search: dict) -> YouTubeSearchDTO:
        page_info = YouTubeSearchPageInfoDTO(
            total_results=youtube_search.get("pageInfo").get("totalResults"),
            results_per_page=youtube_search.get("pageInfo").get("resultsPerPage"),
        )

        items = self.youtube_list_videos_assembler.assemble_response(youtube_videos=youtube_search.get("items"))

        return YouTubeSearchDTO(
            kind=youtube_search.get("kind"),
            etag=youtube_search.get("etag"),
            next_page_token=youtube_search.get("next_page_token"),
            region_code=youtube_search.get("region_code"),
            page_info=page_info,
            items=items,
        )
