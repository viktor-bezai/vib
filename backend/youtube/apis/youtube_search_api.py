from backend.youtube.apis.youtube_authentication_api import YouTubeAuthenticationAPI


class YoutubeSearchAPI(YouTubeAuthenticationAPI):
    def search(self, query, page_token=None):
        request = self.client.search().list(
            part="snippet",
            maxResults=10,
            q=query,
            type="video",
            pageToken=page_token,
        )
        response = request.execute()

        return response
