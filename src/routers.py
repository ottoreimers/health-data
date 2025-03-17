class GarminDBRouter:
    """
    A router to control all database operations on models in the HealthApp application.
    """

    garmin_dbs = [
        "garmin",
        "garmin_monitoring",
        "garmin_activities",
        "garmin_summary",
        "summary",
    ]

    def db_for_read(self, model, **hints):
        """
        Attempts to read garmin models go to respective DB.
        """
        app_label = model._meta.app_label
        if app_label == "sleep":
            return "garmin"
        elif app_label == "monitoring":
            return "garmin_monitoring"
        elif app_label == "activities":
            return "garmin_activities"
        elif app_label == "summary":
            return "garmin_summary"
        return "default"

    def db_for_write(self, model, **hints):
        """
        Writes always go to primary (Django) DB.
        Since we're treating Garmin DBs as read-only.
        """
        return "default"

    def allow_relation(self, obj1, obj2, **hints):
        """
        Relations are allowed within the same DB.
        """
        db1 = self.db_for_read(obj1.__class__)
        db2 = self.db_for_read(obj2.__class__)
        if db1 == db2:
            return True
        return None


def allow_migrate(self, db, app_label, model_name=None, **hints):
    """
    Make sure the Garmin models only appear in their respective DB.
    """
    if db == "garmin":
        return app_label == "sleep"
    elif db == "garmin_monitoring":
        return app_label == "monitoring"
    elif db == "garmin_activities":
        return app_label == "activities"
    elif db == "garmin_summary":
        return app_label == "summary"

    garmin_apps = ["monitoring", "activities", "summary"]
    if app_label in garmin_apps:
        return False

    return True
