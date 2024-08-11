from django.conf import settings
from googleapiclient.discovery import build


class YouTubeAuthenticationAPI:
    API_KEY = settings.GOOGLE_API_KEY

    def __init__(self):
        self.client = build('youtube', 'v3', developerKey=self.API_KEY)
