-- RAFIQ Phase 3 final verification.

\set ON_ERROR_STOP on

select 'completed_import_runs' as check_name, count(*)::bigint as actual, 196::bigint as expected,
       count(*) = 196 as passed
from ingest.import_runs
where status = 'completed'
union all
select 'failed_import_runs', count(*), 0, count(*) = 0
from ingest.import_runs
where status = 'failed'
union all
select 'parser_assignments_implemented', count(*), 186, count(*) = 186
from ingest.raw_object_parser_assignments
where assignment_status = 'implemented'
union all
select 'parser_assignments_open', count(*), 0, count(*) = 0
from ingest.raw_object_parser_assignments
where assignment_status <> 'implemented'
union all
select 'source_records_total', count(*), 1177871, count(*) = 1177871
from staging.source_records
union all
select 'raw_object_profiles', count(*), 118, count(*) = 118
from staging.source_records
where record_type = 'raw_object_profile'
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
select 'source_topics', count(*), 2512, count(*) = 2512
from staging.source_topics
union all
select 'ayah_theme_groups', count(*), 2098, count(*) = 2098
from staging.ayah_theme_groups
union all
select 'hadith_records', count(*), 324866, count(*) = 324866
from staging.hadith_records
union all
select 'hadith_text_versions', count(*), 684348, count(*) = 684348
from staging.hadith_text_versions
union all
select 'hadith_grade_assertions', count(*), 67711, count(*) = 67711
from staging.hadith_grade_assertions
union all
select 'hadith_verification_claims', count(*), 88, count(*) = 88
from staging.hadith_verification_claims
union all
select 'validation_findings', count(*), 73, count(*) = 73
from ingest.validation_findings;

select parser_name, status, count(*)::bigint as runs,
       sum(parsed_record_count)::bigint as parsed_records,
       sum(staged_record_count)::bigint as staged_records,
       sum(warning_count)::bigint as warnings,
       sum(rejected_record_count)::bigint as rejected_records
from ingest.import_runs
group by parser_name, status
order by parser_name, status;

select finding_code, severity, count(*)::bigint as rows
from ingest.validation_findings
group by finding_code, severity
order by finding_code, severity;

do $$
declare
  n_completed bigint;
  n_failed bigint;
  n_open_assignments bigint;
  n_source_records bigint;
  n_hadith_records bigint;
  n_hadith_texts bigint;
  n_findings bigint;
begin
  select count(*) into n_completed from ingest.import_runs where status = 'completed';
  select count(*) into n_failed from ingest.import_runs where status = 'failed';
  select count(*) into n_open_assignments
    from ingest.raw_object_parser_assignments
   where assignment_status <> 'implemented';
  select count(*) into n_source_records from staging.source_records;
  select count(*) into n_hadith_records from staging.hadith_records;
  select count(*) into n_hadith_texts from staging.hadith_text_versions;
  select count(*) into n_findings from ingest.validation_findings;

  assert n_completed = 196, 'completed import runs expected 196, got ' || n_completed;
  assert n_failed = 0, 'failed import runs expected 0, got ' || n_failed;
  assert n_open_assignments = 0, 'open parser assignments expected 0, got ' || n_open_assignments;
  assert n_source_records = 1177871, 'source_records expected 1177871, got ' || n_source_records;
  assert n_hadith_records = 324866, 'hadith_records expected 324866, got ' || n_hadith_records;
  assert n_hadith_texts = 684348, 'hadith_text_versions expected 684348, got ' || n_hadith_texts;
  assert n_findings = 73, 'validation_findings expected 73, got ' || n_findings;

  raise notice 'Phase 3 final verification passed.';
end $$;
