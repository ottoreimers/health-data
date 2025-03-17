from django.urls import include, path
from rest_framework import routers

from . import api_views

router = routers.DefaultRouter()
router.register(r"sleep", api_views.SleepViewSet)
router.register(r"sleep-events", api_views.SleepEventViewSet)
router.register(r"resting-hr", api_views.RestingHRViewSet)
router.register(r"stress", api_views.StressViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("sleep/stats/", api_views.sleep_stats, name="sleep-stats"),
    path("sleep/latest/", api_views.latest_sleep, name="latest-sleep"),
]
