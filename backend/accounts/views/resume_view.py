import os
from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from accounts.models import VIBUser


class ResumeDownloadView(APIView):
    """
    API endpoint to download a user's resume by email.
    """
    
    @extend_schema(
        summary="Download user resume",
        description="Download a user's resume file by providing their email address",
        parameters=[
            OpenApiParameter(
                name='email',
                description='Email address of the user',
                required=True,
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
            ),
        ],
        responses={
            200: OpenApiTypes.BINARY,
            404: {"description": "User not found or no resume available"},
            500: {"description": "Internal server error"},
        },
        tags=['Accounts']
    )
    
    def get(self, request, email):
        try:
            user = VIBUser.objects.get(email=email)
            
            if not user.resume:
                return Response(
                    {"error": "No resume found for this user"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Check if file exists
            if not user.resume.storage.exists(user.resume.name):
                return Response(
                    {"error": "Resume file not found on server"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Get the file extension and set appropriate content type
            file_ext = os.path.splitext(user.resume.name)[1].lower()
            content_types = {
                '.pdf': 'application/pdf',
                '.doc': 'application/msword',
                '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            }
            content_type = content_types.get(file_ext, 'application/octet-stream')
            
            # Generate filename
            filename = f"viktor_bezai_software_developer{file_ext}"
            
            # Return the file as a response
            try:
                file_handle = user.resume.open('rb')
                response = FileResponse(
                    file_handle,
                    content_type=content_type,
                    as_attachment=True,
                )
                response['Content-Disposition'] = f'attachment; filename="{filename}"'
                return response
            except Exception as e:
                return Response(
                    {"error": f"Error reading file: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
        except VIBUser.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )