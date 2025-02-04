from rest_framework import serializers


class BadRequestResponseSerializer(serializers.Serializer):
    error = serializers.CharField()
