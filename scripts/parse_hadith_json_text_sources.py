#!/usr/bin/env python3
"""
RAFIQ Phase 3 - Load additional JSON Hadith text sources.

Checkpoint scope:
  - Abdullah Naseer six-books JSON
  - MeeAtif multilingual JSON
  - AhmedBaset quarantined hadith-json by-book JSON

Each dataset receives its own source namespace. Similar collection names or
Hadith numbers are not merged across sources.
"""

import json
import re
import sys
from pathlib import Path

ARGS = [arg for arg in sys.argv[1:] if arg.startswith("--")]
POSITIONAL_ARGS = [arg for arg in sys.argv[1:] if not arg.startswith("--")]
ROOT = Path(POSITIONAL_ARGS[0]) if POSITIONAL_ARGS else Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from db_utils import (
    get_connection, lookup_raw_object, create_import_run, complete_import_run,
    fail_import_run, insert_source_record, rafiq_uuid, text_hash,
)

PARSER_VERSION = "1.0.1"

ABDULLAH_FILES = [
    ("data/raw/hadith/collections/abdullah-naseer-six-books/src/abu-dawood.json", "abdullah", "abu-dawood"),
    ("data/raw/hadith/collections/abdullah-naseer-six-books/src/al-tirmidhi.json", "abdullah", "al-tirmidhi"),
    ("data/raw/hadith/collections/abdullah-naseer-six-books/src/ibn-e-majah.json", "abdullah", "ibn-e-majah"),
    ("data/raw/hadith/collections/abdullah-naseer-six-books/src/sahih-bukhari.json", "abdullah", "sahih-bukhari"),
    ("data/raw/hadith/collections/abdullah-naseer-six-books/src/sahih-muslim.json", "abdullah", "sahih-muslim"),
    ("data/raw/hadith/collections/abdullah-naseer-six-books/src/sunan-nasai.json", "abdullah", "sunan-nasai"),
]

MEEATIF_FILES = [
    ("data/raw/hadith/multilingual/hf-meeatif-hadith-datasets/Jami` at-Tirmidhi.json", "meeatif", "jami-at-tirmidhi"),
    ("data/raw/hadith/multilingual/hf-meeatif-hadith-datasets/Sahih al-Bukhari.json", "meeatif", "sahih-al-bukhari"),
    ("data/raw/hadith/multilingual/hf-meeatif-hadith-datasets/Sahih Muslim.json", "meeatif", "sahih-muslim"),
    ("data/raw/hadith/multilingual/hf-meeatif-hadith-datasets/Sunan Abi Dawud.json", "meeatif", "sunan-abi-dawud"),
    ("data/raw/hadith/multilingual/hf-meeatif-hadith-datasets/Sunan an-Nasa'i.json", "meeatif", "sunan-an-nasai"),
    ("data/raw/hadith/multilingual/hf-meeatif-hadith-datasets/Sunan Ibn Majah.json", "meeatif", "sunan-ibn-majah"),
]

AHMEDBASET_FILES = [
    ("data/raw/hadith/quarantined/ahmedbaset-hadith-json-v1.2.0/db/by_book/the_9_books/abudawud.json", "ahmedbaset", "abudawud"),
    ("data/raw/hadith/quarantined/ahmedbaset-hadith-json-v1.2.0/db/by_book/the_9_books/bukhari.json", "ahmedbaset", "bukhari"),
    ("data/raw/hadith/quarantined/ahmedbaset-hadith-json-v1.2.0/db/by_book/the_9_books/ibnmajah.json", "ahmedbaset", "ibnmajah"),
    ("data/raw/hadith/quarantined/ahmedbaset-hadith-json-v1.2.0/db/by_book/the_9_books/muslim.json", "ahmedbaset", "muslim"),
    ("data/raw/hadith/quarantined/ahmedbaset-hadith-json-v1.2.0/db/by_book/the_9_books/nasai.json", "ahmedbaset", "nasai"),
    ("data/raw/hadith/quarantined/ahmedbaset-hadith-json-v1.2.0/db/by_book/the_9_books/tirmidhi.json", "ahmedbaset", "tirmidhi"),
]


