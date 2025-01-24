from django.urls import include, path

from server.youtube.views.youtube_word_view import YoutubeWordView

urlpatterns = [
    path('', YoutubeWordView.as_view(), name='api_youtube_word_view'),
]
