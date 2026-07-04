-- RAFIQ Phase 5 private retrieval verification.

with expected_functions(function_name) as (
  values
    ('private_content_notice'),
    ('get_quran_surah'),
    ('list_hadith_collections'),
    ('list_hadith_records'),
    ('get_hadith_record')
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
       has_function_privilege(role_name, 'private_api.get_quran_surah(integer,text,text,text)', 'EXECUTE') as can_get_quran_surah,
       has_function_privilege(role_name, 'private_api.list_hadith_collections()', 'EXECUTE') as can_list_hadith_collections,
       has_function_privilege(role_name, 'private_api.list_hadith_records(text,text,integer,integer)', 'EXECUTE') as can_list_hadith_records,
       has_function_privilege(role_name, 'private_api.get_hadith_record(uuid)', 'EXECUTE') as can_get_hadith_record
  from (values ('anon'), ('authenticated'), ('service_role')) roles(role_name)
 order by role_name;

with quran_payload as (
  select private_api.get_quran_surah(1) as payload
),
hadith_collection_payload as (
  select private_api.list_hadith_collections() as payload
),
hadith_list_payload as (
  select private_api.list_hadith_records('fawaz-linebyline:bukhari', 'english', 3, 0) as payload
),
first_hadith as (
  select (payload->'records'->0->>'hadithRecordId')::uuid as hadith_record_id
    from hadith_list_payload
),
hadith_detail_payload as (
  select private_api.get_hadith_record(hadith_record_id) as payload
    from first_hadith
),
assertions(check_name, passed) as (
  values
    (
      'quran_notice_label',
      (select payload->'notice'->>'label' = 'UNAPPROVED CONTENT - NOT FOR PUBLICATION' from quran_payload)
    ),
    (
      'quran_surah_1_ayah_count',
      (select jsonb_array_length(payload->'ayahs') = 7 from quran_payload)
    ),
    (
      'quran_translation_default',
      (select payload->'editions'->'translation'->>'editionKey' = 'qul-en-sahih-simple' from quran_payload)
    ),
    (
      'hadith_collection_count',
      (select jsonb_array_length(payload->'collections') = 70 from hadith_collection_payload)
    ),
    (
      'hadith_list_limit',
      (select jsonb_array_length(payload->'records') = 3 from hadith_list_payload)
    ),
    (
      'hadith_list_total_bukhari',
      (select (payload->'pagination'->>'total')::integer = 7563 from hadith_list_payload)
    ),
    (
      'hadith_detail_notice_label',
      (select payload->'notice'->>'label' = 'UNAPPROVED CONTENT - NOT FOR PUBLICATION' from hadith_detail_payload)
    ),
    (
      'hadith_detail_has_text_versions',
      (select jsonb_array_length(payload->'textVersions') > 0 from hadith_detail_payload)
    ),
    (
      'anon_blocked',
      not has_schema_privilege('anon', 'private_api', 'USAGE')
      and not has_function_privilege('anon', 'private_api.get_quran_surah(integer,text,text,text)', 'EXECUTE')
    ),
    (
      'authenticated_blocked',
      not has_schema_privilege('authenticated', 'private_api', 'USAGE')
      and not has_function_privilege('authenticated', 'private_api.get_quran_surah(integer,text,text,text)', 'EXECUTE')
    ),
    (
      'service_role_allowed',
      has_schema_privilege('service_role', 'private_api', 'USAGE')
      and has_function_privilege('service_role', 'private_api.get_quran_surah(integer,text,text,text)', 'EXECUTE')
    )
)
select check_name, passed
  from assertions
 order by check_name;

with quran_payload as (
  select private_api.get_quran_surah(1) as payload
),
hadith_collection_payload as (
  select private_api.list_hadith_collections() as payload
),
hadith_list_payload as (
  select private_api.list_hadith_records('fawaz-linebyline:bukhari', 'english', 3, 0) as payload
),
first_hadith as (
  select (payload->'records'->0->>'hadithRecordId')::uuid as hadith_record_id
    from hadith_list_payload
),
hadith_detail_payload as (
  select private_api.get_hadith_record(hadith_record_id) as payload
    from first_hadith
),
assertions(passed) as (
  values
    ((select payload->'notice'->>'label' = 'UNAPPROVED CONTENT - NOT FOR PUBLICATION' from quran_payload)),
    ((select jsonb_array_length(payload->'ayahs') = 7 from quran_payload)),
    ((select payload->'editions'->'translation'->>'editionKey' = 'qul-en-sahih-simple' from quran_payload)),
    ((select jsonb_array_length(payload->'collections') = 70 from hadith_collection_payload)),
    ((select jsonb_array_length(payload->'records') = 3 from hadith_list_payload)),
    ((select (payload->'pagination'->>'total')::integer = 7563 from hadith_list_payload)),
    ((select payload->'notice'->>'label' = 'UNAPPROVED CONTENT - NOT FOR PUBLICATION' from hadith_detail_payload)),
    ((select jsonb_array_length(payload->'textVersions') > 0 from hadith_detail_payload)),
    (not has_schema_privilege('anon', 'private_api', 'USAGE')
      and not has_function_privilege('anon', 'private_api.get_quran_surah(integer,text,text,text)', 'EXECUTE')),
    (not has_schema_privilege('authenticated', 'private_api', 'USAGE')
      and not has_function_privilege('authenticated', 'private_api.get_quran_surah(integer,text,text,text)', 'EXECUTE')),
    (has_schema_privilege('service_role', 'private_api', 'USAGE')
      and has_function_privilege('service_role', 'private_api.get_quran_surah(integer,text,text,text)', 'EXECUTE'))
)
select 'phase5_private_retrieval_assertion_failures' as check_name,
       count(*) filter (where not passed) as failure_count
  from assertions;
