import re

from rest_framework import serializers


class YoutubeWordRequestSerializer(serializers.Serializer):
    word = serializers.CharField()

    def validate_word(self, value):
        # Trim spaces from left and right
        value = value.strip()
        value = value.lower()

        # Ensure only English letters, spaces, and hyphens are allowed
        if not re.match(r'^[A-Za-z\s\-]+$', value):
            raise serializers.ValidationError("The word field must contain only English letters, spaces, or hyphens.")

        # Extract words and enforce the two-word limit
        words = re.findall(r"[A-Za-z-]+", value)

        if len(words) > 2:
            raise serializers.ValidationError("The word field must contain at most two words.")

        return value
