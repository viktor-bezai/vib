from backend.youtube.dtos.youtube_video_dto import YouTubeVideoDto, YouTubeVideoIdDto, YouTubeVideoSnippetDto


class YouTubeVideoAssembler(object):
    def assemble_response(self, youtube_video: dict) -> YouTubeVideoDto:
        youtube_video_id_dto = YouTubeVideoIdDto(
            kind=youtube_video.get('id').get('kind'),
            video_id=youtube_video.get('id').get('videoId'),
        )

        youtube_video_snippet_dto = YouTubeVideoSnippetDto(
            published_at=youtube_video.get('snippet').get('publishedAt'),
            channel_id=youtube_video.get('snippet').get('channelId'),
            title=youtube_video.get('snippet').get('title'),
            description=youtube_video.get('snippet').get('description'),
            thumbnail=youtube_video.get('snippet').get('thumbnail'),
            channel_title=youtube_video.get('snippet').get('channelTitle'),
            live_broadcast_content=youtube_video.get('snippet').get('liveBroadcastContent'),
            publish_time=youtube_video.get('snippet').get('publishTime'),
        )

        youtube_video_dto = YouTubeVideoDto(
            kind=youtube_video.get('kind'),
            etag=youtube_video.get('etag'),
            id=youtube_video_id_dto,
            snippet=youtube_video_snippet_dto,
        )

        return youtube_video_dto