def stable_record_id(namespace: str, collection_key: str, hadith_number: str) -> str:
    return rafiq_uuid(f"{namespace}:hadith_record:{collection_key}:{hadith_number}")


def stable_text_id(namespace: str, collection_key: str, hadith_number: str,
                   language_code: str, sequence: int) -> str:
    return rafiq_uuid(
        f"{namespace}:hadith_text_version:{collection_key}:{hadith_number}:{sequence}:{language_code}"
    )


def clean_text(value) -> str:
    if value is None:
        return ""
    return str(value).strip()


def number_from_reference(reference: str, fallback: int) -> str:
    match = re.search(r":(\d+)\s*$", reference or "")
    return match.group(1) if match else str(fallback)


def ensure_record(conn, *, record_id, source_id, snapshot_id, raw_object_id, import_run_id,
                  namespace, collection_key, row, hadith_number, chapter_key=None,
                  book_key=None, printed_reference=None):
    inserted = insert_source_record(
        conn, record_id=record_id, source_id=source_id, snapshot_id=snapshot_id,
        raw_object_id=raw_object_id, import_run_id=import_run_id, domain="hadith",
        record_type="hadith_record",
        source_record_key=f"{namespace}:{collection_key}:{hadith_number}",
        source_sequence=int(hadith_number) if str(hadith_number).isdigit() else None,
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
            (
                record_id, collection_key, namespace, book_key,
                chapter_key, str(hadith_number), printed_reference,
            ),
        )
    return inserted


def insert_text_version(conn, *, text_id, hadith_record_id, source_id, snapshot_id,
                        raw_object_id, import_run_id, namespace, collection_key,
                        hadith_number, language_code, full_text, narrator_prefix="",
                        source_locator="", sequence=None):
    if not full_text:
        return False
    inserted = insert_source_record(
        conn, record_id=text_id, source_id=source_id, snapshot_id=snapshot_id,
        raw_object_id=raw_object_id, import_run_id=import_run_id, domain="hadith",
        record_type="hadith_text_version",
        source_record_key=f"{namespace}:{collection_key}:{hadith_number}:{sequence}:{language_code}",
        source_locator=source_locator,
        source_sequence=sequence,
        raw_text_hash=text_hash(full_text),
    )
    with conn.cursor() as cur:
        cur.execute(
            """
            insert into staging.hadith_text_versions
              (id, hadith_record_id, language_code, full_text, narrator_prefix)
            values (%s,%s,%s,%s,%s)
            on conflict do nothing
            """,
            (text_id, hadith_record_id, language_code, full_text, narrator_prefix or None),
        )
    return inserted


def load_rows(conn, *, parser_name, object_path, namespace, collection_key, rows, row_adapter):
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
            item = row_adapter(row, seq)
            hadith_number = item["hadith_number"]
            record_id = stable_record_id(namespace, collection_key, hadith_number)
            if ensure_record(
                conn, record_id=record_id, source_id=source_id,
                snapshot_id=snapshot_id, raw_object_id=raw_object_id,
                import_run_id=run_id, namespace=namespace,
                collection_key=collection_key, row=row,
                hadith_number=hadith_number,
                chapter_key=item.get("chapter_key"),
                book_key=item.get("book_key"),
                printed_reference=item.get("printed_reference"),
            ):
                records += 1

            for lang, text, narrator in item["texts"]:
                text_id = stable_text_id(namespace, collection_key, hadith_number, lang, seq)
                if insert_text_version(
                    conn, text_id=text_id, hadith_record_id=record_id,
                    source_id=source_id, snapshot_id=snapshot_id,
                    raw_object_id=raw_object_id, import_run_id=run_id,
                    namespace=namespace, collection_key=collection_key,
                    hadith_number=hadith_number, language_code=lang,
                    full_text=text, narrator_prefix=narrator,
                    source_locator=f"row:{seq}:lang:{lang}",
                    sequence=seq,
                ):
                    texts += 1

            if not item["texts"]:
                warnings += 1
            if parsed % 1000 == 0:
                conn.commit()
        conn.commit()
        complete_import_run(conn, run_id, parsed=parsed, staged=records + texts,
                            warnings=warnings, input_objects=1)
        print(f"{parser_name} {collection_key}: {parsed} parsed, {records} records, {texts} texts")
    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        raise


