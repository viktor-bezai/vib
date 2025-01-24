from rest_framework import serializers

from server.youtube.models import YoutubeWord


class YoutubeWordResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = YoutubeWord
