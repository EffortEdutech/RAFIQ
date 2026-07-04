#!/usr/bin/env python3
"""
RAFIQ Phase 4 - Canonical Quran foundation promotion.

Promotes:
  - canonical surahs and ayahs
  - Quran text editions and ayah texts
  - Quran partition schemes and partitions
  - provenance and private release states
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from db_utils import get_connection, create_import_run, complete_import_run, fail_import_run, rafiq_uuid, text_hash

PARSER_NAME = "promote_phase4_quran_foundation"
PARSER_VERSION = "1.0.0"


def ayah_id_from_key(key: str) -> int:
    surah, ayah = key.split(":")
    # Content ayah IDs equal global ayah number after quran_ayahs promotion.
    # Lookup happens in SQL for set operations; this helper is for generated IDs only.
    return int(surah) * 1000 + int(ayah)


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
    event_id = rafiq_uuid("phase4:transformation:quran_foundation:v1")
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
                "phase4-quran-foundation-v1",
                json.dumps({"scope": "quran_surahs_ayahs_texts_partitions"}),
                "Promote canonical Quran identities, text editions, and partition schemes from Phase 3 staging.",
            ),
        )
    return event_id


def promote_surahs_and_ayahs(conn, event_id):
    with conn.cursor() as cur:
        cur.execute(
            """
            insert into content.quran_surahs
              (id, surah_number, canonical_name_latin, ayah_count)
            select source_partition_id::smallint,
                   source_partition_id::smallint,
                   source_label,
                   split_part(end_ayah_key, ':', 2)::smallint
              from staging.quran_partitions
             where partition_type = 'qul_surah'
            on conflict (id) do update
              set canonical_name_latin = excluded.canonical_name_latin,
                  ayah_count = excluded.ayah_count
            """
        )
        surahs_inserted = cur.rowcount

        cur.execute(
            """
            with ayahs as (
              select distinct surah_number, ayah_number
                from staging.quran_ayah_texts
            ), numbered as (
              select row_number() over (order by surah_number, ayah_number)::integer as global_no,
                     surah_number, ayah_number
                from ayahs
            )
            insert into content.quran_ayahs
              (id, surah_number, ayah_number, global_ayah_number)
            select global_no, surah_number, ayah_number, global_no
              from numbered
            on conflict (id) do nothing
            """
        )
        ayahs_inserted = cur.rowcount

    # Provenance for surahs from QUL surah rows.
    with conn.cursor() as cur:
        cur.execute(
            """
            select qp.id, qp.source_partition_id, sr.snapshot_id
              from staging.quran_partitions qp
              join staging.source_records sr on sr.id = qp.id
             where qp.partition_type = 'qul_surah'
            """
        )
        surah_prov = [
            (
                rafiq_uuid(f"phase4:prov:quran_surah:{row[1]}:{row[0]}"),
                "quran_surah",
                str(row[1]),
                "staging.quran_partitions",
                str(row[0]),
                str(row[2]),
                event_id,
                "primary_source",
                "deterministic_surah_number_from_qul_metadata",
            )
            for row in cur.fetchall()
        ]

        cur.execute(
            """
            with ranked as (
              select qat.id as staging_id, qa.id as ayah_id, sr.snapshot_id,
                     row_number() over (
                       partition by qa.id
                       order by case qat.script_label when 'tanzil_uthmani' then 0 else 1 end,
                                qat.script_label
                     ) as rn
                from staging.quran_ayah_texts qat
                join content.quran_ayahs qa
                  on qa.surah_number = qat.surah_number
                 and qa.ayah_number = qat.ayah_number
                join staging.source_records sr on sr.id = qat.id
            )
            select staging_id, ayah_id, snapshot_id
              from ranked
             where rn = 1
            """
        )
        ayah_prov = [
            (
                rafiq_uuid(f"phase4:prov:quran_ayah:{row[1]}:{row[0]}"),
                "quran_ayah",
                str(row[1]),
                "staging.quran_ayah_texts",
                str(row[0]),
                str(row[2]),
                event_id,
                "identity_source",
                "deterministic_ayah_identity_from_surah_ayah",
            )
            for row in cur.fetchall()
        ]

    return surahs_inserted, ayahs_inserted, add_provenance(conn, surah_prov + ayah_prov)


def promote_quran_texts(conn, event_id):
    edition_meta = {
        "tanzil_uthmani": ("Tanzil Uthmani", "uthmani", "source_includes_bismillah_in_first_ayahs", "none"),
        "qul_uthmani": ("QUL Uthmani", "uthmani", "source_policy_unreviewed", "none"),
        "qul_qpc_hafs": ("QUL QPC Hafs", "qpc_hafs", "source_policy_unreviewed", "none"),
    }
    with conn.cursor() as cur:
        cur.execute(
            """
            select qat.script_label, min(sr.snapshot_id::text)
              from staging.quran_ayah_texts qat
              join staging.source_records sr on sr.id = qat.id
             group by qat.script_label
             order by qat.script_label
            """
        )
        edition_rows = []
        release_rows = []
        for script_label, snapshot_id in cur.fetchall():
            name, orthography, bismillah, marker = edition_meta.get(
                script_label,
                (script_label, script_label, "source_policy_unreviewed", "unknown"),
            )
            edition_id = rafiq_uuid(f"phase4:quran_text_edition:{script_label}")
            edition_rows.append(
                (
                    edition_id,
                    script_label,
                    name,
                    script_label,
                    orthography,
                    "ar",
                    bismillah,
                    marker,
                    snapshot_id,
                    "phase4-promoted",
                )
            )
            release_rows.append(release_state("quran_text_edition", edition_id, "Private canonical Quran text edition."))

        cur.executemany(
            """
            insert into content.quran_text_editions
              (id, edition_key, name, script_label, orthography_label,
               language_code, bismillah_policy, ayah_end_marker_style,
               source_snapshot_id, version_label)
            values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            on conflict (edition_key) do update
              set name = excluded.name,
                  source_snapshot_id = excluded.source_snapshot_id,
                  version_label = excluded.version_label
            """,
            edition_rows,
        )
        editions_inserted = cur.rowcount

        cur.execute(
            """
            insert into content.quran_ayah_texts
              (id, edition_id, ayah_id, text_value, text_hash)
            select gen_random_uuid(),
                   qte.id,
                   qa.id,
                   qat.text_value,
                   encode(digest(qat.text_value, 'sha256'), 'hex')
              from staging.quran_ayah_texts qat
              join content.quran_text_editions qte
                on qte.edition_key = qat.script_label
              join content.quran_ayahs qa
                on qa.surah_number = qat.surah_number
               and qa.ayah_number = qat.ayah_number
            on conflict (edition_id, ayah_id) do update
              set text_value = excluded.text_value,
                  text_hash = excluded.text_hash
            """
        )
        texts_inserted = cur.rowcount

        cur.execute(
            """
            select cqt.id, cqt.edition_id, qat.id as staging_id, sr.snapshot_id
              from staging.quran_ayah_texts qat
              join content.quran_text_editions qte on qte.edition_key = qat.script_label
              join content.quran_ayahs qa
                on qa.surah_number = qat.surah_number
               and qa.ayah_number = qat.ayah_number
              join content.quran_ayah_texts cqt
                on cqt.edition_id = qte.id
               and cqt.ayah_id = qa.id
              join staging.source_records sr on sr.id = qat.id
            """
        )
        prov_rows = [
            (
                rafiq_uuid(f"phase4:prov:quran_ayah_text:{row[0]}:{row[2]}"),
                "quran_ayah_text",
                str(row[0]),
                "staging.quran_ayah_texts",
                str(row[2]),
                str(row[3]),
                event_id,
                "primary_source",
                "direct_text_promotion",
            )
            for row in cur.fetchall()
        ]
        release_rows.extend(
            release_state("quran_ayah_text", str(row[0]), "Private canonical Quran ayah text.")
            for row in cur.fetchall()
        )

    # The cursor was exhausted before release rows above; fetch text IDs separately.
    with conn.cursor() as cur:
        cur.execute("select id from content.quran_ayah_texts")
        text_release_rows = [
            release_state("quran_ayah_text", str(row[0]), "Private canonical Quran ayah text.")
            for row in cur.fetchall()
        ]
    return editions_inserted, texts_inserted, add_provenance(conn, prov_rows), add_release_states(conn, release_rows + text_release_rows)


def promote_partitions(conn, event_id):
    with conn.cursor() as cur:
        cur.execute(
            """
            select ss.snapshot_key, min(sr.snapshot_id::text)
              from staging.quran_partitions qp
              join staging.source_records sr on sr.id = qp.id
              join ingest.source_snapshots ss on ss.id = sr.snapshot_id
             group by ss.snapshot_key
             order by ss.snapshot_key
            """
        )
        scheme_rows = []
        release_rows = []
        for snapshot_key, snapshot_id in cur.fetchall():
            scheme_id = rafiq_uuid(f"phase4:quran_partition_scheme:{snapshot_key}")
            scheme_rows.append(
                (
                    scheme_id,
                    snapshot_key,
                    f"Quran partitions - {snapshot_key}",
                    snapshot_key,
                    snapshot_id,
                    "phase4-promoted",
                )
            )
            release_rows.append(release_state("quran_partition_scheme", scheme_id, "Private Quran partition scheme."))

        cur.executemany(
            """
            insert into content.quran_partition_schemes
              (id, scheme_key, name, layout_label, source_snapshot_id, version_label)
            values (%s,%s,%s,%s,%s,%s)
            on conflict (scheme_key) do update
              set source_snapshot_id = excluded.source_snapshot_id,
                  version_label = excluded.version_label
            """,
            scheme_rows,
        )
        schemes_inserted = cur.rowcount

        cur.execute(
            """
            with mapped as (
              select qps.id as scheme_id,
                     qp.partition_type,
                     nullif(regexp_replace(qp.source_partition_id, '[^0-9]', '', 'g'), '')::integer as partition_number,
                     start_qa.id as start_ayah_id,
                     end_qa.id as end_ayah_id,
                     qp.source_label,
                     qp.classification,
                     qp.id as staging_id,
                     sr.snapshot_id
                from staging.quran_partitions qp
                join staging.source_records sr on sr.id = qp.id
                join ingest.source_snapshots ss on ss.id = sr.snapshot_id
                join content.quran_partition_schemes qps on qps.scheme_key = ss.snapshot_key
                join content.quran_ayahs start_qa
                  on start_qa.surah_number = split_part(qp.start_ayah_key, ':', 1)::smallint
                 and start_qa.ayah_number = split_part(qp.start_ayah_key, ':', 2)::smallint
                left join content.quran_ayahs end_qa
                  on end_qa.surah_number = split_part(qp.end_ayah_key, ':', 1)::smallint
                 and end_qa.ayah_number = split_part(qp.end_ayah_key, ':', 2)::smallint
            )
            insert into content.quran_partitions
              (id, scheme_id, partition_type, partition_number, start_ayah_id,
               end_ayah_id, source_label, classification)
            select gen_random_uuid(), scheme_id, partition_type, partition_number,
                   start_ayah_id, end_ayah_id, source_label, classification
              from mapped
            on conflict (scheme_id, partition_type, partition_number, start_ayah_id)
            do update
              set end_ayah_id = excluded.end_ayah_id,
                  source_label = excluded.source_label,
                  classification = excluded.classification
            """
        )
        partitions_inserted = cur.rowcount

        cur.execute(
            """
            select cp.id, qp.id as staging_id, sr.snapshot_id
              from staging.quran_partitions qp
              join staging.source_records sr on sr.id = qp.id
              join ingest.source_snapshots ss on ss.id = sr.snapshot_id
              join content.quran_partition_schemes qps on qps.scheme_key = ss.snapshot_key
              join content.quran_ayahs start_qa
                on start_qa.surah_number = split_part(qp.start_ayah_key, ':', 1)::smallint
               and start_qa.ayah_number = split_part(qp.start_ayah_key, ':', 2)::smallint
              join content.quran_partitions cp
                on cp.scheme_id = qps.id
               and cp.partition_type = qp.partition_type
               and coalesce(cp.partition_number, -1) = coalesce(nullif(regexp_replace(qp.source_partition_id, '[^0-9]', '', 'g'), '')::integer, -1)
               and cp.start_ayah_id = start_qa.id
            """
        )
        prov_rows = [
            (
                rafiq_uuid(f"phase4:prov:quran_partition:{row[0]}:{row[1]}"),
                "quran_partition",
                str(row[0]),
                "staging.quran_partitions",
                str(row[1]),
                str(row[2]),
                event_id,
                "primary_source",
                "direct_partition_promotion",
            )
            for row in cur.fetchall()
        ]

    with conn.cursor() as cur:
        cur.execute("select id from content.quran_partitions")
        release_rows.extend(
            release_state("quran_partition", str(row[0]), "Private Quran partition.")
            for row in cur.fetchall()
        )
    return schemes_inserted, partitions_inserted, add_provenance(conn, prov_rows), add_release_states(conn, release_rows)


def main():
    conn = get_connection()
    snapshot_id = None
    with conn.cursor() as cur:
        cur.execute("select snapshot_id from staging.source_records where domain='quran' limit 1")
        snapshot_id = str(cur.fetchone()[0])
    run_id = create_import_run(
        conn,
        snapshot_id=snapshot_id,
        parser_name=PARSER_NAME,
        parser_version=PARSER_VERSION,
        configuration={"scope": "quran_foundation"},
        code_revision="phase4-v1",
    )
    try:
        event_id = create_transformation_event(conn, run_id)
        surahs, ayahs, id_prov = promote_surahs_and_ayahs(conn, event_id)
        editions, texts, text_prov, text_release = promote_quran_texts(conn, event_id)
        schemes, partitions, part_prov, part_release = promote_partitions(conn, event_id)

        # Release states for identity rows.
        with conn.cursor() as cur:
            cur.execute("select id from content.quran_surahs")
            identity_releases = [
                release_state("quran_surah", str(row[0]), "Private canonical Quran surah identity.")
                for row in cur.fetchall()
            ]
            cur.execute("select id from content.quran_ayahs")
            identity_releases.extend(
                release_state("quran_ayah", str(row[0]), "Private canonical Quran ayah identity.")
                for row in cur.fetchall()
            )
        identity_release = add_release_states(conn, identity_releases)
        conn.commit()
        staged_total = (
            surahs + ayahs + editions + texts + schemes + partitions +
            id_prov + text_prov + part_prov + text_release + part_release + identity_release
        )
        parsed_total = 114 + 6236 + 18708 + 2590
        complete_import_run(conn, run_id, parsed=parsed_total, staged=staged_total, warnings=0, input_objects=1)
        print("phase4 quran foundation complete")
        print(f"surahs={surahs} ayahs={ayahs} editions={editions} texts={texts} schemes={schemes} partitions={partitions}")
        print(f"provenance={id_prov + text_prov + part_prov} release_states={text_release + part_release + identity_release}")
    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
