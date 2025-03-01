from django.contrib import admin


class YoutubeWordAdmin(admin.ModelAdmin):
    list_display = ["id", "word", "timestamped_url"]
    list_display_links = ["id", "word"]
    search_fields = ["word"]
