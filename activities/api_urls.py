from django.urls import include, path
from rest_framework import routers

from . import api_views

router = routers.DefaultRouter()
router.register(r"activities", api_views.ActivityViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("stats/", api_views.activity_stats, name="api-activity-stats"),
]
