#!/usr/bin/env python3
"""
RAFIQ Phase 3 - Load Hadith grade assertions and verification claims.

Checkpoint scope:
  - Fawaz primary Arabic edition grade assertions
  - SemakHadis frontend mock verification claims
  - Day 6 summary validation findings
"""

import csv
import json
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from db_utils import (
    get_connection, lookup_raw_object, create_import_run,
    complete_import_run, fail_import_run, insert_source_record,
    new_uuid, rafiq_uuid, text_hash,
)

PARSER_VERSION = "1.0.0"

FAWAZ_GRADE_FILES = [
    ("data/raw/hadith/collections/fawaz-hadith-api-v1/editions/ara-abudawud.json", "abudawud"),
    ("data/raw/hadith/collections/fawaz-hadith-api-v1/editions/ara-ibnmajah.json", "ibnmajah"),
    ("data/raw/hadith/collections/fawaz-hadith-api-v1/editions/ara-malik.json", "malik"),
    ("data/raw/hadith/collections/fawaz-hadith-api-v1/editions/ara-nasai.json", "nasai"),
    ("data/raw/hadith/collections/fawaz-hadith-api-v1/editions/ara-tirmidhi.json", "tirmidhi"),
]

SEMAK_MOCK_PATH = "data/raw/hadith/verification/semakhadis-frontend/src/mock/mock.json"


def hadith_record_uuid(source: str, collection_key: str, hadith_number: int) -> str:
    return rafiq_uuid(f"{source}:hadith_record:{collection_key}:{hadith_number}")


def normalize_grade(raw: str) -> str:
    value = (raw or "").lower()
    if "mawdu" in value or "maud" in value or "fabric" in value:
        return "mawdu"
    if "daif" in value or "dhaif" in value or "weak" in value:
        return "daif"
    if "hasan" in value and "sahih" in value:
        return "hasan_sahih"
    if "hasan" in value:
        return "hasan"
    if "sahih" in value or "saheeh" in value:
        return "sahih"
    return "unmapped"


def normalize_conclusion(raw: str) -> str:
    value = (raw or "").lower()
    if "palsu" in value or "maudhu" in value or "maudhu" in value:
        return "fabricated_or_false"
    if "sangat lemah" in value or "jiddan" in value:
        return "very_weak"
    if "lemah" in value or "dhaif" in value:
        return "weak"
    if "hasan" in value:
        return "hasan"
    if "sahih" in value:
        return "sahih"
    if "bukan hadis" in value or "tiada asal" in value or "tidak ada sumber" in value:
        return "not_found_or_not_hadith"
    return "unmapped"


def ensure_hadith_record(conn, *, source_id, snapshot_id, raw_object_id, import_run_id, collection_key, hadith_number):
    record_uuid = hadith_record_uuid("fawaz", collection_key, hadith_number)
    with conn.cursor() as cur:
        cur.execute("select 1 from staging.hadith_records where id = %s", (record_uuid,))
        if cur.fetchone():
            return record_uuid, False
    ok = insert_source_record(
        conn, record_id=record_uuid, source_id=source_id, snapshot_id=snapshot_id,
        raw_object_id=raw_object_id, import_run_id=import_run_id, domain="hadith",
        record_type="hadith_record", source_record_key=f"{collection_key}:{hadith_number}",
        source_sequence=hadith_number,
    )
    if ok:
        with conn.cursor() as cur:
            cur.execute(
                """
                insert into staging.hadith_records
                  (id, source_collection_key, source_edition_key, source_hadith_number)
                values (%s,%s,%s,%s)
                on conflict do nothing
                """,
                (record_uuid, collection_key, "fawaz-arabic-edition", str(hadith_number)),
            )
        return record_uuid, True
    return record_uuid, False


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


def run_fawaz_grades(conn, object_path, collection_key):
    raw_object_id, snapshot_id, source_id = lookup_raw_object(conn, object_path)
    data = json.loads((ROOT / object_path).read_text(encoding="utf-8"))
    run_id = create_import_run(
        conn, snapshot_id=snapshot_id, parser_name="parse_hadith_fawaz_grades",
        parser_version=PARSER_VERSION,
        configuration={"object_path": object_path, "collection_key": collection_key},
    )
    parsed = staged = records_created = 0
    try:
        for h in data.get("hadiths", []):
            hadith_number = int(h["hadithnumber"])
            grades = h.get("grades") or []
            if not grades:
                continue
            hadith_record_id, created = ensure_hadith_record(
                conn, source_id=source_id, snapshot_id=snapshot_id,
                raw_object_id=raw_object_id, import_run_id=run_id,
                collection_key=collection_key, hadith_number=hadith_number,
            )
            records_created += int(created)
            for idx, grade in enumerate(grades, 1):
                parsed += 1
                raw_grade = grade.get("grade") or ""
                grader = grade.get("name")
                record_id = new_uuid()
                ok = insert_source_record(
                    conn, record_id=record_id, source_id=source_id, snapshot_id=snapshot_id,
                    raw_object_id=raw_object_id, import_run_id=run_id, domain="hadith_grade",
                    record_type="hadith_grade_assertion",
                    source_record_key=f"fawaz:{collection_key}:{hadith_number}:{idx}:{grader or ''}",
                    source_sequence=parsed,
                    raw_record={"hadithnumber": hadith_number, "grade": grade},
                    raw_text_hash=text_hash(f"{grader}|{raw_grade}"),
                )
                if ok:
                    with conn.cursor() as cur:
                        cur.execute(
                            """
                            insert into staging.hadith_grade_assertions
                              (id, hadith_record_id, grader_name_raw, raw_grade,
                               normalized_grade, claim_scope, normalization_version)
                            values (%s,%s,%s,%s,%s,%s,%s)
                            on conflict do nothing
                            """,
                            (
                                record_id, hadith_record_id, grader, raw_grade,
                                normalize_grade(raw_grade), "source_hadith_record",
                                "phase3-simple-v1",
                            ),
                        )
                    staged += 1
            if parsed and parsed % 5000 == 0:
                conn.commit()
        conn.commit()
        complete_import_run(conn, run_id, parsed=parsed, staged=staged,
                            warnings=0, rejected=parsed - staged)
        print(f"fawaz grades {collection_key}: {parsed} parsed, {staged} staged, {records_created} records created")
    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        raise


