-- RAFIQ Phase 5 Checkpoint 10: AI/RAG guardrails and answer evidence policy.
--
-- This is a deterministic private answer-policy layer. It retrieves evidence,
-- persists validation gates, and returns a guarded draft shell. It does not
-- call an LLM or generate independent religious claims.

create table if not exists content.private_answer_drafts (
  id uuid primary key default gen_random_uuid(),
  question_text text not null,
  detected_intent text not null,
  requested_language text not null default 'en',
  domain_filter text not null default 'all',
  response_state text not null check (response_state in (
    'approved',
    'approved_with_disclaimer',
    'source_unavailable',
    'scholar_escalation',
    'safety_escalation',
    'blocked'
  )),
  retrieval_trace_id uuid references content.private_retrieval_traces(id),
  retrieved_source_ids jsonb not null default '[]'::jsonb,
  evidence_items jsonb not null default '[]'::jsonb,
  validation_gate_results jsonb not null default '{}'::jsonb,
  draft_answer text not null,
  model_name text not null default 'deterministic_guardrail_v1',
  policy_version text not null default 'phase5_checkpoint_10_v1',
  review_status text not null default 'unreviewed',
  created_at timestamptz not null default now()
);

create index if not exists idx_private_answer_drafts_created
  on content.private_answer_drafts(created_at desc);
create index if not exists idx_private_answer_drafts_state
  on content.private_answer_drafts(response_state, created_at desc);
create index if not exists idx_private_answer_drafts_trace
  on content.private_answer_drafts(retrieval_trace_id)
  where retrieval_trace_id is not null;

alter table content.private_answer_drafts enable row level security;

grant select, insert, update, delete on content.private_answer_drafts to service_role;

create or replace function private_api.detect_answer_intent(p_question text)
returns text
language sql
immutable
as $$
  select case
    when lower(coalesce(p_question, '')) ~ '(suicide|self harm|kill myself|emergency|abuse|medical|doctor|lawyer|legal)' then 'safety'
    when lower(coalesce(p_question, '')) ~ '(fatwa|halal|haram|divorce|inheritance|ruling|is it allowed|permissible|forbidden)' then 'ruling'
    when lower(coalesce(p_question, '')) ~ '(hadith|hadeeth|sunnah|bukhari|muslim)' then 'hadith_learning'
    when lower(coalesce(p_question, '')) ~ '(quran|ayah|surah|tafsir|translation)' then 'quran_learning'
    else 'general_guidance'
  end;
$$;