def abdullah_adapter(row, seq):
    hadith_number = clean_text(row.get("hadithNumber") or row.get("id") or seq)
    texts = [
        ("ar", clean_text(row.get("hadithArabic")), ""),
        ("en", clean_text(row.get("hadithEnglish")), clean_text(row.get("englishNarrator"))),
        ("ur", clean_text(row.get("hadithUrdu")), clean_text(row.get("urduNarrator"))),
    ]
    return {
        "hadith_number": hadith_number,
        "chapter_key": clean_text(row.get("chapterId")),
        "book_key": clean_text(row.get("bookSlug")),
        "printed_reference": clean_text(row.get("volume")),
        "texts": [(lang, text, narrator) for lang, text, narrator in texts if text],
    }


def meeatif_adapter(row, seq):
    hadith_number = number_from_reference(clean_text(row.get("Reference")), seq)
    texts = [
        ("ar", clean_text(row.get("Arabic_Text")), ""),
        ("en", clean_text(row.get("English_Text")), ""),
    ]
    return {
        "hadith_number": hadith_number,
        "chapter_key": clean_text(row.get("Chapter_Number")),
        "book_key": clean_text(row.get("Book")),
        "printed_reference": clean_text(row.get("In-book reference") or row.get("Reference")),
        "texts": [(lang, text, narrator) for lang, text, narrator in texts if text],
    }


def ahmedbaset_adapter(row, seq):
    hadith_number = clean_text(row.get("idInBook") or row.get("id") or seq)
    english = row.get("english") or {}
    en_text = " ".join(part for part in [
        clean_text(english.get("narrator")),
        clean_text(english.get("text")),
    ] if part)
    texts = [
        ("ar", clean_text(row.get("arabic")), ""),
        ("en", en_text, clean_text(english.get("narrator"))),
    ]
    return {
        "hadith_number": hadith_number,
        "chapter_key": clean_text(row.get("chapterId")),
        "book_key": clean_text(row.get("bookId")),
        "printed_reference": f"{row.get('bookId', '')}:{hadith_number}".strip(":"),
        "texts": [(lang, text, narrator) for lang, text, narrator in texts if text],
    }


def main():
    skip_abdullah = "--skip-abdullah" in ARGS
    conn = get_connection()
    try:
        if not skip_abdullah:
            for object_path, namespace, collection_key in ABDULLAH_FILES:
                data = json.loads((ROOT / object_path).read_text(encoding="utf-8"))
                rows = data["hadiths"]["data"]
                load_rows(
                    conn, parser_name="parse_hadith_abdullah_json",
                    object_path=object_path, namespace=namespace,
                    collection_key=collection_key, rows=rows,
                    row_adapter=abdullah_adapter,
                )

        for object_path, namespace, collection_key in MEEATIF_FILES:
            rows = json.loads((ROOT / object_path).read_text(encoding="utf-8"))
            load_rows(
                conn, parser_name="parse_hadith_json_generic",
                object_path=object_path, namespace=namespace,
                collection_key=collection_key, rows=rows,
                row_adapter=meeatif_adapter,
            )

        for object_path, namespace, collection_key in AHMEDBASET_FILES:
            data = json.loads((ROOT / object_path).read_text(encoding="utf-8"))
            load_rows(
                conn, parser_name="parse_hadith_json_generic",
                object_path=object_path, namespace=namespace,
                collection_key=collection_key, rows=data["hadiths"],
                row_adapter=ahmedbaset_adapter,
            )
    finally:
        conn.close()


if __name__ == "__main__":
    main()
