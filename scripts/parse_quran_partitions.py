#!/usr/bin/env python3
"""
RAFIQ Phase 3 – Task 8
Parse quran-data.xml → staging.quran_partitions

Partition types extracted:
  sura   – 114 rows  (start_ayah = index:1, end_ayah = index:ayas)
  juz    – 30 rows
  hizb   – 240 rows  (hizb quarters in XML are called 'hizbs')
  manzil – 7 rows
  ruku   – 556 rows
  page   – 604 rows
  sajda  – 15 rows   (single-ayah; end = start)

For range partitions (juz/hizb/manzil/ruku/page), start_ayah_key is taken
from the item's own sura+aya and end_ayah_key from the NEXT item's sura+aya
(minus 1 ayah).  The final item in each group ends at 114:6 (last ayah).

Usage:
    python scripts/parse_quran_partitions.py [project_root]
"""

import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from db_utils import (
    get_connection, lookup_raw_object, create_import_run,
    complete_import_run, fail_import_run,
    insert_source_record, new_uuid,
)

PARSER_NAME    = "parse_quran_partitions"
PARSER_VERSION = "1.0.0"
OBJECT_PATH    = "data/raw/quran/tanzil/quran-data.xml"

LAST_AYAH_KEY  = "114:6"   # Last ayah of the Quran

# ── Sura ayah-count lookup (built from the XML itself) ───────────────────────
def build_sura_ayah_counts(root) -> dict[int, int]:
    """Return {sura_index: ayah_count}."""
    return {int(s.attrib["index"]): int(s.attrib["ayas"])
            for s in root.find("suras")}


def prev_ayah_key(sura: int, aya: int, sura_counts: dict[int, int]) -> str:
    """Return the ayah_key that is one step before sura:aya."""
    if aya > 1:
        return f"{sura}:{aya - 1}"
    if sura > 1:
        return f"{sura - 1}:{sura_counts[sura - 1]}"
    return "1:1"   # shouldn't happen


# ── Partition generators ──────────────────────────────────────────────────────
def gen_suras(root, sura_counts):
    """Yield partition dicts for each sura."""
    for s in root.find("suras"):
        idx   = int(s.attrib["index"])
        ayas  = int(s.attrib["ayas"])
        yield {
            "partition_type":      "sura",
            "source_partition_id": str(idx),
            "start_ayah_key":      f"{idx}:1",
            "end_ayah_key":        f"{idx}:{ayas}",
            "source_label":        s.attrib.get("ename", ""),
            "classification":      s.attrib.get("type", ""),  # Meccan / Medinan
        }


def gen_range_partitions(root, tag: str, partition_type: str, sura_counts: dict):
    """
    Yield partition dicts for juz / hizb / manzil / ruku / page.
    End of each partition = one ayah before the start of the next.
    End of the last partition = LAST_AYAH_KEY.
    """
    items = list(root.find(tag))
    for i, item in enumerate(items):
        sura = int(item.attrib["sura"])
        aya  = int(item.attrib["aya"])
        idx  = int(item.attrib["index"])
        start_key = f"{sura}:{aya}"

        if i + 1 < len(items):
            next_sura = int(items[i + 1].attrib["sura"])
            next_aya  = int(items[i + 1].attrib["aya"])
            end_key = prev_ayah_key(next_sura, next_aya, sura_counts)
        else:
            end_key = LAST_AYAH_KEY

        yield {
            "partition_type":      partition_type,
            "source_partition_id": str(idx),
            "start_ayah_key":      start_key,
            "end_ayah_key":        end_key,
            "source_label":        None,
            "classification":      None,
        }


def gen_sajdas(root, sura_counts):
    """Yield single-ayah partition dicts for each sajda."""
    for s in root.find("sajdas"):
        sura = int(s.attrib["sura"])
        aya  = int(s.attrib["aya"])
        idx  = int(s.attrib["index"])
        key  = f"{sura}:{aya}"
        yield {
            "partition_type":      "sajda",
            "source_partition_id": str(idx),
            "start_ayah_key":      key,
            "end_ayah_key":        key,
            "source_label":        None,
            "classification":      s.attrib.get("type", ""),  # obligatory / recommended
        }


# ── TAG → (xml_tag, generator_fn) ────────────────────────────────────────────
SECTIONS = [
    ("suras",   "sura",   gen_suras),
    ("juzs",    "juz",    lambda r, sc: gen_range_partitions(r, "juzs",    "juz",    sc)),
    ("hizbs",   "hizb",   lambda r, sc: gen_range_partitions(r, "hizbs",   "hizb",   sc)),
    ("manzils", "manzil", lambda r, sc: gen_range_partitions(r, "manzils", "manzil", sc)),
    ("rukus",   "ruku",   lambda r, sc: gen_range_partitions(r, "rukus",   "ruku",   sc)),
    ("pages",   "page",   lambda r, sc: gen_range_partitions(r, "pages",   "page",   sc)),
    ("sajdas",  "sajda",  gen_sajdas),
]


def main():
    conn = get_connection()
    abs_path = ROOT / OBJECT_PATH
    if not abs_path.exists():
        print(f"File not found: {abs_path}")
        sys.exit(1)

    raw_object_id, snapshot_id, source_id = lookup_raw_object(conn, OBJECT_PATH)

    config = {"object_path": OBJECT_PATH}
    run_id = create_import_run(
        conn,
        snapshot_id=snapshot_id,
        parser_name=PARSER_NAME,
        parser_version=PARSER_VERSION,
        configuration=config,
    )
    print(f"import_run {run_id[:8]}…")

    tree = ET.parse(abs_path)
    root = tree.getroot()
    sura_counts = build_sura_ayah_counts(root)

    total_parsed = total_staged = 0

    try:
        seq = 0
        for xml_tag, partition_type, gen_fn in SECTIONS:
            section_count = 0
            for part in gen_fn(root, sura_counts):
                seq += 1
                section_count += 1
                record_id = new_uuid()
                src_key = f"{partition_type}:{part['source_partition_id']}"

                ok = insert_source_record(
                    conn,
                    record_id=record_id,
                    source_id=source_id,
                    snapshot_id=snapshot_id,
                    raw_object_id=raw_object_id,
                    import_run_id=run_id,
                    domain="quran",
                    record_type="quran_partition",
                    source_record_key=src_key,
                    source_sequence=seq,
                )
                total_parsed += 1

                if ok:
                    with conn.cursor() as cur:
                        cur.execute(
                            """
                            INSERT INTO staging.quran_partitions
                              (id, partition_type, source_partition_id,
                               start_ayah_key, end_ayah_key,
                               source_label, classification)
                            VALUES (%s,%s,%s,%s,%s,%s,%s)
                            ON CONFLICT DO NOTHING
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
                    total_staged += 1

            print(f"  {partition_type}: {section_count} rows")

        conn.commit()
        complete_import_run(
            conn, run_id,
            parsed=total_parsed, staged=total_staged,
            rejected=total_parsed - total_staged,
        )

    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        print(f"ERROR: {exc}")
        raise
    finally:
        conn.close()

    print(f"\n=== quran_partitions: {total_parsed} parsed, {total_staged} staged ===")

    # Verify
    conn2 = get_connection()
    try:
        with conn2.cursor() as cur:
            cur.execute(
                "SELECT partition_type, COUNT(*) FROM staging.quran_partitions "
                "GROUP BY 1 ORDER BY 1"
            )
            print("\nstaging.quran_partitions counts:")
            for row in cur.fetchall():
                print(f"  {row[0]}: {row[1]}")
    finally:
        conn2.close()


if __name__ == "__main__":
    main()
