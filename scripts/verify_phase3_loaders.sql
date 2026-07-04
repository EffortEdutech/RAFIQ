-- RAFIQ Phase 3 loader checkpoint verification.

\set ON_ERROR_STOP on

select 'completed_import_runs' as check_name, count(*)::bigint as actual, 28::bigint as expected,
       count(*) = 28 as passed
from ingest.import_runs
where status = 'completed'
union all
select 'failed_import_runs', count(*), 0, count(*) = 0
from ingest.import_runs
where status = 'failed'
union all
select 'source_records_total', count(*), 202249, count(*) = 202249
from staging.source_records
union all
select 'quran_ayah_texts', count(*), 18708, count(*) = 18708
from staging.quran_ayah_texts
union all
select 'quran_partitions', count(*), 1566, count(*) = 1566
from staging.quran_partitions
union all
select 'translation_texts', count(*), 49888, count(*) = 49888
from staging.translation_texts
union all
select 'hadith_records', count(*), 29929, count(*) = 29929
from staging.hadith_records
union all
select 'hadith_text_versions', count(*), 102158, count(*) = 102158
from staging.hadith_text_versions;

select parser_name, status, count(*)::bigint as runs,
       sum(input_object_count)::bigint as input_objects,
       sum(parsed_record_count)::bigint as parsed_records,
       sum(staged_record_count)::bigint as staged_records,
       sum(rejected_record_count)::bigint as rejected_records
from ingest.import_runs
group by parser_name, status
order by parser_name, status;

select script_label, count(*)::bigint as rows
from staging.quran_ayah_texts
group by script_label
order by script_label;

select partition_type, count(*)::bigint as rows
from staging.quran_partitions
group by partition_type
order by partition_type;

select language_code, edition_label, variant_type, count(*)::bigint as rows
from staging.translation_texts
group by language_code, edition_label, variant_type
order by language_code, edition_label, variant_type;

select hr.source_collection_key,
       count(distinct hr.id)::bigint as hadith_records,
       count(htv.id)::bigint as text_versions
from staging.hadith_records hr
left join staging.hadith_text_versions htv on htv.hadith_record_id = hr.id
group by hr.source_collection_key
order by hr.source_collection_key;

do $$
declare
  n_failed bigint;
  n_completed bigint;
  n_source_records bigint;
  n_quran_texts bigint;
  n_partitions bigint;
  n_translations bigint;
  n_hadith_records bigint;
  n_hadith_texts bigint;
begin
  select count(*) into n_failed from ingest.import_runs where status = 'failed';
  select count(*) into n_completed from ingest.import_runs where status = 'completed';
  select count(*) into n_source_records from staging.source_records;
  select count(*) into n_quran_texts from staging.quran_ayah_texts;
  select count(*) into n_partitions from staging.quran_partitions;
  select count(*) into n_translations from staging.translation_texts;
  select count(*) into n_hadith_records from staging.hadith_records;
  select count(*) into n_hadith_texts from staging.hadith_text_versions;

  assert n_failed = 0, 'failed import runs expected 0, got ' || n_failed;
  assert n_completed = 28, 'completed import runs expected 28, got ' || n_completed;
  assert n_source_records = 202249, 'source_records expected 202249, got ' || n_source_records;
  assert n_quran_texts = 18708, 'quran_ayah_texts expected 18708, got ' || n_quran_texts;
  assert n_partitions = 1566, 'quran_partitions expected 1566, got ' || n_partitions;
  assert n_translations = 49888, 'translation_texts expected 49888, got ' || n_translations;
  assert n_hadith_records = 29929, 'hadith_records expected 29929, got ' || n_hadith_records;
  assert n_hadith_texts = 102158, 'hadith_text_versions expected 102158, got ' || n_hadith_texts;

  raise notice 'Phase 3 loader checkpoint verification passed.';
end $$;
