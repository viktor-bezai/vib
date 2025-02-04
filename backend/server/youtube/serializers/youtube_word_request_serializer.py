import re

from rest_framework import serializers


class YoutubeWordRequestSerializer(serializers.Serializer):
    word = serializers.CharField()

    def validate_word(self, value):
        words = re.findall(r'\w+', value)

        if len(words) > 2:
            raise serializers.ValidationError("The word field must contain at most two words.")

        return value
