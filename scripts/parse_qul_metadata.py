#!/usr/bin/env python3
"""
RAFIQ Phase 3 - Parse QUL Quran metadata into staging.

Loads:
  - ayah metadata as source_records only
  - juz/hizb/rub/ruku/manzil/sajda/surah-name into staging.quran_partitions
"""

import json
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from db_utils import (
    get_connection, lookup_raw_object, create_import_run,
    complete_import_run, fail_import_run, insert_source_record,
    new_uuid, text_hash,
)

PARSER_NAME = "parse_qul_quran_metadata"
PARSER_VERSION = "1.0.0"

FILES = [
    ("data/raw/quran/qul/quran-metadata-ayah.json", "ayah_metadata"),
    ("data/raw/quran/qul/quran-metadata-juz.json", "juz"),
    ("data/raw/quran/qul/quran-metadata-hizb.json", "hizb"),
    ("data/raw/quran/qul/quran-metadata-rub.json", "rub"),
    ("data/raw/quran/qul/quran-metadata-ruku.json", "ruku"),
    ("data/raw/quran/qul/quran-metadata-manzil.json", "manzil"),
    ("data/raw/quran/qul/quran-metadata-sajda.json", "sajda"),
    ("data/raw/quran/qul/quran-metadata-surah-name.json", "surah"),
]


def sorted_items(data):
    return sorted(data.items(), key=lambda kv: int(kv[0]))


def partition_from(kind, key, val):
    if kind == "surah":
        surah = int(val["id"])
        return {
            "partition_type": "qul_surah",
            "source_partition_id": str(surah),
            "start_ayah_key": f"{surah}:1",
            "end_ayah_key": f"{surah}:{val['verses_count']}",
            "source_label": val.get("name_simple") or val.get("name"),
            "classification": val.get("revelation_place"),
        }
    if kind == "sajda":
        ayah_key = val["verse_key"]
        return {
            "partition_type": "qul_sajda",
            "source_partition_id": str(val["sajdah_number"]),
            "start_ayah_key": ayah_key,
            "end_ayah_key": ayah_key,
            "source_label": None,
            "classification": val.get("sajdah_type"),
        }

    id_field = {
        "juz": "juz_number",
        "hizb": "hizb_number",
        "rub": "rub_number",
        "ruku": "ruku_number",
        "manzil": "manzil_number",
    }[kind]
    return {
        "partition_type": f"qul_{kind}",
        "source_partition_id": str(val[id_field]),
        "start_ayah_key": val["first_verse_key"],
        "end_ayah_key": val["last_verse_key"],
        "source_label": None,
        "classification": None,
    }


def run_one(conn, object_path, kind):
    raw_object_id, snapshot_id, source_id = lookup_raw_object(conn, object_path)
    abs_path = ROOT / object_path
    data = json.loads(abs_path.read_text(encoding="utf-8"))
    run_id = create_import_run(
        conn,
        snapshot_id=snapshot_id,
        parser_name=PARSER_NAME,
        parser_version=PARSER_VERSION,
        configuration={"object_path": object_path, "kind": kind},
    )

    parsed = staged = 0
    try:
        for key, val in sorted_items(data):
            parsed += 1
            record_id = new_uuid()
            record_type = "quran_ayah_metadata" if kind == "ayah_metadata" else "quran_partition"
            source_key = val.get("verse_key") if kind == "ayah_metadata" else f"qul_{kind}:{key}"
            ok = insert_source_record(
                conn,
                record_id=record_id,
                source_id=source_id,
                snapshot_id=snapshot_id,
                raw_object_id=raw_object_id,
                import_run_id=run_id,
                domain="quran",
                record_type=record_type,
                source_record_key=source_key,
                source_sequence=parsed,
                raw_record=val,
                raw_text_hash=text_hash(json.dumps(val, ensure_ascii=False, sort_keys=True)),
            )
            if ok and kind != "ayah_metadata":
                part = partition_from(kind, key, val)
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        insert into staging.quran_partitions
                          (id, partition_type, source_partition_id, start_ayah_key,
                           end_ayah_key, source_label, classification)
                        values (%s,%s,%s,%s,%s,%s,%s)
                        on conflict do nothing
                        """,
                        (
                            record_id,
                            part["partition_type"],
                            part["source_partition_id"],
                            part["start_ayah_key"],
                            part["end_ayah_key"],
                            part["source_label"],
                            part["classification"],
                        ),
                    )
            if ok:
                staged += 1
            if parsed % 1000 == 0:
                conn.commit()
        conn.commit()
        complete_import_run(conn, run_id, parsed=parsed, staged=staged, rejected=parsed - staged)
        print(f"{kind}: {parsed} parsed, {staged} staged")
    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        raise


def main():
    conn = get_connection()
    try:
        for object_path, kind in FILES:
            run_one(conn, object_path, kind)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
