from django.urls import path

from accounts.views.resume_view import ResumeDownloadView


app_name = "accounts"

urlpatterns = [
    path(
        "resume/<str:email>/download/",
        ResumeDownloadView.as_view(),
        name="resume-download",
    ),
]
