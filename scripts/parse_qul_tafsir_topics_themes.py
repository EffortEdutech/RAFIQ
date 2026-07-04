#!/usr/bin/env python3
"""
RAFIQ Phase 3 - Parse QUL tafsir, topics, and ayah themes.
"""

import hashlib
import html
import json
import re
import sqlite3
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from db_utils import (
    get_connection, lookup_raw_object, create_import_run,
    complete_import_run, fail_import_run, insert_source_record,
    new_uuid, text_hash,
)

PARSER_VERSION = "1.0.0"

TAFSIR_FILES = [
    ("data/raw/tafsir/en-tafisr-Al-Mukhtasar.json", "en", "qul-en-mukhtasar"),
    ("data/raw/tafsir/en-tafisr-ibn-kathir.json", "en", "qul-en-ibn-kathir"),
    ("data/raw/tafsir/ar-tafseer-al-saddi.json", "ar", "qul-ar-saadi"),
]


def plain_from_html(value: str) -> str:
    if not value:
        return ""
    no_tags = re.sub(r"<[^>]+>", " ", value)
    return re.sub(r"\s+", " ", html.unescape(no_tags)).strip()


def ayah_range(start_key: str, end_key: str):
    s1, a1 = [int(x) for x in start_key.split(":")]
    s2, a2 = [int(x) for x in end_key.split(":")]
    if s1 != s2:
        return [start_key, end_key]
    return [f"{s1}:{a}" for a in range(a1, a2 + 1)]


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


def run_tafsir(conn, object_path, language_code, edition_label):
    raw_object_id, snapshot_id, source_id = lookup_raw_object(conn, object_path)
    data = json.loads((ROOT / object_path).read_text(encoding="utf-8"))
    run_id = create_import_run(
        conn, snapshot_id=snapshot_id, parser_name="parse_qul_tafsir",
        parser_version=PARSER_VERSION,
        configuration={"object_path": object_path, "edition_label": edition_label},
    )
    parsed = staged = warnings = 0
    try:
        for seq, (ayah_key, val) in enumerate(sorted(data.items(), key=lambda kv: tuple(map(int, kv[0].split(":")))), 1):
            raw_text = val.get("text", "") if isinstance(val, dict) else str(val)
            blank = raw_text.strip() == ""
            record_id = new_uuid()
            ok = insert_source_record(
                conn, record_id=record_id, source_id=source_id, snapshot_id=snapshot_id,
                raw_object_id=raw_object_id, import_run_id=run_id, domain="tafsir",
                record_type="tafsir_passage", source_record_key=f"{edition_label}:{ayah_key}",
                source_sequence=seq, raw_record=val if isinstance(val, dict) else {"text": raw_text},
                raw_text_hash=text_hash(raw_text),
            )
            if ok:
                plain = plain_from_html(raw_text) if "<" in raw_text else raw_text
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        insert into staging.tafsir_passages
                          (id, group_ayah_key, language_code, source_edition_label,
                           from_ayah_key, to_ayah_key, passage_text, source_html, blank_text)
                        values (%s,%s,%s,%s,%s,%s,%s,%s,%s)
                        on conflict do nothing
                        """,
                        (record_id, ayah_key, language_code, edition_label, ayah_key, ayah_key,
                         plain, raw_text if "<" in raw_text else None, blank),
                    )
                    cur.execute(
                        """
                        insert into staging.tafsir_passage_ayahs
                          (passage_id, ayah_key, source_order, source_role)
                        values (%s,%s,%s,'covered')
                        on conflict do nothing
                        """,
                        (record_id, ayah_key, 1),
                    )
                if blank:
                    warnings += 1
                    insert_finding(
                        conn, snapshot_id=snapshot_id, raw_object_id=raw_object_id,
                        import_run_id=run_id, code="blank_tafsir_text", severity="warning",
                        description="Source tafsir record contains blank text.",
                        evidence={"edition": edition_label, "ayah_key": ayah_key},
                    )
                staged += 1
            if seq % 1000 == 0:
                conn.commit()
        conn.commit()
        complete_import_run(conn, run_id, parsed=parsed or len(data), staged=staged, warnings=warnings)
        print(f"tafsir {edition_label}: {len(data)} parsed, {staged} staged, {warnings} warnings")
    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        raise


def parse_csv_ids(value):
    if value is None or str(value).strip() == "":
        return []
    return [v.strip() for v in str(value).split(",") if v.strip()]


def run_topics(conn):
    object_path = "data/raw/tafsir/topics.db"
    raw_object_id, snapshot_id, source_id = lookup_raw_object(conn, object_path)
    run_id = create_import_run(
        conn, snapshot_id=snapshot_id, parser_name="parse_qul_topics",
        parser_version=PARSER_VERSION, configuration={"object_path": object_path},
    )
    con = sqlite3.connect(ROOT / object_path)
    con.row_factory = sqlite3.Row
    rows = con.execute("select * from topics order by topic_id").fetchall()
    parsed = staged = ayah_links = relations = 0
    try:
        for seq, row in enumerate(rows, 1):
            raw = dict(row)
            record_id = new_uuid()
            parent_ids = [str(raw[k]) for k in ("parent_id", "thematic_parent_id", "ontology_parent_id") if raw.get(k) is not None]
            related_ids = parse_csv_ids(raw.get("related_topics"))
            ok = insert_source_record(
                conn, record_id=record_id, source_id=source_id, snapshot_id=snapshot_id,
                raw_object_id=raw_object_id, import_run_id=run_id, domain="topic",
                record_type="source_topic", source_record_key=str(raw["topic_id"]),
                source_sequence=seq, raw_record=raw,
            )
            parsed += 1
            if ok:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        insert into staging.source_topics
                          (id, source_topic_id, namespace_labels, name, arabic_name,
                           description, raw_parent_ids, raw_related_topic_ids)
                        values (%s,%s,%s,%s,%s,%s,%s::jsonb,%s::jsonb)
                        on conflict do nothing
                        """,
                        (record_id, str(raw["topic_id"]), ["qul_topics"], raw.get("name"),
                         raw.get("arabic_name"), raw.get("description"),
                         json.dumps(parent_ids), json.dumps(related_ids)),
                    )
                    for parent in parent_ids:
                        cur.execute(
                            """
                            insert into staging.source_topic_relations
                              (topic_id, related_source_topic_id, relation_type)
                            values (%s,%s,'parent')
                            """,
                            (record_id, parent),
                        )
                        relations += 1
                    for related in related_ids:
                        cur.execute(
                            """
                            insert into staging.source_topic_relations
                              (topic_id, related_source_topic_id, relation_type)
                            values (%s,%s,'related')
                            """,
                            (record_id, related),
                        )
                        relations += 1
                    for ayah_key in parse_csv_ids(raw.get("ayahs")):
                        cur.execute(
                            """
                            insert into staging.source_topic_ayahs (topic_id, ayah_key)
                            values (%s,%s)
                            on conflict do nothing
                            """,
                            (record_id, ayah_key),
                        )
                        ayah_links += 1
                staged += 1
        conn.commit()
        complete_import_run(conn, run_id, parsed=parsed, staged=staged)
        print(f"topics: {parsed} parsed, {staged} staged, {ayah_links} ayah links, {relations} relations")
    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        raise
    finally:
        con.close()


