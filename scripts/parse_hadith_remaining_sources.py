#!/usr/bin/env python3
"""
RAFIQ Phase 3 - Remaining Hadith source loaders and Parquet profiler.

Scope:
  - CSV text datasets
  - JSONL and GZIP JSONL text datasets
  - SemakHadis XLSX verification workbook
  - Fawaz metadata/original text profile records
  - Parquet metadata/profile records with small sample hashes

Large Parquet research corpora are profiled, not promoted into Hadith text
staging, unless a future source-specific loader confirms they are direct
Hadith text tables.
"""

import csv
import gzip
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from db_utils import (
    get_connection, lookup_raw_object, create_import_run, complete_import_run,
    fail_import_run, insert_source_record, rafiq_uuid, text_hash,
)

try:
    import pyarrow.parquet as pq
except Exception:
    pq = None

PARSER_VERSION = "1.0.0"

CSV_FILES = [
    ("data/raw/hadith/collections/hf-all-hadiths-cleaned/all_hadiths_clean.csv", "hf-all-hadiths-cleaned", "all-hadiths-cleaned"),
    ("data/raw/hadith/collections/hf-ronnieaban-sunnah/Sunnah.csv", "hf-ronnieaban-sunnah", "sunnah-csv"),
    ("data/raw/hadith/multilingual/hf-meeatif-hadith-datasets/Jami` at-Tirmidhi.csv", "meeatif-csv", "jami-at-tirmidhi"),
    ("data/raw/hadith/multilingual/hf-meeatif-hadith-datasets/Sahih al-Bukhari.csv", "meeatif-csv", "sahih-al-bukhari"),
    ("data/raw/hadith/multilingual/hf-meeatif-hadith-datasets/Sahih Muslim.csv", "meeatif-csv", "sahih-muslim"),
    ("data/raw/hadith/multilingual/hf-meeatif-hadith-datasets/Sunan Abi Dawud.csv", "meeatif-csv", "sunan-abi-dawud"),
    ("data/raw/hadith/multilingual/hf-meeatif-hadith-datasets/Sunan an-Nasa'i.csv", "meeatif-csv", "sunan-an-nasai"),
    ("data/raw/hadith/multilingual/hf-meeatif-hadith-datasets/Sunan Ibn Majah.csv", "meeatif-csv", "sunan-ibn-majah"),
]

JSONL_FILES = [
    ("data/raw/hadith/multilingual/hf-sarnsrun-hadiths/hadiths.jsonl", "hf-sarnsrun-hadiths", "sarnsrun-jsonl", False),
    ("data/raw/hadith/quarantined/hf-sunnah-ar-en/sunnah_ar_en_dataset.jsonl.gz", "hf-sunnah-ar-en", "sunnah-ar-en-jsonl", True),
]

XLSX_FILES = [
    ("data/raw/hadith/verification/semakhadis-api/database/seeds/seeder_csv/hadith_seeder.xlsx", "semakhadis-xlsx", "hadith-seeder"),
]

FAWAZ_PROFILE_FILES = [
    "data/raw/hadith/collections/fawaz-hadith-api-v1/info.json",
    "data/raw/hadith/collections/fawaz-hadith-api-v1/info.min.json",
    "data/raw/hadith/collections/fawaz-hadith-api-v1/others/myfile.json",
]

FAWAZ_ORIGINAL_PREFIX = "data/raw/hadith/collections/fawaz-hadith-api-v1/database/originals/"


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


def stable_record_id(namespace, collection_key, hadith_number):
    return rafiq_uuid(f"{namespace}:hadith_record:{collection_key}:{hadith_number}")


def stable_text_id(namespace, collection_key, hadith_number, seq, lang):
    return rafiq_uuid(f"{namespace}:hadith_text_version:{collection_key}:{hadith_number}:{seq}:{lang}")


def clean(value):
    return "" if value is None else str(value).strip()


def numeric_or_none(value):
    value = clean(value)
    return int(value) if value.isdigit() else None


