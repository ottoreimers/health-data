from django.db import models


class Activities(models.Model):
    """
    Maps to the activities table in GarminActivities.db
    """

    activity_id = models.CharField(max_length=255, primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=100, blank=True, null=True)
    course_id = models.IntegerField(blank=True, null=True)
    laps = models.IntegerField(blank=True, null=True)
    sport = models.CharField(max_length=100, blank=True, null=True)
    sub_sport = models.CharField(max_length=100, blank=True, null=True)
    device_serial_number = models.IntegerField(blank=True, null=True)
    self_eval_feel = models.CharField(max_length=100, blank=True, null=True)
    self_eval_effort = models.CharField(max_length=100, blank=True, null=True)
    training_load = models.FloatField(blank=True, null=True)
    training_effect = models.FloatField(blank=True, null=True)
    anaerobic_training_effect = models.FloatField(blank=True, null=True)
    start_time = models.DateTimeField(blank=True, null=True)
    stop_time = models.DateTimeField(blank=True, null=True)
    elapsed_time = models.TimeField()
    moving_time = models.TimeField()
    distance = models.FloatField(blank=True, null=True)
    cycles = models.FloatField(blank=True, null=True)
    avg_hr = models.IntegerField(blank=True, null=True)
    max_hr = models.IntegerField(blank=True, null=True)
    avg_rr = models.FloatField(blank=True, null=True)
    max_rr = models.FloatField(blank=True, null=True)
    calories = models.IntegerField(blank=True, null=True)
    avg_cadence = models.IntegerField(blank=True, null=True)
    max_cadence = models.IntegerField(blank=True, null=True)
    avg_speed = models.FloatField(blank=True, null=True)
    max_speed = models.FloatField(blank=True, null=True)
    ascent = models.FloatField(blank=True, null=True)
    descent = models.FloatField(blank=True, null=True)
    max_temperature = models.FloatField(blank=True, null=True)
    min_temperature = models.FloatField(blank=True, null=True)
    avg_temperature = models.FloatField(blank=True, null=True)
    start_lat = models.FloatField(blank=True, null=True)
    start_long = models.FloatField(blank=True, null=True)
    stop_lat = models.FloatField(blank=True, null=True)
    stop_long = models.FloatField(blank=True, null=True)
    hr_zones_method = models.CharField(max_length=18, blank=True, null=True)
    hrz_1_hr = models.IntegerField(blank=True, null=True)
    hrz_2_hr = models.IntegerField(blank=True, null=True)
    hrz_3_hr = models.IntegerField(blank=True, null=True)
    hrz_4_hr = models.IntegerField(blank=True, null=True)
    hrz_5_hr = models.IntegerField(blank=True, null=True)
    hrz_1_time = models.TimeField()
    hrz_2_time = models.TimeField()
    hrz_3_time = models.TimeField()
    hrz_4_time = models.TimeField()
    hrz_5_time = models.TimeField()

    class Meta:
        managed = False
        db_table = "activities"
        app_label = "activities"
