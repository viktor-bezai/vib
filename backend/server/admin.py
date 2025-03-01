from django.contrib import admin

from server.youtube.admin.youtube_video_admin import YoutubeVideoAdmin
from server.youtube.admin.youtube_word_admin import YoutubeWordAdmin
from server.youtube.models import YoutubeVideo, YoutubeWord

admin.site.register(YoutubeVideo, YoutubeVideoAdmin)
admin.site.register(YoutubeWord, YoutubeWordAdmin)
