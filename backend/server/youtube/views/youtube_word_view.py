import logging
from googleapiclient.errors import HttpError
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema

from server.youtube.actions.youtube_add_word_action import YoutubeAddWordAction
from server.youtube.models import YoutubeWord
from server.youtube.serializers.bad_request_response_serializer import BadRequestResponseSerializer
from server.youtube.serializers.youtube_word_request_serializer import YoutubeWordRequestSerializer
from server.youtube.serializers.youtube_word_response_serializer import YoutubeWordResponseSerializer


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
            if not youtube_words.exists():
                return Response(
                    {"error": "No matching records found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

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

        try:
            request_serializer.is_valid(raise_exception=True)
            word = request_serializer.validated_data["word"]

            youtube_add_word_action = YoutubeAddWordAction()
            youtube_words = youtube_add_word_action.execute(youtube_word=word, languages=languages)

            if not youtube_words:
                return Response(
                    {"error": "Failed to add YouTube words."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            response_serializer = YoutubeWordResponseSerializer(youtube_words, many=True)
            return Response(response_serializer.data, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except HttpError as e:
            return Response({"error": "YouTube API request failed."}, status=status.HTTP_502_BAD_GATEWAY)

        except Exception as e:
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
