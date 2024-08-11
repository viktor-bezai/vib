from xml.etree.ElementTree import ParseError
from drf_yasg import openapi
from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from googleapiclient.discovery import build
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled

from backend.search.serializers.search_serializer import SearchVideoSerializer, SearchSerializer
from backend.youtube.adapters.youtube_search_adapter import YouTubeSearchAdapter


class SearchView(APIView):
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'next_page_token',
                openapi.IN_QUERY,
                description="Token for getting next page",
                type=openapi.TYPE_STRING,
                required=False
            ),
        ]
    )
    def get(self, request, query):
        next_page_token = request.query_params.get('next_page_token')

        youtube_search_adapter = YouTubeSearchAdapter()
        youtube_search_dto = youtube_search_adapter.search(query=query, next_page_token=next_page_token)

        results = []
        for youtube_video in youtube_search_dto.items:
            timestamped_url = self._get_timestamped_url(youtube_video.id.video_id, query)
            if timestamped_url:
                timestamped_video = {
                    "channel_id": youtube_video.snippet.channel_id,
                    "channel_title": youtube_video.snippet.channel_title,
                    "title": youtube_video.snippet.title,
                    "timestamped_url": timestamped_url,
                }
                search_video_serializer = SearchVideoSerializer(data=timestamped_video)
                results.append(timestamped_video)

        search = {
            "videos": results,
            "next_page_token": youtube_search_dto.next_page_token,
        }
        search_serializer = SearchSerializer(data=search)
        search_serializer.is_valid(raise_exception=True)

        return Response(search_serializer.data, status=status.HTTP_200_OK)

    def _get_timestamped_url(self, video_id, word):
        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            for entry in transcript:
                if word.lower() in entry['text'].lower():
                    timestamp = int(entry['start'])
                    return f"https://www.youtube.com/watch?v={video_id}&t={timestamp}s"
        except NoTranscriptFound:
            return None
        except TranscriptsDisabled:
            return None
        except ParseError:
            return None

        return None
