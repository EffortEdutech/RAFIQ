-- RAFIQ private canonical content schema.
-- Derived from the approved Day 9 reference DDL.
-- ingest and staging are created by the preceding migration.

create extension if not exists pgcrypto;

create schema if not exists content;
create schema if not exists public_api;

revoke all on schema content from public, anon, authenticated;
revoke all on schema public_api from public, anon, authenticated;

create table if not exists content.quran_surahs (
  id smallint primary key,
  surah_number smallint not null unique check (surah_number between 1 and 114),
  canonical_name_ar text,
  canonical_name_latin text,
  ayah_count smallint not null check (ayah_count > 0),
  created_at timestamptz not null default now()
);

create table if not exists content.quran_ayahs (
  id integer primary key,
  surah_number smallint not null references content.quran_surahs(surah_number),
  ayah_number smallint not null check (ayah_number > 0),
  verse_key text generated always as
    ((surah_number::text || ':'::text) || ayah_number::text) stored,
  global_ayah_number smallint not null unique check (global_ayah_number between 1 and 6236),
  created_at timestamptz not null default now(),
  unique (surah_number, ayah_number)
);

create table if not exists content.quran_text_editions (
  id uuid primary key default gen_random_uuid(),
  edition_key text not null unique,
  name text not null,
  script_label text not null,
  orthography_label text,
  language_code text not null default 'ar',
  bismillah_policy text,
  ayah_end_marker_style text,
  source_snapshot_id uuid references ingest.source_snapshots(id),
  version_label text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists content.quran_ayah_texts (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references content.quran_text_editions(id),
  ayah_id integer not null references content.quran_ayahs(id),
  text_value text not null,
  normalized_search_text text,
  text_hash text not null,
  created_at timestamptz not null default now(),
  unique (edition_id, ayah_id)
);

create table if not exists content.quran_partition_schemes (
  id uuid primary key default gen_random_uuid(),
  scheme_key text not null unique,
  name text not null,
  layout_label text,
  source_snapshot_id uuid references ingest.source_snapshots(id),
  version_label text,
  created_at timestamptz not null default now()
);

create table if not exists content.quran_partitions (
  id uuid primary key default gen_random_uuid(),
  scheme_id uuid not null references content.quran_partition_schemes(id),
  partition_type text not null,
  partition_number integer,
  start_ayah_id integer not null references content.quran_ayahs(id),
  end_ayah_id integer references content.quran_ayahs(id),
  source_label text,
  classification text,
  created_at timestamptz not null default now(),
  unique (scheme_id, partition_type, partition_number, start_ayah_id)
);

create table if not exists content.translation_editions (
  id uuid primary key default gen_random_uuid(),
  edition_key text not null unique,
  language_code text not null,
  translator_name text,
  publisher_name text,
  title text not null,
  version_label text,
  source_snapshot_id uuid references ingest.source_snapshots(id),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists content.translation_texts (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references content.translation_editions(id),
  ayah_id integer not null references content.quran_ayahs(id),
  variant_type text not null,
  text_value text,
  source_markup text,
  structured_content jsonb,
  text_hash text,
  created_at timestamptz not null default now(),
  unique (edition_id, ayah_id, variant_type)
);

create table if not exists content.translation_footnotes (
  id uuid primary key default gen_random_uuid(),
  translation_text_id uuid not null references content.translation_texts(id) on delete cascade,
  source_footnote_key text,
  marker text,
  rich_text text,
  plain_text text not null,
  source_order integer,
  created_at timestamptz not null default now()
);

create table if not exists content.translation_chunks (
  id uuid primary key default gen_random_uuid(),
  translation_text_id uuid not null references content.translation_texts(id) on delete cascade,
  source_order integer not null,
  chunk_type text not null,
  text_value text,
  footnote_id uuid references content.translation_footnotes(id),
  style_json jsonb,
  unique (translation_text_id, source_order)
);

create table if not exists content.tafsir_editions (
  id uuid primary key default gen_random_uuid(),
  edition_key text not null unique,
  title text not null,
  author_name text,
  language_code text not null,
  methodology text,
  version_label text,
  source_snapshot_id uuid references ingest.source_snapshots(id),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists content.tafsir_passages (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references content.tafsir_editions(id),
  passage_key text not null,
  passage_text text,
  source_html text,
  blank_text boolean not null default false,
  text_hash text,
  created_at timestamptz not null default now(),
  unique (edition_id, passage_key)
);

create table if not exists content.tafsir_passage_ayahs (
  passage_id uuid not null references content.tafsir_passages(id) on delete cascade,
  ayah_id integer not null references content.quran_ayahs(id),
  source_order integer,
  source_role text not null,
  primary key (passage_id, ayah_id)
);

create table if not exists content.source_taxonomies (
  id uuid primary key default gen_random_uuid(),
  taxonomy_key text not null unique,
  name text not null,
  source_snapshot_id uuid references ingest.source_snapshots(id),
  version_label text,
  created_at timestamptz not null default now()
);

create table if not exists content.source_topics (
  id uuid primary key default gen_random_uuid(),
  taxonomy_id uuid not null references content.source_taxonomies(id),
  source_topic_key text not null,
  name text not null,
  arabic_name text,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (taxonomy_id, source_topic_key)
);

create table if not exists content.source_topic_relations (
  parent_topic_id uuid not null references content.source_topics(id),
  child_topic_id uuid not null references content.source_topics(id),
  relation_type text not null,
  source_provided boolean not null default true,
  primary key (parent_topic_id, child_topic_id, relation_type)
);

create table if not exists content.source_topic_ayahs (
  topic_id uuid not null references content.source_topics(id),
  ayah_id integer not null references content.quran_ayahs(id),
  primary key (topic_id, ayah_id)
);

create table if not exists content.themes (
  id uuid primary key default gen_random_uuid(),
  theme_key text not null unique,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content.theme_labels (
  id uuid primary key default gen_random_uuid(),
  theme_id uuid not null references content.themes(id) on delete cascade,
  language_code text not null,
  name text not null,
  description text,
  is_primary boolean not null default false,
  unique (theme_id, language_code, name)
);

create table if not exists content.theme_relations (
  parent_theme_id uuid not null references content.themes(id),
  child_theme_id uuid not null references content.themes(id),
  relation_type text not null,
  origin text not null,
  confidence numeric check (confidence between 0 and 1),
  review_status text not null default 'candidate',
  primary key (parent_theme_id, child_theme_id, relation_type)
);

create table if not exists content.source_topic_theme_mappings (
  source_topic_id uuid not null references content.source_topics(id),
  theme_id uuid not null references content.themes(id),
  mapping_method text not null,
  confidence numeric check (confidence between 0 and 1),
  evidence jsonb not null default '{}'::jsonb,
  review_status text not null default 'candidate',
  primary key (source_topic_id, theme_id, mapping_method)
);

create table if not exists content.source_ayah_theme_groups (
  id uuid primary key default gen_random_uuid(),
  source_snapshot_id uuid references ingest.source_snapshots(id),
  source_group_key text not null,
  theme_text text not null,
  raw_keywords text,
  duplicate_group_key text,
  created_at timestamptz not null default now(),
  unique (source_snapshot_id, source_group_key)
);

create table if not exists content.source_ayah_theme_group_ayahs (
  group_id uuid not null references content.source_ayah_theme_groups(id) on delete cascade,
  ayah_id integer not null references content.quran_ayahs(id),
  primary key (group_id, ayah_id)
);

create table if not exists content.hadith_collections (
  id uuid primary key default gen_random_uuid(),
  collection_key text not null unique,
  name_ar text,
  name_en text not null,
  author_name text,
  collection_type text,
  created_at timestamptz not null default now()
);

create table if not exists content.hadith_editions (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references content.hadith_collections(id),
  edition_key text not null unique,
  language_code text,
  translator_name text,
  publisher_name text,
  version_label text,
  source_snapshot_id uuid references ingest.source_snapshots(id),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists content.hadith_books (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references content.hadith_editions(id),
  source_book_key text not null,
  book_number text,
  title_ar text,
  title_en text,
  title_ms text,
  unique (edition_id, source_book_key)
);

create table if not exists content.hadith_chapters (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references content.hadith_books(id),
  source_chapter_key text not null,
  chapter_number text,
  title_ar text,
  title_en text,
  title_ms text,
  unique (book_id, source_chapter_key)
);

create table if not exists content.hadith_records (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references content.hadith_editions(id),
  book_id uuid references content.hadith_books(id),
  chapter_id uuid references content.hadith_chapters(id),
  source_hadith_key text not null,
  source_hadith_number text,
  source_arabic_number text,
  source_urn text,
  printed_reference text,
  created_at timestamptz not null default now(),
  unique (edition_id, source_hadith_key)
);

create table if not exists content.hadith_text_versions (
  id uuid primary key default gen_random_uuid(),
  hadith_record_id uuid not null references content.hadith_records(id),
  language_code text not null,
  translator_name text,
  full_text text,
  narrator_prefix text,
  isnad_text text,
  matn_text text,
  source_html text,
  text_hash text,
  created_at timestamptz not null default now()
);

create table if not exists content.hadith_record_mappings (
  left_hadith_id uuid not null references content.hadith_records(id),
  right_hadith_id uuid not null references content.hadith_records(id),
  mapping_type text not null,
  method text not null,
  confidence numeric check (confidence between 0 and 1),
  evidence jsonb not null default '{}'::jsonb,
  review_status text not null default 'candidate',
  primary key (left_hadith_id, right_hadith_id, mapping_type, method),
  check (left_hadith_id <> right_hadith_id)
);

create table if not exists content.hadith_references (
  id uuid primary key default gen_random_uuid(),
  hadith_record_id uuid references content.hadith_records(id),
  reference_type text not null,
  reference_text text not null,
  collection_label text,
  book_label text,
  chapter_label text,
  volume text,
  page text,
  external_url text,
  source_order integer
);

create table if not exists content.hadith_grade_assertions (
  id uuid primary key default gen_random_uuid(),
  hadith_record_id uuid references content.hadith_records(id),
  source_snapshot_id uuid references ingest.source_snapshots(id),
  grader_name_raw text,
  raw_grade text not null,
  claim_scope text,
  citation text,
  reliability_flag text,
  created_at timestamptz not null default now()
);

create table if not exists content.hadith_grade_normalizations (
  id uuid primary key default gen_random_uuid(),
  assertion_id uuid not null references content.hadith_grade_assertions(id),
  normalized_label text,
  normalization_version text not null,
  mapping_method text not null,
  reviewer text,
  review_status text not null default 'unreviewed',
  notes text,
  unique (assertion_id, normalization_version)
);

create table if not exists content.hadith_verification_claims (
  id uuid primary key default gen_random_uuid(),
  hadith_record_id uuid references content.hadith_records(id),
  source_snapshot_id uuid references ingest.source_snapshots(id),
  claim_text text,
  raw_conclusion text not null,
  claim_scope text,
  scholar_researcher_raw text,
  explanation text,
  classification_status text,
  editorial_workflow_status text,
  review_status text not null default 'unreviewed',
  created_at timestamptz not null default now()
);

create table if not exists content.hadith_verification_references (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references content.hadith_verification_claims(id) on delete cascade,
  source_order integer not null,
  reference_text text,
  volume_page_text text,
  external_url text,
  unique (claim_id, source_order)
);

create table if not exists content.theme_ayah_links (
  theme_id uuid not null references content.themes(id),
  ayah_id integer not null references content.quran_ayahs(id),
  origin text not null,
  method_version text,
  confidence numeric check (confidence between 0 and 1),
  review_status text not null default 'candidate',
  primary key (theme_id, ayah_id, origin)
);

create table if not exists content.theme_hadith_links (
  theme_id uuid not null references content.themes(id),
  hadith_id uuid not null references content.hadith_records(id),
  origin text not null,
  method_version text,
  confidence numeric check (confidence between 0 and 1),
  review_status text not null default 'candidate',
  primary key (theme_id, hadith_id, origin)
);

create table if not exists content.quran_hadith_links (
  ayah_id integer not null references content.quran_ayahs(id),
  hadith_id uuid not null references content.hadith_records(id),
  relationship_type text not null,
  origin text not null,
  method_version text,
  confidence numeric check (confidence between 0 and 1),
  evidence jsonb not null default '{}'::jsonb,
  review_status text not null default 'candidate',
  primary key (ayah_id, hadith_id, relationship_type, origin)
);

create table if not exists content.related_ayahs (
  ayah_id integer not null references content.quran_ayahs(id),
  related_ayah_id integer not null references content.quran_ayahs(id),
  relationship_type text not null default 'similar',
  origin text not null,
  method_version text,
  confidence numeric check (confidence between 0 and 1),
  evidence jsonb not null default '{}'::jsonb,
  review_status text not null default 'candidate',
  primary key (ayah_id, related_ayah_id, relationship_type, origin),
  check (ayah_id <> related_ayah_id)
);

create table if not exists content.related_hadiths (
  hadith_id uuid not null references content.hadith_records(id),
  related_hadith_id uuid not null references content.hadith_records(id),
  relationship_type text not null default 'similar',
  origin text not null,
  method_version text,
  confidence numeric check (confidence between 0 and 1),
  evidence jsonb not null default '{}'::jsonb,
  review_status text not null default 'candidate',
  primary key (hadith_id, related_hadith_id, relationship_type, origin),
  check (hadith_id <> related_hadith_id)
);

create table if not exists content.entity_provenance (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  staging_table text not null,
  staging_record_id uuid not null,
  source_snapshot_id uuid references ingest.source_snapshots(id),
  transformation_event_id uuid references ingest.transformation_events(id),
  provenance_role text not null default 'source',
  mapping_method text not null,
  created_at timestamptz not null default now(),
  unique (entity_type, entity_id, staging_table, staging_record_id, provenance_role)
);

create table if not exists content.entity_release_states (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  entity_version text not null default '1',
  technical_status text not null default 'validated',
  rights_status text not null default 'unknown',
  attribution_status text not null default 'unknown',
  editorial_status text not null default 'unreviewed',
  scholar_content_status text not null default 'unreviewed',
  publication_status text not null default 'private_only',
  effective_from timestamptz not null default now(),
  effective_to timestamptz,
  notes text,
  unique (entity_type, entity_id, entity_version)
);

create index if not exists idx_quran_ayahs_surah_number
  on content.quran_ayahs(surah_number, ayah_number);
create index if not exists idx_quran_texts_ayah
  on content.quran_ayah_texts(ayah_id, edition_id);
create index if not exists idx_translation_texts_ayah
  on content.translation_texts(ayah_id, edition_id, variant_type);
create index if not exists idx_tafsir_passage_ayahs_ayah
  on content.tafsir_passage_ayahs(ayah_id, passage_id);
create index if not exists idx_source_topic_ayahs_ayah
  on content.source_topic_ayahs(ayah_id, topic_id);
create index if not exists idx_hadith_records_reference
  on content.hadith_records(edition_id, source_hadith_number);
create index if not exists idx_hadith_text_versions_record_language
  on content.hadith_text_versions(hadith_record_id, language_code);
create index if not exists idx_grade_assertions_hadith
  on content.hadith_grade_assertions(hadith_record_id);
create index if not exists idx_verification_claims_hadith
  on content.hadith_verification_claims(hadith_record_id);
create index if not exists idx_related_ayahs_reverse
  on content.related_ayahs(related_ayah_id, ayah_id);
create index if not exists idx_related_hadiths_reverse
  on content.related_hadiths(related_hadith_id, hadith_id);
create index if not exists idx_entity_provenance_entity
  on content.entity_provenance(entity_type, entity_id);
create index if not exists idx_release_states_publication
  on content.entity_release_states(entity_type, publication_status);

-- Public API views and grants are intentionally deferred until Day 10 or the
-- implementation sprint establishes exact release predicates and API shapes.

do $$
declare
  table_record record;
begin
  for table_record in
    select schemaname, tablename
    from pg_tables
    where schemaname = 'content'
  loop
    execute format(
      'alter table %I.%I enable row level security',
      table_record.schemaname,
      table_record.tablename
    );
  end loop;
end
$$;

grant usage on schema content to service_role;
grant select, insert, update, delete
  on all tables in schema content to service_role;
grant usage, select
  on all sequences in schema content to service_role;

alter default privileges in schema content
  grant select, insert, update, delete on tables to service_role;
alter default privileges in schema content
  grant usage, select on sequences to service_role;

-- public_api remains empty and inaccessible until reviewed release-filtered
-- views or RPCs are implemented in a later migration.
