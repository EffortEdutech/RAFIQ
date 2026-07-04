-- RAFIQ Phase 3 loader checkpoint 02 verification.

\set ON_ERROR_STOP on

select 'completed_import_runs' as check_name, count(*)::bigint as actual, 48::bigint as expected,
       count(*) = 48 as passed
from ingest.import_runs
where status = 'completed'
union all
select 'failed_import_runs', count(*), 0, count(*) = 0
from ingest.import_runs
where status = 'failed'
union all
select 'source_records_total', count(*), 306909, count(*) = 306909
from staging.source_records
union all
select 'quran_ayah_texts', count(*), 18708, count(*) = 18708
from staging.quran_ayah_texts
union all
select 'quran_partitions', count(*), 2590, count(*) = 2590
from staging.quran_partitions
union all
select 'translation_texts', count(*), 49888, count(*) = 49888
from staging.translation_texts
union all
select 'tafsir_passages', count(*), 18708, count(*) = 18708
from staging.tafsir_passages
union all
select 'tafsir_passage_ayahs', count(*), 18708, count(*) = 18708
from staging.tafsir_passage_ayahs
union all
select 'source_topics', count(*), 2512, count(*) = 2512
from staging.source_topics
union all
select 'source_topic_ayahs', count(*), 30687, count(*) = 30687
from staging.source_topic_ayahs
union all
select 'source_topic_relations', count(*), 1759, count(*) = 1759
from staging.source_topic_relations
union all
select 'ayah_theme_groups', count(*), 2098, count(*) = 2098
from staging.ayah_theme_groups
union all
select 'ayah_theme_group_ayahs', count(*), 12400, count(*) = 12400
from staging.ayah_theme_group_ayahs
union all
select 'hadith_records', count(*), 36272, count(*) = 36272
from staging.hadith_records
union all
select 'hadith_text_versions', count(*), 102158, count(*) = 102158
from staging.hadith_text_versions
union all
select 'hadith_grade_assertions', count(*), 67711, count(*) = 67711
from staging.hadith_grade_assertions
union all
select 'hadith_verification_claims', count(*), 28, count(*) = 28
from staging.hadith_verification_claims
union all
select 'validation_findings', count(*), 66, count(*) = 66
from ingest.validation_findings;

select parser_name, status, count(*)::bigint as runs,
       sum(input_object_count)::bigint as input_objects,
       sum(parsed_record_count)::bigint as parsed_records,
       sum(staged_record_count)::bigint as staged_records,
       sum(warning_count)::bigint as warnings,
       sum(rejected_record_count)::bigint as rejected_records
from ingest.import_runs
group by parser_name, status
order by parser_name, status;

select normalized_grade, count(*)::bigint as rows
from staging.hadith_grade_assertions
group by normalized_grade
order by normalized_grade;

select normalized_conclusion, count(*)::bigint as rows
from staging.hadith_verification_claims
group by normalized_conclusion
order by normalized_conclusion;

select finding_code, severity, count(*)::bigint as rows
from ingest.validation_findings
group by finding_code, severity
order by finding_code, severity;

do $$
declare
  n_completed bigint;
  n_failed bigint;
  n_source_records bigint;
  n_partitions bigint;
  n_tafsir bigint;
  n_topics bigint;
  n_topic_ayahs bigint;
  n_theme_groups bigint;
  n_theme_ayahs bigint;
  n_hadith_records bigint;
  n_hadith_grades bigint;
  n_verification_claims bigint;
  n_findings bigint;
begin
  select count(*) into n_completed from ingest.import_runs where status = 'completed';
  select count(*) into n_failed from ingest.import_runs where status = 'failed';
  select count(*) into n_source_records from staging.source_records;
  select count(*) into n_partitions from staging.quran_partitions;
  select count(*) into n_tafsir from staging.tafsir_passages;
  select count(*) into n_topics from staging.source_topics;
  select count(*) into n_topic_ayahs from staging.source_topic_ayahs;
  select count(*) into n_theme_groups from staging.ayah_theme_groups;
  select count(*) into n_theme_ayahs from staging.ayah_theme_group_ayahs;
  select count(*) into n_hadith_records from staging.hadith_records;
  select count(*) into n_hadith_grades from staging.hadith_grade_assertions;
  select count(*) into n_verification_claims from staging.hadith_verification_claims;
  select count(*) into n_findings from ingest.validation_findings;

  assert n_completed = 48, 'completed import runs expected 48, got ' || n_completed;
  assert n_failed = 0, 'failed import runs expected 0, got ' || n_failed;
  assert n_source_records = 306909, 'source_records expected 306909, got ' || n_source_records;
  assert n_partitions = 2590, 'quran_partitions expected 2590, got ' || n_partitions;
  assert n_tafsir = 18708, 'tafsir_passages expected 18708, got ' || n_tafsir;
  assert n_topics = 2512, 'source_topics expected 2512, got ' || n_topics;
  assert n_topic_ayahs = 30687, 'source_topic_ayahs expected 30687, got ' || n_topic_ayahs;
  assert n_theme_groups = 2098, 'ayah_theme_groups expected 2098, got ' || n_theme_groups;
  assert n_theme_ayahs = 12400, 'ayah_theme_group_ayahs expected 12400, got ' || n_theme_ayahs;
  assert n_hadith_records = 36272, 'hadith_records expected 36272, got ' || n_hadith_records;
  assert n_hadith_grades = 67711, 'hadith_grade_assertions expected 67711, got ' || n_hadith_grades;
  assert n_verification_claims = 28, 'hadith_verification_claims expected 28, got ' || n_verification_claims;
  assert n_findings = 66, 'validation_findings expected 66, got ' || n_findings;

  raise notice 'Phase 3 loader checkpoint 02 verification passed.';
end $$;
