#!/usr/bin/env python3
"""
RAFIQ Phase 3 – Task 7
Parse Quran Arabic script files → staging.quran_ayah_texts

Sources parsed (3 scripts × 6 236 ayahs = 18 708 rows):
  1. tanzil_uthmani  – data/raw/quran/tanzil/quran-uthmani-with-ayah-numbers.txt
  2. qul_uthmani     – data/raw/quran/qul/uthmani.json
  3. qul_qpc_hafs    – data/raw/quran/qul/qpc-hafs.json

Usage:
    python scripts/parse_quran_ayah_texts.py [project_root]
"""

import sys
import json
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from db_utils import (
    get_connection, lookup_raw_object, create_import_run,
    complete_import_run, fail_import_run,
    insert_source_record, text_hash, new_uuid,
)

PARSER_NAME    = "parse_quran_ayah_texts"
PARSER_VERSION = "1.0.0"

# ── source files → (object_path, script_label) ───────────────────────────────
SCRIPTS = [
    (
        "data/raw/quran/tanzil/quran-uthmani-with-ayah-numbers.txt",
        "tanzil_uthmani",
    ),
    (
        "data/raw/quran/qul/uthmani.json",
        "qul_uthmani",
    ),
    (
        "data/raw/quran/qul/qpc-hafs.json",
        "qul_qpc_hafs",
    ),
]


# ── parsers ───────────────────────────────────────────────────────────────────
def parse_tanzil_pipe(path: Path):
    """
    Yield (surah, ayah, text) from a Tanzil pipe-delimited file.
    Lines starting with # are comments; empty lines are skipped.
    Format: surah|ayah|arabic_text
    """
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            line = line.rstrip("\n")
            if not line or line.startswith("#"):
                continue
            parts = line.split("|", 2)
            if len(parts) != 3:
                continue
            yield int(parts[0]), int(parts[1]), parts[2]


def parse_qul_json(path: Path):
    """
    Yield (surah, ayah, text) from a QUL JSON script file.
    Format: dict keyed "surah:ayah" → {surah, ayah, text, ...}
    """
    data = json.loads(path.read_text(encoding="utf-8"))
    for key, val in data.items():
        if isinstance(val, dict):
            surah = int(val.get("surah") or key.split(":")[0])
            ayah  = int(val.get("ayah")  or key.split(":")[1])
            text  = val.get("text", "")
        else:
            surah_s, ayah_s = key.split(":")
            surah, ayah = int(surah_s), int(ayah_s)
            text = str(val)
        yield surah, ayah, text


def get_parser(label: str):
    if label == "tanzil_uthmani":
        return parse_tanzil_pipe
    return parse_qul_json


# ── per-source import run ─────────────────────────────────────────────────────
def run_one(conn, object_path: str, script_label: str):
    abs_path = ROOT / object_path
    if not abs_path.exists():
        print(f"  SKIP – file not found: {abs_path}")
        return 0, 0

    raw_object_id, snapshot_id, source_id = lookup_raw_object(conn, object_path)

    config = {"script_label": script_label, "object_path": object_path}
    run_id = create_import_run(
        conn,
        snapshot_id=snapshot_id,
        parser_name=PARSER_NAME,
        parser_version=PARSER_VERSION,
        configuration=config,
    )
    print(f"  import_run {run_id[:8]}…  [{script_label}]")

    parser = get_parser(script_label)
    parsed = staged = warnings = 0

    try:
        for surah, ayah, raw_text in parser(abs_path):
            parsed += 1
            ayah_key = f"{surah}:{ayah}"
            record_id = new_uuid()
            th = text_hash(raw_text)

            ok = insert_source_record(
                conn,
                record_id=record_id,
                source_id=source_id,
                snapshot_id=snapshot_id,
                raw_object_id=raw_object_id,
                import_run_id=run_id,
                domain="quran",
                record_type="quran_ayah_text",
                source_record_key=ayah_key,
                source_sequence=parsed,
                raw_text_hash=th,
            )

            if ok:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO staging.quran_ayah_texts
                          (id, surah_number, ayah_number, ayah_key,
                           script_label, text_value)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        ON CONFLICT DO NOTHING
                        """,
                        (record_id, surah, ayah, ayah_key,
                         script_label, raw_text),
                    )
                staged += 1

            # Commit in batches of 500
            if parsed % 500 == 0:
                conn.commit()
                print(f"    … {parsed} parsed, {staged} staged")

        conn.commit()
        complete_import_run(
            conn, run_id,
            parsed=parsed, staged=staged, warnings=warnings,
            rejected=parsed - staged, input_objects=1,
        )
        print(f"  done – {parsed} parsed, {staged} staged")
        return parsed, staged

    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        print(f"  ERROR: {exc}")
        raise


def main():
    conn = get_connection()
    total_parsed = total_staged = 0
    try:
        for object_path, script_label in SCRIPTS:
            print(f"\nParsing {script_label} …")
            p, s = run_one(conn, object_path, script_label)
            total_parsed += p
            total_staged += s
    finally:
        conn.close()

    print(f"\n=== quran_ayah_texts total: {total_parsed} parsed, {total_staged} staged ===")

    # Quick verification
    conn2 = get_connection()
    try:
        with conn2.cursor() as cur:
            cur.execute("SELECT script_label, COUNT(*) FROM staging.quran_ayah_texts GROUP BY 1 ORDER BY 1")
            print("\nstaging.quran_ayah_texts counts by script_label:")
            for row in cur.fetchall():
                print(f"  {row[0]}: {row[1]}")
    finally:
        conn2.close()


if __name__ == "__main__":
    main()
