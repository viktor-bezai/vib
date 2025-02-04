from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from server.youtube.actions.youtube_add_word_action import YoutubeAddWordAction
from server.youtube.models import YoutubeWord
from server.youtube.serializers.youtube_word_request_serializer import YoutubeWordRequestSerializer
from server.youtube.serializers.youtube_word_response_serializer import YoutubeWordResponseSerializer


class YoutubeWordView(APIView):
    @swagger_auto_schema(
        responses={200: YoutubeWordResponseSerializer()},
        operation_summary='Get list of YoutubeWord',
        query_serializer=YoutubeWordRequestSerializer()
    )
    def get(self, request):
        language = "ENG"
        request_serializer = YoutubeWordRequestSerializer(data=request.query_params)
        request_serializer.is_valid(raise_exception=True)

        word = request_serializer.validated_data["word"]
        youtube_words = YoutubeWord.objects.filter(word=word, language=language)

        response_serializer = YoutubeWordResponseSerializer(youtube_words, many=True)
        return Response(response_serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        responses={200: YoutubeWordResponseSerializer()},
        operation_summary='Adding YoutubeWords to the Database',
        request_body=YoutubeWordRequestSerializer(),
    )
    def post(self, request):
        languages = ["en"]
        request_serializer = YoutubeWordRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)

        word = request_serializer.validated_data["word"]

        youtube_add_word_action = YoutubeAddWordAction()
        youtube_words = youtube_add_word_action.execute(youtube_word=word, languages=languages)

        response_serializer = YoutubeWordResponseSerializer(youtube_words, many=True)
        return Response(response_serializer.data, status=status.HTTP_200_OK)
