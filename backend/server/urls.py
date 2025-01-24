from django.urls import include, path

urlpatterns = [
    path('search/', include('server.youtube.urls')),
]
