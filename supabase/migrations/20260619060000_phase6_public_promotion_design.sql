-- RAFIQ Phase 6: Public promotion design and release-filtered public_api.
--
-- This is not a public release. It creates a reviewed public_api contract that
-- exposes only fully release-approved entities. Current canonical content is
-- still private_only, so these surfaces intentionally return zero content.

create schema if not exists public_api;

revoke all on schema public_api from public;
grant usage on schema public_api to anon, authenticated, service_role;

create or replace function public_api.public_release_notice()
returns jsonb
language sql
stable
security definer
set search_path = public_api, content, public
as $$
  select jsonb_build_object(
    'label', 'PUBLIC RELEASE FILTER ACTIVE',
    'message', 'This public API surface returns only content whose rights, attribution, editorial, scholar/content, and publication gates are approved.',
    'deploymentMode', 'public_release_design',
    'publicReleaseEnabled', false,
    'pendingContentBlocked', true
  );
$$;

create or replace view public_api.release_approved_entities
with (security_barrier = true)
as
  select ers.entity_type,
         ers.entity_id,
         ers.entity_version,
         ers.technical_status,
         ers.rights_status,
         ers.attribution_status,
         ers.editorial_status,
         ers.scholar_content_status,
         ers.publication_status,
         ers.effective_from,
         ers.effective_to,
         ers.notes
    from content.entity_release_states ers
   where ers.effective_to is null
     and ers.technical_status in ('validated', 'approved')
     and ers.rights_status = 'approved'
     and ers.attribution_status = 'approved'
     and ers.editorial_status = 'approved'
     and ers.scholar_content_status = 'approved'
     and ers.publication_status in ('public', 'published');

create or replace function public_api.release_gate_passed(
  p_entity_type text,
  p_entity_id text
)
returns boolean
language sql
stable
security definer
set search_path = public_api, content, public
as $$
  select exists (
    select 1
      from public_api.release_approved_entities rae
     where rae.entity_type = lower(nullif(trim(coalesce(p_entity_type, '')), ''))
       and rae.entity_id = nullif(trim(coalesce(p_entity_id, '')), '')
  );
$$;

create or replace function public_api.public_release_readiness()
returns jsonb
language sql
stable
security definer
set search_path = public_api, content, public
as $$
  with counts as (
    select count(*)::integer as total_release_states,
           count(*) filter (where publication_status = 'private_only')::integer as private_only_count,
           count(*) filter (
             where rights_status = 'approved'
               and attribution_status = 'approved'
               and editorial_status = 'approved'
               and scholar_content_status = 'approved'
               and publication_status in ('public', 'published')
           )::integer as public_approved_count,
           count(*) filter (
             where rights_status <> 'approved'
                or attribution_status <> 'approved'
                or editorial_status <> 'approved'
                or scholar_content_status <> 'approved'
                or publication_status not in ('public', 'published')
           )::integer as pending_or_blocked_count
      from content.entity_release_states
     where effective_to is null
  ),
  entity_counts as (
    select coalesce(jsonb_object_agg(entity_type, entity_count order by entity_type), '{}'::jsonb) as by_entity_type
      from (
        select entity_type, count(*)::integer as entity_count
          from public_api.release_approved_entities
         group by entity_type
      ) grouped
  )
  select jsonb_build_object(
    'notice', public_api.public_release_notice(),
    'readiness', jsonb_build_object(
      'publicReleaseGo', false,
      'publicDesignReady', true,
      'totalReleaseStates', counts.total_release_states,
      'publicApprovedEntityCount', counts.public_approved_count,
      'privateOnlyEntityCount', counts.private_only_count,
      'pendingOrBlockedEntityCount', counts.pending_or_blocked_count,
      'approvedByEntityType', entity_counts.by_entity_type,
      'requiredGates', jsonb_build_array(
        'rights_status=approved',
        'attribution_status=approved',
        'editorial_status=approved',
        'scholar_content_status=approved',
        'publication_status=public_or_published',
        'product_owner_public_scope_approved'
      )
    )
  )
    from counts, entity_counts;
$$;

create or replace function public_api.list_release_approved_entities(
  p_entity_type text default null,
  p_limit integer default 20,
  p_offset integer default 0
)
returns jsonb
language sql
stable
security definer
set search_path = public_api, content, public
as $$
  with bounded as (
    select lower(nullif(trim(coalesce(p_entity_type, '')), '')) as entity_type_filter,
           least(greatest(coalesce(p_limit, 20), 1), 100) as page_limit,
           greatest(coalesce(p_offset, 0), 0) as page_offset
  ),
  filtered as (
    select rae.*
      from public_api.release_approved_entities rae, bounded b
     where b.entity_type_filter is null
        or rae.entity_type = b.entity_type_filter
  ),
  paged as (
    select filtered.*, count(*) over () as total_rows
      from filtered, bounded b
     order by entity_type, entity_id
     limit (select page_limit from bounded)
    offset (select page_offset from bounded)
  )
  select jsonb_build_object(
    'notice', public_api.public_release_notice(),
    'query', jsonb_build_object(
      'entityType', (select entity_type_filter from bounded)
    ),
    'pagination', jsonb_build_object(
      'limit', (select page_limit from bounded),
      'offset', (select page_offset from bounded),
      'total', coalesce((select max(total_rows) from paged), 0)
    ),
    'entities', coalesce(jsonb_agg(jsonb_build_object(
      'entityType', entity_type,
      'entityId', entity_id,
      'entityVersion', entity_version,
      'publicationStatus', publication_status,
      'effectiveFrom', effective_from
    ) order by entity_type, entity_id), '[]'::jsonb)
  )
    from paged;
$$;

create or replace function public_api.search_public_content(
  p_query text,
  p_domain text default 'all',
  p_limit integer default 20,
  p_offset integer default 0
)
returns jsonb
language sql
stable
security definer
set search_path = public_api, content, public
as $$
  select jsonb_build_object(
    'notice', public_api.public_release_notice(),
    'query', jsonb_build_object(
      'text', nullif(trim(coalesce(p_query, '')), ''),
      'domain', lower(coalesce(nullif(trim(p_domain), ''), 'all'))
    ),
    'pagination', jsonb_build_object(
      'limit', least(greatest(coalesce(p_limit, 20), 1), 50),
      'offset', greatest(coalesce(p_offset, 0), 0),
      'total', 0
    ),
    'facets', '{}'::jsonb,
    'results', '[]'::jsonb,
    'releaseFilter', jsonb_build_object(
      'status', 'blocked_until_public_approval',
      'reason', 'No canonical content has passed every public release gate in this workspace.'
    )
  );
$$;

revoke all on function public_api.public_release_notice()
  from public;
revoke all on function public_api.release_gate_passed(text, text)
  from public;
revoke all on function public_api.public_release_readiness()
  from public;
revoke all on function public_api.list_release_approved_entities(text, integer, integer)
  from public;
revoke all on function public_api.search_public_content(text, text, integer, integer)
  from public;
revoke all on public_api.release_approved_entities
  from public;

grant execute on function public_api.public_release_notice()
  to anon, authenticated, service_role;
grant execute on function public_api.release_gate_passed(text, text)
  to anon, authenticated, service_role;
grant execute on function public_api.public_release_readiness()
  to anon, authenticated, service_role;
grant execute on function public_api.list_release_approved_entities(text, integer, integer)
  to anon, authenticated, service_role;
grant execute on function public_api.search_public_content(text, text, integer, integer)
  to anon, authenticated, service_role;
grant select on public_api.release_approved_entities
  to anon, authenticated, service_role;
