create temp table if not exists phase5_source_detail_payloads (
  payload_key text primary key,
  payload jsonb not null
);

truncate table phase5_source_detail_payloads;

insert into phase5_source_detail_payloads(payload_key, payload)
values ('quran', private_api.get_quran_surah(1));

insert into phase5_source_detail_payloads(payload_key, payload)
values (
  'quran_text_source',
  private_api.get_source_detail(
    (select payload #>> '{ayahs,0,quranTextSourceDetailTarget,entityType}' from phase5_source_detail_payloads where payload_key = 'quran'),
    (select payload #>> '{ayahs,0,quranTextSourceDetailTarget,entityId}' from phase5_source_detail_payloads where payload_key = 'quran')
  )
);

insert into phase5_source_detail_payloads(payload_key, payload)
values (
  'translation_source',
  private_api.get_source_detail(
    (select payload #>> '{ayahs,0,translation,sourceDetailTarget,entityType}' from phase5_source_detail_payloads where payload_key = 'quran'),
    (select payload #>> '{ayahs,0,translation,sourceDetailTarget,entityId}' from phase5_source_detail_payloads where payload_key = 'quran')
  )
);

insert into phase5_source_detail_payloads(payload_key, payload)
values (
  'hadith',
  private_api.get_hadith_record(
    (private_api.list_hadith_records('fawaz-linebyline:bukhari', 'english', 1, 0) #>> '{records,0,hadithRecordId}')::uuid
  )
);

insert into phase5_source_detail_payloads(payload_key, payload)
values (
  'hadith_source',
  private_api.get_source_detail(
    (select payload #>> '{record,sourceDetailTarget,entityType}' from phase5_source_detail_payloads where payload_key = 'hadith'),
    (select payload #>> '{record,sourceDetailTarget,entityId}' from phase5_source_detail_payloads where payload_key = 'hadith')
  )
);

with failures as (
  select 'quran_has_ayah_source_target' as check_name
   where (select payload #>> '{ayahs,0,quranTextSourceDetailTarget,entityType}' from phase5_source_detail_payloads where payload_key = 'quran') <> 'quran_ayah_text'
  union all
  select 'quran_translation_has_source_target'
   where (select payload #>> '{ayahs,0,translation,sourceDetailTarget,entityType}' from phase5_source_detail_payloads where payload_key = 'quran') <> 'translation_text'
  union all
  select 'quran_source_detail_has_provenance'
   where ((select payload #>> '{sourceDetail,provenanceCount}' from phase5_source_detail_payloads where payload_key = 'quran_text_source')::integer) <= 0
  union all
  select 'translation_source_detail_has_release_state'
   where (select payload #> '{sourceDetail,releaseState}' from phase5_source_detail_payloads where payload_key = 'translation_source') is null
  union all
  select 'hadith_has_record_source_target'
   where (select payload #>> '{record,sourceDetailTarget,entityType}' from phase5_source_detail_payloads where payload_key = 'hadith') <> 'hadith_record'
  union all
  select 'hadith_text_has_source_target'
   where (select payload #>> '{textVersions,0,sourceDetailTarget,entityType}' from phase5_source_detail_payloads where payload_key = 'hadith') <> 'hadith_text_version'
  union all
  select 'hadith_source_detail_has_snapshot'
   where (select payload #>> '{sourceDetail,provenance,0,snapshot,snapshotKey}' from phase5_source_detail_payloads where payload_key = 'hadith_source') is null
  union all
  select 'source_detail_notice_present'
   where (select payload #>> '{notice,label}' from phase5_source_detail_payloads where payload_key = 'hadith_source') <> 'UNAPPROVED CONTENT - NOT FOR PUBLICATION'
)
select count(*) as phase5_source_detail_assertion_failures,
       coalesce(jsonb_agg(check_name order by check_name), '[]'::jsonb) as failing_checks
  from failures;
