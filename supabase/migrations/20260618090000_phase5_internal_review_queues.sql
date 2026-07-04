-- RAFIQ Phase 5 Checkpoint 09: Internal review queues and retrieval evidence.
--
-- Private infrastructure only. Review queues expose provenance and retrieval
-- evidence to the service-role API while keeping all canonical content behind
-- internal approval gates.

create table if not exists content.private_review_queue_items (
  id uuid primary key default gen_random_uuid(),
  queue_type text not null check (queue_type in (
    'retrieval_trace',
    'source_gap',
    'grade_assertion',
    'verification_claim'
  )),
  subject_type text not null,
  subject_id text not null,
  title text not null,
  summary text,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high')),
  review_status text not null default 'unreviewed' check (review_status in (
    'unreviewed',
    'in_review',
    'approved_for_internal_testing',
    'needs_correction',
    'deferred'
  )),
  source text not null,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (queue_type, subject_type, subject_id)
);

create index if not exists idx_private_review_queue_status
  on content.private_review_queue_items(review_status, severity desc, created_at desc);
create index if not exists idx_private_review_queue_type
  on content.private_review_queue_items(queue_type, created_at desc);
create index if not exists idx_private_review_queue_subject
  on content.private_review_queue_items(subject_type, subject_id);

alter table content.private_review_queue_items enable row level security;

grant select, insert, update, delete on content.private_review_queue_items to service_role;

create or replace function private_api.refresh_private_review_queue()
returns jsonb
language plpgsql
volatile
security definer
set search_path = private_api, content, public
as $$
declare
  queue_count integer;
