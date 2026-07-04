#!/usr/bin/env python3
"""
RAFIQ: Apply a single SQL migration file directly to the local Supabase PostgreSQL.
Usage:  python scripts/apply_migration.py [migration_file]
Default migration: supabase/migrations/20260615000001_phase2_source_registry.sql
"""
import sys
import os
from pathlib import Path

# ── Connection defaults (local Supabase Docker) ────────────────────────────────
HOST = "localhost"
PORT = 55422
USER = "supabase_admin"
PASSWORD = "postgres"
DBNAME = "postgres"

# ── Migration file ─────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent.parent
DEFAULT_MIGRATION = ROOT / "supabase" / "migrations" / "20260615000001_phase2_source_registry.sql"


def apply(migration_path: Path):
    try:
        import psycopg2
    except ImportError:
        print("psycopg2 not found. Installing...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install",
                               "psycopg2-binary", "--quiet"])
        import psycopg2

    sql = migration_path.read_text(encoding="utf-8")
    print(f"Connecting to postgresql://{USER}@{HOST}:{PORT}/{DBNAME} ...")

    conn = psycopg2.connect(
        host=HOST, port=PORT, user=USER, password=PASSWORD, dbname=DBNAME
    )
    conn.autocommit = False

    try:
        with conn.cursor() as cur:
            cur.execute(sql)
        conn.commit()
        print("Migration applied successfully.")
        # psycopg2 accumulates NOTICE messages in conn.notices
        for n in conn.notices:
            print(f"  NOTICE: {n.rstrip()}")
    except Exception as exc:
        conn.rollback()
        print(f"\nERROR — rolled back.\n{exc}")
        sys.exit(1)
    finally:
        conn.close()


if __name__ == "__main__":
    migration = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_MIGRATION
    if not migration.exists():
        print(f"File not found: {migration}")
        sys.exit(1)
    apply(migration)
