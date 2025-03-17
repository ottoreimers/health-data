# sleep/api_views.py
from django.db.models import Avg, Count, Sum
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import RestingHR, Sleep, SleepEvent, Stress
from .serializers import (
    RestingHRSerializer,
    SleepEventSerializer,
    SleepSerializer,
    StressSerializer,
)


class SleepViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for sleep data
    """

    queryset = Sleep.objects.all().order_by("-day")
    serializer_class = SleepSerializer


class SleepEventViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for sleep events
    """

    queryset = SleepEvent.objects.all().order_by("-timestamp")
    serializer_class = SleepEventSerializer


class RestingHRViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for resting heart rate data
    """

    queryset = RestingHR.objects.all().order_by("-day")
    serializer_class = RestingHRSerializer


class StressViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for stress data
    """

    queryset = Stress.objects.all().order_by("-timestamp")
    serializer_class = StressSerializer


@api_view(["GET"])
def latest_sleep(request):
    """
    Get the latest sleep data
    """
    try:
        latest = Sleep.objects.latest("day")
        serializer = SleepSerializer(latest)
        return Response(serializer.data)
    except Sleep.DoesNotExist:
        return Response({"error": "No sleep data found"}, status=404)


def sleep_stats(request):
    """
    Get sleep statistics
    """
    # Convert TimeField to minutes for easier calculations
    from django.db.models import F
    from django.db.models.functions import Extract

    # Get average sleep metrics (last 30 days)
    recent_sleep = Sleep.objects.order_by("-day")[:30]

    # Total sleep time average in minutes
    # Note: This is tricky with TimeField - we may need to convert to minutes in Python
    sleep_data = list(
        recent_sleep.values(
            "day",
            "total_sleep",
            "deep_sleep",
            "light_sleep",
            "rem_sleep",
            "awake",
            "score",
        )
    )

    # Process the time values to get averages
    import datetime

    def time_to_minutes(time_obj):
        if not time_obj:
            return 0
        return time_obj.hour * 60 + time_obj.minute

    # Calculate averages manually
    total_days = len(sleep_data)
    if total_days > 0:
        avg_total = (
            sum(time_to_minutes(day["total_sleep"]) for day in sleep_data) / total_days
        )
        avg_deep = (
            sum(time_to_minutes(day["deep_sleep"]) for day in sleep_data) / total_days
        )
        avg_light = (
            sum(time_to_minutes(day["light_sleep"]) for day in sleep_data) / total_days
        )
        avg_rem = (
            sum(time_to_minutes(day["rem_sleep"]) for day in sleep_data) / total_days
        )
        avg_awake = (
            sum(time_to_minutes(day["awake"]) for day in sleep_data) / total_days
        )
        avg_score = sum(day["score"] for day in sleep_data if day["score"]) / sum(
            1 for day in sleep_data if day["score"]
        )
    else:
        avg_total = avg_deep = avg_light = avg_rem = avg_awake = avg_score = 0

    return Response(
        {
            "sleep_data": sleep_data,
            "averages": {
                "total_sleep_minutes": avg_total,
                "deep_sleep_minutes": avg_deep,
                "light_sleep_minutes": avg_light,
                "rem_sleep_minutes": avg_rem,
                "awake_minutes": avg_awake,
                "score": avg_score,
            },
        }
    )
