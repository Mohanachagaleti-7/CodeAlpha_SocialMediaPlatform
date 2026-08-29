from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Like, Follow
from .serializers import LikeSerializer, FollowSerializer

@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def likes(request):

    if request.method == "GET":
        post_id = request.query_params.get("post")

        if post_id:
            like_list = Like.objects.filter(
                post_id=post_id
            ).order_by("-created_at")
        else:
            like_list = Like.objects.all().order_by("-created_at")

        serializer = LikeSerializer(
            like_list,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    if request.method == "POST":
        post_id = request.data.get("post")

        if not post_id:
            return Response(
                {"error": "Post ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Like.objects.filter(
            user=request.user,
            post_id=post_id
        ).exists():
            return Response(
                {"error": "You already liked this post."},
                status=status.HTTP_400_BAD_REQUEST
            )

        like = Like.objects.create(
            user=request.user,
            post_id=post_id
        )

        return Response(
            LikeSerializer(like).data,
            status=status.HTTP_201_CREATED
        )

    if request.method == "DELETE":
        post_id = request.data.get("post")

        if not post_id:
            return Response(
                {"error": "Post ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        like = Like.objects.filter(
            user=request.user,
            post_id=post_id
        ).first()

        if not like:
            return Response(
                {"error": "You have not liked this post."},
                status=status.HTTP_404_NOT_FOUND
            )

        like.delete()

        return Response(
            {"message": "Post unliked successfully."},
            status=status.HTTP_200_OK
        )
@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def follows(request):

    if request.method == "GET":
        following = Follow.objects.filter(
            follower=request.user
        )

        serializer = FollowSerializer(
            following,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    if request.method == "POST":
        following_id = request.data.get("following")

        if not following_id:
            return Response(
                {"error": "User ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if int(following_id) == request.user.id:
            return Response(
                {"error": "You cannot follow yourself."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Follow.objects.filter(
            follower=request.user,
            following_id=following_id
        ).exists():
            return Response(
                {"error": "You already follow this user."},
                status=status.HTTP_400_BAD_REQUEST
            )

        follow = Follow.objects.create(
            follower=request.user,
            following_id=following_id
        )

        return Response(
            FollowSerializer(follow).data,
            status=status.HTTP_201_CREATED
        )

    if request.method == "DELETE":
        following_id = request.data.get("following")

        if not following_id:
            return Response(
                {"error": "User ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        follow = Follow.objects.filter(
            follower=request.user,
            following_id=following_id
        ).first()

        if not follow:
            return Response(
                {"error": "You are not following this user."},
                status=status.HTTP_404_NOT_FOUND
            )

        follow.delete()

        return Response(
            {"message": "Unfollowed successfully."},
            status=status.HTTP_200_OK
        )