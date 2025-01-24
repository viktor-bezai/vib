from rest_framework import serializers


class YoutubeWordRequestSerializer(serializers.Serializer):
    word = serializers.CharField()
