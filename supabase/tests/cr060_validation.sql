with expected(schema_name, expected_tables) as (
  values
    ('ingest'::text, 7::bigint),
    ('staging'::text, 28::bigint),
    ('content'::text, 42::bigint),
    ('public_api'::text, 0::bigint)
),
actual as (
  select schemaname as schema_name, count(*) as actual_tables
  from pg_tables
  where schemaname in ('ingest', 'staging', 'content', 'public_api')
  group by schemaname
)
select
  expected.schema_name,
  expected.expected_tables,
  coalesce(actual.actual_tables, 0) as actual_tables,
  expected.expected_tables = coalesce(actual.actual_tables, 0) as passed
from expected
left join actual using (schema_name)
order by expected.schema_name;

select
  count(*) as private_table_count,
  count(*) filter (where rowsecurity) as rls_enabled_count,
  bool_and(rowsecurity) as all_private_tables_have_rls
from pg_tables
where schemaname in ('ingest', 'staging', 'content');

select
  role_name,
  has_schema_privilege(role_name, 'ingest', 'usage') as ingest_usage,
  has_schema_privilege(role_name, 'staging', 'usage') as staging_usage,
  has_schema_privilege(role_name, 'content', 'usage') as content_usage,
  has_schema_privilege(role_name, 'public_api', 'usage') as public_api_usage
from (values ('anon'), ('authenticated'), ('service_role')) roles(role_name)
order by role_name;

select
  role_name,
  has_table_privilege(role_name, 'ingest.source_registry', 'select') as ingest_select,
  has_table_privilege(role_name, 'staging.source_records', 'select') as staging_select,
  has_table_privilege(role_name, 'content.quran_ayahs', 'select') as content_select
from (values ('anon'), ('authenticated'), ('service_role')) roles(role_name)
order by role_name;

select version from supabase_migrations.schema_migrations order by version;

begin;
set local role service_role;
insert into ingest.source_registry (source_key, name, domain)
values ('cr060-service-role-check', 'CR-060 service role check', 'verification');
select count(*) = 1 as service_role_write_passed
from ingest.source_registry
where source_key = 'cr060-service-role-check';
rollback;

begin;
insert into content.quran_surahs (id, surah_number, ayah_count)
values (1, 1, 7);
insert into content.quran_ayahs
  (id, surah_number, ayah_number, global_ayah_number)
values
  (1, 1, 1, 1);
select verse_key = '1:1' as generated_verse_key_passed
from content.quran_ayahs
where id = 1;
rollback;
