from django.urls import include, path

from server.csrf_token.views.get_csrf_token import get_csrf_token

app_name = 'api_v1'

urlpatterns = [
    path('youtube/', include('server.youtube.urls')),
    path('get-csrf-token/', get_csrf_token, name="get-csrf-token"),
]