begin
  insert into content.private_review_queue_items (
    queue_type,
    subject_type,
    subject_id,
    title,
    summary,
    severity,
    review_status,
    source,
    evidence
  )
  select case when prt.total_results = 0 then 'source_gap' else 'retrieval_trace' end,
         'private_retrieval_trace',
         prt.id::text,
         case
           when prt.total_results = 0 then 'Review no-result search: ' || coalesce(prt.query_text, '[empty query]')
           else 'Review retrieval trace: ' || coalesce(prt.query_text, '[empty query]')
         end,
         'Query "' || coalesce(prt.query_text, '') || '" in domain ' || prt.domain_filter ||
           ' returned ' || prt.total_results::text || ' results.',
         case when prt.total_results = 0 then 'high' else 'medium' end,
         case
           when prt.review_status in ('unreviewed', 'in_review', 'approved_for_internal_testing', 'needs_correction', 'deferred')
             then prt.review_status
           else 'unreviewed'
         end,
         prt.source,
         jsonb_build_object(
           'traceId', prt.id,
           'queryText', prt.query_text,
           'domainFilter', prt.domain_filter,
           'limit', prt.limit_value,
           'offset', prt.offset_value,
           'totalResults', prt.total_results,
           'returnedResultIds', prt.returned_result_ids,
           'facets', prt.facets,
           'createdAt', prt.created_at
         )
    from content.private_retrieval_traces prt
  on conflict (queue_type, subject_type, subject_id) do update
    set title = excluded.title,
        summary = excluded.summary,
        severity = excluded.severity,
        review_status = excluded.review_status,
        source = excluded.source,
        evidence = excluded.evidence,
        updated_at = now();

  insert into content.private_review_queue_items (
    queue_type,
    subject_type,
    subject_id,
    title,
    summary,
    severity,
    review_status,
    source,
    evidence
  )
  select 'verification_claim',
         'hadith_verification_claim',
         hvc.id::text,
         'Review Hadith verification claim',
         left(coalesce(hvc.claim_text, hvc.raw_conclusion, 'Hadith verification claim'), 240),
         'high',
         case
           when hvc.review_status in ('unreviewed', 'in_review', 'approved_for_internal_testing', 'needs_correction', 'deferred')
             then hvc.review_status
           else 'unreviewed'
         end,
         'content.hadith_verification_claims',
         jsonb_build_object(
           'claimId', hvc.id,
           'hadithRecordId', hvc.hadith_record_id,
           'route', '/hadith/' || hvc.hadith_record_id,
           'claimText', hvc.claim_text,
           'rawConclusion', hvc.raw_conclusion,
           'claimScope', hvc.claim_scope,
           'scholarResearcherRaw', hvc.scholar_researcher_raw,
           'classificationStatus', hvc.classification_status,
           'editorialWorkflowStatus', hvc.editorial_workflow_status
         )
    from content.hadith_verification_claims hvc
   where coalesce(hvc.review_status, 'unreviewed') = 'unreviewed'
  on conflict (queue_type, subject_type, subject_id) do update
    set title = excluded.title,
        summary = excluded.summary,
        severity = excluded.severity,
        review_status = excluded.review_status,
        source = excluded.source,
        evidence = excluded.evidence,
        updated_at = now();

  insert into content.private_review_queue_items (
    queue_type,
    subject_type,
    subject_id,
    title,
    summary,
    severity,
    review_status,
    source,
    evidence
  )
  select 'grade_assertion',
         'hadith_grade_assertion',
         grade_batch.id::text,
         'Review Hadith grade assertion',
         left(coalesce(grade_batch.grader_name_raw || ': ', '') || grade_batch.raw_grade, 240),
         'medium',
         case
           when coalesce(grade_batch.review_status, 'unreviewed') in ('unreviewed', 'in_review', 'approved_for_internal_testing', 'needs_correction', 'deferred')
             then coalesce(grade_batch.review_status, 'unreviewed')
           else 'unreviewed'
         end,
         'content.hadith_grade_assertions',
         jsonb_build_object(
           'assertionId', grade_batch.id,
           'hadithRecordId', grade_batch.hadith_record_id,
           'route', '/hadith/' || grade_batch.hadith_record_id,
           'graderNameRaw', grade_batch.grader_name_raw,
           'rawGrade', grade_batch.raw_grade,
           'normalizedLabel', grade_batch.normalized_label,
           'claimScope', grade_batch.claim_scope,
           'citation', grade_batch.citation,
           'normalizationVersion', grade_batch.normalization_version,
           'mappingMethod', grade_batch.mapping_method,
           'batchPolicy', 'first_500_unreviewed_for_checkpoint_09_foundation'
         )
    from (
      select hga.id,
             hga.hadith_record_id,
             hga.grader_name_raw,
             hga.raw_grade,
             hga.claim_scope,
             hga.citation,
             hgn.normalized_label,
             hgn.normalization_version,
             hgn.mapping_method,
             hgn.review_status
        from content.hadith_grade_assertions hga
        left join content.hadith_grade_normalizations hgn on hgn.assertion_id = hga.id
       where coalesce(hgn.review_status, 'unreviewed') = 'unreviewed'
       order by hga.created_at, hga.id
       limit 500
    ) grade_batch
  on conflict (queue_type, subject_type, subject_id) do update
    set title = excluded.title,
        summary = excluded.summary,
        severity = excluded.severity,
        review_status = excluded.review_status,
        source = excluded.source,
        evidence = excluded.evidence,
        updated_at = now();

  select count(*) into queue_count from content.private_review_queue_items;

  return jsonb_build_object(
    'notice', private_api.private_content_notice(),
    'status', 'refreshed',
    'queueItemCount', queue_count,
    'gradeAssertionPolicy', 'first_500_unreviewed_seeded_for_checkpoint_09'
  );
end;
$$;

