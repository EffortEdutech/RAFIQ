-- RAFIQ Phase 5 indexed private search and retrieval trace verification.

with expected_functions(function_name) as (
  values
    ('rebuild_private_search_documents'),
    ('search_content'),
    ('get_retrieval_trace')
),
actual_functions as (
  select p.proname as function_name
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'private_api'
)
select ef.function_name,
       af.function_name is not null as installed
  from expected_functions ef
  left join actual_functions af using (function_name)
 order by ef.function_name;

select role_name,
       has_schema_privilege(role_name, 'private_api', 'USAGE') as schema_usage,
       has_function_privilege(role_name, 'private_api.search_content(text,text,integer,integer)', 'EXECUTE') as can_search_content,
       has_function_privilege(role_name, 'private_api.rebuild_private_search_documents()', 'EXECUTE') as can_rebuild_search,
       has_function_privilege(role_name, 'private_api.get_retrieval_trace(uuid)', 'EXECUTE') as can_get_trace
  from (values ('anon'), ('authenticated'), ('service_role')) roles(role_name)
 order by role_name;

with indexed_counts as (
  select domain, count(*) as document_count
    from content.private_search_documents
   group by domain
),
search_payload as (
  select private_api.search_content('mercy', 'all', 5, 0) as payload
),
trace_payload as (
  select private_api.get_retrieval_trace((payload->'retrievalTrace'->>'traceId')::uuid) as payload
    from search_payload
),
assertions(check_name, passed) as (
  values
    ('indexed_quran_documents', coalesce((select document_count > 0 from indexed_counts where domain = 'quran'), false)),
    ('indexed_tafsir_documents', coalesce((select document_count > 0 from indexed_counts where domain = 'tafsir'), false)),
    ('indexed_topic_documents', coalesce((select document_count > 0 from indexed_counts where domain = 'topic'), false)),
    ('indexed_theme_documents', coalesce((select document_count > 0 from indexed_counts where domain = 'ayah_theme'), false)),
    ('indexed_hadith_documents', coalesce((select document_count > 0 from indexed_counts where domain = 'hadith'), false)),
    ('search_has_trace_id', (select payload->'retrievalTrace'->>'traceId' is not null from search_payload)),
    ('search_has_scores', (select payload->'results'->0->>'score' is not null from search_payload)),
    ('search_has_results', (select jsonb_array_length(payload->'results') > 0 from search_payload)),
    ('trace_roundtrip', coalesce((select payload->'trace'->>'queryText' = 'mercy' from trace_payload), false)),
    (
      'anon_indexed_search_blocked',
      not has_schema_privilege('anon', 'private_api', 'USAGE')
      and not has_function_privilege('anon', 'private_api.search_content(text,text,integer,integer)', 'EXECUTE')
    ),
    (
      'authenticated_indexed_search_blocked',
      not has_schema_privilege('authenticated', 'private_api', 'USAGE')
      and not has_function_privilege('authenticated', 'private_api.search_content(text,text,integer,integer)', 'EXECUTE')
    ),
    (
      'service_role_indexed_search_allowed',
      has_schema_privilege('service_role', 'private_api', 'USAGE')
      and has_function_privilege('service_role', 'private_api.search_content(text,text,integer,integer)', 'EXECUTE')
    )
)
select check_name, passed
  from assertions
 order by check_name;

with search_payload as (
  select private_api.search_content('mercy', 'all', 5, 0) as payload
),
trace_payload as (
  select private_api.get_retrieval_trace((payload->'retrievalTrace'->>'traceId')::uuid) as payload
    from search_payload
),
assertions(passed) as (
  values
    ((select count(*) > 0 from content.private_search_documents where domain = 'quran')),
    ((select count(*) > 0 from content.private_search_documents where domain = 'tafsir')),
    ((select count(*) > 0 from content.private_search_documents where domain = 'topic')),
    ((select count(*) > 0 from content.private_search_documents where domain = 'ayah_theme')),
    ((select count(*) > 0 from content.private_search_documents where domain = 'hadith')),
    ((select payload->'retrievalTrace'->>'traceId' is not null from search_payload)),
    ((select payload->'results'->0->>'score' is not null from search_payload)),
    ((select jsonb_array_length(payload->'results') > 0 from search_payload)),
    (coalesce((select payload->'trace'->>'queryText' = 'mercy' from trace_payload), false)),
    (not has_schema_privilege('anon', 'private_api', 'USAGE')
      and not has_function_privilege('anon', 'private_api.search_content(text,text,integer,integer)', 'EXECUTE')),
    (not has_schema_privilege('authenticated', 'private_api', 'USAGE')
      and not has_function_privilege('authenticated', 'private_api.search_content(text,text,integer,integer)', 'EXECUTE')),
    (has_schema_privilege('service_role', 'private_api', 'USAGE')
      and has_function_privilege('service_role', 'private_api.search_content(text,text,integer,integer)', 'EXECUTE'))
)
select 'phase5_indexed_search_assertion_failures' as check_name,
       count(*) filter (where passed is distinct from true) as failure_count
  from assertions;
