from drf_yasg.utils import swagger_auto_schema
from googleapiclient.errors import HttpError
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from server.youtube.models import YoutubeWord
from server.youtube.serializers.bad_request_response_serializer import BadRequestResponseSerializer
from server.youtube.serializers.youtube_word_request_serializer import YoutubeWordRequestSerializer
from server.youtube.serializers.youtube_word_response_serializer import YoutubeWordResponseSerializer
from server.youtube.services.youtube_add_word_service import YouTubeAddWordService


class YoutubeWordView(APIView):
    @swagger_auto_schema(
        responses={
            200: YoutubeWordResponseSerializer(),
            400: BadRequestResponseSerializer(),
        },
        operation_summary='Get list of YoutubeWord',
        query_serializer=YoutubeWordRequestSerializer()
    )
    def get(self, request):
        language = "ENG"
        request_serializer = YoutubeWordRequestSerializer(data=request.query_params)

        try:
            request_serializer.is_valid(raise_exception=True)
            word = request_serializer.validated_data["word"]

            youtube_words = YoutubeWord.objects.filter(word=word, language=language)

            response_serializer = YoutubeWordResponseSerializer(youtube_words, many=True)
            return Response(response_serializer.data, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        responses={
            200: YoutubeWordResponseSerializer(),
            400: BadRequestResponseSerializer(),
        },
        operation_summary='Adding YoutubeWords to the Database',
        request_body=YoutubeWordRequestSerializer(),
    )
    def post(self, request):
        languages = ["en"]
        request_serializer = YoutubeWordRequestSerializer(data=request.data)

        request_serializer.is_valid(raise_exception=True)
        youtube_word = request_serializer.validated_data["word"]

        youtube_add_word_service = YouTubeAddWordService()
        youtube_words = youtube_add_word_service.add_word(youtube_word=youtube_word)

        response_serializer = YoutubeWordResponseSerializer(youtube_words, many=True)
        return Response(response_serializer.data, status=status.HTTP_200_OK)

