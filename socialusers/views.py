
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

from .models import Profile
from .serializers import UserSerializer, ProfileSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not email or not password:
        return Response(
            {"error": "Username, email and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "Email already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    Profile.objects.create(user=user)

    token, created = Token.objects.get_or_create(user=user)

    return Response(
        {
            "message": "Registration successful.",
            "token": token.key,
            "user": UserSerializer(user).data
        },
        status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "Username and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(
        username=username,
        password=password
    )

    if user is None:
        return Response(
            {"error": "Invalid username or password."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    token, created = Token.objects.get_or_create(user=user)

    return Response(
        {
            "message": "Login successful.",
            "token": token.key,
            "user": UserSerializer(user).data
        },
        status=status.HTTP_200_OK
    )


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def profile(request):

    profile_data = Profile.objects.get(user=request.user)

    # GET PROFILE
    if request.method == "GET":
        return Response(
            ProfileSerializer(profile_data).data,
            status=status.HTTP_200_OK
        )

    # UPDATE PROFILE
    if request.method == "PATCH":

        bio = request.data.get("bio")
        profile_image = request.data.get("profile_image")

        if bio is not None:
            profile_data.bio = bio

        if profile_image is not None:
            profile_data.profile_image = profile_image

        profile_data.save()

        return Response(
            ProfileSerializer(profile_data).data,
            status=status.HTTP_200_OK
        )
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def users_list(request):
    users = User.objects.all().order_by("username")
    return Response(
    UserSerializer(users, many=True).data,
    status=status.HTTP_200_OK
)


