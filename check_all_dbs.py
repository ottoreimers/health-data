# Save as check_all_dbs.py in your project root
import os
import sqlite3
import sys

# Updated path to your databases
DB_PATH = os.path.expanduser("~/HealthData/DBs/")

# List of database files to check
DB_FILES = [
    "garmin.db",
    "garmin_activities.db",
    "garmin_monitoring.db",
    "garmin_summary.db",
    "summary.db",
]


def check_sqlite_tables(db_file):
    """Connect to an SQLite database and print all table names and their structures."""
    print(f"\n{'='*60}")
    print(f"Checking database: {db_file}")
    print(f"{'='*60}")

    db_path = os.path.join(DB_PATH, db_file)

    if not os.path.exists(db_path):
        print(f"ERROR: Database file not found: {db_path}")
        return False

    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Query to get all table names
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()

        print(f"Found {len(tables)} tables:")
        for table in tables:
            table_name = table[0]
            print(f"\n- Table: {table_name}")

            # Get column information for this table
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()

            print(f"  Columns ({len(columns)}):")
            for col in columns:
                col_id, col_name, col_type, not_null, default_val, is_pk = col
                pk_marker = " (PK)" if is_pk else ""
                null_marker = " NOT NULL" if not_null else ""
                print(f"    {col_name}: {col_type}{null_marker}{pk_marker}")

            # Get row count for this table
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                count = cursor.fetchone()[0]
                print(f"  Row count: {count}")

                # If this is the activities table, show a sample row
                if table_name == "activities" and count > 0:
                    cursor.execute(f"SELECT * FROM {table_name} LIMIT 1")
                    sample = cursor.fetchone()
                    print("  Sample row (first few fields):")
                    print(f"    activity_id: {sample[0]}")
                    print(f"    name: {sample[1]}")
                    print(f"    type: {sample[3]}")
                    print(f"    start_time: {sample[14]}")
            except sqlite3.Error as e:
                print(f"  Error getting row count: {e}")

        return True
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        return False
    finally:
        if "conn" in locals() and conn:
            conn.close()


def main():
    print("Database Table Checker")
    print(f"Looking in directory: {DB_PATH}")

    if not os.path.exists(DB_PATH):
        print(f"ERROR: Directory not found: {DB_PATH}")
        return

    success = False
    for db_file in DB_FILES:
        if check_sqlite_tables(db_file):
            success = True

    if not success:
        print(
            "\nNo databases could be successfully checked. Check the path and file names."
        )


if __name__ == "__main__":
    main()
