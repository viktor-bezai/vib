from dataclasses import dataclass


@dataclass
class YouTubeVideoSnippetDto:
    published_at: str
    channel_id: str
    title: str
    description: str
    thumbnail: dict
    channel_title: str
    live_broadcast_content: str
    publish_time: str


@dataclass
class YouTubeVideoIdDto:
    kind: str
    video_id: str


@dataclass
class YouTubeVideoDto:
    kind: str
    etag: str
    id: YouTubeVideoIdDto
    snippet: YouTubeVideoSnippetDto
