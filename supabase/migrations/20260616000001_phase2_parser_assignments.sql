-- RAFIQ Phase 2: parser assignment register.
--
-- Phase 2 exit gate requires every principal/parser input to have a
-- snapshot, raw object, checksum, and parser assignment before Phase 3
-- loaders are treated as production-grade.

create table if not exists ingest.raw_object_parser_assignments (
  id uuid primary key default gen_random_uuid(),
  raw_object_id uuid not null references ingest.raw_objects(id),
  parser_name text not null,
  parser_version text not null default 'assigned-v1',
  assignment_status text not null default 'assigned',
  assignment_scope text not null default 'principal_input',
  notes text,
  created_at timestamptz not null default now(),
  unique (raw_object_id, parser_name, parser_version)
);

alter table ingest.raw_object_parser_assignments enable row level security;

revoke all on ingest.raw_object_parser_assignments from anon, authenticated;
grant select, insert, update, delete on ingest.raw_object_parser_assignments to service_role;

insert into ingest.raw_object_parser_assignments (
  raw_object_id,
  parser_name,
  parser_version,
  assignment_status,
  assignment_scope,
  notes
)
select
  ro.id,
  case
    when ro.object_path in (
      'data/raw/quran/tanzil/quran-uthmani-with-ayah-numbers.txt',
      'data/raw/quran/qul/uthmani.json',
      'data/raw/quran/qul/qpc-hafs.json'
    ) then 'parse_quran_ayah_texts'
    when ro.object_path = 'data/raw/quran/tanzil/quran-data.xml'
      then 'parse_quran_partitions'
    when ro.object_path like 'data/raw/quran/qul/quran-metadata-%.json'
      then 'parse_qul_quran_metadata'
    when ro.object_path like 'data/raw/translations/%'
      then 'parse_translation_texts'
    when ro.object_path like 'data/raw/tafsir/%'
      then 'parse_tafsir_topics_themes'
    when ro.object_path like 'data/raw/hadith/collections/fawaz-hadith-api-v1/database/linebyline/%.txt'
      then 'parse_hadith_fawaz_linebyline'
    when ro.object_path like 'data/raw/hadith/collections/fawaz-hadith-api-v1/editions/%.json'
      then 'parse_hadith_fawaz_editions_json'
    when ro.object_path like 'data/raw/hadith/collections/fawaz-hadith-api-v1/database/originals/%.txt'
      then 'parse_hadith_fawaz_originals_text'
    when ro.object_path like 'data/raw/hadith/collections/fawaz-hadith-api-v1/%'
      then 'parse_hadith_fawaz_metadata'
    when ro.object_path like 'data/raw/hadith/collections/abdullah-naseer-six-books/%'
      then 'parse_hadith_abdullah_json'
    when ro.format = 'parquet'
      then 'parse_hadith_parquet_generic'
    when ro.format = 'csv'
      then 'parse_hadith_csv_generic'
    when ro.format = 'jsonl'
      then 'parse_hadith_jsonl_generic'
    when ro.format = 'gzip'
      then 'parse_hadith_gzip_jsonl_generic'
    when ro.format = 'xlsx'
      then 'parse_hadith_xlsx_generic'
    when ro.format = 'json'
      then 'parse_hadith_json_generic'
    else 'manual_parser_review'
  end as parser_name,
  'assigned-v1' as parser_version,
  case
    when ro.object_path in (
      'data/raw/quran/tanzil/quran-uthmani-with-ayah-numbers.txt',
      'data/raw/quran/qul/uthmani.json',
      'data/raw/quran/qul/qpc-hafs.json',
      'data/raw/quran/tanzil/quran-data.xml',
      'data/raw/translations/tanzil/en.sahih.txt',
      'data/raw/translations/tanzil/ms.basmeih.txt',
      'data/raw/translations/tanzil/id.indonesian.txt',
      'data/raw/translations/qul/en-sahih-international-simple.json',
      'data/raw/translations/qul/en-sahih-international-inline-footnotes.json',
      'data/raw/translations/qul/en-sahih-international-with-footnote-tags.json',
      'data/raw/translations/qul/en-sahih-international-chunks.json',
      'data/raw/translations/qul/abdullah-basamia-simple.json'
    )
    or ro.object_path like 'data/raw/hadith/collections/fawaz-hadith-api-v1/database/linebyline/%.txt'
      then 'implemented'
    else 'assigned'
  end as assignment_status,
  case
    when ro.object_path like 'data/raw/hadith/%' then 'hadith_principal_input'
    else 'domain_payload_input'
  end as assignment_scope,
  'Phase 2 parser assignment register. Implemented status means a Phase 3 loader script already exists; assigned means the raw input has an explicit planned parser owner.'
from ingest.raw_objects ro
where ro.parse_eligible
on conflict (raw_object_id, parser_name, parser_version) do update
set assignment_status = excluded.assignment_status,
    assignment_scope = excluded.assignment_scope,
    notes = excluded.notes;

do $$
declare
  n_parse_eligible bigint;
  n_assignments bigint;
  n_missing bigint;
begin
  select count(*) into n_parse_eligible
  from ingest.raw_objects
  where parse_eligible;

  select count(distinct raw_object_id) into n_assignments
  from ingest.raw_object_parser_assignments;

  select count(*) into n_missing
  from ingest.raw_objects ro
  where ro.parse_eligible
    and not exists (
      select 1
      from ingest.raw_object_parser_assignments ropa
      where ropa.raw_object_id = ro.id
    );

  assert n_assignments = n_parse_eligible,
    'parser assignments expected ' || n_parse_eligible || ', got ' || n_assignments;
  assert n_missing = 0,
    'parse_eligible raw_objects without parser assignment: ' || n_missing;

  raise notice 'Phase 2 parser assignment verification passed: % assigned inputs',
    n_assignments;
end $$;
