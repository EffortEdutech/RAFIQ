#!/usr/bin/env python3
"""
RAFIQ Phase 4 - Source topics and ayah themes canonical promotion.
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from db_utils import get_connection, create_import_run, complete_import_run, fail_import_run, rafiq_uuid

PARSER_NAME = "promote_phase4_topics_themes"
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
    event_id = rafiq_uuid("phase4:transformation:topics_themes:v1")
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
                "phase4-topics-themes-v1",
                json.dumps({"scope": "source_topics_and_ayah_theme_groups"}),
                "Promote QUL source topics and ayah theme groups from Phase 3 staging.",
            ),
        )
    return event_id


def promote_topics(conn, event_id):
    taxonomy_id = rafiq_uuid("phase4:source_taxonomy:qul-topics")
    with conn.cursor() as cur:
        cur.execute(
            """
            select min(sr.snapshot_id::text)
              from staging.source_topics st
              join staging.source_records sr on sr.id = st.id
            """
        )
        snapshot_id = cur.fetchone()[0]
        cur.execute(
            """
            insert into content.source_taxonomies
              (id, taxonomy_key, name, source_snapshot_id, version_label)
            values (%s,%s,%s,%s,%s)
            on conflict (taxonomy_key) do update
              set source_snapshot_id = excluded.source_snapshot_id,
                  version_label = excluded.version_label
            """,
            (taxonomy_id, "qul-topics", "QUL Topics and Concepts", snapshot_id, "phase4-promoted"),
        )
        taxonomy_count = cur.rowcount

        cur.execute(
            """
            insert into content.source_topics
              (id, taxonomy_id, source_topic_key, name, arabic_name,
               description, metadata)
            select gen_random_uuid(),
                   %s,
                   st.source_topic_id,
                   st.name,
                   st.arabic_name,
                   st.description,
                   jsonb_build_object(
                     'namespace_labels', st.namespace_labels,
                     'raw_parent_ids', st.raw_parent_ids,
                     'raw_related_topic_ids', st.raw_related_topic_ids
                   )
              from staging.source_topics st
            on conflict (taxonomy_id, source_topic_key) do update
              set name = excluded.name,
                  arabic_name = excluded.arabic_name,
                  description = excluded.description,
                  metadata = excluded.metadata
            """,
            (taxonomy_id,),
        )
        topics_count = cur.rowcount

        cur.execute(
            """
            insert into content.source_topic_ayahs
              (topic_id, ayah_id)
            select ct.id, qa.id
              from staging.source_topic_ayahs sta
              join staging.source_topics st on st.id = sta.topic_id
              join content.source_topics ct
                on ct.taxonomy_id = %s
               and ct.source_topic_key = st.source_topic_id
              join content.quran_ayahs qa
                on qa.surah_number = split_part(sta.ayah_key, ':', 1)::smallint
               and qa.ayah_number = split_part(sta.ayah_key, ':', 2)::smallint
            on conflict do nothing
            """,
            (taxonomy_id,),
        )
        topic_ayahs_count = cur.rowcount

        cur.execute(
            """
            insert into content.source_topic_relations
              (parent_topic_id, child_topic_id, relation_type, source_provided)
            select parent.id, child.id, str.relation_type, str.source_provided
              from staging.source_topic_relations str
              join staging.source_topics st on st.id = str.topic_id
              join content.source_topics parent
                on parent.taxonomy_id = %s
               and parent.source_topic_key = st.source_topic_id
              join content.source_topics child
                on child.taxonomy_id = %s
               and child.source_topic_key = str.related_source_topic_id
            on conflict do nothing
            """,
            (taxonomy_id, taxonomy_id),
        )
        relations_count = cur.rowcount

        cur.execute(
            """
            select ct.id, st.id, sr.snapshot_id
              from staging.source_topics st
              join content.source_topics ct
                on ct.taxonomy_id = %s
               and ct.source_topic_key = st.source_topic_id
              join staging.source_records sr on sr.id = st.id
            """,
            (taxonomy_id,),
        )
        prov_rows = [
            (
                rafiq_uuid(f"phase4:prov:source_topic:{row[0]}:{row[1]}"),
                "source_topic",
                str(row[0]),
                "staging.source_topics",
                str(row[1]),
                str(row[2]),
                event_id,
                "primary_source",
                "direct_source_topic_promotion",
            )
            for row in cur.fetchall()
        ]
        cur.execute("select id from content.source_topics where taxonomy_id = %s", (taxonomy_id,))
        release_rows = [release_state("source_topic", str(row[0]), "Private source topic.") for row in cur.fetchall()]
        release_rows.append(release_state("source_taxonomy", taxonomy_id, "Private source taxonomy."))

    return taxonomy_count, topics_count, topic_ayahs_count, relations_count, add_provenance(conn, prov_rows), add_release_states(conn, release_rows)


def promote_ayah_themes(conn, event_id):
    with conn.cursor() as cur:
        cur.execute(
            """
            insert into content.source_ayah_theme_groups
              (id, source_snapshot_id, source_group_key, theme_text,
               raw_keywords, duplicate_group_key)
            select gen_random_uuid(),
                   sr.snapshot_id,
                   atg.id::text,
                   atg.theme_text,
                   atg.raw_keywords,
                   atg.exact_duplicate_group
              from staging.ayah_theme_groups atg
              join staging.source_records sr on sr.id = atg.id
            on conflict (source_snapshot_id, source_group_key) do update
              set theme_text = excluded.theme_text,
                  raw_keywords = excluded.raw_keywords,
                  duplicate_group_key = excluded.duplicate_group_key
            """
        )
        groups_count = cur.rowcount

        cur.execute(
            """
            insert into content.source_ayah_theme_group_ayahs
              (group_id, ayah_id)
            select cg.id, qa.id
              from staging.ayah_theme_group_ayahs aga
              join staging.ayah_theme_groups atg on atg.id = aga.theme_group_id
              join staging.source_records sr on sr.id = atg.id
              join content.source_ayah_theme_groups cg
                on cg.source_snapshot_id = sr.snapshot_id
               and cg.source_group_key = atg.id::text
              join content.quran_ayahs qa
                on qa.surah_number = split_part(aga.ayah_key, ':', 1)::smallint
               and qa.ayah_number = split_part(aga.ayah_key, ':', 2)::smallint
            on conflict do nothing
            """
        )
        group_ayahs_count = cur.rowcount

        cur.execute(
            """
            select cg.id, atg.id, sr.snapshot_id
              from staging.ayah_theme_groups atg
              join staging.source_records sr on sr.id = atg.id
              join content.source_ayah_theme_groups cg
                on cg.source_snapshot_id = sr.snapshot_id
               and cg.source_group_key = atg.id::text
            """
        )
        prov_rows = [
            (
                rafiq_uuid(f"phase4:prov:source_ayah_theme_group:{row[0]}:{row[1]}"),
                "source_ayah_theme_group",
                str(row[0]),
                "staging.ayah_theme_groups",
                str(row[1]),
                str(row[2]),
                event_id,
                "primary_source",
                "direct_ayah_theme_group_promotion",
            )
            for row in cur.fetchall()
        ]
        cur.execute("select id from content.source_ayah_theme_groups")
        release_rows = [
            release_state("source_ayah_theme_group", str(row[0]), "Private source ayah theme group.")
            for row in cur.fetchall()
        ]

    return groups_count, group_ayahs_count, add_provenance(conn, prov_rows), add_release_states(conn, release_rows)


def main():
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("select snapshot_id from staging.source_records where domain in ('topic','ayah_theme') limit 1")
        snapshot_id = str(cur.fetchone()[0])
    run_id = create_import_run(
        conn,
        snapshot_id=snapshot_id,
        parser_name=PARSER_NAME,
        parser_version=PARSER_VERSION,
        configuration={"scope": "topics_themes"},
        code_revision="phase4-v1",
    )
    try:
        event_id = create_transformation_event(conn, run_id)
        tax, topics, topic_ayahs, relations, topic_prov, topic_release = promote_topics(conn, event_id)
        groups, group_ayahs, group_prov, group_release = promote_ayah_themes(conn, event_id)
        conn.commit()
        parsed = 2512 + 30687 + 1759 + 2098 + 12400
        staged = tax + topics + topic_ayahs + relations + topic_prov + topic_release + groups + group_ayahs + group_prov + group_release
        complete_import_run(conn, run_id, parsed=parsed, staged=staged, warnings=0, input_objects=1)
        print("phase4 topics/themes complete")
        print(f"taxonomies={tax} topics={topics} topic_ayahs={topic_ayahs} relations={relations}")
        print(f"theme_groups={groups} group_ayahs={group_ayahs}")
        print(f"provenance={topic_prov + group_prov} release_states={topic_release + group_release}")
    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
