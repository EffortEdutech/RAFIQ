create temp table if not exists phase6_public_payloads (
  payload_key text primary key,
  payload jsonb not null
);

truncate table phase6_public_payloads;

insert into phase6_public_payloads(payload_key, payload)
values ('readiness', public_api.public_release_readiness());

insert into phase6_public_payloads(payload_key, payload)
values ('entities', public_api.list_release_approved_entities(null, 20, 0));

insert into phase6_public_payloads(payload_key, payload)
values ('search', public_api.search_public_content('mercy', 'all', 5, 0));

insert into phase6_public_payloads(payload_key, payload)
values ('answer_draft', public_api.create_public_answer_draft('What does Islam say about mercy?', null, 'en', 'all', 5));

insert into phase6_public_payloads(payload_key, payload)
values ('guided_answer', public_api.create_public_guided_answer('What does Islam say about mercy?', null, 'en', 'all', 5));

with sample_private_entity as (
  select entity_type, entity_id
    from content.entity_release_states
   where publication_status = 'private_only'
   limit 1
),
failures as (
  select 'public_api_usage_granted_to_anon' as check_name
   where not has_schema_privilege('anon', 'public_api', 'USAGE')
  union all
  select 'public_api_usage_granted_to_authenticated'
   where not has_schema_privilege('authenticated', 'public_api', 'USAGE')
  union all
  select 'private_api_still_blocked_from_anon'
   where has_schema_privilege('anon', 'private_api', 'USAGE')
  union all
  select 'content_still_blocked_from_anon'
   where has_schema_privilege('anon', 'content', 'USAGE')
  union all
  select 'public_notice_active'
   where (select payload #>> '{notice,label}' from phase6_public_payloads where payload_key = 'readiness') <> 'PUBLIC RELEASE FILTER ACTIVE'
  union all
  select 'public_release_go_false'
   where (select (payload #>> '{readiness,publicReleaseGo}')::boolean from phase6_public_payloads where payload_key = 'readiness') is not false
  union all
  select 'public_design_ready_true'
   where (select (payload #>> '{readiness,publicDesignReady}')::boolean from phase6_public_payloads where payload_key = 'readiness') is not true
  union all
  select 'no_public_approved_entities_yet'
   where (select (payload #>> '{readiness,publicApprovedEntityCount}')::integer from phase6_public_payloads where payload_key = 'readiness') <> 0
  union all
  select 'private_content_blocked_count_present'
   where (select (payload #>> '{readiness,privateOnlyEntityCount}')::integer from phase6_public_payloads where payload_key = 'readiness') <= 0
  union all
  select 'release_approved_view_empty'
   where exists (select 1 from public_api.release_approved_entities)
  union all
  select 'list_entities_returns_empty_page'
   where (select (payload #>> '{pagination,total}')::integer from phase6_public_payloads where payload_key = 'entities') <> 0
  union all
  select 'public_search_returns_empty_results'
   where (select (payload #>> '{pagination,total}')::integer from phase6_public_payloads where payload_key = 'search') <> 0
      or jsonb_array_length((select payload #> '{results}' from phase6_public_payloads where payload_key = 'search')) <> 0
  union all
  select 'public_search_release_filter_active'
   where (select payload #>> '{releaseFilter,status}' from phase6_public_payloads where payload_key = 'search') <> 'active'
      or (select (payload #>> '{releaseFilter,pendingContentBlocked}')::boolean from phase6_public_payloads where payload_key = 'search') is not true
      or (select (payload #>> '{releaseFilter,privateSearchIndexReadable}')::boolean from phase6_public_payloads where payload_key = 'search') is not false
  union all
  select 'public_search_does_not_match_private_totals'
   where (select (payload #>> '{pagination,total}')::integer from phase6_public_payloads where payload_key = 'search')
       >= (select (private_api.search_content('mercy', 'all', 5, 0) #>> '{pagination,total}')::integer)
      and (select (private_api.search_content('mercy', 'all', 5, 0) #>> '{pagination,total}')::integer) > 0
  union all
  select 'public_answer_uses_public_notice'
   where (select payload #>> '{notice,label}' from phase6_public_payloads where payload_key = 'answer_draft') <> 'PUBLIC RELEASE FILTER ACTIVE'
  union all
  select 'public_answer_blocks_without_public_evidence'
   where (select payload #>> '{answerDraft,responseState}' from phase6_public_payloads where payload_key = 'answer_draft') <> 'source_unavailable'
      or jsonb_array_length((select payload #> '{answerDraft,evidenceItems}' from phase6_public_payloads where payload_key = 'answer_draft')) <> 0
      or (select (payload #>> '{answerDraft,publicReleaseReady}')::boolean from phase6_public_payloads where payload_key = 'answer_draft') is not false
  union all
  select 'public_answer_gate_failed_without_evidence'
   where (select payload #>> '{answerDraft,validationGateResults,publicReleaseGate,status}' from phase6_public_payloads where payload_key = 'answer_draft') <> 'failed'
      or (select (payload #>> '{answerDraft,validationGateResults,publicReleaseGate,pendingContentBlocked}')::boolean from phase6_public_payloads where payload_key = 'answer_draft') is not true
  union all
  select 'public_guided_answer_blocks_model_without_public_evidence'
   where (select payload #>> '{guidedAnswer,promptStatus}' from phase6_public_payloads where payload_key = 'guided_answer') <> 'blocked_no_public_evidence'
      or jsonb_array_length((select payload #> '{guidedAnswer,evidencePrompt}' from phase6_public_payloads where payload_key = 'guided_answer')) <> 0
      or jsonb_array_length((select payload #> '{guidedAnswer,citationIds}' from phase6_public_payloads where payload_key = 'guided_answer')) <> 0
      or (select (payload #>> '{guidedAnswer,publicReleaseReady}')::boolean from phase6_public_payloads where payload_key = 'guided_answer') is not false
  union all
  select 'private_only_entity_fails_release_gate'
   where exists (
     select 1
       from sample_private_entity spe
      where public_api.release_gate_passed(spe.entity_type, spe.entity_id)
   )
)
select count(*) as phase6_public_promotion_assertion_failures,
       coalesce(jsonb_agg(check_name order by check_name), '[]'::jsonb) as failing_checks
  from failures;
