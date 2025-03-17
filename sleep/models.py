from django.db import models


class Sleep(models.Model):
    """
    Maps to the sleep table in garmin.db
    """

    day = models.DateField(primary_key=True)
    start = models.DateTimeField(blank=True, null=True)
    end = models.DateTimeField(blank=True, null=True)
    total_sleep = models.TimeField()
    deep_sleep = models.TimeField()
    light_sleep = models.TimeField()
    rem_sleep = models.TimeField()
    awake = models.TimeField()
    avg_spo2 = models.FloatField(blank=True, null=True)
    avg_rr = models.FloatField(blank=True, null=True)
    avg_stress = models.FloatField(blank=True, null=True)
    score = models.IntegerField(blank=True, null=True)
    qualifier = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "sleep"
        app_label = "sleep"


class SleepEvent(models.Model):
    """
    Maps to the sleep_events table in garmin.db
    """

    timestamp = models.DateTimeField(primary_key=True)
    event = models.CharField(max_length=100, blank=True, null=True)
    duration = models.TimeField()

    class Meta:
        managed = False
        db_table = "sleep_events"
        app_label = "sleep"


class RestingHR(models.Model):
    """
    Maps to the resting_hr table in garmin.db
    """

    day = models.DateField(primary_key=True)
    resting_heart_rate = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "resting_hr"
        app_label = "sleep"


class Stress(models.Model):
    """
    Maps to the stress table in garmin.db
    """

    timestamp = models.DateTimeField(primary_key=True)
    stress = models.IntegerField()

    class Meta:
        managed = False
        db_table = "stress"
        app_label = "sleep"
