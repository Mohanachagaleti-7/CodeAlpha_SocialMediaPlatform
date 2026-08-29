from django.urls import path
from .views import likes, follows

urlpatterns = [
    path("", likes, name="likes"),
    path("follow/", follows, name="follows"),
]