-- RAFIQ Phase 3 loader checkpoint 03 verification.

\set ON_ERROR_STOP on

select 'completed_import_runs' as check_name, count(*)::bigint as actual, 66::bigint as expected,
       count(*) = 66 as passed
from ingest.import_runs
where status = 'completed'
union all
select 'failed_import_runs', count(*), 0, count(*) = 0
from ingest.import_runs
where status = 'failed'
union all
select 'source_records_total', count(*), 646545, count(*) = 646545
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
select 'source_topics', count(*), 2512, count(*) = 2512
from staging.source_topics
union all
select 'ayah_theme_groups', count(*), 2098, count(*) = 2098
from staging.ayah_theme_groups
union all
select 'hadith_records', count(*), 137347, count(*) = 137347
from staging.hadith_records
union all
select 'hadith_text_versions', count(*), 340719, count(*) = 340719
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

select parser_name, parser_version, status, count(*)::bigint as runs,
       sum(input_object_count)::bigint as input_objects,
       sum(parsed_record_count)::bigint as parsed_records,
       sum(staged_record_count)::bigint as staged_records,
       sum(warning_count)::bigint as warnings,
       sum(rejected_record_count)::bigint as rejected_records
from ingest.import_runs
group by parser_name, parser_version, status
order by parser_name, parser_version, status;

select source_edition_key, source_collection_key,
       count(*)::bigint as hadith_records
from staging.hadith_records
where source_edition_key in ('abdullah', 'meeatif', 'ahmedbaset')
group by source_edition_key, source_collection_key
order by source_edition_key, source_collection_key;

do $$
declare
  n_completed bigint;
  n_failed bigint;
  n_source_records bigint;
  n_hadith_records bigint;
  n_hadith_texts bigint;
begin
  select count(*) into n_completed from ingest.import_runs where status = 'completed';
  select count(*) into n_failed from ingest.import_runs where status = 'failed';
  select count(*) into n_source_records from staging.source_records;
  select count(*) into n_hadith_records from staging.hadith_records;
  select count(*) into n_hadith_texts from staging.hadith_text_versions;

  assert n_completed = 66, 'completed import runs expected 66, got ' || n_completed;
  assert n_failed = 0, 'failed import runs expected 0, got ' || n_failed;
  assert n_source_records = 646545, 'source_records expected 646545, got ' || n_source_records;
  assert n_hadith_records = 137347, 'hadith_records expected 137347, got ' || n_hadith_records;
  assert n_hadith_texts = 340719, 'hadith_text_versions expected 340719, got ' || n_hadith_texts;

  raise notice 'Phase 3 loader checkpoint 03 verification passed.';
end $$;
