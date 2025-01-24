from server.youtube.api.youtube_authentication_api import YouTubeAuthenticationAPI


class YoutubeSearchAPI(YouTubeAuthenticationAPI):
    def search(self, youtube_word, page_token=None):
        request = self.client.search().list(
            part="snippet",
            maxResults=10,
            q=youtube_word,
            type="video",
            pageToken=page_token,
        )
        response = request.execute()

        return response
