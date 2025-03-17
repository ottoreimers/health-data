from rest_framework import fields, serializers

from .models import Activities


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activities
        fields = "__all__"


class ActivityListSerializer(serializers.ModelSerializer):
    """A lighter serializer for the list view"""

    class Meta:
        model = Activities
        fields = [
            "activity_id",
            "name",
            "type",
            "sport",
            "sub_sport",
            "start_time",
            "stop_time",
            "distance",
            "moving_time",
            "avg_speed",
            "avg_hr",
            "max_hr",
            "calories",
        ]
