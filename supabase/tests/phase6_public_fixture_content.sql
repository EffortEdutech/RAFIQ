begin;

create temp table phase6_fixture_payloads (
  payload_key text primary key,
  payload jsonb not null
);

insert into content.private_search_documents (
  result_id,
  domain,
  title,
  subtitle,
  searchable_text,
  snippet,
  surah_number,
  ayah_number,
  verse_key,
  hadith_record_id,
  collection_key,
  target,
  rank_weight
)
values (
  'phase6-fixture:source_topic:approved-mercy',
  'topic',
  'Approved public fixture: mercy',
  'Phase 6 controlled fixture',
  'what does islam say about mercy compassion rahmah approved public fixture',
  'Controlled approved public fixture about mercy for release-filter testing only.',
  null,
  null,
  null,
  null,
  null,
  jsonb_build_object(
    'route', '/fixture/approved-mercy',
    'topicId', 'phase6-approved-fixture-topic-001',
    'sourceTopicKey', 'phase6-fixture-mercy'
  ),
  99.00
)
on conflict (result_id) do update
set title = excluded.title,
    subtitle = excluded.subtitle,
    searchable_text = excluded.searchable_text,
    snippet = excluded.snippet,
    target = excluded.target,
    rank_weight = excluded.rank_weight,
    indexed_at = now();

insert into content.entity_release_states (
  entity_type,
  entity_id,
  entity_version,
  technical_status,
  rights_status,
  attribution_status,
  editorial_status,
  scholar_content_status,
  publication_status,
  notes
)
values (
  'source_topic',
  'phase6-approved-fixture-topic-001',
  'phase6-fixture-v1',
  'validated',
  'approved',
  'approved',
  'approved',
  'approved',
  'public',
  'Synthetic Phase 6 approved fixture. Not real RAFIQ Islamic source content.'
)
on conflict (entity_type, entity_id, entity_version) do update
set technical_status = excluded.technical_status,
    rights_status = excluded.rights_status,
    attribution_status = excluded.attribution_status,
    editorial_status = excluded.editorial_status,
    scholar_content_status = excluded.scholar_content_status,
    publication_status = excluded.publication_status,
    effective_to = null,
    notes = excluded.notes;

insert into phase6_fixture_payloads(payload_key, payload)
values ('readiness_with_fixture', public_api.public_release_readiness());

insert into phase6_fixture_payloads(payload_key, payload)
values ('entities_with_fixture', public_api.list_release_approved_entities('source_topic', 10, 0));

insert into phase6_fixture_payloads(payload_key, payload)
values ('search_with_fixture', public_api.search_public_content('mercy', 'topics', 5, 0));

insert into phase6_fixture_payloads(payload_key, payload)
values ('answer_with_fixture', public_api.create_public_answer_draft('What does Islam say about mercy?', null, 'en', 'topics', 5));

insert into phase6_fixture_payloads(payload_key, payload)
values ('guided_with_fixture', public_api.create_public_guided_answer('What does Islam say about mercy?', null, 'en', 'topics', 5));

update content.entity_release_states
   set publication_status = 'private_only',
       effective_to = null,
       notes = 'Synthetic Phase 6 fixture rolled back inside test transaction.'
 where entity_type = 'source_topic'
   and entity_id = 'phase6-approved-fixture-topic-001'
   and entity_version = 'phase6-fixture-v1';

insert into phase6_fixture_payloads(payload_key, payload)
values ('search_after_rollback', public_api.search_public_content('mercy', 'topics', 5, 0));

insert into phase6_fixture_payloads(payload_key, payload)
values ('answer_after_rollback', public_api.create_public_answer_draft('What does Islam say about mercy?', null, 'en', 'topics', 5));

