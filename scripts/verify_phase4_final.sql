-- RAFIQ Phase 4 Canonical Promotion Verification
-- Run inside the local Supabase/Postgres database.

with expected(metric, expected_count) as (
  values
    ('quran_surahs', 114),
    ('quran_ayahs', 6236),
    ('quran_text_editions', 3),
    ('quran_ayah_texts', 18708),
    ('quran_partition_schemes', 2),
    ('quran_partitions', 2590),
    ('translation_editions', 8),
    ('translation_texts', 49888),
    ('tafsir_editions', 3),
    ('tafsir_passages', 18708),
    ('tafsir_passage_ayahs', 18708),
    ('source_taxonomies', 1),
    ('source_topics', 2512),
    ('source_topic_ayahs', 30687),
    ('source_topic_relations', 1758),
    ('source_ayah_theme_groups', 2098),
    ('source_ayah_theme_group_ayahs', 12400),
    ('hadith_collections', 70),
    ('hadith_editions', 70),
    ('hadith_records', 324866),
    ('hadith_text_versions', 684348),
    ('hadith_grade_assertions', 67711),
    ('hadith_grade_normalizations', 67711),
    ('hadith_verification_claims', 88),
    ('entity_provenance', 1177867),
    ('entity_release_states', 1245735)
),
actual(metric, actual_count) as (
  select 'quran_surahs', count(*) from content.quran_surahs
  union all select 'quran_ayahs', count(*) from content.quran_ayahs
  union all select 'quran_text_editions', count(*) from content.quran_text_editions
  union all select 'quran_ayah_texts', count(*) from content.quran_ayah_texts
  union all select 'quran_partition_schemes', count(*) from content.quran_partition_schemes
  union all select 'quran_partitions', count(*) from content.quran_partitions
  union all select 'translation_editions', count(*) from content.translation_editions
  union all select 'translation_texts', count(*) from content.translation_texts
  union all select 'tafsir_editions', count(*) from content.tafsir_editions
  union all select 'tafsir_passages', count(*) from content.tafsir_passages
  union all select 'tafsir_passage_ayahs', count(*) from content.tafsir_passage_ayahs
  union all select 'source_taxonomies', count(*) from content.source_taxonomies
  union all select 'source_topics', count(*) from content.source_topics
  union all select 'source_topic_ayahs', count(*) from content.source_topic_ayahs
  union all select 'source_topic_relations', count(*) from content.source_topic_relations
  union all select 'source_ayah_theme_groups', count(*) from content.source_ayah_theme_groups
  union all select 'source_ayah_theme_group_ayahs', count(*) from content.source_ayah_theme_group_ayahs
  union all select 'hadith_collections', count(*) from content.hadith_collections
  union all select 'hadith_editions', count(*) from content.hadith_editions
  union all select 'hadith_records', count(*) from content.hadith_records
  union all select 'hadith_text_versions', count(*) from content.hadith_text_versions
  union all select 'hadith_grade_assertions', count(*) from content.hadith_grade_assertions
  union all select 'hadith_grade_normalizations', count(*) from content.hadith_grade_normalizations
  union all select 'hadith_verification_claims', count(*) from content.hadith_verification_claims
  union all select 'entity_provenance', count(*) from content.entity_provenance
  union all select 'entity_release_states', count(*) from content.entity_release_states
)
select e.metric, e.expected_count, a.actual_count,
       case when e.expected_count = a.actual_count then 'pass' else 'fail' end as status
  from expected e
  join actual a using (metric)
 order by e.metric;

with phase4_runs as (
  select parser_name, status, parsed_record_count, staged_record_count,
         warning_count, rejected_record_count
    from ingest.import_runs
   where parser_name like 'promote_phase4_%'
)
select parser_name, status, parsed_record_count, staged_record_count,
       warning_count, rejected_record_count
  from phase4_runs
 order by parser_name;

select 'phase4_assertion_failures' as check_name, count(*) as failure_count
  from (
    select 1
      from ingest.import_runs
     where parser_name like 'promote_phase4_%'
       and status <> 'completed'
    union all
    select 1
      from ingest.import_runs
     where parser_name like 'promote_phase4_%'
       and (warning_count <> 0 or rejected_record_count <> 0)
    union all
    select 1
     where exists (
       select 1
         from staging.source_topic_relations rel
        where not exists (
          select 1
            from staging.source_topics t
           where t.source_topic_id = rel.related_source_topic_id
        )
     )
  ) failures;

select finding_code, severity, resolution_status, evidence
  from ingest.validation_findings
 where finding_code = 'phase4_source_topic_relation_duplicate_canonical_key';
