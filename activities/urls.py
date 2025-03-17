from django.urls import path

from . import views

app_name = "activities"

urlpatterns = [
    path("", views.ActivityListView.as_view(), name="activity_list"),
    path(
        "<int:activity_id>/", views.ActivityDetailView.as_view(), name="activity_detail"
    ),
    path("api/stats/", views.activity_stats, name="activity_stats"),
    path("debug/", views.debug_view, name="debug_view"),
    path("check-dbs/", views.check_all_dbs, name="check_all_dbs"),
]