create or replace function private_api.create_answer_draft(
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
  question_text text := nullif(trim(coalesce(p_question, '')), '');
  requested_language text := lower(coalesce(nullif(trim(p_language), ''), 'en'));
  domain_filter text := lower(coalesce(nullif(trim(p_domain), ''), 'all'));
  page_limit integer := least(greatest(coalesce(p_limit, 5), 1), 10);
  detected_intent text;
  search_payload jsonb;
  trace_id uuid;
  source_ids jsonb;
  evidence_payload jsonb;
  gate_payload jsonb;
  response_state text;
  answer_text text;
  draft_id uuid;
  evidence_count integer;
begin
  if question_text is null then
    raise exception 'question must not be blank';
  end if;

  detected_intent := lower(coalesce(nullif(trim(p_intent), ''), private_api.detect_answer_intent(question_text)));

  search_payload := private_api.search_content(question_text, domain_filter, page_limit, 0);
  trace_id := (search_payload #>> '{retrievalTrace,traceId}')::uuid;
  evidence_count := jsonb_array_length(coalesce(search_payload->'results', '[]'::jsonb));

  source_ids := coalesce((
    select jsonb_agg(result_value->>'resultId')
      from jsonb_array_elements(coalesce(search_payload->'results', '[]'::jsonb)) as results(result_value)
  ), '[]'::jsonb);

  evidence_payload := coalesce((
    select jsonb_agg(jsonb_build_object(
             'citationId', result_value->>'resultId',
             'domain', result_value->>'domain',
             'title', result_value->>'title',
             'subtitle', result_value->>'subtitle',
             'snippet', result_value->>'snippet',
             'reference', result_value->'reference',
             'target', result_value->'target',
             'reviewStatus', 'unreviewed',
             'publicReleaseStatus', 'blocked_pending_approval'
           ) order by ordinality)
      from jsonb_array_elements(coalesce(search_payload->'results', '[]'::jsonb)) with ordinality as results(result_value, ordinality)
  ), '[]'::jsonb);

  response_state := case
    when detected_intent = 'safety' then 'safety_escalation'
    when detected_intent = 'ruling' then 'scholar_escalation'
    when evidence_count = 0 then 'source_unavailable'
    else 'approved_with_disclaimer'
  end;

  gate_payload := jsonb_build_object(
    'intentGate', jsonb_build_object(
      'status', 'passed',
      'detectedIntent', detected_intent
    ),
    'sourceRetrievalGate', jsonb_build_object(
      'status', case when evidence_count > 0 then 'passed' else 'failed' end,
      'retrievalTraceId', trace_id,
      'evidenceCount', evidence_count
    ),
    'quranReferenceGate', jsonb_build_object(
      'status', 'not_evaluated_in_checkpoint_10',
      'policy', 'future answer generation must validate every Quran reference against canonical ayah identity'
    ),
    'translationGate', jsonb_build_object(
      'status', 'restricted',
      'policy', 'do not create Quran translations with AI; use stored source translations only'
    ),
    'tafsirGate', jsonb_build_object(
      'status', 'restricted',
      'policy', 'do not infer tafsir beyond retrieved stored tafsir passages'
    ),
    'hadithReferenceGate', jsonb_build_object(
      'status', 'restricted',
      'policy', 'Hadith must include collection, source reference, text source, and grade or verification status before guidance use'
    ),
    'gradeGate', jsonb_build_object(
      'status', 'restricted',
      'policy', 'unknown or unreviewed grades cannot be used as primary guidance'
    ),
    'fatwaBoundaryGate', jsonb_build_object(
      'status', case when detected_intent = 'ruling' then 'escalate' else 'passed' end
    ),
    'medicalLegalCrisisGate', jsonb_build_object(
      'status', case when detected_intent = 'safety' then 'escalate' else 'passed' end
    ),
    'finalCitationGate', jsonb_build_object(
      'status', case when evidence_count > 0 then 'passed' else 'failed' end,
      'requiredCitationCount', case when evidence_count > 0 then 1 else 0 end
    )
  );

  answer_text := case response_state
    when 'safety_escalation' then
      'This question may involve safety, medical, legal, crisis, abuse, or emergency risk. RAFIQ should not answer it as ordinary spiritual guidance. Use appropriate professional, emergency, or qualified support, and only show general source search evidence separately.'
    when 'scholar_escalation' then
      'This question may require a qualified scholarly ruling. RAFIQ should provide related retrieved evidence only, avoid a halal/haram decision, and recommend consulting a qualified scholar.'
    when 'source_unavailable' then
      'No suitable private evidence was retrieved. RAFIQ should not generate an Islamic answer for this question until relevant reviewed sources are available.'
    else
      'Private evidence was retrieved. A future AI answer may summarize only the cited evidence, preserve source labels, avoid new religious claims, and keep this content private until approval gates pass.'
  end;

  insert into content.private_answer_drafts (
    question_text,
    detected_intent,
    requested_language,
    domain_filter,
    response_state,
    retrieval_trace_id,
    retrieved_source_ids,
    evidence_items,
    validation_gate_results,
    draft_answer
  )
  values (
    question_text,
    detected_intent,
    requested_language,
    domain_filter,
    response_state,
    trace_id,
    source_ids,
    evidence_payload,
    gate_payload,
    answer_text
  )
  returning id into draft_id;

  return private_api.get_answer_draft(draft_id);
end;
$$;

create or replace function private_api.get_answer_draft(p_answer_draft_id uuid)
returns jsonb
language sql
volatile
security definer
set search_path = private_api, content, public
as $$
  select jsonb_build_object(
    'notice', private_api.private_content_notice(),
    'answerDraft', jsonb_build_object(
      'answerDraftId', pad.id,
      'questionText', pad.question_text,
      'detectedIntent', pad.detected_intent,
      'requestedLanguage', pad.requested_language,
      'domainFilter', pad.domain_filter,
      'responseState', pad.response_state,
      'retrievalTraceId', pad.retrieval_trace_id,
      'retrievedSourceIds', pad.retrieved_source_ids,
      'evidenceItems', pad.evidence_items,
      'validationGateResults', pad.validation_gate_results,
      'draftAnswer', pad.draft_answer,
      'modelName', pad.model_name,
      'policyVersion', pad.policy_version,
      'reviewStatus', pad.review_status,
      'createdAt', pad.created_at
    )
  )
    from content.private_answer_drafts pad
   where pad.id = p_answer_draft_id;
$$;

revoke all on function private_api.detect_answer_intent(text)
  from public, anon, authenticated;
revoke all on function private_api.create_answer_draft(text, text, text, text, integer)
  from public, anon, authenticated;
revoke all on function private_api.get_answer_draft(uuid)
  from public, anon, authenticated;

grant execute on function private_api.detect_answer_intent(text)
  to service_role;
grant execute on function private_api.create_answer_draft(text, text, text, text, integer)
  to service_role;
grant execute on function private_api.get_answer_draft(uuid)
  to service_role;
