#!/usr/bin/env python3
"""
RAFIQ Phase 3 – shared database utilities.

All parsers import from this module.  It handles:
  - psycopg2 connection to the local Supabase Docker instance
  - Deterministic UUID-5 generation under the RAFIQ namespace
  - ingest.raw_objects / source_snapshots lookups
  - ingest.import_runs lifecycle (create → complete / fail)
  - staging.source_records insertion

Connection target: postgresql://supabase_admin:postgres@localhost:55422/postgres
"""

import hashlib
import json
import uuid
from typing import Any, Optional

# ── RAFIQ UUID namespace ──────────────────────────────────────────────────────
RAFIQ_NS = uuid.UUID("b5d4f3a2-1c9e-4d7f-8b5e-3a2f4c6d8e9f")

# ── Connection defaults ───────────────────────────────────────────────────────
_DB = dict(host="localhost", port=55422, user="supabase_admin",
           password="postgres", dbname="postgres")


# ── psycopg2 import guard ─────────────────────────────────────────────────────
def _ensure_psycopg2():
    try:
        import psycopg2
        return psycopg2
    except ImportError:
        import subprocess, sys
        print("psycopg2 not found. Installing psycopg2-binary …")
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install",
             "psycopg2-binary", "--quiet"])
        import psycopg2
        return psycopg2


def get_connection():
    """Return an open psycopg2 connection (autocommit=False)."""
    pg = _ensure_psycopg2()
    conn = pg.connect(**_DB)
    conn.autocommit = False
    return conn


# ── UUID helpers ──────────────────────────────────────────────────────────────
def rafiq_uuid(seed: str) -> str:
    """Deterministic UUID-5 under the RAFIQ namespace."""
    return str(uuid.uuid5(RAFIQ_NS, seed))


def new_uuid() -> str:
    """Random UUID-4 as a string."""
    return str(uuid.uuid4())


def config_hash(config: dict) -> str:
    """SHA-256 hex of the canonical JSON of *config*."""
    raw = json.dumps(config, sort_keys=True, ensure_ascii=False).encode()
    return hashlib.sha256(raw).hexdigest()


# ── ingest lookups ────────────────────────────────────────────────────────────
def lookup_raw_object(conn, object_path: str):
    """
    Return (raw_object_id, snapshot_id, source_id) for the given
    object_path (e.g. 'data/raw/quran/tanzil/quran-uthmani-with-ayah-numbers.txt').
    Raises KeyError if not found.
    """
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT ro.id, ro.snapshot_id, ss.source_id
              FROM ingest.raw_objects ro
              JOIN ingest.source_snapshots ss ON ss.id = ro.snapshot_id
             WHERE ro.object_path = %s
             LIMIT 1
            """,
            (object_path,),
        )
        row = cur.fetchone()
    if row is None:
        raise KeyError(f"raw_object not found for path: {object_path!r}")
    return str(row[0]), str(row[1]), str(row[2])


def lookup_snapshot(conn, snapshot_key: str):
    """Return (snapshot_id, source_id) for the given snapshot_key."""
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT id, source_id
              FROM ingest.source_snapshots
             WHERE snapshot_key = %s
             LIMIT 1
            """,
            (snapshot_key,),
        )
        row = cur.fetchone()
    if row is None:
        raise KeyError(f"snapshot not found: {snapshot_key!r}")
    return str(row[0]), str(row[1])


