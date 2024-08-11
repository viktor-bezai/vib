from rest_framework import serializers


class SearchVideoSerializer(serializers.Serializer):
    channel_id = serializers.CharField(max_length=100)
    channel_title = serializers.CharField(max_length=200)
    title = serializers.CharField(max_length=200)
    timestamped_url = serializers.CharField(max_length=200)


class SearchSerializer(serializers.Serializer):
    videos = SearchVideoSerializer(many=True)
    next_page_token = serializers.CharField(max_length=100, allow_null=True)
