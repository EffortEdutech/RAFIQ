#!/usr/bin/env python3
"""
RAFIQ Phase 4 - Source-qualified Hadith canonical promotion.
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from db_utils import get_connection, create_import_run, complete_import_run, fail_import_run, rafiq_uuid

PARSER_NAME = "promote_phase4_hadith"
PARSER_VERSION = "1.0.0"

UUID_SQL = (
    "(substr(md5(%s),1,8)||'-'||substr(md5(%s),9,4)||'-'||"
    "substr(md5(%s),13,4)||'-'||substr(md5(%s),17,4)||'-'||"
    "substr(md5(%s),21,12))::uuid"
)


def create_transformation_event(conn, run_id):
    event_id = rafiq_uuid("phase4:transformation:hadith:v1")
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
                "phase4-hadith-v1",
                json.dumps({"scope": "hadith_records_texts_grades_verification"}),
                "Promote source-qualified Hadith records, text versions, grade assertions, and verification claims.",
            ),
        )
    return event_id


def release_sql(entity_type, id_select_sql, notes):
    return f"""
        insert into content.entity_release_states
          (id, entity_type, entity_id, entity_version, technical_status,
           rights_status, attribution_status, editorial_status,
           scholar_content_status, publication_status, notes)
        select gen_random_uuid(), '{entity_type}', id::text, '1',
               'validated', 'pending', 'pending', 'unreviewed', 'unreviewed',
               'private_only', {notes!r}
          from ({id_select_sql}) s
        on conflict (entity_type, entity_id, entity_version) do nothing
    """


def promote_hadith(conn, event_id):
    with conn.cursor() as cur:
        # Collections are source-family + collection, intentionally not global.
        cur.execute(
            """
            insert into content.hadith_collections
              (id, collection_key, name_en)
            select gen_random_uuid(),
                   coalesce(nullif(hr.source_edition_key, ''), 'fawaz-linebyline') || ':' ||
                     coalesce(nullif(hr.source_collection_key, ''), 'unknown') as collection_key,
                   coalesce(nullif(hr.source_edition_key, ''), 'fawaz-linebyline') || ' / ' ||
                     coalesce(nullif(hr.source_collection_key, ''), 'unknown') as name_en
              from staging.hadith_records hr
             group by 2,3
            on conflict (collection_key) do update
              set name_en = excluded.name_en
            """
        )
        collections = cur.rowcount

        cur.execute(
            """
            with edition_src as (
              select coalesce(nullif(hr.source_edition_key, ''), 'fawaz-linebyline') || ':' ||
                       coalesce(nullif(hr.source_collection_key, ''), 'unknown') as edition_key,
                     coalesce(nullif(hr.source_edition_key, ''), 'fawaz-linebyline') || ':' ||
                       coalesce(nullif(hr.source_collection_key, ''), 'unknown') as collection_key,
                     min(sr.snapshot_id::text)::uuid as snapshot_id
                from staging.hadith_records hr
                join staging.source_records sr on sr.id = hr.id
               group by 1,2
            )
            insert into content.hadith_editions
              (id, collection_id, edition_key, source_snapshot_id, version_label)
            select gen_random_uuid(), hc.id, es.edition_key, es.snapshot_id, 'phase4-promoted'
              from edition_src es
              join content.hadith_collections hc on hc.collection_key = es.collection_key
            on conflict (edition_key) do update
              set source_snapshot_id = excluded.source_snapshot_id,
                  version_label = excluded.version_label
            """
        )
        editions = cur.rowcount

        cur.execute(
            """
            insert into content.hadith_records
              (id, edition_id, source_hadith_key, source_hadith_number,
               source_urn, printed_reference)
            select (substr(md5('phase4:hadith_record:' || hr.id::text),1,8)||'-'||
                    substr(md5('phase4:hadith_record:' || hr.id::text),9,4)||'-'||
                    substr(md5('phase4:hadith_record:' || hr.id::text),13,4)||'-'||
                    substr(md5('phase4:hadith_record:' || hr.id::text),17,4)||'-'||
                    substr(md5('phase4:hadith_record:' || hr.id::text),21,12))::uuid,
                   he.id,
                   hr.id::text,
                   hr.source_hadith_number,
                   hr.source_urn,
                   hr.printed_reference
              from staging.hadith_records hr
              join content.hadith_editions he
                on he.edition_key = coalesce(nullif(hr.source_edition_key, ''), 'fawaz-linebyline') || ':' ||
                   coalesce(nullif(hr.source_collection_key, ''), 'unknown')
            on conflict (edition_id, source_hadith_key) do update
              set source_hadith_number = excluded.source_hadith_number,
                  source_urn = excluded.source_urn,
                  printed_reference = excluded.printed_reference
            """
        )
        hadith_records = cur.rowcount

        cur.execute(
            """
            insert into content.hadith_text_versions
              (id, hadith_record_id, language_code, translator_name, full_text,
               narrator_prefix, isnad_text, matn_text, source_html, text_hash)
            select (substr(md5('phase4:hadith_text_version:' || htv.id::text),1,8)||'-'||
                    substr(md5('phase4:hadith_text_version:' || htv.id::text),9,4)||'-'||
                    substr(md5('phase4:hadith_text_version:' || htv.id::text),13,4)||'-'||
                    substr(md5('phase4:hadith_text_version:' || htv.id::text),17,4)||'-'||
                    substr(md5('phase4:hadith_text_version:' || htv.id::text),21,12))::uuid,
                   chr.id,
                   htv.language_code,
                   htv.translator_label,
                   htv.full_text,
                   htv.narrator_prefix,
                   htv.isnad_text,
                   htv.matn_text,
                   htv.source_html,
                   case when htv.full_text is null then null
                        else encode(digest(htv.full_text, 'sha256'), 'hex')
                   end
              from staging.hadith_text_versions htv
              join staging.hadith_records shr on shr.id = htv.hadith_record_id
              join content.hadith_editions he
                on he.edition_key = coalesce(nullif(shr.source_edition_key, ''), 'fawaz-linebyline') || ':' ||
                   coalesce(nullif(shr.source_collection_key, ''), 'unknown')
              join content.hadith_records chr
                on chr.edition_id = he.id
               and chr.source_hadith_key = shr.id::text
             where not exists (
                   select 1
                     from content.entity_provenance ep
                    where ep.entity_type = 'hadith_text_version'
                      and ep.staging_table = 'staging.hadith_text_versions'
                      and ep.staging_record_id = htv.id
             )
            on conflict (id) do update
              set full_text = excluded.full_text,
                  text_hash = excluded.text_hash
            """
        )
        text_versions = cur.rowcount

        cur.execute(
            """
            insert into content.hadith_grade_assertions
              (id, hadith_record_id, source_snapshot_id, grader_name_raw,
               raw_grade, claim_scope, citation)
            select (substr(md5('phase4:hadith_grade_assertion:' || hga.id::text),1,8)||'-'||
                    substr(md5('phase4:hadith_grade_assertion:' || hga.id::text),9,4)||'-'||
                    substr(md5('phase4:hadith_grade_assertion:' || hga.id::text),13,4)||'-'||
                    substr(md5('phase4:hadith_grade_assertion:' || hga.id::text),17,4)||'-'||
                    substr(md5('phase4:hadith_grade_assertion:' || hga.id::text),21,12))::uuid,
                   chr.id,
                   sr.snapshot_id,
                   hga.grader_name_raw,
                   hga.raw_grade,
                   hga.claim_scope,
                   hga.citation
              from staging.hadith_grade_assertions hga
              join staging.source_records sr on sr.id = hga.id
              left join staging.hadith_records shr on shr.id = hga.hadith_record_id
              left join content.hadith_editions he
                on he.edition_key = coalesce(nullif(shr.source_edition_key, ''), 'fawaz-linebyline') || ':' ||
                   coalesce(nullif(shr.source_collection_key, ''), 'unknown')
              left join content.hadith_records chr
                on chr.edition_id = he.id
               and chr.source_hadith_key = shr.id::text
             where not exists (
                   select 1
                     from content.entity_provenance ep
                    where ep.entity_type = 'hadith_grade_assertion'
                      and ep.staging_table = 'staging.hadith_grade_assertions'
                      and ep.staging_record_id = hga.id
             )
            on conflict (id) do update
              set raw_grade = excluded.raw_grade,
                  grader_name_raw = excluded.grader_name_raw,
                  claim_scope = excluded.claim_scope
            """
        )
        grades = cur.rowcount

        cur.execute(
            """
            insert into content.hadith_grade_normalizations
              (id, assertion_id, normalized_label, normalization_version,
               mapping_method, review_status)
            select gen_random_uuid(),
                   cga.id,
                   hga.normalized_grade,
                   coalesce(hga.normalization_version, 'phase4-pass-through'),
                   'staging_pass_through',
                   hga.review_status
              from staging.hadith_grade_assertions hga
              join content.hadith_grade_assertions cga
                on cga.id = (substr(md5('phase4:hadith_grade_assertion:' || hga.id::text),1,8)||'-'||
                             substr(md5('phase4:hadith_grade_assertion:' || hga.id::text),9,4)||'-'||
                             substr(md5('phase4:hadith_grade_assertion:' || hga.id::text),13,4)||'-'||
                             substr(md5('phase4:hadith_grade_assertion:' || hga.id::text),17,4)||'-'||
                             substr(md5('phase4:hadith_grade_assertion:' || hga.id::text),21,12))::uuid
            on conflict (assertion_id, normalization_version) do nothing
            """
        )
        normalizations = cur.rowcount

        cur.execute(
            """
            insert into content.hadith_verification_claims
              (id, hadith_record_id, source_snapshot_id, claim_text, raw_conclusion,
               claim_scope, scholar_researcher_raw, explanation,
               classification_status, editorial_workflow_status, review_status)
            select (substr(md5('phase4:hadith_verification_claim:' || hvc.id::text),1,8)||'-'||
                    substr(md5('phase4:hadith_verification_claim:' || hvc.id::text),9,4)||'-'||
                    substr(md5('phase4:hadith_verification_claim:' || hvc.id::text),13,4)||'-'||
                    substr(md5('phase4:hadith_verification_claim:' || hvc.id::text),17,4)||'-'||
                    substr(md5('phase4:hadith_verification_claim:' || hvc.id::text),21,12))::uuid,
                   chr.id,
                   sr.snapshot_id,
                   hvc.claim_text,
                   hvc.raw_conclusion,
                   hvc.claim_scope,
                   hvc.scholar_researcher_raw,
                   hvc.explanation,
                   hvc.classification_status,
                   hvc.editorial_workflow_status,
                   hvc.review_status
              from staging.hadith_verification_claims hvc
              join staging.source_records sr on sr.id = hvc.id
              left join staging.hadith_records shr on shr.id = hvc.hadith_record_id
              left join content.hadith_editions he
                on he.edition_key = coalesce(nullif(shr.source_edition_key, ''), 'fawaz-linebyline') || ':' ||
                   coalesce(nullif(shr.source_collection_key, ''), 'unknown')
              left join content.hadith_records chr
                on chr.edition_id = he.id
               and chr.source_hadith_key = shr.id::text
             where not exists (
                   select 1
                     from content.entity_provenance ep
                    where ep.entity_type = 'hadith_verification_claim'
                      and ep.staging_table = 'staging.hadith_verification_claims'
                      and ep.staging_record_id = hvc.id
             )
            on conflict (id) do update
              set raw_conclusion = excluded.raw_conclusion,
                  claim_text = excluded.claim_text,
                  review_status = excluded.review_status
            """
        )
        verification = cur.rowcount

        # Provenance rows use content rows matched back to staging source records.
        cur.execute(
            """
            insert into content.entity_provenance
              (id, entity_type, entity_id, staging_table, staging_record_id,
               source_snapshot_id, transformation_event_id, provenance_role,
               mapping_method)
            select gen_random_uuid(), 'hadith_record', chr.id::text,
                   'staging.hadith_records', shr.id, sr.snapshot_id, %s,
                   'primary_source', 'source_qualified_hadith_record_promotion'
              from staging.hadith_records shr
              join staging.source_records sr on sr.id = shr.id
              join content.hadith_editions he
                on he.edition_key = coalesce(nullif(shr.source_edition_key, ''), 'fawaz-linebyline') || ':' ||
                   coalesce(nullif(shr.source_collection_key, ''), 'unknown')
              join content.hadith_records chr
                on chr.edition_id = he.id
               and chr.source_hadith_key = shr.id::text
            on conflict (entity_type, entity_id, staging_table, staging_record_id, provenance_role)
            do nothing
            """,
            (event_id,),
        )
        prov_records = cur.rowcount

        cur.execute(
            """
            insert into content.entity_provenance
              (id, entity_type, entity_id, staging_table, staging_record_id,
               source_snapshot_id, transformation_event_id, provenance_role,
               mapping_method)
            select gen_random_uuid(), 'hadith_text_version', ctv.id::text,
                   'staging.hadith_text_versions', htv.id, sr.snapshot_id, %s,
                   'primary_source', 'direct_hadith_text_promotion'
              from staging.hadith_text_versions htv
              join staging.source_records sr on sr.id = htv.id
              join staging.hadith_records shr on shr.id = htv.hadith_record_id
              join content.hadith_editions he
                on he.edition_key = coalesce(nullif(shr.source_edition_key, ''), 'fawaz-linebyline') || ':' ||
                   coalesce(nullif(shr.source_collection_key, ''), 'unknown')
              join content.hadith_records chr
                on chr.edition_id = he.id
               and chr.source_hadith_key = shr.id::text
              join content.hadith_text_versions ctv
                on ctv.id = (substr(md5('phase4:hadith_text_version:' || htv.id::text),1,8)||'-'||
                             substr(md5('phase4:hadith_text_version:' || htv.id::text),9,4)||'-'||
                             substr(md5('phase4:hadith_text_version:' || htv.id::text),13,4)||'-'||
                             substr(md5('phase4:hadith_text_version:' || htv.id::text),17,4)||'-'||
                             substr(md5('phase4:hadith_text_version:' || htv.id::text),21,12))::uuid
            on conflict (entity_type, entity_id, staging_table, staging_record_id, provenance_role)
            do nothing
            """,
            (event_id,),
        )
        prov_texts = cur.rowcount

        cur.execute(
            """
            insert into content.entity_provenance
              (id, entity_type, entity_id, staging_table, staging_record_id,
               source_snapshot_id, transformation_event_id, provenance_role,
               mapping_method)
            select gen_random_uuid(), 'hadith_grade_assertion', cga.id::text,
                   'staging.hadith_grade_assertions', hga.id, sr.snapshot_id, %s,
                   'primary_source', 'direct_grade_assertion_promotion'
              from staging.hadith_grade_assertions hga
              join staging.source_records sr on sr.id = hga.id
              join content.hadith_grade_assertions cga
                on cga.id = (substr(md5('phase4:hadith_grade_assertion:' || hga.id::text),1,8)||'-'||
                             substr(md5('phase4:hadith_grade_assertion:' || hga.id::text),9,4)||'-'||
                             substr(md5('phase4:hadith_grade_assertion:' || hga.id::text),13,4)||'-'||
                             substr(md5('phase4:hadith_grade_assertion:' || hga.id::text),17,4)||'-'||
                             substr(md5('phase4:hadith_grade_assertion:' || hga.id::text),21,12))::uuid
            on conflict (entity_type, entity_id, staging_table, staging_record_id, provenance_role)
            do nothing
            """,
            (event_id,),
        )
        prov_grades = cur.rowcount

        cur.execute(
            """
            insert into content.entity_provenance
              (id, entity_type, entity_id, staging_table, staging_record_id,
               source_snapshot_id, transformation_event_id, provenance_role,
               mapping_method)
            select gen_random_uuid(), 'hadith_verification_claim', cvc.id::text,
                   'staging.hadith_verification_claims', hvc.id, sr.snapshot_id, %s,
                   'primary_source', 'direct_verification_claim_promotion'
              from staging.hadith_verification_claims hvc
              join staging.source_records sr on sr.id = hvc.id
              join content.hadith_verification_claims cvc
                on cvc.id = (substr(md5('phase4:hadith_verification_claim:' || hvc.id::text),1,8)||'-'||
                             substr(md5('phase4:hadith_verification_claim:' || hvc.id::text),9,4)||'-'||
                             substr(md5('phase4:hadith_verification_claim:' || hvc.id::text),13,4)||'-'||
                             substr(md5('phase4:hadith_verification_claim:' || hvc.id::text),17,4)||'-'||
                             substr(md5('phase4:hadith_verification_claim:' || hvc.id::text),21,12))::uuid
            on conflict (entity_type, entity_id, staging_table, staging_record_id, provenance_role)
            do nothing
            """,
            (event_id,),
        )
        prov_verification = cur.rowcount

        release_counts = []
        for entity_type, select_sql, notes in [
            ("hadith_collection", "select id from content.hadith_collections", "Private source-qualified Hadith collection."),
            ("hadith_edition", "select id from content.hadith_editions", "Private source-qualified Hadith edition."),
            ("hadith_record", "select id from content.hadith_records", "Private source-qualified Hadith record."),
            ("hadith_text_version", "select id from content.hadith_text_versions", "Private source Hadith text version."),
            ("hadith_grade_assertion", "select id from content.hadith_grade_assertions", "Private Hadith grade assertion."),
            ("hadith_grade_normalization", "select id from content.hadith_grade_normalizations", "Private Hadith grade normalization."),
            ("hadith_verification_claim", "select id from content.hadith_verification_claims", "Private Hadith verification claim."),
        ]:
            cur.execute(release_sql(entity_type, select_sql, notes))
            release_counts.append(cur.rowcount)

    return {
        "collections": collections,
        "editions": editions,
        "hadith_records": hadith_records,
        "text_versions": text_versions,
        "grades": grades,
        "normalizations": normalizations,
        "verification": verification,
        "provenance": prov_records + prov_texts + prov_grades + prov_verification,
        "release_states": sum(release_counts),
    }


def main():
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("select snapshot_id from staging.source_records where domain='hadith' limit 1")
        snapshot_id = str(cur.fetchone()[0])
    run_id = create_import_run(
        conn,
        snapshot_id=snapshot_id,
        parser_name=PARSER_NAME,
        parser_version=PARSER_VERSION,
        configuration={"scope": "hadith"},
        code_revision="phase4-v1",
    )
    try:
        event_id = create_transformation_event(conn, run_id)
        counts = promote_hadith(conn, event_id)
        conn.commit()
        parsed = 324866 + 684348 + 67711 + 88
        staged = sum(counts.values())
        complete_import_run(conn, run_id, parsed=parsed, staged=staged, warnings=0, input_objects=1)
        print("phase4 hadith complete")
        print(json.dumps(counts, indent=2, sort_keys=True))
    except Exception as exc:
        conn.rollback()
        fail_import_run(conn, run_id, str(exc))
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
