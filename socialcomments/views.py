from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Comment
from .serializers import CommentSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def comments(request):

    if request.method == "GET":
        post_id = request.query_params.get("post")

        if post_id:
            comment_list = Comment.objects.filter(
                post_id=post_id
            ).order_by("created_at")
        else:
            comment_list = Comment.objects.all().order_by("-created_at")

        serializer = CommentSerializer(
            comment_list,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    if request.method == "POST":
        serializer = CommentSerializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save(author=request.user)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )