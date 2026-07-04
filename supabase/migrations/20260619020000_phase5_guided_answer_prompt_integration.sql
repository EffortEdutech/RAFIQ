-- RAFIQ Phase 5 Checkpoint 11: Private guided answer UX and prompt integration.
--
-- This layer creates a model-ready prompt package behind Checkpoint 10
-- guardrails. It still does not call an external LLM. The guided answer preview
-- is deterministic and citation-bound so we can verify UX, storage, and policy
-- behavior before enabling a model provider.

create table if not exists content.private_guided_answer_runs (
  id uuid primary key default gen_random_uuid(),
  answer_draft_id uuid not null references content.private_answer_drafts(id),
  prompt_version text not null default 'phase5_checkpoint_11_prompt_v1',
  prompt_status text not null check (prompt_status in (
    'model_ready',
    'blocked_by_guardrail',
    'blocked_no_evidence'
  )),
  response_state text not null,
  system_prompt text not null,
  user_prompt text not null,
  evidence_prompt jsonb not null default '[]'::jsonb,
  guided_answer text not null,
  citation_ids jsonb not null default '[]'::jsonb,
  model_provider text not null default 'not_connected',
  model_name text not null default 'deterministic_prompt_preview_v1',
  review_status text not null default 'unreviewed',
  created_at timestamptz not null default now()
);

create index if not exists idx_private_guided_answer_runs_created
  on content.private_guided_answer_runs(created_at desc);
create index if not exists idx_private_guided_answer_runs_draft
  on content.private_guided_answer_runs(answer_draft_id);
create index if not exists idx_private_guided_answer_runs_status
  on content.private_guided_answer_runs(prompt_status, response_state, created_at desc);

alter table content.private_guided_answer_runs enable row level security;

grant select, insert, update, delete on content.private_guided_answer_runs to service_role;

create or replace function private_api.create_guided_answer(
  p_question text,
  p_intent text default null,
  p_language text default 'en',
  p_domain text default 'all',
  p_limit integer default 5
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = private_api, content, public
as $$
declare
  draft_payload jsonb;
  draft jsonb;
  draft_id uuid;
  evidence_count integer;
  response_state text;
  prompt_status text;
  system_prompt_text text;
  user_prompt_text text;
  evidence_prompt_payload jsonb;
  citation_ids_payload jsonb;
  guided_answer_text text;
  run_id uuid;
begin
  draft_payload := private_api.create_answer_draft(p_question, p_intent, p_language, p_domain, p_limit);
  draft := draft_payload->'answerDraft';
  draft_id := (draft->>'answerDraftId')::uuid;
  response_state := draft->>'responseState';
  evidence_count := jsonb_array_length(coalesce(draft->'evidenceItems', '[]'::jsonb));

  prompt_status := case
    when response_state in ('scholar_escalation', 'safety_escalation', 'blocked') then 'blocked_by_guardrail'
    when evidence_count = 0 then 'blocked_no_evidence'
    else 'model_ready'
  end;

  system_prompt_text :=
    'You are RAFIQ private guided-answer assistant. Use only the provided evidence. ' ||
    'Do not invent Quran translations, tafsir, Hadith grades, rulings, or source references. ' ||
    'If the gate state is not model_ready, do not answer; return the escalation/no-source message. ' ||
    'Always preserve citations and the private-only notice.';

  user_prompt_text :=
    'Question: ' || (draft->>'questionText') || E'\n' ||
    'Detected intent: ' || (draft->>'detectedIntent') || E'\n' ||
    'Response state: ' || response_state || E'\n' ||
    'Instruction: produce a concise private answer only from cited evidence.';

  evidence_prompt_payload := coalesce((
    select jsonb_agg(jsonb_build_object(
             'citationId', evidence_item->>'citationId',
             'domain', evidence_item->>'domain',
             'title', evidence_item->>'title',
             'snippet', evidence_item->>'snippet',
             'reference', evidence_item->'reference',
             'target', evidence_item->'target',
             'publicReleaseStatus', evidence_item->>'publicReleaseStatus'
           ) order by ordinality)
      from jsonb_array_elements(coalesce(draft->'evidenceItems', '[]'::jsonb)) with ordinality as evidence(evidence_item, ordinality)
  ), '[]'::jsonb);

  citation_ids_payload := coalesce((
    select jsonb_agg(evidence_item->>'citationId' order by ordinality)
      from jsonb_array_elements(coalesce(draft->'evidenceItems', '[]'::jsonb)) with ordinality as evidence(evidence_item, ordinality)
  ), '[]'::jsonb);

  guided_answer_text := case prompt_status
    when 'blocked_by_guardrail' then draft->>'draftAnswer'
    when 'blocked_no_evidence' then draft->>'draftAnswer'
    else
      'Private guided answer preview: RAFIQ found ' || evidence_count::text ||
      ' cited evidence item(s). A connected model may answer only by summarizing these citations, ' ||
      'must keep source labels visible, and must not add uncited religious claims. Primary citations: ' ||
      coalesce((
        select string_agg('[' || (evidence_item->>'citationId') || '] ' || (evidence_item->>'title'), '; ' order by ordinality)
          from jsonb_array_elements(coalesce(draft->'evidenceItems', '[]'::jsonb)) with ordinality as evidence(evidence_item, ordinality)
      ), 'none') || '.'
  end;

  insert into content.private_guided_answer_runs (
    answer_draft_id,
    prompt_status,
    response_state,
    system_prompt,
    user_prompt,
    evidence_prompt,
    guided_answer,
    citation_ids
  )
  values (
    draft_id,
    prompt_status,
    response_state,
    system_prompt_text,
    user_prompt_text,
    evidence_prompt_payload,
    guided_answer_text,
    citation_ids_payload
  )
  returning id into run_id;

  return private_api.get_guided_answer(run_id);
end;
$$;

create or replace function private_api.get_guided_answer(p_guided_answer_run_id uuid)
returns jsonb
language sql
volatile
security definer
set search_path = private_api, content, public
as $$
  select jsonb_build_object(
    'notice', private_api.private_content_notice(),
    'guidedAnswer', jsonb_build_object(
      'guidedAnswerId', pgar.id,
      'answerDraftId', pgar.answer_draft_id,
      'promptVersion', pgar.prompt_version,
      'promptStatus', pgar.prompt_status,
      'responseState', pgar.response_state,
      'systemPrompt', pgar.system_prompt,
      'userPrompt', pgar.user_prompt,
      'evidencePrompt', pgar.evidence_prompt,
      'guidedAnswer', pgar.guided_answer,
      'citationIds', pgar.citation_ids,
      'modelProvider', pgar.model_provider,
      'modelName', pgar.model_name,
      'reviewStatus', pgar.review_status,
      'createdAt', pgar.created_at
    ),
    'answerDraft', private_api.get_answer_draft(pgar.answer_draft_id)->'answerDraft'
  )
    from content.private_guided_answer_runs pgar
   where pgar.id = p_guided_answer_run_id;
$$;

revoke all on function private_api.create_guided_answer(text, text, text, text, integer)
  from public, anon, authenticated;
revoke all on function private_api.get_guided_answer(uuid)
  from public, anon, authenticated;

grant execute on function private_api.create_guided_answer(text, text, text, text, integer)
  to service_role;
grant execute on function private_api.get_guided_answer(uuid)
  to service_role;
