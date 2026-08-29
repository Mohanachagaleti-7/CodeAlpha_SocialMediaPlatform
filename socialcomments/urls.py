from django.urls import path
from .views import comments

urlpatterns = [
    path("", comments, name="comments"),
]