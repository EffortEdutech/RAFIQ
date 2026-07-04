-- RAFIQ Phase 3 loader checkpoint 04 verification.

\set ON_ERROR_STOP on

select 'completed_import_runs' as check_name, count(*)::bigint as actual, 141::bigint as expected,
       count(*) = 141 as passed
from ingest.import_runs
where status = 'completed'
union all
select 'failed_import_runs', count(*), 0, count(*) = 0
from ingest.import_runs
where status = 'failed'
union all
select 'source_records_total', count(*), 1177817, count(*) = 1177817
from staging.source_records
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
select 'raw_object_profiles', count(*), 64, count(*) = 64
from staging.source_records
where record_type = 'raw_object_profile'
union all
select 'validation_findings', count(*), 66, count(*) = 66
from ingest.validation_findings;

select parser_name, status, count(*)::bigint as runs,
       sum(parsed_record_count)::bigint as parsed_records,
       sum(staged_record_count)::bigint as staged_records,
       sum(warning_count)::bigint as warnings,
       sum(rejected_record_count)::bigint as rejected_records
from ingest.import_runs
group by parser_name, status
order by parser_name, status;

select source_edition_key, count(*)::bigint as hadith_records
from staging.hadith_records
group by source_edition_key
order by source_edition_key;

select assignment_status, count(*)::bigint as assignments
from ingest.raw_object_parser_assignments
group by assignment_status
order by assignment_status;

do $$
declare
  n_completed bigint;
  n_failed bigint;
  n_source_records bigint;
  n_hadith_records bigint;
  n_hadith_texts bigint;
  n_claims bigint;
  n_profiles bigint;
begin
  select count(*) into n_completed from ingest.import_runs where status = 'completed';
  select count(*) into n_failed from ingest.import_runs where status = 'failed';
  select count(*) into n_source_records from staging.source_records;
  select count(*) into n_hadith_records from staging.hadith_records;
  select count(*) into n_hadith_texts from staging.hadith_text_versions;
  select count(*) into n_claims from staging.hadith_verification_claims;
  select count(*) into n_profiles from staging.source_records where record_type = 'raw_object_profile';

  assert n_completed = 141, 'completed import runs expected 141, got ' || n_completed;
  assert n_failed = 0, 'failed import runs expected 0, got ' || n_failed;
  assert n_source_records = 1177817, 'source_records expected 1177817, got ' || n_source_records;
  assert n_hadith_records = 324866, 'hadith_records expected 324866, got ' || n_hadith_records;
  assert n_hadith_texts = 684348, 'hadith_text_versions expected 684348, got ' || n_hadith_texts;
  assert n_claims = 88, 'hadith_verification_claims expected 88, got ' || n_claims;
  assert n_profiles = 64, 'raw_object_profiles expected 64, got ' || n_profiles;

  raise notice 'Phase 3 loader checkpoint 04 verification passed.';
end $$;
