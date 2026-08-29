from rest_framework import serializers
from .models import Like, Follow


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = [
            "id",
            "user",
            "post",
            "created_at",
        ]
        read_only_fields = [
            "user",
            "created_at",
        ]


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = [
            "id",
            "follower",
            "following",
            "created_at",
        ]
        read_only_fields = [
            "follower",
            "created_at",
        ]