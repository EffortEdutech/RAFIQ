create temp table if not exists phase6_security_payloads (
  payload_key text primary key,
  payload jsonb not null
);

truncate table phase6_security_payloads;

insert into phase6_security_payloads(payload_key, payload)
values ('public_search', public_api.search_public_content('mercy', 'all', 5, 0));

insert into phase6_security_payloads(payload_key, payload)
values ('public_answer', public_api.create_public_answer_draft('What does Islam say about mercy?', null, 'en', 'all', 5));

with function_privileges as (
  select role_name,
         has_function_privilege(role_name, 'public_api.search_public_content(text,text,integer,integer)', 'EXECUTE') as can_public_search,
         has_function_privilege(role_name, 'public_api.create_public_answer_draft(text,text,text,text,integer)', 'EXECUTE') as can_public_answer,
         has_function_privilege(role_name, 'public_api.create_public_guided_answer(text,text,text,text,integer)', 'EXECUTE') as can_public_guided,
         has_function_privilege(role_name, 'private_api.search_content(text,text,integer,integer)', 'EXECUTE') as can_private_search,
         has_function_privilege(role_name, 'private_api.create_answer_draft(text,text,text,text,integer)', 'EXECUTE') as can_private_answer,
         has_function_privilege(role_name, 'private_api.list_review_queue(text,text,integer,integer)', 'EXECUTE') as can_private_review_queue
    from (values ('anon'), ('authenticated'), ('service_role')) roles(role_name)
),
failures as (
  select 'public_api_usage_for_client_roles' as check_name
   where not has_schema_privilege('anon', 'public_api', 'USAGE')
      or not has_schema_privilege('authenticated', 'public_api', 'USAGE')
  union all
  select 'private_schemas_blocked_from_client_roles'
   where has_schema_privilege('anon', 'private_api', 'USAGE')
      or has_schema_privilege('authenticated', 'private_api', 'USAGE')
      or has_schema_privilege('anon', 'content', 'USAGE')
      or has_schema_privilege('authenticated', 'content', 'USAGE')
      or has_schema_privilege('anon', 'ingest', 'USAGE')
      or has_schema_privilege('authenticated', 'ingest', 'USAGE')
      or has_schema_privilege('anon', 'staging', 'USAGE')
      or has_schema_privilege('authenticated', 'staging', 'USAGE')
  union all
  select 'public_functions_available_to_client_roles'
   where exists (
     select 1
       from function_privileges
      where role_name in ('anon', 'authenticated')
        and not (can_public_search and can_public_answer and can_public_guided)
   )
  union all
  select 'private_functions_blocked_from_client_roles'
   where exists (
     select 1
       from function_privileges
      where role_name in ('anon', 'authenticated')
        and (can_private_search or can_private_answer or can_private_review_queue)
   )
  union all
  select 'service_role_private_functions_available'
   where exists (
     select 1
       from function_privileges
      where role_name = 'service_role'
        and not (can_private_search and can_private_answer and can_private_review_queue)
   )
  union all
  select 'public_search_does_not_expose_pending_content'
   where (select (payload #>> '{pagination,total}')::integer from phase6_security_payloads where payload_key = 'public_search') <> 0
      or jsonb_array_length((select payload #> '{results}' from phase6_security_payloads where payload_key = 'public_search')) <> 0
  union all
  select 'public_answer_does_not_expose_pending_evidence'
   where (select payload #>> '{answerDraft,responseState}' from phase6_security_payloads where payload_key = 'public_answer') <> 'source_unavailable'
      or jsonb_array_length((select payload #> '{answerDraft,evidenceItems}' from phase6_security_payloads where payload_key = 'public_answer')) <> 0
  union all
  select 'public_release_filter_reports_active'
   where (select payload #>> '{releaseFilter,status}' from phase6_security_payloads where payload_key = 'public_search') <> 'active'
      or (select (payload #>> '{releaseFilter,pendingContentBlocked}')::boolean from phase6_security_payloads where payload_key = 'public_search') is not true
      or (select (payload #>> '{releaseFilter,privateSearchIndexReadable}')::boolean from phase6_security_payloads where payload_key = 'public_search') is not false
)
select count(*) as phase6_public_security_assertion_failures,
       coalesce(jsonb_agg(check_name order by check_name), '[]'::jsonb) as failing_checks
  from failures;
