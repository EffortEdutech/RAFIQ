-- RAFIQ Phase 5 Checkpoint 13: Post-generation citation enforcement,
-- answer validation, and reviewer actions.
--
-- This layer validates a candidate answer after the model-adapter boundary.
-- It does not call a model. It enforces citation coverage, records uncited
-- claim flags, and creates answer-validation review queue items for private
-- reviewer action.

alter table content.private_review_queue_items
  drop constraint if exists private_review_queue_items_queue_type_check;

alter table content.private_review_queue_items
  add constraint private_review_queue_items_queue_type_check
  check (queue_type in (
    'retrieval_trace',
    'source_gap',
    'grade_assertion',
    'verification_claim',
    'answer_validation'
  ));

create table if not exists content.private_answer_validation_runs (
  id uuid primary key default gen_random_uuid(),
  guided_answer_run_id uuid not null references content.private_guided_answer_runs(id),
  model_adapter_run_id uuid references content.private_model_adapter_runs(id),
  candidate_answer text not null,
  validation_status text not null check (validation_status in (
    'passed_private_review_required',
    'failed_missing_citations',
    'failed_uncited_claims',
    'blocked_by_adapter',
    'blocked_by_guardrail'
  )),
  citation_ids jsonb not null default '[]'::jsonb,
  cited_source_ids jsonb not null default '[]'::jsonb,
  missing_citation_ids jsonb not null default '[]'::jsonb,
  uncited_claim_flags jsonb not null default '[]'::jsonb,
  validation_results jsonb not null default '{}'::jsonb,
  reviewer_action_status text not null default 'queued' check (reviewer_action_status in (
    'queued',
    'approved_for_internal_testing',
    'needs_correction',
    'deferred',
    'rejected'
  )),
  reviewer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_private_answer_validation_guided
  on content.private_answer_validation_runs(guided_answer_run_id);
create index if not exists idx_private_answer_validation_adapter
  on content.private_answer_validation_runs(model_adapter_run_id);
create index if not exists idx_private_answer_validation_status
  on content.private_answer_validation_runs(validation_status, reviewer_action_status, created_at desc);

alter table content.private_answer_validation_runs enable row level security;

grant select, insert, update, delete on content.private_answer_validation_runs to service_role;

create or replace function private_api.get_answer_validation_run(p_validation_run_id uuid)
returns jsonb
language sql
volatile
security definer
set search_path = private_api, content, public
as $$
  select jsonb_build_object(
    'notice', private_api.private_content_notice(),
    'answerValidationRun', jsonb_build_object(
      'answerValidationRunId', pavr.id,
      'guidedAnswerId', pavr.guided_answer_run_id,
      'modelAdapterRunId', pavr.model_adapter_run_id,
      'candidateAnswer', pavr.candidate_answer,
      'validationStatus', pavr.validation_status,
      'citationIds', pavr.citation_ids,
      'citedSourceIds', pavr.cited_source_ids,
      'missingCitationIds', pavr.missing_citation_ids,
      'uncitedClaimFlags', pavr.uncited_claim_flags,
      'validationResults', pavr.validation_results,
      'reviewerActionStatus', pavr.reviewer_action_status,
      'reviewerNotes', pavr.reviewer_notes,
      'createdAt', pavr.created_at,
      'updatedAt', pavr.updated_at
    ),
    'guidedAnswer', private_api.get_guided_answer(pavr.guided_answer_run_id)->'guidedAnswer',
    'modelAdapterRun', case
      when pavr.model_adapter_run_id is null then null
      else private_api.get_model_adapter_run(pavr.model_adapter_run_id)->'modelAdapterRun'
    end
  )
    from content.private_answer_validation_runs pavr
   where pavr.id = p_validation_run_id;
$$;

create or replace function private_api.create_answer_validation_run(
  p_guided_answer_run_id uuid,
  p_model_adapter_run_id uuid default null,
  p_candidate_answer text default null
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = private_api, content, public
as $$
declare
  guided_row content.private_guided_answer_runs%rowtype;
  adapter_row content.private_model_adapter_runs%rowtype;
  candidate_answer_text text;
  citation_ids_payload jsonb;
  missing_citation_ids_payload jsonb;
  cited_source_ids_payload jsonb;
  uncited_claim_flags_payload jsonb := '[]'::jsonb;
  validation_results_payload jsonb;
  validation_status_value text;
  validation_run_id uuid;
  queue_severity text;
begin
  select *
    into guided_row
    from content.private_guided_answer_runs
   where id = p_guided_answer_run_id;

  if guided_row.id is null then
    raise exception 'guided answer run not found: %', p_guided_answer_run_id;
  end if;

  if p_model_adapter_run_id is not null then
    select *
      into adapter_row
      from content.private_model_adapter_runs
     where id = p_model_adapter_run_id;

    if adapter_row.id is null then
      raise exception 'model adapter run not found: %', p_model_adapter_run_id;
    end if;
  end if;

  candidate_answer_text := coalesce(nullif(trim(p_candidate_answer), ''), guided_row.guided_answer);
  citation_ids_payload := coalesce(guided_row.citation_ids, '[]'::jsonb);

  missing_citation_ids_payload := coalesce((
    select jsonb_agg(citation_id order by citation_id)
      from jsonb_array_elements_text(citation_ids_payload) as citations(citation_id)
     where candidate_answer_text not ilike '%' || citation_id || '%'
  ), '[]'::jsonb);

  cited_source_ids_payload := coalesce((
    select jsonb_agg(citation_id order by citation_id)
      from jsonb_array_elements_text(citation_ids_payload) as citations(citation_id)
     where candidate_answer_text ilike '%' || citation_id || '%'
  ), '[]'::jsonb);

  if candidate_answer_text ~* '\m(halal|haram|obligatory|forbidden|must|ruling|Allah says|Prophet said)\M'
     and candidate_answer_text !~ '\[[^]]+\]' then
    uncited_claim_flags_payload := jsonb_build_array(jsonb_build_object(
      'code', 'claim_requires_citation_marker',
      'message', 'Candidate contains ruling/source-style wording without a bracketed citation marker.',
      'policy', 'phase5_checkpoint_13_citation_enforcement_v1'
    ));
  end if;

  validation_status_value := case
    when guided_row.prompt_status <> 'model_ready' then 'blocked_by_guardrail'
    when adapter_row.id is not null and adapter_row.adapter_status in ('blocked_by_guardrail', 'blocked_no_evidence') then 'blocked_by_adapter'
    when jsonb_array_length(uncited_claim_flags_payload) > 0 then 'failed_uncited_claims'
    when jsonb_array_length(missing_citation_ids_payload) > 0 then 'failed_missing_citations'
    else 'passed_private_review_required'
  end;

  validation_results_payload := jsonb_build_object(
    'policyVersion', 'phase5_checkpoint_13_citation_enforcement_v1',
    'candidateLength', length(candidate_answer_text),
    'guidedPromptStatus', guided_row.prompt_status,
    'adapterStatus', case when adapter_row.id is null then null else adapter_row.adapter_status end,
    'requiredCitationCount', jsonb_array_length(citation_ids_payload),
    'citedCitationCount', jsonb_array_length(cited_source_ids_payload),
    'missingCitationCount', jsonb_array_length(missing_citation_ids_payload),
    'uncitedClaimFlagCount', jsonb_array_length(uncited_claim_flags_payload),
    'reviewRequired', true
  );

  insert into content.private_answer_validation_runs (
    guided_answer_run_id,
    model_adapter_run_id,
    candidate_answer,
    validation_status,
    citation_ids,
    cited_source_ids,
    missing_citation_ids,
    uncited_claim_flags,
    validation_results
  )
  values (
    guided_row.id,
    adapter_row.id,
    candidate_answer_text,
    validation_status_value,
    citation_ids_payload,
    cited_source_ids_payload,
    missing_citation_ids_payload,
    uncited_claim_flags_payload,
    validation_results_payload
  )
  returning id into validation_run_id;

  queue_severity := case
    when validation_status_value = 'passed_private_review_required' then 'medium'
    else 'high'
  end;

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
  values (
    'answer_validation',
    'private_answer_validation_run',
    validation_run_id::text,
    'Review answer validation: ' || validation_status_value,
    'Post-generation citation enforcement result for guided answer ' || guided_row.id::text,
    queue_severity,
    'unreviewed',
    'content.private_answer_validation_runs',
    jsonb_build_object(
      'validationRunId', validation_run_id,
      'guidedAnswerId', guided_row.id,
      'modelAdapterRunId', adapter_row.id,
      'validationStatus', validation_status_value,
      'missingCitationIds', missing_citation_ids_payload,
      'uncitedClaimFlags', uncited_claim_flags_payload,
      'route', '/answer'
    )
  )
  on conflict (queue_type, subject_type, subject_id) do update
     set title = excluded.title,
         summary = excluded.summary,
         severity = excluded.severity,
         source = excluded.source,
         evidence = excluded.evidence,
         updated_at = now();

  return private_api.get_answer_validation_run(validation_run_id);
end;
$$;

create or replace function private_api.update_answer_validation_reviewer_action(
  p_validation_run_id uuid,
  p_action text,
  p_notes text default null
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = private_api, content, public
as $$
declare
  action_value text := lower(coalesce(nullif(trim(p_action), ''), ''));
  queue_status_value text;
begin
  if action_value not in (
    'queued',
    'approved_for_internal_testing',
    'needs_correction',
    'deferred',
    'rejected'
  ) then
    raise exception 'invalid answer validation reviewer action: %', p_action;
  end if;

  update content.private_answer_validation_runs
     set reviewer_action_status = action_value,
         reviewer_notes = nullif(trim(coalesce(p_notes, '')), ''),
         updated_at = now()
   where id = p_validation_run_id;

  if not found then
    raise exception 'answer validation run not found: %', p_validation_run_id;
  end if;

  queue_status_value := case action_value
    when 'queued' then 'unreviewed'
    when 'rejected' then 'needs_correction'
    else action_value
  end;

  update content.private_review_queue_items
     set review_status = queue_status_value,
         evidence = jsonb_set(
           jsonb_set(evidence, '{reviewerActionStatus}', to_jsonb(action_value), true),
           '{reviewerNotes}',
           to_jsonb(nullif(trim(coalesce(p_notes, '')), '')),
           true
         ),
         updated_at = now()
   where queue_type = 'answer_validation'
     and subject_type = 'private_answer_validation_run'
     and subject_id = p_validation_run_id::text;

  return private_api.get_answer_validation_run(p_validation_run_id);
end;
$$;

revoke all on function private_api.create_answer_validation_run(uuid, uuid, text)
  from public, anon, authenticated;
revoke all on function private_api.get_answer_validation_run(uuid)
  from public, anon, authenticated;
revoke all on function private_api.update_answer_validation_reviewer_action(uuid, text, text)
  from public, anon, authenticated;

grant execute on function private_api.create_answer_validation_run(uuid, uuid, text)
  to service_role;
grant execute on function private_api.get_answer_validation_run(uuid)
  to service_role;
grant execute on function private_api.update_answer_validation_reviewer_action(uuid, text, text)
  to service_role;