def ensure_hadith(conn, *, record_id, source_id, snapshot_id, raw_object_id,
                  run_id, namespace, collection_key, hadith_number, row,
                  chapter_key="", book_key="", printed_reference="", seq=None):
    ok = insert_source_record(
        conn, record_id=record_id, source_id=source_id, snapshot_id=snapshot_id,
        raw_object_id=raw_object_id, import_run_id=run_id, domain="hadith",
        record_type="hadith_record",
        source_record_key=f"{namespace}:{collection_key}:{hadith_number}",
        source_sequence=numeric_or_none(hadith_number) or seq,
        raw_record=row,
    )
    with conn.cursor() as cur:
        cur.execute(
            """
            insert into staging.hadith_records
              (id, source_collection_key, source_edition_key, source_book_key,
               source_chapter_key, source_hadith_number, printed_reference)
            values (%s,%s,%s,%s,%s,%s,%s)
            on conflict do nothing
            """,
            (record_id, collection_key, namespace, book_key or None,
             chapter_key or None, str(hadith_number), printed_reference or None),
        )
    return ok


def add_text(conn, *, text_id, record_id, source_id, snapshot_id, raw_object_id,
             run_id, namespace, collection_key, hadith_number, seq, lang,
             text, narrator=""):
    text = clean(text)
    if not text:
        return False
    ok = insert_source_record(
        conn, record_id=text_id, source_id=source_id, snapshot_id=snapshot_id,
        raw_object_id=raw_object_id, import_run_id=run_id, domain="hadith",
        record_type="hadith_text_version",
        source_record_key=f"{namespace}:{collection_key}:{hadith_number}:{seq}:{lang}",
        source_locator=f"row:{seq}:lang:{lang}",
        source_sequence=seq,
        raw_text_hash=text_hash(text),
    )
    with conn.cursor() as cur:
        cur.execute(
            """
            insert into staging.hadith_text_versions
              (id, hadith_record_id, language_code, full_text, narrator_prefix)
            values (%s,%s,%s,%s,%s)
            on conflict do nothing
            """,
            (text_id, record_id, lang, text, narrator or None),
        )
    return ok


def run_text_rows(conn, *, parser_name, object_path, namespace, collection_key,
                  rows, adapter):
    raw_object_id, snapshot_id, source_id = lookup_raw_object(conn, object_path)
    run_id = create_import_run(
        conn, snapshot_id=snapshot_id, parser_name=parser_name,
        parser_version=PARSER_VERSION,
        configuration={"object_path": object_path, "namespace": namespace, "collection_key": collection_key},
    )
    parsed = records = texts = warnings = 0
    try:
        for seq, row in enumerate(rows, 1):
            parsed += 1
            item = adapter(row, seq, collection_key)
            hadith_number = item["hadith_number"]
            effective_collection_key = item.get("collection_key") or collection_key
            record_id = stable_record_id(namespace, effective_collection_key, hadith_number)
            if ensure_hadith(
                conn, record_id=record_id, source_id=source_id,
                snapshot_id=snapshot_id, raw_object_id=raw_object_id,
                run_id=run_id, namespace=namespace, collection_key=effective_collection_key,
                hadith_number=hadith_number, row=row,
                chapter_key=item.get("chapter_key", ""),
                book_key=item.get("book_key", ""),
                printed_reference=item.get("printed_reference", ""),
                seq=seq,
            ):
                records += 1
            row_texts = item.get("texts", [])
            if not any(clean(text) for _lang, text, _narrator in row_texts):
                warnings += 1
            for lang, text, narrator in row_texts:
                text_id = stable_text_id(namespace, effective_collection_key, hadith_number, seq, lang)
                if add_text(
                    conn, text_id=text_id, record_id=record_id, source_id=source_id,
                    snapshot_id=snapshot_id, raw_object_id=raw_object_id,
                    run_id=run_id, namespace=namespace, collection_key=effective_collection_key,
                    hadith_number=hadith_number, seq=seq, lang=lang, text=text,
                    narrator=narrator,
                ):
                    texts += 1
            if parsed % 1000 == 0:
                conn.commit()
        conn.commit()
        complete_import_run(conn, run_id, parsed=parsed, staged=records + texts,
                            warnings=warnings, input_objects=1)
        print(f"{parser_name} {collection_key}: {parsed} parsed, {records} records, {texts} texts, {warnings} warnings")
    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        raise