def run_themes(conn):
    object_path = "data/raw/tafsir/ayah-themes.db"
    raw_object_id, snapshot_id, source_id = lookup_raw_object(conn, object_path)
    run_id = create_import_run(
        conn, snapshot_id=snapshot_id, parser_name="parse_qul_ayah_themes",
        parser_version=PARSER_VERSION, configuration={"object_path": object_path},
    )
    con = sqlite3.connect(ROOT / object_path)
    con.row_factory = sqlite3.Row
    rows = con.execute("select rowid as source_rowid, * from themes order by rowid").fetchall()
    seen = {}
    covered = set()
    malformed_wai = 0
    parsed = staged = links = duplicate_rows = 0
    try:
        for seq, row in enumerate(rows, 1):
            raw = dict(row)
            key_tuple = (raw["theme"], raw["surah_number"], raw["ayah_from"], raw["ayah_to"], raw["keywords"], raw["total_ayahs"])
            digest = hashlib.sha256(json.dumps(key_tuple, ensure_ascii=False).encode("utf-8")).hexdigest()
            duplicate_group = digest if digest in seen else None
            seen[digest] = seen.get(digest, 0) + 1
            if duplicate_group:
                duplicate_rows += 1
            keywords = raw.get("keywords") or ""
            if "Wai" in keywords.split(",") or keywords.strip() == "Wai":
                malformed_wai += 1
            record_id = new_uuid()
            source_key = f"theme-row:{raw['source_rowid']}"
            ok = insert_source_record(
                conn, record_id=record_id, source_id=source_id, snapshot_id=snapshot_id,
                raw_object_id=raw_object_id, import_run_id=run_id, domain="theme",
                record_type="ayah_theme_group", source_record_key=source_key,
                source_sequence=seq, raw_record=raw,
            )
            parsed += 1
            if ok:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        insert into staging.ayah_theme_groups
                          (id, theme_text, surah_number, ayah_from, ayah_to,
                           raw_keywords, total_ayahs, exact_duplicate_group)
                        values (%s,%s,%s,%s,%s,%s,%s,%s)
                        on conflict do nothing
                        """,
                        (record_id, raw["theme"], raw["surah_number"], raw["ayah_from"],
                         raw["ayah_to"], keywords, raw["total_ayahs"], duplicate_group),
                    )
                    for ayah_key in ayah_range(f"{raw['surah_number']}:{raw['ayah_from']}", f"{raw['surah_number']}:{raw['ayah_to']}"):
                        cur.execute(
                            """
                            insert into staging.ayah_theme_group_ayahs (theme_group_id, ayah_key)
                            values (%s,%s)
                            on conflict do nothing
                            """,
                            (record_id, ayah_key),
                        )
                        covered.add(ayah_key)
                        links += 1
                staged += 1

        all_ayahs = {f"{s}:{a}" for s, max_a in SURAH_COUNTS.items() for a in range(1, max_a + 1)}
        gaps = sorted(all_ayahs - covered, key=lambda k: tuple(map(int, k.split(":"))))
        if duplicate_rows:
            insert_finding(conn, snapshot_id=snapshot_id, raw_object_id=raw_object_id, import_run_id=run_id,
                           code="ayah_theme_exact_duplicates", severity="warning",
                           description="Ayah-theme source contains exact duplicate rows.",
                           evidence={"duplicate_rows": duplicate_rows, "unique_rows": len(seen)})
        if gaps:
            insert_finding(conn, snapshot_id=snapshot_id, raw_object_id=raw_object_id, import_run_id=run_id,
                           code="ayah_theme_coverage_gaps", severity="warning",
                           description="Ayah-theme source does not cover every Quran ayah.",
                           evidence={"gap_count": len(gaps), "sample": gaps[:20]})
        if malformed_wai:
            insert_finding(conn, snapshot_id=snapshot_id, raw_object_id=raw_object_id, import_run_id=run_id,
                           code="ayah_theme_malformed_keyword_wai", severity="warning",
                           description="Ayah-theme source contains likely malformed keyword Wai.",
                           evidence={"row_count": malformed_wai})
        conn.commit()
        complete_import_run(conn, run_id, parsed=parsed, staged=staged,
                            warnings=(1 if duplicate_rows else 0) + (1 if gaps else 0) + (1 if malformed_wai else 0))
        print(f"themes: {parsed} parsed, {staged} staged, {links} ayah links, {duplicate_rows} duplicate rows, {len(gaps)} gaps")
    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        raise
    finally:
        con.close()


SURAH_COUNTS = {
    1: 7, 2: 286, 3: 200, 4: 176, 5: 120, 6: 165, 7: 206, 8: 75, 9: 129, 10: 109,
    11: 123, 12: 111, 13: 43, 14: 52, 15: 99, 16: 128, 17: 111, 18: 110, 19: 98,
    20: 135, 21: 112, 22: 78, 23: 118, 24: 64, 25: 77, 26: 227, 27: 93, 28: 88,
    29: 69, 30: 60, 31: 34, 32: 30, 33: 73, 34: 54, 35: 45, 36: 83, 37: 182,
    38: 88, 39: 75, 40: 85, 41: 54, 42: 53, 43: 89, 44: 59, 45: 37, 46: 35,
    47: 38, 48: 29, 49: 18, 50: 45, 51: 60, 52: 49, 53: 62, 54: 55, 55: 78,
    56: 96, 57: 29, 58: 22, 59: 24, 60: 13, 61: 14, 62: 11, 63: 11, 64: 18,
    65: 12, 66: 12, 67: 30, 68: 52, 69: 52, 70: 44, 71: 28, 72: 28, 73: 20,
    74: 56, 75: 40, 76: 31, 77: 50, 78: 40, 79: 46, 80: 42, 81: 29, 82: 19,
    83: 36, 84: 25, 85: 22, 86: 17, 87: 19, 88: 26, 89: 30, 90: 20, 91: 15,
    92: 21, 93: 11, 94: 8, 95: 8, 96: 19, 97: 5, 98: 8, 99: 8, 100: 11,
    101: 11, 102: 8, 103: 3, 104: 9, 105: 5, 106: 4, 107: 7, 108: 3, 109: 6,
    110: 3, 111: 5, 112: 4, 113: 5, 114: 6,
}


def main():
    conn = get_connection()
    try:
        for args in TAFSIR_FILES:
            run_tafsir(conn, *args)
        run_topics(conn)
        run_themes(conn)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
