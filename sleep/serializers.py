from rest_framework import fields, serializers

from .models import RestingHR, Sleep, SleepEvent, Stress


class SleepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sleep
        fields = "__all__"


class SleepEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = SleepEvent
        fields = "__all__"


class RestingHRSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestingHR
        fields = "__all__"


class StressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stress
        fields = "__all__"