with failures as (
  select 'fixture_public_entity_count_positive' as check_name
   where (select (payload #>> '{readiness,publicApprovedEntityCount}')::integer
            from phase6_fixture_payloads
           where payload_key = 'readiness_with_fixture') < 1
  union all
  select 'fixture_entity_list_includes_source_topic'
   where (select (payload #>> '{pagination,total}')::integer
            from phase6_fixture_payloads
           where payload_key = 'entities_with_fixture') < 1
      or not exists (
        select 1
          from jsonb_array_elements((select payload #> '{entities}' from phase6_fixture_payloads where payload_key = 'entities_with_fixture')) item(value)
         where item.value->>'entityId' = 'phase6-approved-fixture-topic-001'
           and item.value->>'publicationStatus' = 'public'
      )
  union all
  select 'fixture_public_search_returns_only_fixture'
   where (select (payload #>> '{pagination,total}')::integer
            from phase6_fixture_payloads
           where payload_key = 'search_with_fixture') <> 1
      or jsonb_array_length((select payload #> '{results}' from phase6_fixture_payloads where payload_key = 'search_with_fixture')) <> 1
      or (select payload #>> '{results,0,resultId}' from phase6_fixture_payloads where payload_key = 'search_with_fixture') <> 'phase6-fixture:source_topic:approved-mercy'
      or (select payload #>> '{results,0,release,entityId}' from phase6_fixture_payloads where payload_key = 'search_with_fixture') <> 'phase6-approved-fixture-topic-001'
  union all
  select 'fixture_public_answer_uses_approved_evidence'
   where (select payload #>> '{answerDraft,responseState}' from phase6_fixture_payloads where payload_key = 'answer_with_fixture') <> 'approved_with_disclaimer'
      or jsonb_array_length((select payload #> '{answerDraft,evidenceItems}' from phase6_fixture_payloads where payload_key = 'answer_with_fixture')) <> 1
      or (select (payload #>> '{answerDraft,publicReleaseReady}')::boolean from phase6_fixture_payloads where payload_key = 'answer_with_fixture') is not true
      or (select payload #>> '{answerDraft,validationGateResults,publicReleaseGate,status}' from phase6_fixture_payloads where payload_key = 'answer_with_fixture') <> 'passed'
  union all
  select 'fixture_guided_answer_model_ready'
   where (select payload #>> '{guidedAnswer,promptStatus}' from phase6_fixture_payloads where payload_key = 'guided_with_fixture') <> 'model_ready'
      or jsonb_array_length((select payload #> '{guidedAnswer,evidencePrompt}' from phase6_fixture_payloads where payload_key = 'guided_with_fixture')) <> 1
      or jsonb_array_length((select payload #> '{guidedAnswer,citationIds}' from phase6_fixture_payloads where payload_key = 'guided_with_fixture')) <> 1
      or (select (payload #>> '{guidedAnswer,publicReleaseReady}')::boolean from phase6_fixture_payloads where payload_key = 'guided_with_fixture') is not true
  union all
  select 'fixture_rollback_removes_public_search'
   where exists (
     select 1
       from jsonb_array_elements((select payload #> '{results}' from phase6_fixture_payloads where payload_key = 'search_after_rollback')) item(value)
      where item.value->>'resultId' = 'phase6-fixture:source_topic:approved-mercy'
   )
  union all
  select 'fixture_rollback_blocks_public_answer'
   where (select payload #>> '{answerDraft,responseState}' from phase6_fixture_payloads where payload_key = 'answer_after_rollback') <> 'source_unavailable'
      or jsonb_array_length((select payload #> '{answerDraft,evidenceItems}' from phase6_fixture_payloads where payload_key = 'answer_after_rollback')) <> 0
  union all
  select 'private_content_still_has_mercy_results'
   where (select (private_api.search_content('mercy', 'all', 5, 0) #>> '{pagination,total}')::integer) <= 0
)
select count(*) as phase6_public_fixture_assertion_failures,
       coalesce(jsonb_agg(check_name order by check_name), '[]'::jsonb) as failing_checks
  from failures;

rollback;
