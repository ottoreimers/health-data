from django.urls import path

from . import views

app_name = "sleep"

urlpatterns = [
    path("", views.SleepListView.as_view(), name="sleep_list"),
    path("<int:sleep_id>/", views.SleepDetailView.as_view(), name="sleep_detail"),
    path("api/stats/", views.sleep_stats, name="sleep_stats"),
]
