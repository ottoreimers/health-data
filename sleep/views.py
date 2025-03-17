import json
import os
import sqlite3

from django.conf import settings
from django.db.models import Count, Sum
from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import DetailView, ListView

from .models import Sleep


class SleepListView(ListView):
    model = Sleep
    template_name = "sleep/sleep_list.html"
    context_object_name = "sleep"
    paginate_by = 20
    ordering = ["-start_time"]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context["sleep_types"] = (
            Sleep.objects.values("type")
            .annotate(count=Count("sleep_id"))
            .order_by("-count")
        )

        return context


class SleepDetailView(DetailView):
    model = Sleep
    template_name = "sleep/sleep_detail.html"
    context_object_name = "sleep"
    pk_url_kwarg = "sleep_id"


def sleep_stats(request):
    """API endpoint to get sleep statistics for charts"""
    try:
        # Get sleep stats by type
        sleep_types = list(
            Sleep.objects.values("type")
            .annotate(
                count=Count("sleep_id"),
                total_distance=Sum("distance"),
                total_time=Sum("moving_time"),
            )
            .order_by("-count")[:10]
        )

        # Convert to a serializable format (TimeField doesn't serialize to JSON)
        for item in sleep_types:
            if "total_time" in item and item["total_time"]:
                # Convert to string representation for the JSON response
                item["total_time"] = str(item["total_time"])

        return HttpResponse(
            json.dumps({"sleep_types": sleep_types}),
            content_type="application/json",
        )
    except Exception as e:
        return HttpResponse(
            json.dumps({"error": str(e)}),
            content_type="application/json",
        )
