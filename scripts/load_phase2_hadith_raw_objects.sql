-- RAFIQ Phase 2 bulk loader: complete Hadith raw-object registration.
--
-- Expected container-side files:
--   /tmp/rafiq-phase2/hadith-raw-objects-2026-06-14.csv
--   /tmp/rafiq-phase2/hadith-raw-subtrees-2026-06-14.csv
--
-- This script is intentionally a loader, not a migration. The complete
-- Hadith inventory contains 654,229 rows and is better loaded from the
-- audited CSV artifact than embedded in a huge SQL migration file.

\set ON_ERROR_STOP on

begin;

create temp table phase2_hadith_raw_objects_csv (
  path text,
  category text,
  resource_path text,
  subtree_key text,
  role text,
  parse_eligible boolean,
  bytes bigint,
  mtime_ns numeric,
  sha256 text,
  hashed_at timestamptz
) on commit drop;

\copy phase2_hadith_raw_objects_csv from '/tmp/rafiq-phase2/hadith-raw-objects-2026-06-14.csv' with (format csv, header true)

create temp table phase2_hadith_raw_subtrees_csv (
  level text,
  group_key text,
  file_count bigint,
  bytes bigint,
  aggregate_sha256 text,
  role_counts_json jsonb
) on commit drop;

\copy phase2_hadith_raw_subtrees_csv from '/tmp/rafiq-phase2/hadith-raw-subtrees-2026-06-14.csv' with (format csv, header true)

with resource_aggregates as (
  select
    regexp_replace(group_key, '^.*/', '') as snapshot_key,
    file_count,
    bytes,
    lower(aggregate_sha256) as aggregate_sha256,
    role_counts_json
  from phase2_hadith_raw_subtrees_csv
  where level = 'resource'
),
updated as (
  update ingest.source_snapshots ss
     set file_count = ra.file_count,
         total_bytes = ra.bytes,
         aggregate_sha256 = ra.aggregate_sha256,
         notes = concat_ws(
           E'\n',
           nullif(ss.notes, ''),
           'Phase 2 complete Hadith raw-object inventory loaded from data/manifests/hadith-raw-objects-2026-06-14.csv; role_counts=' || ra.role_counts_json::text
         )
    from resource_aggregates ra
   where ss.snapshot_key = ra.snapshot_key
  returning ss.snapshot_key
)
select count(*) as updated_hadith_snapshot_aggregates
from updated;

insert into ingest.raw_objects (
  id,
  snapshot_id,
  logical_name,
  object_role,
  object_path,
  sha256,
  byte_length,
  format,
  media_type,
  encoding,
  parse_eligible
)
select
  gen_random_uuid(),
  ss.id,
  regexp_replace(csv.path, '^.*/', '') as logical_name,
  csv.role as object_role,
  csv.path as object_path,
  lower(csv.sha256) as sha256,
  csv.bytes as byte_length,
  case
    when lower(csv.path) like '%.jsonl' then 'jsonl'
    when lower(csv.path) like '%.json' then 'json'
    when lower(csv.path) like '%.csv' then 'csv'
    when lower(csv.path) like '%.parquet' then 'parquet'
    when lower(csv.path) like '%.txt' then 'text'
    when lower(csv.path) like '%.md' then 'markdown'
    when lower(csv.path) like '%.html' then 'html'
    when lower(csv.path) like '%.db' then 'sqlite'
    when lower(csv.path) like '%.sqlite' then 'sqlite'
    when lower(csv.path) like '%.gz' then 'gzip'
    when lower(csv.path) like '%.zip' then 'zip'
    when lower(csv.path) like '%.xlsx' then 'xlsx'
    else 'binary'
  end as format,
  case
    when lower(csv.path) like '%.jsonl' then 'application/jsonl'
    when lower(csv.path) like '%.json' then 'application/json'
    when lower(csv.path) like '%.csv' then 'text/csv'
    when lower(csv.path) like '%.parquet' then 'application/vnd.apache.parquet'
    when lower(csv.path) like '%.txt' then 'text/plain'
    when lower(csv.path) like '%.md' then 'text/markdown'
    when lower(csv.path) like '%.html' then 'text/html'
    when lower(csv.path) like '%.db' then 'application/vnd.sqlite3'
    when lower(csv.path) like '%.sqlite' then 'application/vnd.sqlite3'
    when lower(csv.path) like '%.gz' then 'application/gzip'
    when lower(csv.path) like '%.zip' then 'application/zip'
    when lower(csv.path) like '%.xlsx' then 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    else 'application/octet-stream'
  end as media_type,
  case
    when lower(csv.path) ~ '\.(jsonl|json|csv|txt|md|html)$' then 'utf-8'
    else null
  end as encoding,
  csv.parse_eligible
from phase2_hadith_raw_objects_csv csv
join ingest.source_snapshots ss
  on ss.snapshot_key = regexp_replace(csv.resource_path, '^.*/', '')
on conflict (snapshot_id, object_path, sha256) do update
set logical_name = excluded.logical_name,
    object_role = excluded.object_role,
    byte_length = excluded.byte_length,
    format = excluded.format,
    media_type = excluded.media_type,
    encoding = excluded.encoding,
    parse_eligible = excluded.parse_eligible;

do $$
declare
  n_hadith_csv bigint;
  n_hadith_db bigint;
  n_principal bigint;
  n_missing_snapshot bigint;
begin
  select count(*) into n_hadith_csv
  from phase2_hadith_raw_objects_csv;

  select count(*) into n_hadith_db
  from ingest.raw_objects ro
  where ro.object_path like 'data/raw/hadith/%';

  select count(*) into n_principal
  from ingest.raw_objects ro
  where ro.object_path like 'data/raw/hadith/%'
    and ro.object_role = 'principal';

  select count(*) into n_missing_snapshot
  from phase2_hadith_raw_objects_csv csv
  left join ingest.source_snapshots ss
    on ss.snapshot_key = regexp_replace(csv.resource_path, '^.*/', '')
  where ss.id is null;

  assert n_hadith_csv = 654229,
    'Hadith CSV expected 654229 rows, got ' || n_hadith_csv;
  assert n_hadith_db = 654229,
    'ingest.raw_objects expected 654229 Hadith rows, got ' || n_hadith_db;
  assert n_principal = 163,
    'Hadith principal raw_objects expected 163, got ' || n_principal;
  assert n_missing_snapshot = 0,
    'Hadith raw-object rows with missing snapshot mapping: ' || n_missing_snapshot;

  raise notice 'Phase 2 Hadith raw-object load passed: % rows, % principals',
    n_hadith_db, n_principal;
end $$;

commit;
