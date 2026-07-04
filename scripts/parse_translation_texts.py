#!/usr/bin/env python3
"""
RAFIQ Phase 3 – Task 9
Parse translation files → staging.translation_texts

Sources:
  Tanzil (pipe-delimited .txt):
    data/raw/translations/tanzil/en.sahih.txt         → en / Saheeh International / simple
    data/raw/translations/tanzil/ms.basmeih.txt       → ms / Basmeih / simple
    data/raw/translations/tanzil/id.indonesian.txt    → id / Kemenag / simple

  QUL (JSON):
    data/raw/translations/qul/en-sahih-international-simple.json           → simple
    data/raw/translations/qul/en-sahih-international-inline-footnotes.json → inline_footnotes
    data/raw/translations/qul/en-sahih-international-with-footnote-tags.json → tagged_html
    data/raw/translations/qul/en-sahih-international-chunks.json           → chunks (stored as plain)
    data/raw/translations/qul/abdullah-basamia-simple.json                 → ms / Basamia / simple

variant_type values: simple | inline_footnotes | tagged_html | chunks_plain

Usage:
    python scripts/parse_translation_texts.py [project_root]
"""

import sys
import json
import re
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from db_utils import (
    get_connection, lookup_raw_object, create_import_run,
    complete_import_run, fail_import_run,
    insert_source_record, text_hash, new_uuid,
)

PARSER_NAME    = "parse_translation_texts"
PARSER_VERSION = "1.0.0"

# ── Source definitions ────────────────────────────────────────────────────────
# Each entry: (object_path, language_code, translator_label, edition_label, variant_type)
SOURCES = [
    # Tanzil plain-text
    (
        "data/raw/translations/tanzil/en.sahih.txt",
        "en", "Saheeh International", "tanzil-en-sahih", "simple",
    ),
    (
        "data/raw/translations/tanzil/ms.basmeih.txt",
        "ms", "Abdullah Basmeih", "tanzil-ms-basmeih", "simple",
    ),
    (
        "data/raw/translations/tanzil/id.indonesian.txt",
        "id", "Kemenag RI", "tanzil-id-indonesian", "simple",
    ),
    # QUL JSON
    (
        "data/raw/translations/qul/en-sahih-international-simple.json",
        "en", "Saheeh International", "qul-en-sahih-simple", "simple",
    ),
    (
        "data/raw/translations/qul/en-sahih-international-inline-footnotes.json",
        "en", "Saheeh International", "qul-en-sahih-inline-footnotes", "inline_footnotes",
    ),
    (
        "data/raw/translations/qul/en-sahih-international-with-footnote-tags.json",
        "en", "Saheeh International", "qul-en-sahih-tagged-html", "tagged_html",
    ),
    (
        "data/raw/translations/qul/en-sahih-international-chunks.json",
        "en", "Saheeh International", "qul-en-sahih-chunks", "chunks_plain",
    ),
    (
        "data/raw/translations/qul/abdullah-basamia-simple.json",
        "ms", "Abdullah Basamia", "qul-ms-basamia-simple", "simple",
    ),
]


# ── Parsers: yield (ayah_key, plain_text, source_markup) ─────────────────────
def parse_tanzil_pipe(path: Path):
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            line = line.rstrip("\n")
            if not line or line.startswith("#"):
                continue
            parts = line.split("|", 2)
            if len(parts) != 3:
                continue
            surah, ayah, text = parts[0], parts[1], parts[2]
            ayah_key = f"{surah}:{ayah}"
            yield ayah_key, text, None


def _chunks_to_plain(t_list: list) -> str:
    """Flatten a QUL chunks 't' array to plain text (drop footnote markers)."""
    parts = []
    for item in t_list:
        if isinstance(item, str):
            parts.append(item)
        # dicts like {'f': 1} are footnote markers — skip for plain text
    return "".join(parts)


def _strip_footnote_tags(html: str) -> str:
    """Remove <sup foot_note="...">N</sup> tags from tagged_html variant."""
    return re.sub(r'<sup[^>]*>\d+</sup>', '', html)


