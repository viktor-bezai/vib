from dataclasses import dataclass
from typing import List

from server.youtube.dtos.youtube_video_dto import YouTubeVideoDto


@dataclass
class YouTubeSearchPageInfoDTO:
    total_results: int
    results_per_page: int


@dataclass
class YouTubeSearchDTO:
    kind: str
    etag: str
    next_page_token: str
    region_code: str
    page_info: YouTubeSearchPageInfoDTO
    items: List[YouTubeVideoDto]