# ── import_runs lifecycle ─────────────────────────────────────────────────────
def create_import_run(
    conn,
    *,
    snapshot_id: str,
    parser_name: str,
    parser_version: str,
    configuration: dict,
    code_revision: str = "phase3-v1",
) -> str:
    """
    Insert a new ingest.import_runs row (status='running').
    Returns the new import_run UUID string.

    If a run with the same (snapshot_id, parser_name, parser_version,
    configuration_hash) already exists it is returned unchanged — this lets
    parsers be re-run safely during development.
    """
    cfg_hash = config_hash(configuration)
    run_id = new_uuid()

    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO ingest.import_runs
              (id, snapshot_id, parser_name, parser_version, code_revision,
               configuration, configuration_hash, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'running')
            ON CONFLICT (snapshot_id, parser_name, parser_version, configuration_hash)
            DO UPDATE SET status = 'running',
                          started_at = now(),
                          completed_at = NULL,
                          input_object_count  = 0,
                          parsed_record_count = 0,
                          staged_record_count = 0,
                          warning_count       = 0,
                          rejected_record_count = 0,
                          error_summary       = NULL
            RETURNING id
            """,
            (run_id, snapshot_id, parser_name, parser_version,
             code_revision, json.dumps(configuration), cfg_hash),
        )
        row = cur.fetchone()
    conn.commit()
    return str(row[0])


def complete_import_run(
    conn,
    run_id: str,
    *,
    parsed: int = 0,
    staged: int = 0,
    warnings: int = 0,
    rejected: int = 0,
    input_objects: int = 1,
):
    """Mark an import run as 'completed' and record counts."""
    with conn.cursor() as cur:
        cur.execute(
            """
            UPDATE ingest.import_runs
               SET status               = 'completed',
                   completed_at         = now(),
                   input_object_count   = %s,
                   parsed_record_count  = %s,
                   staged_record_count  = %s,
                   warning_count        = %s,
                   rejected_record_count = %s
             WHERE id = %s
            """,
            (input_objects, parsed, staged, warnings, rejected, run_id),
        )
    conn.commit()


def fail_import_run(conn, run_id: str, error_summary: str):
    """Mark an import run as 'failed'."""
    with conn.cursor() as cur:
        cur.execute(
            """
            UPDATE ingest.import_runs
               SET status = 'failed',
                   completed_at = now(),
                   error_summary = %s
             WHERE id = %s
            """,
            (error_summary[:2000], run_id),
        )
    conn.commit()


# ── staging.source_records + domain table helpers ─────────────────────────────
def insert_source_record(
    conn,
    *,
    record_id: str,
    source_id: str,
    snapshot_id: str,
    raw_object_id: str,
    import_run_id: str,
    domain: str,
    record_type: str,
    source_record_key: str,
    source_locator: str = "",
    source_sequence: Optional[int] = None,
    raw_record: Optional[dict] = None,
    raw_text_hash: Optional[str] = None,
) -> bool:
    """
    Insert a row into staging.source_records.
    Uses ON CONFLICT DO NOTHING — returns True if inserted, False if skipped.
    """
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO staging.source_records
              (id, source_id, snapshot_id, raw_object_id, import_run_id,
               domain, record_type, source_record_key, source_locator,
               source_sequence, raw_record, raw_text_hash, parse_status)
            VALUES (%s,%s,%s,%s,%s, %s,%s,%s,%s, %s,%s,%s,'parsed')
            ON CONFLICT (import_run_id, raw_object_id, record_type,
                         source_record_key, source_locator)
            DO NOTHING
            """,
            (
                record_id, source_id, snapshot_id, raw_object_id,
                import_run_id, domain, record_type, source_record_key,
                source_locator, source_sequence,
                json.dumps(raw_record) if raw_record else None,
                raw_text_hash,
            ),
        )
        inserted = cur.rowcount == 1
    return inserted


def text_hash(text: str) -> str:
    """SHA-256 hex of a UTF-8 encoded string."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


# ── batch insert helpers ──────────────────────────────────────────────────────
def bulk_insert_source_records(conn, rows: list[dict]) -> int:
    """
    Insert a list of source_record dicts in one executemany call.
    Returns number of rows actually inserted.
    Each dict must have the same keys as insert_source_record's kwargs.
    """
    if not rows:
        return 0

    pg = _ensure_psycopg2()
    sql = """
        INSERT INTO staging.source_records
          (id, source_id, snapshot_id, raw_object_id, import_run_id,
           domain, record_type, source_record_key, source_locator,
           source_sequence, raw_record, raw_text_hash, parse_status)
        VALUES (%(id)s,%(source_id)s,%(snapshot_id)s,%(raw_object_id)s,
                %(import_run_id)s,%(domain)s,%(record_type)s,
                %(source_record_key)s,%(source_locator)s,
                %(source_sequence)s,%(raw_record)s,%(raw_text_hash)s,'parsed')
        ON CONFLICT (import_run_id, raw_object_id, record_type,
                     source_record_key, source_locator)
        DO NOTHING
    """
    # Serialise raw_record to JSON string for all rows
    prepared = []
    for r in rows:
        d = dict(r)
        if d.get("raw_record") and isinstance(d["raw_record"], dict):
            d["raw_record"] = json.dumps(d["raw_record"])
        d.setdefault("source_locator", "")
        d.setdefault("source_sequence", None)
        d.setdefault("raw_record", None)
        d.setdefault("raw_text_hash", None)
        prepared.append(d)

    with conn.cursor() as cur:
        cur.executemany(sql, prepared)
        count = cur.rowcount   # rowcount after executemany = total affected
    return count
