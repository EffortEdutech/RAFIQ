#!/usr/bin/env python3
"""
RAFIQ Phase 3 – Task 10
Parse Fawaz Hadith API v1 linebyline txt files
→ staging.hadith_records + staging.hadith_text_versions

Only files registered in ingest.raw_objects are parsed.
Arabic files establish the canonical hadith_records (one row per hadith number).
All language files (including Arabic) produce hadith_text_versions rows.

Deterministic UUID strategy:
  hadith_record UUID = rafiq_uuid("fawaz:hadith_record:{collection}:{hadith_number}")
  This lets multiple per-language import runs all point to the same hadith_record ID.

File naming convention:  {lang3}-{collection}.txt
  lang codes: ara→ar, eng→en, ben→bn, ind→id, rus→ru, tam→ta, tur→tr, urd→ur
  collections: bukhari, muslim, tirmidhi, abudawud, nasai, ibnmajah, malik,
               nawawi, qudsi, dehlawi

Format: "{number} | {text}"  (number is 1-based sequential)

Usage:
    python scripts/parse_hadith_fawaz.py [project_root]
"""

import sys
import csv
from pathlib import Path
from collections import defaultdict

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from db_utils import (
    get_connection, lookup_raw_object, create_import_run,
    complete_import_run, fail_import_run,
    insert_source_record, text_hash, new_uuid, rafiq_uuid,
)

PARSER_NAME    = "parse_hadith_fawaz_linebyline"
PARSER_VERSION = "1.0.0"
CHECKSUM_CSV   = ROOT / "data/checksums/HADITH_PRINCIPAL_SHA256_2026-06-14.csv"

# lang3 code → ISO 639-1 language code
LANG_MAP = {
    "ara": "ar",
    "eng": "en",
    "ben": "bn",
    "ind": "id",
    "rus": "ru",
    "tam": "ta",
    "tur": "tr",
    "urd": "ur",
    "fra": "fr",
}

# Which lang files are considered "canonical Arabic" (for creating hadith_records)
ARABIC_LANGS = {"ara"}


def registered_linebyline_paths() -> list[str]:
    """Return all linebyline object_paths registered in HADITH_PRINCIPAL_SHA256 CSV."""
    paths = []
    with open(CHECKSUM_CSV, encoding="utf-8-sig") as fh:
        for row in csv.DictReader(fh):
            p = row["path"]
            if "linebyline" in p and p.endswith(".txt"):
                paths.append(p)
    return paths


def parse_stem(filename: str) -> tuple[str, str]:
    """
    Parse '{lang3}-{collection}' from filename stem.
    Returns (lang3, collection_key).  e.g. 'ara-bukhari' → ('ara', 'bukhari')
    """
    stem = filename.replace(".txt", "")
    lang3, _, collection = stem.partition("-")
    return lang3, collection


def parse_linebyline(path: Path) -> list[tuple[int, str]]:
    """
    Return list of (hadith_number, text) from a linebyline txt file.
    Format: "{number} | {text}"
    Empty lines are skipped; lines without ' | ' are logged and skipped.
    """
    results = []
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            line = line.rstrip("\n")
            if not line:
                continue
            if " | " not in line:
                continue
            num_str, _, text = line.partition(" | ")
            try:
                num = int(num_str.strip())
            except ValueError:
                continue
            results.append((num, text))
    return results


def hadith_record_uuid(collection_key: str, hadith_number: int) -> str:
    return rafiq_uuid(f"fawaz:hadith_record:{collection_key}:{hadith_number}")