def all_hadiths_adapter(row, seq, collection_key):
    source = clean(row.get("source")).lower().replace(" ", "-")
    coll = source or collection_key
    number = clean(row.get("hadith_no") or row.get("hadith_id") or seq)
    return {
        "collection_key": coll,
        "hadith_number": number,
        "chapter_key": clean(row.get("chapter_no")),
        "book_key": coll,
        "printed_reference": f"{clean(row.get('source'))} {number}".strip(),
        "texts": [
            ("ar", clean(row.get("text_ar")), ""),
            ("en", clean(row.get("text_en")), ""),
        ],
    }


def ronnie_adapter(row, seq, collection_key):
    perawi = clean(row.get("Perawi"))
    match = re.search(r"Hadits\s+(.+?)\s+Nomor\s+(\d+)", perawi, re.I)
    coll = (match.group(1).lower().replace(" ", "-") if match else collection_key)
    number = match.group(2) if match else str(seq)
    return {
        "collection_key": coll,
        "hadith_number": number,
        "book_key": coll,
        "printed_reference": perawi,
        "texts": [
            ("ar", clean(row.get("Arab")), ""),
            ("id", clean(row.get("Terjemahan")), ""),
        ],
    }


def meeatif_csv_adapter(row, seq, collection_key):
    reference = clean(row.get("Reference"))
    match = re.search(r":(\d+)\s*$", reference)
    number = match.group(1) if match else str(seq)
    return {
        "hadith_number": number,
        "chapter_key": clean(row.get("Chapter_Number")),
        "book_key": clean(row.get("Book")),
        "printed_reference": clean(row.get("In-book reference") or reference),
        "texts": [
            ("ar", clean(row.get("Arabic_Text")), ""),
            ("en", clean(row.get("English_Text")), ""),
        ],
    }


def csv_adapter_for(namespace):
    if namespace == "hf-ronnieaban-sunnah":
        return ronnie_adapter
    if namespace == "meeatif-csv":
        return meeatif_csv_adapter
    return all_hadiths_adapter


def csv_rows(path):
    with open(path, encoding="utf-8-sig", newline="") as fh:
        yield from csv.DictReader(fh)


def parse_tagged_prompt(text):
    fields = {}
    parts = re.split(r"<\|([^|]+)\|>", text or "")
    for idx in range(1, len(parts), 2):
        fields[parts[idx]] = parts[idx + 1].strip() if idx + 1 < len(parts) else ""
    return fields


def sarnsrun_adapter(row, seq, collection_key):
    fields = parse_tagged_prompt(row.get("text", ""))
    source = clean(fields.get("source")).lower().replace(" ", "-") or collection_key
    number = clean(fields.get("hadith_id") or seq)
    return {
        "collection_key": source,
        "hadith_number": number,
        "chapter_key": clean(fields.get("chapter")),
        "book_key": source,
        "printed_reference": f"{fields.get('source', '')} {number}".strip(),
        "texts": [("en", clean(fields.get("text")), "")],
    }


def sunnah_gz_adapter(row, seq, collection_key):
    number = clean(row.get("hadith_uid") or row.get("hadith_id") or seq)
    coll = clean(row.get("book_title_en")).lower().replace(" ", "-") or collection_key
    return {
        "collection_key": coll,
        "hadith_number": number,
        "chapter_key": clean(row.get("hadith_chapter_id")),
        "book_key": clean(row.get("book_title_en")),
        "printed_reference": clean(row.get("hadith_uid")),
        "texts": [
            ("ar", clean(row.get("hadith_text_ar")), ""),
            ("en", clean(row.get("hadith_text_en")), clean(row.get("hadith_narrator_en"))),
        ],
    }


