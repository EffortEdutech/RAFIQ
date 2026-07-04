-- RAFIQ Phase 2 registry verification.

\set ON_ERROR_STOP on

select 'source_registry' as check_name, count(*)::bigint as actual, 22::bigint as expected,
       count(*) >= 22 as passed
from ingest.source_registry
union all
select 'source_snapshots', count(*), 42, count(*) >= 42
from ingest.source_snapshots
union all
select 'raw_objects_total', count(*), 654285, count(*) >= 654285
from ingest.raw_objects
union all
select 'hadith_raw_objects', count(*), 654229, count(*) = 654229
from ingest.raw_objects
where object_path like 'data/raw/hadith/%'
union all
select 'hadith_principal_raw_objects', count(*), 163, count(*) = 163
from ingest.raw_objects
where object_path like 'data/raw/hadith/%'
  and object_role = 'principal'
union all
select 'hadith_parse_eligible_raw_objects', count(*), 163, count(*) = 163
from ingest.raw_objects
where object_path like 'data/raw/hadith/%'
  and parse_eligible
union all
select 'parser_assigned_raw_objects', count(distinct raw_object_id), 186,
       count(distinct raw_object_id) = 186
from ingest.raw_object_parser_assignments;

select
  count(*) as hadith_snapshots,
  count(*) filter (where aggregate_sha256 is not null) as hadith_snapshots_with_aggregate_digest
from ingest.source_snapshots ss
where exists (
  select 1
  from ingest.raw_objects ro
  where ro.snapshot_id = ss.id
    and ro.object_path like 'data/raw/hadith/%'
);

select
  ss.snapshot_key,
  ss.file_count,
  count(ro.id) as registered_objects,
  ss.total_bytes,
  ss.aggregate_sha256
from ingest.source_snapshots ss
join ingest.raw_objects ro on ro.snapshot_id = ss.id
where ro.object_path like 'data/raw/hadith/%'
group by ss.snapshot_key, ss.file_count, ss.total_bytes, ss.aggregate_sha256
order by ss.snapshot_key;

do $$
declare
  n_sources bigint;
  n_snapshots bigint;
  n_total_objects bigint;
  n_hadith_objects bigint;
  n_hadith_principal bigint;
  n_hadith_parse_eligible bigint;
  n_parser_assignments bigint;
  n_unassigned bigint;
  n_missing_digest bigint;
begin
  select count(*) into n_sources from ingest.source_registry;
  select count(*) into n_snapshots from ingest.source_snapshots;
  select count(*) into n_total_objects from ingest.raw_objects;
  select count(*) into n_hadith_objects
  from ingest.raw_objects where object_path like 'data/raw/hadith/%';
  select count(*) into n_hadith_principal
  from ingest.raw_objects
  where object_path like 'data/raw/hadith/%' and object_role = 'principal';
  select count(*) into n_hadith_parse_eligible
  from ingest.raw_objects
  where object_path like 'data/raw/hadith/%' and parse_eligible;
  select count(distinct raw_object_id) into n_parser_assignments
  from ingest.raw_object_parser_assignments;
  select count(*) into n_unassigned
  from ingest.raw_objects ro
  where ro.parse_eligible
    and not exists (
      select 1 from ingest.raw_object_parser_assignments ropa
      where ropa.raw_object_id = ro.id
    );
  select count(*) into n_missing_digest
  from ingest.source_snapshots ss
  where exists (
    select 1 from ingest.raw_objects ro
    where ro.snapshot_id = ss.id and ro.object_path like 'data/raw/hadith/%'
  )
  and ss.aggregate_sha256 is null;

  assert n_sources >= 22, 'source_registry expected >= 22, got ' || n_sources;
  assert n_snapshots >= 42, 'source_snapshots expected >= 42, got ' || n_snapshots;
  assert n_total_objects >= 654285, 'raw_objects expected >= 654285, got ' || n_total_objects;
  assert n_hadith_objects = 654229, 'Hadith raw_objects expected 654229, got ' || n_hadith_objects;
  assert n_hadith_principal = 163, 'Hadith principal raw_objects expected 163, got ' || n_hadith_principal;
  assert n_hadith_parse_eligible = 163, 'Hadith parse_eligible expected 163, got ' || n_hadith_parse_eligible;
  assert n_parser_assignments = 186, 'parser assignments expected 186, got ' || n_parser_assignments;
  assert n_unassigned = 0, 'parse_eligible raw_objects without parser assignment: ' || n_unassigned;
  assert n_missing_digest = 0, 'Hadith snapshots missing aggregate digest: ' || n_missing_digest;

  raise notice 'Phase 2 registry verification passed.';
end $$;