create or replace function private_api.list_review_queue(
  p_status text default 'unreviewed',
  p_queue_type text default null,
  p_limit integer default 20,
  p_offset integer default 0
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = private_api, content, public
as $$
declare
  status_filter text := lower(coalesce(nullif(trim(p_status), ''), 'unreviewed'));
  type_filter text := nullif(trim(coalesce(p_queue_type, '')), '');
  page_limit integer := least(greatest(coalesce(p_limit, 20), 1), 100);
  page_offset integer := greatest(coalesce(p_offset, 0), 0);
  items_payload jsonb;
  facets_payload jsonb;
  total_count integer;
begin
  perform private_api.refresh_private_review_queue();

  with filtered as (
    select prqi.*
      from content.private_review_queue_items prqi
     where (status_filter = 'all' or prqi.review_status = status_filter)
       and (type_filter is null or prqi.queue_type = type_filter)
  ),
  counted as (
    select filtered.*, count(*) over () as total_rows
      from filtered
  ),
  paged as (
    select *
      from counted
     order by case severity when 'high' then 3 when 'medium' then 2 else 1 end desc,
              created_at desc,
              id
     limit page_limit
    offset page_offset
  ),
  facets as (
    select queue_type, count(*) as item_count
      from filtered
     group by queue_type
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'queueItemId', paged.id,
           'queueType', paged.queue_type,
           'subjectType', paged.subject_type,
           'subjectId', paged.subject_id,
           'title', paged.title,
           'summary', paged.summary,
           'severity', paged.severity,
           'reviewStatus', paged.review_status,
           'source', paged.source,
           'evidence', paged.evidence,
           'createdAt', paged.created_at,
           'updatedAt', paged.updated_at
         ) order by case paged.severity when 'high' then 3 when 'medium' then 2 else 1 end desc,
                  paged.created_at desc,
                  paged.id), '[]'::jsonb),
         coalesce(max(paged.total_rows), 0),
         coalesce((select jsonb_object_agg(queue_type, item_count order by queue_type) from facets), '{}'::jsonb)
    into items_payload, total_count, facets_payload
    from paged;

  return jsonb_build_object(
    'notice', private_api.private_content_notice(),
    'query', jsonb_build_object(
      'status', status_filter,
      'queueType', type_filter
    ),
    'pagination', jsonb_build_object(
      'limit', page_limit,
      'offset', page_offset,
      'total', total_count
    ),
    'facets', facets_payload,
    'items', items_payload
  );
end;
$$;

create or replace function private_api.get_review_queue_item(p_queue_item_id uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = private_api, content, public
as $$
declare
  item_payload jsonb;
  trace_payload jsonb;
  trace_id uuid;
begin
  perform private_api.refresh_private_review_queue();

  select jsonb_build_object(
           'queueItemId', prqi.id,
           'queueType', prqi.queue_type,
           'subjectType', prqi.subject_type,
           'subjectId', prqi.subject_id,
           'title', prqi.title,
           'summary', prqi.summary,
           'severity', prqi.severity,
           'reviewStatus', prqi.review_status,
           'source', prqi.source,
           'evidence', prqi.evidence,
           'createdAt', prqi.created_at,
           'updatedAt', prqi.updated_at
         )
    into item_payload
    from content.private_review_queue_items prqi
   where prqi.id = p_queue_item_id;

  if item_payload is null then
    return jsonb_build_object(
      'notice', private_api.private_content_notice(),
      'item', null,
      'retrievalTrace', null
    );
  end if;

  if item_payload->>'queueType' in ('retrieval_trace', 'source_gap') then
    trace_id := nullif(item_payload #>> '{evidence,traceId}', '')::uuid;
    if trace_id is not null then
      trace_payload := private_api.get_retrieval_trace(trace_id)->'trace';
    end if;
  end if;

  return jsonb_build_object(
    'notice', private_api.private_content_notice(),
    'item', item_payload,
    'retrievalTrace', trace_payload
  );
end;
$$;

select private_api.refresh_private_review_queue();

revoke all on function private_api.refresh_private_review_queue()
  from public, anon, authenticated;
revoke all on function private_api.list_review_queue(text, text, integer, integer)
  from public, anon, authenticated;
revoke all on function private_api.get_review_queue_item(uuid)
  from public, anon, authenticated;

grant execute on function private_api.refresh_private_review_queue()
  to service_role;
grant execute on function private_api.list_review_queue(text, text, integer, integer)
  to service_role;
grant execute on function private_api.get_review_queue_item(uuid)
  to service_role;
