-- RAFIQ private ingest and source-shaped staging schemas.
-- Derived from the approved Day 7 reference DDL.

create extension if not exists pgcrypto;

create schema if not exists ingest;
create schema if not exists staging;

revoke all on schema ingest from public, anon, authenticated;
revoke all on schema staging from public, anon, authenticated;

create table if not exists ingest.source_registry (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  name text not null,
  provider text,
  domain text not null,
  official_url text,
  repository_url text,
  documentation_url text,
  authority_class text not null default 'candidate',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists ingest.source_snapshots (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references ingest.source_registry(id),
  snapshot_key text not null unique,
  upstream_version text,
  branch text,
  commit_hash text,
  acquired_at timestamptz not null,
  acquisition_method text not null,
  acquired_by text,
  license_name text,
  license_url text,
  attribution_text text,
  technical_status text not null default 'acquired',
  rights_status text not null default 'unknown',
  attribution_status text not null default 'unknown',
  content_status text not null default 'raw',
  publication_status text not null default 'private_only',
  expected_record_count bigint,
  actual_record_count bigint,
  file_count bigint,
  total_bytes bigint,
  aggregate_sha256 text,
  supersedes_snapshot_id uuid references ingest.source_snapshots(id),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists ingest.raw_objects (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references ingest.source_snapshots(id),
  logical_name text not null,
  object_role text not null,
  object_path text not null,
  sha256 text not null,
  byte_length bigint not null,
  format text,
  media_type text,
  encoding text,
  parent_archive_object_id uuid references ingest.raw_objects(id),
  archive_member_path text,
  parse_eligible boolean not null default true,
  created_at timestamptz not null default now(),
  unique (snapshot_id, object_path, sha256)
);

create table if not exists ingest.import_runs (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references ingest.source_snapshots(id),
  parser_name text not null,
  parser_version text not null,
  code_revision text,
  configuration jsonb not null default '{}'::jsonb,
  configuration_hash text not null,
  status text not null default 'running',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  input_object_count bigint not null default 0,
  parsed_record_count bigint not null default 0,
  staged_record_count bigint not null default 0,
  warning_count bigint not null default 0,
  rejected_record_count bigint not null default 0,
  error_summary text,
  unique (snapshot_id, parser_name, parser_version, configuration_hash)
);

create table if not exists ingest.validation_findings (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid references ingest.source_snapshots(id),
  raw_object_id uuid references ingest.raw_objects(id),
  import_run_id uuid references ingest.import_runs(id),
  staging_table text,
  staging_record_id uuid,
  finding_code text not null,
  severity text not null,
  finding_origin text not null default 'rafiq_derived',
  description text not null,
  evidence jsonb not null default '{}'::jsonb,
  resolution_status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists ingest.transformation_events (
  id uuid primary key default gen_random_uuid(),
  import_run_id uuid not null references ingest.import_runs(id),
  transformation_type text not null,
  transformation_version text not null,
  configuration jsonb not null default '{}'::jsonb,
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists ingest.record_lineage (
  id uuid primary key default gen_random_uuid(),
  transformation_event_id uuid references ingest.transformation_events(id),
  parent_table text not null,
  parent_record_id uuid not null,
  child_table text not null,
  child_record_id uuid not null,
  lineage_role text not null default 'source',
  created_at timestamptz not null default now()
);

create table if not exists staging.source_records (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references ingest.source_registry(id),
  snapshot_id uuid not null references ingest.source_snapshots(id),
  raw_object_id uuid not null references ingest.raw_objects(id),
  import_run_id uuid not null references ingest.import_runs(id),
  domain text not null,
  record_type text not null,
  source_record_key text not null default '',
  source_locator text not null default '',
  source_sequence bigint,
  raw_record jsonb,
  raw_text_hash text,
  normalized_text_hash text,
  parse_status text not null default 'parsed',
  created_at timestamptz not null default now(),
  unique (import_run_id, raw_object_id, record_type, source_record_key, source_locator)
);

create table if not exists staging.quran_ayah_texts (
  id uuid primary key references staging.source_records(id),
  surah_number smallint not null,
  ayah_number smallint not null,
  ayah_key text not null,
  script_label text not null,
  text_value text not null,
  bismillah_representation text,
  ayah_end_marker_style text
);

create table if not exists staging.quran_partitions (
  id uuid primary key references staging.source_records(id),
  partition_type text not null,
  source_partition_id text,
  start_ayah_key text not null,
  end_ayah_key text,
  source_label text,
  classification text
);

create table if not exists staging.translation_texts (
  id uuid primary key references staging.source_records(id),
  ayah_key text not null,
  language_code text not null,
  translator_label text,
  edition_label text,
  variant_type text not null,
  text_value text not null,
  source_markup text
);

create table if not exists staging.translation_footnotes (
  id uuid primary key references staging.source_records(id),
  translation_text_id uuid references staging.translation_texts(id),
  source_footnote_id text,
  marker text,
  rich_text text,
  plain_text text
);

create table if not exists staging.translation_chunks (
  id uuid primary key references staging.source_records(id),
  translation_text_id uuid not null references staging.translation_texts(id),
  source_chunk_id text,
  source_order integer not null,
  chunk_type text,
  text_value text not null,
  style_json jsonb
);

create table if not exists staging.tafsir_passages (
  id uuid primary key references staging.source_records(id),
  group_ayah_key text not null,
  language_code text not null,
  source_edition_label text,
  from_ayah_key text,
  to_ayah_key text,
  passage_text text,
  source_html text,
  blank_text boolean not null default false
);

create table if not exists staging.tafsir_passage_ayahs (
  id uuid primary key default gen_random_uuid(),
  passage_id uuid not null references staging.tafsir_passages(id),
  ayah_key text not null,
  source_order integer,
  source_role text not null,
  unique (passage_id, ayah_key)
);

create table if not exists staging.source_topics (
  id uuid primary key references staging.source_records(id),
  source_topic_id text not null,
  namespace_labels text[],
  name text not null,
  arabic_name text,
  description text,
  raw_parent_ids jsonb,
  raw_related_topic_ids jsonb
);

create table if not exists staging.source_topic_relations (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references staging.source_topics(id),
  related_source_topic_id text not null,
  relation_type text not null,
  source_provided boolean not null default true
);

create table if not exists staging.source_topic_ayahs (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references staging.source_topics(id),
  ayah_key text not null,
  unique (topic_id, ayah_key)
);

create table if not exists staging.ayah_theme_groups (
  id uuid primary key references staging.source_records(id),
  theme_text text not null,
  surah_number smallint not null,
  ayah_from smallint not null,
  ayah_to smallint not null,
  raw_keywords text,
  total_ayahs integer,
  exact_duplicate_group text
);

create table if not exists staging.ayah_theme_group_ayahs (
  id uuid primary key default gen_random_uuid(),
  theme_group_id uuid not null references staging.ayah_theme_groups(id),
  ayah_key text not null,
  unique (theme_group_id, ayah_key)
);

create table if not exists staging.hadith_records (
  id uuid primary key references staging.source_records(id),
  source_collection_key text not null,
  source_edition_key text,
  source_book_key text,
  source_chapter_key text,
  source_hadith_number text,
  source_urn text,
  printed_reference text
);

create table if not exists staging.hadith_collections (
  id uuid primary key references staging.source_records(id),
  source_collection_key text not null,
  name_ar text,
  name_en text,
  name_ms text,
  author_label text,
  collection_type text
);

create table if not exists staging.hadith_editions (
  id uuid primary key references staging.source_records(id),
  collection_id uuid references staging.hadith_collections(id),
  source_edition_key text not null,
  language_code text,
  translator_label text,
  publisher_label text,
  edition_version text
);

create table if not exists staging.hadith_books (
  id uuid primary key references staging.source_records(id),
  edition_id uuid references staging.hadith_editions(id),
  source_book_key text not null,
  book_number text,
  title_ar text,
  title_en text
);

create table if not exists staging.hadith_chapters (
  id uuid primary key references staging.source_records(id),
  book_id uuid references staging.hadith_books(id),
  source_chapter_key text not null,
  chapter_number text,
  title_ar text,
  title_en text
);

create table if not exists staging.hadith_text_versions (
  id uuid primary key references staging.source_records(id),
  hadith_record_id uuid not null references staging.hadith_records(id),
  language_code text not null,
  translator_label text,
  full_text text,
  narrator_prefix text,
  isnad_text text,
  matn_text text,
  source_html text
);

create table if not exists staging.hadith_references (
  id uuid primary key references staging.source_records(id),
  reference_type text not null,
  reference_text text not null,
  collection_label text,
  book_label text,
  chapter_label text,
  volume text,
  page text,
  external_url text
);

create table if not exists staging.hadith_record_references (
  id uuid primary key default gen_random_uuid(),
  hadith_record_id uuid not null references staging.hadith_records(id),
  reference_id uuid not null references staging.hadith_references(id),
  source_order integer,
  unique (hadith_record_id, reference_id)
);

create table if not exists staging.hadith_isnad_segments (
  id uuid primary key references staging.source_records(id),
  hadith_text_version_id uuid not null references staging.hadith_text_versions(id),
  segment_text text not null,
  source_order integer,
  segmentation_method text,
  segmentation_confidence numeric
);

create table if not exists staging.hadith_matn_segments (
  id uuid primary key references staging.source_records(id),
  hadith_text_version_id uuid not null references staging.hadith_text_versions(id),
  segment_text text not null,
  source_order integer,
  segmentation_method text,
  segmentation_confidence numeric
);

create table if not exists staging.hadith_narrators (
  id uuid primary key references staging.source_records(id),
  source_narrator_key text,
  name_raw text not null,
  name_normalized text,
  biographical_text text
);

create table if not exists staging.hadith_annotations (
  id uuid primary key references staging.source_records(id),
  hadith_record_id uuid references staging.hadith_records(id),
  annotation_type text not null,
  annotation_value jsonb not null,
  annotation_method text,
  confidence numeric
);

create table if not exists staging.hadith_grade_assertions (
  id uuid primary key references staging.source_records(id),
  hadith_record_id uuid references staging.hadith_records(id),
  grader_name_raw text,
  raw_grade text not null,
  normalized_grade text,
  claim_scope text,
  citation text,
  normalization_version text,
  review_status text not null default 'unreviewed'
);

create table if not exists staging.hadith_verification_claims (
  id uuid primary key references staging.source_records(id),
  hadith_record_id uuid references staging.hadith_records(id),
  claim_text text,
  raw_conclusion text not null,
  normalized_conclusion text,
  claim_scope text,
  scholar_researcher_raw text,
  explanation text,
  references_json jsonb,
  classification_status text,
  editorial_workflow_status text,
  review_status text not null default 'unreviewed'
);

create table if not exists staging.candidate_entity_mappings (
  id uuid primary key default gen_random_uuid(),
  left_table text not null,
  left_record_id uuid not null,
  right_table text not null,
  right_record_id uuid not null,
  mapping_type text not null,
  method text not null,
  score numeric,
  evidence jsonb not null default '{}'::jsonb,
  review_status text not null default 'candidate',
  created_at timestamptz not null default now(),
  unique (left_table, left_record_id, right_table, right_record_id, mapping_type, method)
);

create index if not exists idx_raw_objects_snapshot
  on ingest.raw_objects(snapshot_id);
create index if not exists idx_import_runs_snapshot
  on ingest.import_runs(snapshot_id);
create index if not exists idx_findings_run_code
  on ingest.validation_findings(import_run_id, finding_code);
create index if not exists idx_source_records_source_key
  on staging.source_records(source_id, record_type, source_record_key);
create index if not exists idx_quran_ayah_texts_key
  on staging.quran_ayah_texts(ayah_key, script_label);
create index if not exists idx_translation_texts_key_language
  on staging.translation_texts(ayah_key, language_code);
create index if not exists idx_tafsir_passage_ayahs_key
  on staging.tafsir_passage_ayahs(ayah_key);
create index if not exists idx_hadith_records_source_number
  on staging.hadith_records(source_collection_key, source_edition_key, source_hadith_number);
create index if not exists idx_hadith_text_versions_record
  on staging.hadith_text_versions(hadith_record_id, language_code);
create index if not exists idx_grade_assertions_hadith
  on staging.hadith_grade_assertions(hadith_record_id);
create index if not exists idx_verification_claims_hadith
  on staging.hadith_verification_claims(hadith_record_id);

-- Private schemas are not exposed by supabase/config.toml. RLS remains enabled
-- as defense in depth; service_role is the server-side importer.
do $$
declare
  table_record record;
begin
  for table_record in
    select schemaname, tablename
    from pg_tables
    where schemaname in ('ingest', 'staging')
  loop
    execute format(
      'alter table %I.%I enable row level security',
      table_record.schemaname,
      table_record.tablename
    );
  end loop;
end
$$;

grant usage on schema ingest, staging to service_role;
grant select, insert, update, delete
  on all tables in schema ingest, staging to service_role;
grant usage, select
  on all sequences in schema ingest, staging to service_role;

alter default privileges in schema ingest
  grant select, insert, update, delete on tables to service_role;
alter default privileges in schema staging
  grant select, insert, update, delete on tables to service_role;
alter default privileges in schema ingest
  grant usage, select on sequences to service_role;
alter default privileges in schema staging
  grant usage, select on sequences to service_role;
