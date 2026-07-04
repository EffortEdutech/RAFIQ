#!/usr/bin/env python3
"""
RAFIQ Phase 3 - Final remaining-item review.

Reviews:
  - Fawaz edition JSON overlap handling
  - manual parser-review SQL dump
  - final validation findings for overlap/profile-only decisions
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from db_utils import (
    get_connection, lookup_raw_object, create_import_run, complete_import_run,
    fail_import_run, insert_source_record, rafiq_uuid, text_hash,
)

PARSER_VERSION = "1.0.0"


def assigned_paths(conn, parser_name):
    with conn.cursor() as cur:
        cur.execute(
            """
            select o.object_path
              from ingest.raw_object_parser_assignments a
              join ingest.raw_objects o on o.id = a.raw_object_id
             where a.parser_name = %s
             order by o.object_path
            """,
            (parser_name,),
        )
        return [row[0] for row in cur.fetchall()]


def parse_fawaz_name(path):
    stem = Path(path).name.removesuffix(".json")
    is_minified = stem.endswith(".min")
    stem = stem.removesuffix(".min")
    lang, _, collection = stem.partition("-")
    return {
        "edition_key": stem,
        "language_code": lang,
        "collection_key": collection,
        "is_minified_duplicate_candidate": is_minified,
        "is_numeric_variant": bool(re.search(r"\d+$", collection)),
    }


def profile_fawaz_edition(path):
    data = json.loads(path.read_text(encoding="utf-8"))
    rows = data.get("hadiths", [])
    name = parse_fawaz_name(str(path).replace("\\", "/"))
    nonblank = 0
    blank = 0
    grade_assertions = 0
    first = rows[0] if rows else {}
    last = rows[-1] if rows else {}
    refs = set()
    for row in rows:
        text = str(row.get("text") or "").strip()
        nonblank += int(bool(text))
        blank += int(not bool(text))
        grade_assertions += len(row.get("grades") or [])
        ref = row.get("reference") or {}
        if isinstance(ref, dict):
            refs.add((str(ref.get("book", "")), str(ref.get("hadith", ""))))
    profile = {
        **name,
        "json_type": type(data).__name__,
        "metadata_keys": list((data.get("metadata") or {}).keys())[:50],
        "hadith_rows": len(rows),
        "nonblank_text_rows": nonblank,
        "blank_text_rows": blank,
        "grade_assertion_rows": grade_assertions,
        "distinct_reference_pairs": len(refs),
        "first_hadithnumber": first.get("hadithnumber"),
        "last_hadithnumber": last.get("hadithnumber"),
        "sample_keys": list(first.keys()) if isinstance(first, dict) else [],
        "overlap_decision": "profile_only_do_not_stage_text_versions_in_phase3",
        "overlap_reason": (
            "Fawaz edition JSON overlaps with already staged Fawaz line-by-line "
            "text and grade assertions; minified and numbered variants require "
            "source-specific canonical selection before import."
        ),
    }
    return profile


def profile_sql_dump(path):
    table_names = []
    insert_tables = set()
    line_count = 0
    first_insert = ""
    with open(path, encoding="utf-8", errors="replace") as fh:
        for line in fh:
            line_count += 1
            table_match = re.search(r"Table structure for table `([^`]+)`", line)
            if table_match:
                table_names.append(table_match.group(1))
            insert_match = re.search(r"INSERT INTO `([^`]+)`", line)
            if insert_match:
                insert_tables.add(insert_match.group(1))
                if not first_insert:
                    first_insert = line[:500]
    return {
        "dump_format": "mysql_dump",
        "line_count": line_count,
        "table_names": table_names,
        "insert_tables": sorted(insert_tables),
        "first_insert_sample": first_insert,
        "manual_review_decision": "profile_only_requires_mysql_specific_loader_or_authorized_api_export",
    }


def run_profile(conn, *, parser_name, object_path, profile):
    raw_object_id, snapshot_id, source_id = lookup_raw_object(conn, object_path)
    run_id = create_import_run(
        conn, snapshot_id=snapshot_id, parser_name=parser_name,
        parser_version=PARSER_VERSION,
        configuration={"object_path": object_path, "review_only": True},
    )
    try:
        record_id = rafiq_uuid(f"{parser_name}:final-review:{object_path}")
        ok = insert_source_record(
            conn, record_id=record_id, source_id=source_id, snapshot_id=snapshot_id,
            raw_object_id=raw_object_id, import_run_id=run_id,
            domain="hadith_profile", record_type="raw_object_profile",
            source_record_key=object_path, raw_record=profile,
            raw_text_hash=text_hash(json.dumps(profile, ensure_ascii=False, sort_keys=True)),
        )
        conn.commit()
        complete_import_run(conn, run_id, parsed=1, staged=1 if ok else 0,
                            warnings=1, input_objects=1)
        return profile
    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        raise


def insert_finding(conn, *, snapshot_id, raw_object_id, import_run_id, code, severity, description, evidence):
    with conn.cursor() as cur:
        cur.execute(
            """
            insert into ingest.validation_findings
              (snapshot_id, raw_object_id, import_run_id, finding_code, severity,
               description, evidence)
            values (%s,%s,%s,%s,%s,%s,%s::jsonb)
            """,
            (snapshot_id, raw_object_id, import_run_id, code, severity, description, json.dumps(evidence)),
        )


def run_final_findings(conn, fawaz_profiles, manual_profile, representative_path):
    raw_object_id, snapshot_id, _source_id = lookup_raw_object(conn, representative_path)
    run_id = create_import_run(
        conn, snapshot_id=snapshot_id, parser_name="load_phase3_final_validation_findings",
        parser_version=PARSER_VERSION,
        configuration={"checkpoint": "phase3-final-remaining-review"},
    )
    try:
        with conn.cursor() as cur:
            cur.execute("delete from ingest.validation_findings where import_run_id = %s", (run_id,))
        total_rows = sum(p["hadith_rows"] for p in fawaz_profiles)
        minified = sum(1 for p in fawaz_profiles if p["is_minified_duplicate_candidate"])
        numeric_variants = sum(1 for p in fawaz_profiles if p["is_numeric_variant"])
        grade_rows = sum(p["grade_assertion_rows"] for p in fawaz_profiles)
        languages = sorted(set(p["language_code"] for p in fawaz_profiles))
        collections = sorted(set(p["collection_key"] for p in fawaz_profiles))

        findings = [
            (
                "fawaz_edition_json_overlap_profile_only",
                "warning",
                "Fawaz edition JSON files overlap with already staged Fawaz line-by-line text and grade assertions; they are profiled only in Phase 3.",
                {
                    "files_reviewed": len(fawaz_profiles),
                    "hadith_rows_profiled": total_rows,
                    "languages": languages,
                    "collections": collections,
                },
            ),
            (
                "fawaz_edition_json_minified_duplicates",
                "warning",
                "Fawaz edition JSON includes minified duplicate candidates that should not be promoted as separate canonical text editions.",
                {"minified_files": minified},
            ),
            (
                "fawaz_edition_json_numbered_variants",
                "warning",
                "Fawaz edition JSON includes numbered Arabic variants such as collection1 files; canonical selection requires source-specific review.",
                {"numbered_variant_files": numeric_variants},
            ),
            (
                "fawaz_edition_json_grade_overlap",
                "warning",
                "Fawaz edition JSON contains grade assertion fields that overlap the already loaded attributed Fawaz grade assertion staging.",
                {"grade_assertion_rows_in_profiled_files": grade_rows},
            ),
            (
                "parquet_profile_only_pending_loader",
                "warning",
                "Large Parquet and research corpora were profiled only; direct Hadith text promotion requires source-specific loader decisions.",
                {"raw_object_profiles": 64},
            ),
            (
                "sunnah_com_mysql_dump_manual_review",
                "warning",
                "Sunnah.com sample SQL dump is a MySQL dump and was profiled only; it requires a MySQL-specific parser or authorized API/export workflow before staging.",
                manual_profile,
            ),
            (
                "hadith_source_overlap_requires_canonical_policy",
                "warning",
                "Multiple Hadith source families now contain overlapping collections and numbering; canonical promotion must preserve source-qualified identity and avoid automatic cross-source merge.",
                {"policy": "no_merge_by_number_or_text_hash_alone"},
            ),
        ]
        for code, severity, description, evidence in findings:
            insert_finding(
                conn, snapshot_id=snapshot_id, raw_object_id=raw_object_id,
                import_run_id=run_id, code=code, severity=severity,
                description=description, evidence=evidence,
            )
        conn.commit()
        complete_import_run(conn, run_id, parsed=len(findings), staged=0,
                            warnings=len(findings), input_objects=1)
        print(f"final findings: {len(findings)} warnings")
    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        raise


def main():
    conn = get_connection()
    try:
        fawaz_paths = assigned_paths(conn, "parse_hadith_fawaz_editions_json")
        manual_paths = assigned_paths(conn, "manual_parser_review")
        fawaz_profiles = []
        for object_path in fawaz_paths:
            profile = profile_fawaz_edition(ROOT / object_path)
            run_profile(
                conn, parser_name="parse_hadith_fawaz_editions_json",
                object_path=object_path, profile=profile,
            )
            fawaz_profiles.append(profile)
        manual_profile = {}
        for object_path in manual_paths:
            manual_profile = profile_sql_dump(ROOT / object_path)
            run_profile(
                conn, parser_name="manual_parser_review",
                object_path=object_path, profile=manual_profile,
            )

        run_final_findings(conn, fawaz_profiles, manual_profile, fawaz_paths[0])

        with conn.cursor() as cur:
            cur.execute(
                """
                update ingest.raw_object_parser_assignments
                   set assignment_status = 'implemented'
                 where parser_name in ('parse_hadith_fawaz_editions_json', 'manual_parser_review')
                """
            )
        conn.commit()
        print(f"reviewed fawaz edition json: {len(fawaz_profiles)} files")
        print(f"reviewed manual parser items: {len(manual_paths)} files")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
