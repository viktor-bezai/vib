from django.urls import path

from backend.search.views.search_view import SearchView

urlpatterns = [
    path('<str:query>/', SearchView.as_view(), name='api-search'),
]
