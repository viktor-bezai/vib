from rest_framework import serializers


class BadRequestResponseSerializer(serializers.Serializer):
    field = serializers.ListField(
        child=serializers.CharField()
    )