def iter_jsonl(path, gzipped=False):
    opener = gzip.open if gzipped else open
    with opener(path, "rt", encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line:
                yield json.loads(line)


def xlsx_rows(path):
    ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    with zipfile.ZipFile(path) as zf:
        shared = []
        if "xl/sharedStrings.xml" in zf.namelist():
            root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
            for si in root.findall("m:si", ns):
                shared.append("".join(t.text or "" for t in si.findall(".//m:t", ns)))
        sheet = ET.fromstring(zf.read("xl/worksheets/sheet1.xml"))
        rows = []
        for row in sheet.findall(".//m:row", ns):
            values = []
            for cell in row.findall("m:c", ns):
                val = ""
                v = cell.find("m:v", ns)
                if v is not None:
                    val = v.text or ""
                    if cell.attrib.get("t") == "s" and val:
                        val = shared[int(val)]
                values.append(val)
            rows.append(values)
        headers = rows[0]
        for values in rows[1:]:
            yield {headers[idx]: values[idx] if idx < len(values) else "" for idx in range(len(headers))}


def normalize_conclusion(raw):
    value = clean(raw).lower()
    if "palsu" in value or "maud" in value:
        return "fabricated_or_false"
    if "sangat lemah" in value:
        return "very_weak"
    if "tidak sahih" in value or "lemah" in value or "dhaif" in value:
        return "weak"
    if "hasan" in value:
        return "hasan"
    if "sahih" in value:
        return "sahih"
    return "unmapped"


def run_xlsx_claims(conn, object_path, namespace, collection_key):
    raw_object_id, snapshot_id, source_id = lookup_raw_object(conn, object_path)
    run_id = create_import_run(
        conn, snapshot_id=snapshot_id, parser_name="parse_hadith_xlsx_generic",
        parser_version=PARSER_VERSION,
        configuration={"object_path": object_path, "namespace": namespace, "collection_key": collection_key},
    )
    parsed = staged = warnings = 0
    try:
        for seq, row in enumerate(xlsx_rows(ROOT / object_path), 1):
            parsed += 1
            raw_conclusion = clean(row.get("STATUS"))
            record_id = rafiq_uuid(f"{namespace}:verification_claim:{collection_key}:{seq}")
            refs = [value for key, value in row.items() if key == "RUJUKAN" and clean(value)]
            ok = insert_source_record(
                conn, record_id=record_id, source_id=source_id, snapshot_id=snapshot_id,
                raw_object_id=raw_object_id, import_run_id=run_id,
                domain="hadith_verification", record_type="hadith_verification_claim",
                source_record_key=f"{namespace}:{collection_key}:{seq}",
                source_sequence=seq, raw_record=row,
                raw_text_hash=text_hash(json.dumps(row, ensure_ascii=False, sort_keys=True)),
            )
            if ok:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        insert into staging.hadith_verification_claims
                          (id, claim_text, raw_conclusion, normalized_conclusion,
                           claim_scope, scholar_researcher_raw, explanation,
                           references_json, classification_status,
                           review_status)
                        values (%s,%s,%s,%s,%s,%s,%s,%s::jsonb,%s,'unreviewed')
                        on conflict do nothing
                        """,
                        (
                            record_id, clean(row.get("TEKS BAHASA MALAYSIA") or row.get("TEKS BAHASA ARAB")),
                            raw_conclusion, normalize_conclusion(raw_conclusion),
                            "semakhadis_xlsx_seed_record",
                            clean(row.get("ULAMA/PENGKAJI HADIS")),
                            clean(row.get("KOMENTAR ULAMA/PENGKAJI HADIS")),
                            json.dumps(refs, ensure_ascii=False),
                            raw_conclusion,
                        ),
                    )
                staged += 1
            if not raw_conclusion:
                warnings += 1
        conn.commit()
        complete_import_run(conn, run_id, parsed=parsed, staged=staged,
                            warnings=warnings, input_objects=1)
        print(f"xlsx claims {collection_key}: {parsed} parsed, {staged} staged, {warnings} warnings")
    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        raise


def run_profile(conn, *, parser_name, object_path, profile):
    raw_object_id, snapshot_id, source_id = lookup_raw_object(conn, object_path)
    run_id = create_import_run(
        conn, snapshot_id=snapshot_id, parser_name=parser_name,
        parser_version=PARSER_VERSION,
        configuration={"object_path": object_path, "profile_only": True},
    )
    try:
        record_id = rafiq_uuid(f"{parser_name}:profile:{object_path}")
        ok = insert_source_record(
            conn, record_id=record_id, source_id=source_id, snapshot_id=snapshot_id,
            raw_object_id=raw_object_id, import_run_id=run_id,
            domain="hadith_profile", record_type="raw_object_profile",
            source_record_key=object_path, raw_record=profile,
            raw_text_hash=text_hash(json.dumps(profile, ensure_ascii=False, sort_keys=True)),
        )
        conn.commit()
        complete_import_run(conn, run_id, parsed=1, staged=1 if ok else 0,
                            warnings=0, input_objects=1)
        print(f"profile {parser_name}: {object_path}")
    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        raise


def profile_json(path):
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict):
        return {"json_type": "dict", "keys": list(data)[:50], "top_level_count": len(data)}
    return {"json_type": type(data).__name__, "top_level_count": len(data) if hasattr(data, "__len__") else None}


def profile_text(path):
    lines = 0
    nonempty = 0
    first = ""
    with open(path, encoding="utf-8", errors="replace") as fh:
        for line in fh:
            lines += 1
            if line.strip() and not first:
                first = line.strip()[:500]
            if line.strip():
                nonempty += 1
    return {"line_count": lines, "nonempty_line_count": nonempty, "first_nonempty_sample": first}


def profile_parquet(path):
    if pq is None:
        return {"profile_error": "pyarrow unavailable"}
    pf = pq.ParquetFile(path)
    schema = pf.schema.names
    sample = {}
    try:
        row = next(pf.iter_batches(batch_size=1)).to_pylist()[0]
        for key in schema[:20]:
            value = row.get(key)
            if isinstance(value, (bytes, bytearray)):
                value = {"bytes": len(value)}
            elif isinstance(value, dict):
                value = {k: ({"bytes": len(v)} if isinstance(v, (bytes, bytearray)) else clean(v)[:200]) for k, v in value.items()}
            else:
                value = clean(value)[:500]
            sample[key] = value
    except Exception as exc:
        sample = {"sample_error": str(exc)}
    direct_text_columns = [c for c in schema if c.lower() in {
        "text", "text_ar", "text_en", "arabic_full", "english_full",
        "english_text", "sentence", "arabic", "english",
    }]
    return {
        "num_rows": pf.metadata.num_rows,
        "num_row_groups": pf.metadata.num_row_groups,
        "columns": schema,
        "direct_text_columns": direct_text_columns,
        "sample": sample,
        "profile_decision": "profile_only_pending_source_specific_loader",
    }


def main():
    only_jsonl = "--only-jsonl" in sys.argv[1:]
    conn = get_connection()
    try:
        if not only_jsonl:
            for object_path, namespace, collection_key in CSV_FILES:
                run_text_rows(
                    conn, parser_name="parse_hadith_csv_generic",
                    object_path=object_path, namespace=namespace,
                    collection_key=collection_key,
                    rows=csv_rows(ROOT / object_path),
                    adapter=csv_adapter_for(namespace),
                )

        for object_path, namespace, collection_key, gzipped in JSONL_FILES:
            if only_jsonl and gzipped:
                continue
            adapter = sunnah_gz_adapter if gzipped else sarnsrun_adapter
            run_text_rows(
                conn, parser_name="parse_hadith_gzip_jsonl_generic" if gzipped else "parse_hadith_jsonl_generic",
                object_path=object_path, namespace=namespace,
                collection_key=collection_key,
                rows=iter_jsonl(ROOT / object_path, gzipped=gzipped),
                adapter=adapter,
            )

        if not only_jsonl:
            for object_path, namespace, collection_key in XLSX_FILES:
                run_xlsx_claims(conn, object_path, namespace, collection_key)

            for object_path in FAWAZ_PROFILE_FILES:
                run_profile(
                    conn, parser_name="parse_hadith_fawaz_metadata",
                    object_path=object_path,
                    profile=profile_json(ROOT / object_path),
                )

            for object_path in assigned_paths(conn, "parse_hadith_fawaz_originals_text"):
                run_profile(
                    conn, parser_name="parse_hadith_fawaz_originals_text",
                    object_path=object_path,
                    profile=profile_text(ROOT / object_path),
                )

            for object_path in assigned_paths(conn, "parse_hadith_parquet_generic"):
                run_profile(
                    conn, parser_name="parse_hadith_parquet_generic",
                    object_path=object_path,
                    profile=profile_parquet(ROOT / object_path),
                )
    finally:
        conn.close()


if __name__ == "__main__":
    main()
