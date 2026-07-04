-- RAFIQ Phase 5 Checkpoint 12: Private model-provider adapter, disabled by default.
--
-- This migration records model-adapter readiness/attempts behind the guided
-- answer guardrail. It does not call an external model. The API passes runtime
-- configuration into this private function and the function persists the
-- adapter decision for audit/review.

create table if not exists content.private_model_adapter_runs (
  id uuid primary key default gen_random_uuid(),
  guided_answer_run_id uuid not null references content.private_guided_answer_runs(id),
  adapter_status text not null check (adapter_status in (
    'disabled_by_configuration',
    'blocked_by_guardrail',
    'blocked_no_evidence',
    'adapter_ready_not_executed'
  )),
  provider_key text not null,
  model_name text not null,
  provider_enabled boolean not null default false,
  execution_mode text not null default 'disabled_dry_run',
  refusal_reason text,
  request_payload jsonb not null default '{}'::jsonb,
  response_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_private_model_adapter_runs_guided
  on content.private_model_adapter_runs(guided_answer_run_id);
create index if not exists idx_private_model_adapter_runs_status
  on content.private_model_adapter_runs(adapter_status, created_at desc);

alter table content.private_model_adapter_runs enable row level security;

grant select, insert, update, delete on content.private_model_adapter_runs to service_role;

create or replace function private_api.create_model_adapter_run(
  p_guided_answer_run_id uuid,
  p_provider_enabled boolean default false,
  p_provider_key text default 'disabled',
  p_model_name text default 'not_configured',
  p_execution_mode text default 'disabled_dry_run'
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = private_api, content, public
as $$
declare
  guided_row content.private_guided_answer_runs%rowtype;
  adapter_status_value text;
  refusal_reason_value text;
  run_id uuid;
begin
  select *
    into guided_row
    from content.private_guided_answer_runs
   where id = p_guided_answer_run_id;

  if guided_row.id is null then
    raise exception 'guided answer run not found: %', p_guided_answer_run_id;
  end if;

  adapter_status_value := case
    when coalesce(p_provider_enabled, false) is false then 'disabled_by_configuration'
    when guided_row.prompt_status = 'blocked_by_guardrail' then 'blocked_by_guardrail'
    when guided_row.prompt_status = 'blocked_no_evidence' then 'blocked_no_evidence'
    else 'adapter_ready_not_executed'
  end;

  refusal_reason_value := case adapter_status_value
    when 'disabled_by_configuration' then 'Model provider execution is disabled by RAFIQ_MODEL_PROVIDER_ENABLED.'
    when 'blocked_by_guardrail' then 'Guided answer is blocked by answer guardrails.'
    when 'blocked_no_evidence' then 'Guided answer has no evidence citations.'
    else null
  end;

  insert into content.private_model_adapter_runs (
    guided_answer_run_id,
    adapter_status,
    provider_key,
    model_name,
    provider_enabled,
    execution_mode,
    refusal_reason,
    request_payload,
    response_payload
  )
  values (
    guided_row.id,
    adapter_status_value,
    coalesce(nullif(trim(p_provider_key), ''), 'disabled'),
    coalesce(nullif(trim(p_model_name), ''), 'not_configured'),
    coalesce(p_provider_enabled, false),
    coalesce(nullif(trim(p_execution_mode), ''), 'disabled_dry_run'),
    refusal_reason_value,
    jsonb_build_object(
      'guidedAnswerId', guided_row.id,
      'promptStatus', guided_row.prompt_status,
      'responseState', guided_row.response_state,
      'systemPrompt', guided_row.system_prompt,
      'userPrompt', guided_row.user_prompt,
      'evidencePrompt', guided_row.evidence_prompt,
      'citationIds', guided_row.citation_ids
    ),
    jsonb_build_object(
      'status', adapter_status_value,
      'message', coalesce(refusal_reason_value, 'Provider adapter is configured but live execution remains disabled until a later checkpoint.')
    )
  )
  returning id into run_id;

  return private_api.get_model_adapter_run(run_id);
end;
$$;

create or replace function private_api.get_model_adapter_run(p_adapter_run_id uuid)
returns jsonb
language sql
volatile
security definer
set search_path = private_api, content, public
as $$
  select jsonb_build_object(
    'notice', private_api.private_content_notice(),
    'modelAdapterRun', jsonb_build_object(
      'modelAdapterRunId', pmar.id,
      'guidedAnswerId', pmar.guided_answer_run_id,
      'adapterStatus', pmar.adapter_status,
      'providerKey', pmar.provider_key,
      'modelName', pmar.model_name,
      'providerEnabled', pmar.provider_enabled,
      'executionMode', pmar.execution_mode,
      'refusalReason', pmar.refusal_reason,
      'requestPayload', pmar.request_payload,
      'responsePayload', pmar.response_payload,
      'createdAt', pmar.created_at
    ),
    'guidedAnswer', private_api.get_guided_answer(pmar.guided_answer_run_id)->'guidedAnswer'
  )
    from content.private_model_adapter_runs pmar
   where pmar.id = p_adapter_run_id;
$$;

revoke all on function private_api.create_model_adapter_run(uuid, boolean, text, text, text)
  from public, anon, authenticated;
revoke all on function private_api.get_model_adapter_run(uuid)
  from public, anon, authenticated;

grant execute on function private_api.create_model_adapter_run(uuid, boolean, text, text, text)
  to service_role;
grant execute on function private_api.get_model_adapter_run(uuid)
  to service_role;
