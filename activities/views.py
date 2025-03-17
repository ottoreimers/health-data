import json
import os
import sqlite3

from django.conf import settings
from django.db.models import Avg, Count, Max, Min, Sum
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.generic import DetailView, ListView

from .models import Activities


def check_all_dbs(request):
    """
    Check all databases for the activities table
    """
    html = "<h1>Database Check</h1>"

    # Check each database
    for db_name, db_config in settings.DATABASES.items():
        if db_name == "default":
            continue

        db_path = db_config["NAME"]
        html += f"<h2>Database: {db_name}</h2>"
        html += f"<p>Path: {db_path}</p>"

        if not os.path.exists(db_path):
            html += f"<p style='color:red'>File does not exist!</p>"
            continue

        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()

            # Check if activities table exists in this database
            cursor.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='activities';"
            )
            table_exists = cursor.fetchone()

            if table_exists:
                html += f"<p style='color:green'>✓ 'activities' table found!</p>"

                # Get table structure
                cursor.execute("PRAGMA table_info(activities)")
                columns = cursor.fetchall()

                html += "<h3>Table Structure:</h3>"
                html += "<ul>"
                for col in columns:
                    col_id, col_name, col_type, not_null, default_val, is_pk = col
                    pk_marker = " (Primary Key)" if is_pk else ""
                    null_marker = " NOT NULL" if not_null else ""
                    html += f"<li>{col_name}: {col_type}{null_marker}{pk_marker}</li>"
                html += "</ul>"

                # Count rows
                cursor.execute("SELECT COUNT(*) FROM activities")
                count = cursor.fetchone()[0]
                html += f"<p>Total activities: {count}</p>"

                # Sample data
                if count > 0:
                    cursor.execute(
                        "SELECT activity_id, name, type, start_time FROM activities LIMIT 5"
                    )
                    rows = cursor.fetchall()

                    html += "<h3>Sample Data:</h3>"
                    html += "<table border='1' cellpadding='5'>"
                    html += "<tr><th>ID</th><th>Name</th><th>Type</th><th>Start Time</th></tr>"

                    for row in rows:
                        html += "<tr>"
                        for cell in row:
                            html += f"<td>{cell}</td>"
                        html += "</tr>"

                    html += "</table>"
            else:
                html += f"<p style='color:red'>✗ 'activities' table NOT found</p>"

                # List all tables in this database
                cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
                tables = cursor.fetchall()

                if tables:
                    html += "<h3>Available tables:</h3>"
                    html += "<ul>"
                    for table in tables:
                        html += f"<li>{table[0]}</li>"
                    html += "</ul>"
                else:
                    html += "<p>No tables found in this database.</p>"

            conn.close()
        except Exception as e:
            html += f"<p style='color:red'>Error checking database: {str(e)}</p>"

        html += "<hr>"

    return HttpResponse(html)


def debug_view(request):
    return HttpResponse("Django is working! This view dosen't need database access.")


class ActivityListView(ListView):
    model = Activities
    template_name = "activities/activity_list.html"
    context_object_name = "activities"
    paginate_by = 20
    ordering = ["-start_time"]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context["activity_types"] = (
            Activities.objects.values("type")
            .annotate(count=Count("activity_id"))
            .order_by("-count")
        )

        return context


class ActivityDetailView(DetailView):
    model = Activities
    template_name = "activities/activity_detail.html"
    context_object_name = "activity"
    pk_url_kwarg = "activity_id"


def activity_stats(request):
    """API endpoint to get activity statistics for charts"""
    try:
        # Get activity stats by type
        activity_types = list(
            Activities.objects.values("type")
            .annotate(
                count=Count("activity_id"),
                total_distance=Sum("distance"),
                total_time=Sum("moving_time"),
            )
            .order_by("-count")[:10]
        )

        # Convert to a serializable format (TimeField doesn't serialize to JSON)
        for item in activity_types:
            if "total_time" in item and item["total_time"]:
                # Convert to string representation for the JSON response
                item["total_time"] = str(item["total_time"])

        return HttpResponse(
            json.dumps({"activity_types": activity_types}),
            content_type="application/json",
        )
    except Exception as e:
        return HttpResponse(
            json.dumps({"error": str(e)}), content_type="application/json", status=500
        )
