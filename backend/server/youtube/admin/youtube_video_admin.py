from django.contrib import admin


class YoutubeVideoAdmin(admin.ModelAdmin):
    list_display = ["id", "video_id", "title"]
    list_display_links = ["id", "video_id"]
    search_fields = ["video_id"]