def ensure_hadith_record(
    conn,
    *,
    record_uuid: str,
    source_id: str,
    snapshot_id: str,
    raw_object_id: str,
    import_run_id: str,
    collection_key: str,
    hadith_number: int,
) -> bool:
    """Ensure the source-record and staging hadith_record rows exist."""
    with conn.cursor() as cur:
        cur.execute("SELECT 1 FROM staging.hadith_records WHERE id = %s", (record_uuid,))
        if cur.fetchone():
            return False

    rec_ok = insert_source_record(
        conn,
        record_id=record_uuid,
        source_id=source_id,
        snapshot_id=snapshot_id,
        raw_object_id=raw_object_id,
        import_run_id=import_run_id,
        domain="hadith",
        record_type="hadith_record",
        source_record_key=f"{collection_key}:{hadith_number}",
        source_sequence=hadith_number,
    )
    if not rec_ok:
        return False

    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO staging.hadith_records
              (id, source_collection_key, source_hadith_number)
            VALUES (%s, %s, %s)
            ON CONFLICT DO NOTHING
            """,
            (record_uuid, collection_key, str(hadith_number)),
        )
    return True


# ── Main logic ────────────────────────────────────────────────────────────────
def main():
    conn = get_connection()
    all_paths = registered_linebyline_paths()

    # Group files by collection
    by_collection: dict[str, list[tuple[str, str]]] = defaultdict(list)
    for op in all_paths:
        fname = Path(op).name
        lang3, collection = parse_stem(fname)
        by_collection[collection].append((lang3, op))

    # Sort so Arabic comes first within each collection
    for coll in by_collection:
        by_collection[coll].sort(key=lambda x: (0 if x[0] in ARABIC_LANGS else 1, x[0]))

    total_records = total_text_versions = 0

    try:
        for collection_key, lang_files in sorted(by_collection.items()):
            print(f"\nCollection: {collection_key} ({len(lang_files)} files)")

            # Track which hadith_record UUIDs have been created so text_version
            # parsers can reference them without re-inserting.
            created_record_ids: set[str] = set()

            # Determine which lang will create the hadith_records
            has_arabic = any(l == "ara" for l, _ in lang_files)

            for lang3, object_path in lang_files:
                abs_path = ROOT / object_path
                if not abs_path.exists():
                    print(f"  SKIP – {object_path}")
                    continue

                lang_code = LANG_MAP.get(lang3, lang3)
                is_primary = (lang3 in ARABIC_LANGS) or (not has_arabic and lang3 == lang_files[0][0])
                role = "primary_arabic" if is_primary else f"translation_{lang_code}"

                raw_object_id, snapshot_id, source_id = lookup_raw_object(conn, object_path)
                config = {
                    "object_path": object_path,
                    "collection_key": collection_key,
                    "language_code": lang_code,
                    "is_primary": is_primary,
                }
                run_id = create_import_run(
                    conn,
                    snapshot_id=snapshot_id,
                    parser_name=PARSER_NAME,
                    parser_version=PARSER_VERSION,
                    configuration=config,
                )
                print(f"  [{lang3}] import_run {run_id[:8]}… ({role})")

                hadith_rows = parse_linebyline(abs_path)
                parsed = staged_records = staged_versions = warnings = 0

                try:
                    for hadith_number, full_text in hadith_rows:
                        parsed += 1
                        record_uuid = hadith_record_uuid(collection_key, hadith_number)

                        # Ensure every text version has a source-qualified
                        # hadith_record, even when a translation file contains
                        # numbers not present in the Arabic line-by-line file.
                        if record_uuid not in created_record_ids:
                            rec_created = ensure_hadith_record(
                                conn,
                                record_uuid=record_uuid,
                                source_id=source_id,
                                snapshot_id=snapshot_id,
                                raw_object_id=raw_object_id,
                                import_run_id=run_id,
                                collection_key=collection_key,
                                hadith_number=hadith_number,
                            )
                            if rec_created:
                                staged_records += 1
                                total_records += 1
                            created_record_ids.add(record_uuid)

                        # ── Insert hadith_text_version ──────────────────────────────
                        # Use a new UUID for the text_version source_record
                        tv_uuid = new_uuid()
                        th = text_hash(full_text)

                        tv_ok = insert_source_record(
                            conn,
                            record_id=tv_uuid,
                            source_id=source_id,
                            snapshot_id=snapshot_id,
                            raw_object_id=raw_object_id,
                            import_run_id=run_id,
                            domain="hadith",
                            record_type="hadith_text_version",
                            source_record_key=f"{collection_key}:{hadith_number}:{lang_code}",
                            source_sequence=hadith_number,
                            raw_text_hash=th,
                        )
                        if tv_ok:
                            with conn.cursor() as cur:
                                cur.execute(
                                    """
                                    INSERT INTO staging.hadith_text_versions
                                      (id, hadith_record_id, language_code, full_text)
                                    VALUES (%s, %s, %s, %s)
                                    ON CONFLICT DO NOTHING
                                    """,
                                    (tv_uuid, record_uuid, lang_code, full_text),
                                )
                            staged_versions += 1
                            total_text_versions += 1

                        if parsed % 1000 == 0:
                            conn.commit()

                    conn.commit()
                    complete_import_run(
                        conn, run_id,
                        parsed=parsed,
                        staged=staged_records + staged_versions,
                        rejected=0,
                        input_objects=1,
                    )
                    print(f"    {parsed} hadith | {staged_records} records + {staged_versions} text_versions")

                except Exception as exc:
                    conn.rollback()
                    fail_import_run(conn, run_id, str(exc))
                    print(f"    ERROR: {exc}")
                    raise

    finally:
        conn.close()

    print(f"\n=== hadith total: {total_records} records, {total_text_versions} text_versions ===")

    conn2 = get_connection()
    try:
        with conn2.cursor() as cur:
            cur.execute(
                """
                SELECT hr.source_collection_key, COUNT(DISTINCT hr.id), COUNT(htv.id)
                  FROM staging.hadith_records hr
                  LEFT JOIN staging.hadith_text_versions htv ON htv.hadith_record_id = hr.id
                 GROUP BY 1
                 ORDER BY 1
                """
            )
            print("\nstaging counts by collection (records | text_versions):")
            for row in cur.fetchall():
                print(f"  {row[0]}: {row[1]} records, {row[2]} text_versions")
    finally:
        conn2.close()


if __name__ == "__main__":
    main()
