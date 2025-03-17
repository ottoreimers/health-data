from django.db.models import Avg, Count, Sum
from rest_framework import generics, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Activities
from .serializers import ActivityListSerializer, ActivitySerializer


class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows activities to be viewed.
    """

    queryset = Activities.objects.all().order_by("-start_time")
    serializer_class = ActivitySerializer

    def get_serializer_class(self):
        if self.action == "list":
            return ActivityListSerializer
        return ActivitySerializer


@api_view(["GET"])
def activity_stats(request):
    """
    Get activity statistics for dashboard displays
    """
    # Activity counts by type
    activity_types = list(
        Activities.objects.values("type")
        .annotate(count=Count("activity_id"))
        .order_by("-count")[:10]
    )

    # Monthly activity counts
    monthly_stats = list(
        Activities.objects.extra(select={"month": "strftime('%Y-%m', start_time)"})
        .values("month")
        .annotate(count=Count("activity_id"), distance=Sum("distance"))
        .order_by("month")
    )

    # Sport distribution
    sports_distribution = list(
        Activities.objects.values("sport")
        .annotate(count=Count("activity_id"))
        .order_by("-count")[:10]
    )

    # Distance by year
    yearly_distance = list(
        Activities.objects.extra(select={"year": "strftime('%Y', start_time)"})
        .values("year")
        .annotate(distance=Sum("distance"))
        .order_by("year")
    )

    return Response(
        {
            "activity_types": activity_types,
            "monthly_stats": monthly_stats,
            "sports_distribution": sports_distribution,
            "yearly_distance": yearly_distance,
        }
    )
