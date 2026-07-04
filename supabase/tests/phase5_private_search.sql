-- RAFIQ Phase 5 private search verification.

with expected_functions(function_name) as (
  values ('search_content')
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
       has_function_privilege(role_name, 'private_api.search_content(text,text,integer,integer)', 'EXECUTE') as can_search_content
  from (values ('anon'), ('authenticated'), ('service_role')) roles(role_name)
 order by role_name;

with quran_payload as (
  select private_api.search_content('ٱللَّهِ', 'quran', 5, 0) as payload
),
tafsir_payload as (
  select private_api.search_content('mercy', 'tafsir', 5, 0) as payload
),
topic_payload as (
  select private_api.search_content('Allah', 'topics', 5, 0) as payload
),
theme_payload as (
  select private_api.search_content('guidance', 'themes', 5, 0) as payload
),
hadith_payload as (
  select private_api.search_content('intention', 'hadith', 5, 0) as payload
),
empty_payload as (
  select private_api.search_content('', 'all', 5, 0) as payload
),
assertions(check_name, passed) as (
  values
    ('search_notice_label', (select payload->'notice'->>'label' = 'UNAPPROVED CONTENT - NOT FOR PUBLICATION' from quran_payload)),
    ('quran_search_has_results', (select jsonb_array_length(payload->'results') > 0 from quran_payload)),
    ('tafsir_search_has_results', (select jsonb_array_length(payload->'results') > 0 from tafsir_payload)),
    ('topic_search_has_results', (select jsonb_array_length(payload->'results') > 0 from topic_payload)),
    ('theme_search_has_results', (select jsonb_array_length(payload->'results') > 0 from theme_payload)),
    ('hadith_search_has_results', (select jsonb_array_length(payload->'results') > 0 from hadith_payload)),
    ('empty_query_returns_no_results', (select jsonb_array_length(payload->'results') = 0 from empty_payload)),
    (
      'anon_search_blocked',
      not has_schema_privilege('anon', 'private_api', 'USAGE')
      and not has_function_privilege('anon', 'private_api.search_content(text,text,integer,integer)', 'EXECUTE')
    ),
    (
      'authenticated_search_blocked',
      not has_schema_privilege('authenticated', 'private_api', 'USAGE')
      and not has_function_privilege('authenticated', 'private_api.search_content(text,text,integer,integer)', 'EXECUTE')
    ),
    (
      'service_role_search_allowed',
      has_schema_privilege('service_role', 'private_api', 'USAGE')
      and has_function_privilege('service_role', 'private_api.search_content(text,text,integer,integer)', 'EXECUTE')
    )
)
select check_name, passed
  from assertions
 order by check_name;

with quran_payload as (
  select private_api.search_content('ٱللَّهِ', 'quran', 5, 0) as payload
),
tafsir_payload as (
  select private_api.search_content('mercy', 'tafsir', 5, 0) as payload
),
topic_payload as (
  select private_api.search_content('Allah', 'topics', 5, 0) as payload
),
theme_payload as (
  select private_api.search_content('guidance', 'themes', 5, 0) as payload
),
hadith_payload as (
  select private_api.search_content('intention', 'hadith', 5, 0) as payload
),
empty_payload as (
  select private_api.search_content('', 'all', 5, 0) as payload
),
assertions(passed) as (
  values
    ((select payload->'notice'->>'label' = 'UNAPPROVED CONTENT - NOT FOR PUBLICATION' from quran_payload)),
    ((select jsonb_array_length(payload->'results') > 0 from quran_payload)),
    ((select jsonb_array_length(payload->'results') > 0 from tafsir_payload)),
    ((select jsonb_array_length(payload->'results') > 0 from topic_payload)),
    ((select jsonb_array_length(payload->'results') > 0 from theme_payload)),
    ((select jsonb_array_length(payload->'results') > 0 from hadith_payload)),
    ((select jsonb_array_length(payload->'results') = 0 from empty_payload)),
    (not has_schema_privilege('anon', 'private_api', 'USAGE')
      and not has_function_privilege('anon', 'private_api.search_content(text,text,integer,integer)', 'EXECUTE')),
    (not has_schema_privilege('authenticated', 'private_api', 'USAGE')
      and not has_function_privilege('authenticated', 'private_api.search_content(text,text,integer,integer)', 'EXECUTE')),
    (has_schema_privilege('service_role', 'private_api', 'USAGE')
      and has_function_privilege('service_role', 'private_api.search_content(text,text,integer,integer)', 'EXECUTE'))
)
select 'phase5_private_search_assertion_failures' as check_name,
       count(*) filter (where not passed) as failure_count
  from assertions;