def run_semakhadis_mock(conn):
    object_path = SEMAK_MOCK_PATH
    raw_object_id, snapshot_id, source_id = lookup_raw_object(conn, object_path)
    data = json.loads((ROOT / object_path).read_text(encoding="utf-8"))
    rows = data.get("hadith", [])
    run_id = create_import_run(
        conn, snapshot_id=snapshot_id, parser_name="parse_semakhadis_mock_claims",
        parser_version=PARSER_VERSION, configuration={"object_path": object_path},
    )
    parsed = staged = warnings = 0
    try:
        for seq, row in enumerate(rows, 1):
            parsed += 1
            raw_conclusion = row.get("status_hadith") or ""
            record_id = new_uuid()
            ok = insert_source_record(
                conn, record_id=record_id, source_id=source_id, snapshot_id=snapshot_id,
                raw_object_id=raw_object_id, import_run_id=run_id, domain="hadith_verification",
                record_type="hadith_verification_claim", source_record_key=f"semakhadis-mock:{row.get('id', seq)}",
                source_sequence=seq, raw_record=row, raw_text_hash=text_hash(json.dumps(row, ensure_ascii=False, sort_keys=True)),
            )
            if ok:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        insert into staging.hadith_verification_claims
                          (id, claim_text, raw_conclusion, normalized_conclusion,
                           claim_scope, scholar_researcher_raw, explanation,
                           references_json, classification_status,
                           editorial_workflow_status, review_status)
                        values (%s,%s,%s,%s,%s,%s,%s,%s::jsonb,%s,%s,'unreviewed')
                        on conflict do nothing
                        """,
                        (
                            record_id,
                            row.get("title") or row.get("text_melayu"),
                            raw_conclusion,
                            normalize_conclusion(raw_conclusion),
                            "semakhadis_mock_record",
                            row.get("pengkaji-hadis"),
                            row.get("komentar_ulama"),
                            json.dumps(row.get("rujukan") or []),
                            raw_conclusion,
                            row.get("status"),
                        ),
                    )
                staged += 1
        insert_finding(
            conn, snapshot_id=snapshot_id, raw_object_id=raw_object_id, import_run_id=run_id,
            code="semakhadis_mock_not_authoritative_export", severity="warning",
            description="SemakHadis frontend mock data is sample/mock evidence, not a complete authoritative verification export.",
            evidence={"mock_records": len(rows)},
        )
        warnings += 1
        conn.commit()
        complete_import_run(conn, run_id, parsed=parsed, staged=staged, warnings=warnings)
        print(f"semakhadis mock claims: {parsed} parsed, {staged} staged")
    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        raise


def run_day6_summary_findings(conn):
    object_path = "data/raw/hadith/collections/fawaz-hadith-api-v1/editions/ara-abudawud.json"
    raw_object_id, snapshot_id, _source_id = lookup_raw_object(conn, object_path)
    run_id = create_import_run(
        conn, snapshot_id=snapshot_id, parser_name="load_day6_hadith_quality_findings",
        parser_version=PARSER_VERSION, configuration={"source": "data/staging_reports/hadith/day6"},
    )
    summary = json.loads((ROOT / "data/staging_reports/hadith/day6/day6_summary.json").read_text(encoding="utf-8"))
    try:
        insert_finding(
            conn, snapshot_id=snapshot_id, raw_object_id=raw_object_id, import_run_id=run_id,
            code="fawaz_multi_grader_conflicts", severity="warning",
            description="Fawaz grade assertions include records with more than one broad normalized grade bucket.",
            evidence={"conflict_records": summary.get("fawaz_conflict_records")},
        )
        insert_finding(
            conn, snapshot_id=snapshot_id, raw_object_id=raw_object_id, import_run_id=run_id,
            code="abdullah_grade_field_unreliable", severity="warning",
            description="Abdullah Naseer six-books grade/status field is preserved as raw metadata but is not authoritative.",
            evidence={"correction_register": "CR-050"},
        )
        insert_finding(
            conn, snapshot_id=snapshot_id, raw_object_id=raw_object_id, import_run_id=run_id,
            code="verification_exports_incomplete", severity="warning",
            description="Current verification resources are schema/sample evidence and do not provide complete verification coverage.",
            evidence={"correction_register": "CR-051", "semakhadis_mock_records": summary.get("semakhadis_mock_records")},
        )
        conn.commit()
        complete_import_run(conn, run_id, parsed=3, staged=0, warnings=3)
        print("day6 quality findings: 3 warnings")
    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        raise


def main():
    conn = get_connection()
    try:
        for object_path, collection_key in FAWAZ_GRADE_FILES:
            run_fawaz_grades(conn, object_path, collection_key)
        run_semakhadis_mock(conn)
        run_day6_summary_findings(conn)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