def parse_qul_json(path: Path, variant_type: str):
    """
    Yield (ayah_key, plain_text, source_markup) from a QUL translation JSON.
    For simple/inline_footnotes: source_markup = None (t is already the text).
    For tagged_html: source_markup = original HTML, plain_text = stripped.
    For chunks_plain: flatten chunks array to plain text.
    """
    data = json.loads(path.read_text(encoding="utf-8"))
    for key in sorted(data.keys(), key=lambda k: (int(k.split(":")[0]), int(k.split(":")[1]))):
        val = data[key]
        t = val.get("t", "")
        ayah_key = key

        if variant_type == "tagged_html":
            plain = _strip_footnote_tags(t).strip()
            markup = t
        elif variant_type == "chunks_plain":
            if isinstance(t, list):
                plain = _chunks_to_plain(t)
                markup = json.dumps(val)   # store full chunks JSON as markup
            else:
                plain = str(t)
                markup = None
        else:
            # simple or inline_footnotes — store as-is
            plain = t if isinstance(t, str) else str(t)
            markup = None

        yield ayah_key, plain, markup


# ── Per-source import run ─────────────────────────────────────────────────────
def run_one(conn, object_path, language_code, translator_label,
            edition_label, variant_type):
    abs_path = ROOT / object_path
    if not abs_path.exists():
        print(f"  SKIP – file not found: {abs_path}")
        return 0, 0

    raw_object_id, snapshot_id, source_id = lookup_raw_object(conn, object_path)

    config = {
        "object_path": object_path,
        "language_code": language_code,
        "edition_label": edition_label,
        "variant_type": variant_type,
    }
    run_id = create_import_run(
        conn,
        snapshot_id=snapshot_id,
        parser_name=PARSER_NAME,
        parser_version=PARSER_VERSION,
        configuration=config,
    )
    print(f"  import_run {run_id[:8]}…  [{edition_label} / {variant_type}]")

    is_tanzil = object_path.endswith(".txt")
    if is_tanzil:
        rows = parse_tanzil_pipe(abs_path)
    else:
        rows = parse_qul_json(abs_path, variant_type)

    parsed = staged = warnings = 0

    try:
        for seq, (ayah_key, plain_text, source_markup) in enumerate(rows, 1):
            parsed += 1
            record_id = new_uuid()
            th = text_hash(plain_text)

            ok = insert_source_record(
                conn,
                record_id=record_id,
                source_id=source_id,
                snapshot_id=snapshot_id,
                raw_object_id=raw_object_id,
                import_run_id=run_id,
                domain="translation",
                record_type="translation_text",
                source_record_key=ayah_key,
                source_locator=edition_label,
                source_sequence=seq,
                raw_text_hash=th,
            )

            if ok:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO staging.translation_texts
                          (id, ayah_key, language_code, translator_label,
                           edition_label, variant_type, text_value, source_markup)
                        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
                        ON CONFLICT DO NOTHING
                        """,
                        (
                            record_id, ayah_key, language_code,
                            translator_label, edition_label,
                            variant_type, plain_text, source_markup,
                        ),
                    )
                staged += 1

            if parsed % 1000 == 0:
                conn.commit()

        conn.commit()
        complete_import_run(
            conn, run_id,
            parsed=parsed, staged=staged, warnings=warnings,
            rejected=parsed - staged,
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
        for args in SOURCES:
            object_path, lang, translator, edition, variant = args
            print(f"\nParsing {edition} …")
            p, s = run_one(conn, object_path, lang, translator, edition, variant)
            total_parsed += p
            total_staged += s
    finally:
        conn.close()

    print(f"\n=== translation_texts total: {total_parsed} parsed, {total_staged} staged ===")

    conn2 = get_connection()
    try:
        with conn2.cursor() as cur:
            cur.execute(
                """
                SELECT language_code, edition_label, variant_type, COUNT(*)
                  FROM staging.translation_texts
                 GROUP BY 1,2,3
                 ORDER BY 1,2,3
                """
            )
            print("\nstaging.translation_texts counts:")
            for row in cur.fetchall():
                print(f"  {row[0]} / {row[1]} / {row[2]}: {row[3]}")
    finally:
        conn2.close()


if __name__ == "__main__":
    main()
