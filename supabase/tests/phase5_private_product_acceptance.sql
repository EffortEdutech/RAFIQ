create temp table if not exists phase5_acceptance_payloads (
  payload_key text primary key,
  payload jsonb not null
);

truncate table phase5_acceptance_payloads;

insert into phase5_acceptance_payloads(payload_key, payload)
values ('quran', private_api.get_quran_surah(1));

insert into phase5_acceptance_payloads(payload_key, payload)
values ('hadith_collections', private_api.list_hadith_collections());

insert into phase5_acceptance_payloads(payload_key, payload)
values (
  'hadith_records',
  private_api.list_hadith_records('fawaz-linebyline:bukhari', 'english', 3, 0)
);

insert into phase5_acceptance_payloads(payload_key, payload)
values (
  'hadith_detail',
  private_api.get_hadith_record(
    (select (payload #>> '{records,0,hadithRecordId}')::uuid
       from phase5_acceptance_payloads
      where payload_key = 'hadith_records')
  )
);

insert into phase5_acceptance_payloads(payload_key, payload)
values ('search', private_api.search_content('mercy', 'all', 5, 0));

insert into phase5_acceptance_payloads(payload_key, payload)
values (
  'trace',
  private_api.get_retrieval_trace(
    (select (payload #>> '{retrievalTrace,traceId}')::uuid
       from phase5_acceptance_payloads
      where payload_key = 'search')
  )
);

insert into phase5_acceptance_payloads(payload_key, payload)
values ('review_queue', private_api.list_review_queue('all', null, 5, 0));

insert into phase5_acceptance_payloads(payload_key, payload)
values (
  'source_detail',
  private_api.get_source_detail(
    (select payload #>> '{ayahs,0,quranTextSourceDetailTarget,entityType}' from phase5_acceptance_payloads where payload_key = 'quran'),
    (select payload #>> '{ayahs,0,quranTextSourceDetailTarget,entityId}' from phase5_acceptance_payloads where payload_key = 'quran')
  )
);

insert into phase5_acceptance_payloads(payload_key, payload)
values (
  'answer_draft',
  private_api.create_answer_draft('What does Islam say about mercy?', null, 'en', 'all', 5)
);

insert into phase5_acceptance_payloads(payload_key, payload)
values (
  'guided_answer',
  private_api.create_guided_answer('What does Islam say about mercy?', null, 'en', 'all', 5)
);

insert into phase5_acceptance_payloads(payload_key, payload)
values (
  'model_adapter',
  private_api.create_model_adapter_run(
    (select (payload #>> '{guidedAnswer,guidedAnswerId}')::uuid
       from phase5_acceptance_payloads
      where payload_key = 'guided_answer'),
    false,
    'disabled',
    'not_configured',
    'disabled_dry_run'
  )
);

insert into phase5_acceptance_payloads(payload_key, payload)
values (
  'answer_validation',
  private_api.create_answer_validation_run(
    (select (payload #>> '{guidedAnswer,guidedAnswerId}')::uuid
       from phase5_acceptance_payloads
      where payload_key = 'guided_answer'),
    (select (payload #>> '{modelAdapterRun,modelAdapterRunId}')::uuid
       from phase5_acceptance_payloads
      where payload_key = 'model_adapter'),
    null
  )
);

with failures as (
  select 'private_api_not_accessible_to_anon' as check_name
   where has_schema_privilege('anon', 'private_api', 'USAGE')
  union all
  select 'private_api_not_accessible_to_authenticated'
   where has_schema_privilege('authenticated', 'private_api', 'USAGE')
  union all
  select 'public_api_has_no_release_surfaces_yet'
   where exists (
     select 1
       from pg_namespace n
       join pg_class c on c.relnamespace = n.oid
      where n.nspname = 'public_api'
        and c.relkind in ('r', 'v', 'm')
   )
      or exists (
     select 1
       from pg_namespace n
       join pg_proc p on p.pronamespace = n.oid
      where n.nspname = 'public_api'
   )
  union all
  select 'quran_surah_private_notice'
   where (select payload #>> '{notice,label}' from phase5_acceptance_payloads where payload_key = 'quran') <> 'UNAPPROVED CONTENT - NOT FOR PUBLICATION'
  union all
  select 'quran_surah_complete'
   where jsonb_array_length((select payload #> '{ayahs}' from phase5_acceptance_payloads where payload_key = 'quran')) <> 7
  union all
  select 'hadith_collections_complete'
   where jsonb_array_length((select payload #> '{collections}' from phase5_acceptance_payloads where payload_key = 'hadith_collections')) <> 70
  union all
  select 'hadith_bukhari_private_count'
   where (select (payload #>> '{pagination,total}')::integer from phase5_acceptance_payloads where payload_key = 'hadith_records') <> 7563
  union all
  select 'hadith_detail_has_text_versions'
   where jsonb_array_length((select payload #> '{textVersions}' from phase5_acceptance_payloads where payload_key = 'hadith_detail')) = 0
  union all
  select 'search_returns_ranked_results'
   where jsonb_array_length((select payload #> '{results}' from phase5_acceptance_payloads where payload_key = 'search')) = 0
  union all
  select 'retrieval_trace_round_trips'
   where (select payload #>> '{trace,queryText}' from phase5_acceptance_payloads where payload_key = 'trace') <> 'mercy'
  union all
  select 'review_queue_has_items'
   where (select (payload #>> '{pagination,total}')::integer from phase5_acceptance_payloads where payload_key = 'review_queue') <= 0
  union all
  select 'source_detail_has_provenance'
   where (select (payload #>> '{sourceDetail,provenanceCount}')::integer from phase5_acceptance_payloads where payload_key = 'source_detail') <= 0
  union all
  select 'answer_draft_guardrail_state'
   where (select payload #>> '{answerDraft,responseState}' from phase5_acceptance_payloads where payload_key = 'answer_draft') <> 'approved_with_disclaimer'
  union all
  select 'guided_answer_model_ready'
   where (select payload #>> '{guidedAnswer,promptStatus}' from phase5_acceptance_payloads where payload_key = 'guided_answer') <> 'model_ready'
  union all
  select 'model_adapter_disabled_by_default'
   where (select payload #>> '{modelAdapterRun,adapterStatus}' from phase5_acceptance_payloads where payload_key = 'model_adapter') <> 'disabled_by_configuration'
  union all
  select 'answer_validation_passes_private_review_required'
   where (select payload #>> '{answerValidationRun,validationStatus}' from phase5_acceptance_payloads where payload_key = 'answer_validation') <> 'passed_private_review_required'
  union all
  select 'private_search_index_populated'
   where (select count(*) from content.private_search_documents) < 700000
  union all
  select 'canonical_release_states_populated'
   where (select count(*) from content.entity_release_states) < 1000000
  union all
  select 'canonical_provenance_populated'
   where (select count(*) from content.entity_provenance) < 1000000
)
select count(*) as phase5_private_product_acceptance_failures,
       coalesce(jsonb_agg(check_name order by check_name), '[]'::jsonb) as failing_checks
  from failures;
