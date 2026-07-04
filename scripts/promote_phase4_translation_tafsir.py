#!/usr/bin/env python3
"""
RAFIQ Phase 4 - Translation and tafsir canonical promotion.

Promotes:
  - translation editions and text variants
  - tafsir editions, passages, and passage-to-ayah links
  - provenance and private release states
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from db_utils import get_connection, create_import_run, complete_import_run, fail_import_run, rafiq_uuid

PARSER_NAME = "promote_phase4_translation_tafsir"
PARSER_VERSION = "1.0.0"


def release_state(entity_type: str, entity_id: str, notes: str = ""):
    return (
        rafiq_uuid(f"phase4:release:{entity_type}:{entity_id}:1"),
        entity_type,
        str(entity_id),
        "1",
        "validated",
        "pending",
        "pending",
        "unreviewed",
        "unreviewed",
        "private_only",
        notes,
    )


def add_release_states(conn, rows):
    if not rows:
        return 0
    with conn.cursor() as cur:
        cur.executemany(
            """
            insert into content.entity_release_states
              (id, entity_type, entity_id, entity_version, technical_status,
               rights_status, attribution_status, editorial_status,
               scholar_content_status, publication_status, notes)
            values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            on conflict (entity_type, entity_id, entity_version) do nothing
            """,
            rows,
        )
        return cur.rowcount


def add_provenance(conn, rows):
    if not rows:
        return 0
    with conn.cursor() as cur:
        cur.executemany(
            """
            insert into content.entity_provenance
              (id, entity_type, entity_id, staging_table, staging_record_id,
               source_snapshot_id, transformation_event_id, provenance_role,
               mapping_method)
            values (%s,%s,%s,%s,%s,%s,%s,%s,%s)
            on conflict (entity_type, entity_id, staging_table, staging_record_id, provenance_role)
            do nothing
            """,
            rows,
        )
        return cur.rowcount


def create_transformation_event(conn, run_id):
    event_id = rafiq_uuid("phase4:transformation:translation_tafsir:v1")
    with conn.cursor() as cur:
        cur.execute(
            """
            insert into ingest.transformation_events
              (id, import_run_id, transformation_type, transformation_version,
               configuration, description)
            values (%s,%s,%s,%s,%s::jsonb,%s)
            on conflict (id) do update
              set import_run_id = excluded.import_run_id,
                  configuration = excluded.configuration,
                  description = excluded.description
            """,
            (
                event_id,
                run_id,
                "canonical_promotion",
                "phase4-translation-tafsir-v1",
                json.dumps({"scope": "translation_texts_and_tafsir"}),
                "Promote canonical translation and tafsir records from Phase 3 staging.",
            ),
        )
    return event_id


def promote_translations(conn, event_id):
    with conn.cursor() as cur:
        cur.execute(
            """
            select tt.edition_label, tt.language_code, tt.translator_label,
                   min(sr.snapshot_id::text) as snapshot_id
              from staging.translation_texts tt
              join staging.source_records sr on sr.id = tt.id
             group by tt.edition_label, tt.language_code, tt.translator_label
             order by tt.edition_label
            """
        )
        edition_rows = []
        release_rows = []
        for edition_label, language_code, translator, snapshot_id in cur.fetchall():
            edition_id = rafiq_uuid(f"phase4:translation_edition:{edition_label}")
            edition_rows.append(
                (
                    edition_id,
                    edition_label,
                    language_code,
                    translator,
                    f"{translator or edition_label} ({edition_label})",
                    "phase4-promoted",
                    snapshot_id,
                )
            )
            release_rows.append(release_state("translation_edition", edition_id, "Private canonical translation edition."))

        cur.executemany(
            """
            insert into content.translation_editions
              (id, edition_key, language_code, translator_name, title,
               version_label, source_snapshot_id)
            values (%s,%s,%s,%s,%s,%s,%s)
            on conflict (edition_key) do update
              set language_code = excluded.language_code,
                  translator_name = excluded.translator_name,
                  title = excluded.title,
                  source_snapshot_id = excluded.source_snapshot_id,
                  version_label = excluded.version_label
            """,
            edition_rows,
        )
        editions_count = cur.rowcount

        cur.execute(
            """
            insert into content.translation_texts
              (id, edition_id, ayah_id, variant_type, text_value,
               source_markup, text_hash)
            select gen_random_uuid(),
                   te.id,
                   qa.id,
                   tt.variant_type,
                   tt.text_value,
                   tt.source_markup,
                   case when tt.text_value is null then null
                        else encode(digest(tt.text_value, 'sha256'), 'hex')
                   end
              from staging.translation_texts tt
              join content.translation_editions te on te.edition_key = tt.edition_label
              join content.quran_ayahs qa
                on qa.surah_number = split_part(tt.ayah_key, ':', 1)::smallint
               and qa.ayah_number = split_part(tt.ayah_key, ':', 2)::smallint
            on conflict (edition_id, ayah_id, variant_type) do update
              set text_value = excluded.text_value,
                  source_markup = excluded.source_markup,
                  text_hash = excluded.text_hash
            """
        )
        texts_count = cur.rowcount

        cur.execute(
            """
            select ct.id, tt.id as staging_id, sr.snapshot_id
              from staging.translation_texts tt
              join content.translation_editions te on te.edition_key = tt.edition_label
              join content.quran_ayahs qa
                on qa.surah_number = split_part(tt.ayah_key, ':', 1)::smallint
               and qa.ayah_number = split_part(tt.ayah_key, ':', 2)::smallint
              join content.translation_texts ct
                on ct.edition_id = te.id
               and ct.ayah_id = qa.id
               and ct.variant_type = tt.variant_type
              join staging.source_records sr on sr.id = tt.id
            """
        )
        prov_rows = [
            (
                rafiq_uuid(f"phase4:prov:translation_text:{row[0]}:{row[1]}"),
                "translation_text",
                str(row[0]),
                "staging.translation_texts",
                str(row[1]),
                str(row[2]),
                event_id,
                "primary_source",
                "direct_translation_text_promotion",
            )
            for row in cur.fetchall()
        ]

        cur.execute("select id from content.translation_texts")
        release_rows.extend(
            release_state("translation_text", str(row[0]), "Private canonical translation text.")
            for row in cur.fetchall()
        )

    return editions_count, texts_count, add_provenance(conn, prov_rows), add_release_states(conn, release_rows)


def promote_tafsir(conn, event_id):
    with conn.cursor() as cur:
        cur.execute(
            """
            select tp.source_edition_label, tp.language_code, min(sr.snapshot_id::text)
              from staging.tafsir_passages tp
              join staging.source_records sr on sr.id = tp.id
             group by tp.source_edition_label, tp.language_code
             order by tp.source_edition_label
            """
        )
        edition_rows = []
        release_rows = []
        for edition_label, language_code, snapshot_id in cur.fetchall():
            edition_id = rafiq_uuid(f"phase4:tafsir_edition:{edition_label}")
            edition_rows.append(
                (
                    edition_id,
                    edition_label,
                    edition_label,
                    language_code,
                    "phase4-promoted",
                    snapshot_id,
                )
            )
            release_rows.append(release_state("tafsir_edition", edition_id, "Private canonical tafsir edition."))

        cur.executemany(
            """
            insert into content.tafsir_editions
              (id, edition_key, title, language_code, version_label, source_snapshot_id)
            values (%s,%s,%s,%s,%s,%s)
            on conflict (edition_key) do update
              set language_code = excluded.language_code,
                  source_snapshot_id = excluded.source_snapshot_id,
                  version_label = excluded.version_label
            """,
            edition_rows,
        )
        editions_count = cur.rowcount

        cur.execute(
            """
            insert into content.tafsir_passages
              (id, edition_id, passage_key, passage_text, source_html,
               blank_text, text_hash)
            select gen_random_uuid(),
                   te.id,
                   tp.group_ayah_key,
                   tp.passage_text,
                   tp.source_html,
                   tp.blank_text,
                   case when tp.passage_text is null then null
                        else encode(digest(tp.passage_text, 'sha256'), 'hex')
                   end
              from staging.tafsir_passages tp
              join content.tafsir_editions te on te.edition_key = tp.source_edition_label
            on conflict (edition_id, passage_key) do update
              set passage_text = excluded.passage_text,
                  source_html = excluded.source_html,
                  blank_text = excluded.blank_text,
                  text_hash = excluded.text_hash
            """
        )
        passages_count = cur.rowcount

        cur.execute(
            """
            insert into content.tafsir_passage_ayahs
              (passage_id, ayah_id, source_order, source_role)
            select cp.id,
                   qa.id,
                   tpa.source_order,
                   tpa.source_role
              from staging.tafsir_passage_ayahs tpa
              join staging.tafsir_passages tp on tp.id = tpa.passage_id
              join content.tafsir_editions te on te.edition_key = tp.source_edition_label
              join content.tafsir_passages cp
                on cp.edition_id = te.id
               and cp.passage_key = tp.group_ayah_key
              join content.quran_ayahs qa
                on qa.surah_number = split_part(tpa.ayah_key, ':', 1)::smallint
               and qa.ayah_number = split_part(tpa.ayah_key, ':', 2)::smallint
            on conflict (passage_id, ayah_id) do update
              set source_order = excluded.source_order,
                  source_role = excluded.source_role
            """
        )
        links_count = cur.rowcount

        cur.execute(
            """
            select cp.id, tp.id as staging_id, sr.snapshot_id
              from staging.tafsir_passages tp
              join content.tafsir_editions te on te.edition_key = tp.source_edition_label
              join content.tafsir_passages cp
                on cp.edition_id = te.id
               and cp.passage_key = tp.group_ayah_key
              join staging.source_records sr on sr.id = tp.id
            """
        )
        prov_rows = [
            (
                rafiq_uuid(f"phase4:prov:tafsir_passage:{row[0]}:{row[1]}"),
                "tafsir_passage",
                str(row[0]),
                "staging.tafsir_passages",
                str(row[1]),
                str(row[2]),
                event_id,
                "primary_source",
                "direct_tafsir_passage_promotion",
            )
            for row in cur.fetchall()
        ]

        cur.execute("select id from content.tafsir_passages")
        release_rows.extend(
            release_state("tafsir_passage", str(row[0]), "Private canonical tafsir passage.")
            for row in cur.fetchall()
        )

    return editions_count, passages_count, links_count, add_provenance(conn, prov_rows), add_release_states(conn, release_rows)


def main():
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("select snapshot_id from staging.source_records where domain in ('translation','tafsir') limit 1")
        snapshot_id = str(cur.fetchone()[0])
    run_id = create_import_run(
        conn,
        snapshot_id=snapshot_id,
        parser_name=PARSER_NAME,
        parser_version=PARSER_VERSION,
        configuration={"scope": "translation_tafsir"},
        code_revision="phase4-v1",
    )
    try:
        event_id = create_transformation_event(conn, run_id)
        tr_ed, tr_texts, tr_prov, tr_release = promote_translations(conn, event_id)
        taf_ed, taf_passages, taf_links, taf_prov, taf_release = promote_tafsir(conn, event_id)
        conn.commit()
        parsed = 49888 + 18708 + 18708
        staged = tr_ed + tr_texts + tr_prov + tr_release + taf_ed + taf_passages + taf_links + taf_prov + taf_release
        complete_import_run(conn, run_id, parsed=parsed, staged=staged, warnings=0, input_objects=1)
        print("phase4 translation/tafsir complete")
        print(f"translation_editions={tr_ed} translation_texts={tr_texts}")
        print(f"tafsir_editions={taf_ed} tafsir_passages={taf_passages} tafsir_links={taf_links}")
        print(f"provenance={tr_prov + taf_prov} release_states={tr_release + taf_release}")
    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
