-- RAFIQ Phase 6 Checkpoint 03: Public AI/RAG retrieval contract.
--
-- This is a public read-only answer-policy surface. It retrieves evidence only
-- from release-filtered public search. It does not call private_api, does not
-- create private traces, and does not call an LLM.

create or replace function public_api.detect_public_answer_intent(p_question text)
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

create or replace function public_api.create_public_answer_draft(
  p_question text,
  p_intent text default null,
  p_language text default 'en',
  p_domain text default 'all',
  p_limit integer default 5
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public_api, content, public
as $$
declare
  question_text text := nullif(trim(coalesce(p_question, '')), '');
  requested_language text := lower(coalesce(nullif(trim(p_language), ''), 'en'));
  domain_filter text := lower(coalesce(nullif(trim(p_domain), ''), 'all'));
  page_limit integer := least(greatest(coalesce(p_limit, 5), 1), 10);
  detected_intent text;
  search_payload jsonb;
  source_ids jsonb;
  evidence_payload jsonb;
  gate_payload jsonb;
  response_state text;
  answer_text text;
  evidence_count integer;
begin
  if question_text is null then
    raise exception 'question must not be blank';
  end if;

  detected_intent := lower(coalesce(nullif(trim(p_intent), ''), public_api.detect_public_answer_intent(question_text)));

  search_payload := public_api.search_public_content(question_text, domain_filter, page_limit, 0);
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
             'release', result_value->'release',
             'publicReleaseStatus', 'approved_public_release'
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
    'publicReleaseGate', jsonb_build_object(
      'status', case when evidence_count > 0 then 'passed' else 'failed' end,
      'source', 'public_api.search_public_content',
      'evidenceCount', evidence_count,
      'pendingContentBlocked', true
    ),
    'intentGate', jsonb_build_object(
      'status', 'passed',
      'detectedIntent', detected_intent
    ),
    'sourceRetrievalGate', jsonb_build_object(
      'status', case when evidence_count > 0 then 'passed' else 'failed' end,
      'evidenceCount', evidence_count
    ),
    'publicCitationGate', jsonb_build_object(
      'status', case when evidence_count > 0 then 'passed' else 'failed' end,
      'requiredCitationCount', case when evidence_count > 0 then 1 else 0 end
    ),
    'quranReferenceGate', jsonb_build_object(
      'status', 'restricted',
      'policy', 'Public answers may cite only stored, release-approved Quran source records.'
    ),
    'translationGate', jsonb_build_object(
      'status', 'restricted',
      'policy', 'Do not create Quran translations with AI; use approved stored translations only.'
    ),
    'tafsirGate', jsonb_build_object(
      'status', 'restricted',
      'policy', 'Do not infer tafsir beyond approved retrieved tafsir passages.'
    ),
    'hadithReferenceGate', jsonb_build_object(
      'status', 'restricted',
      'policy', 'Hadith evidence must be release-approved and source-qualified before public guidance.'
    ),
    'fatwaBoundaryGate', jsonb_build_object(
      'status', case when detected_intent = 'ruling' then 'escalate' else 'passed' end
    ),
    'medicalLegalCrisisGate', jsonb_build_object(
      'status', case when detected_intent = 'safety' then 'escalate' else 'passed' end
    )
  );

  answer_text := case response_state
    when 'safety_escalation' then
      'This question may involve safety, medical, legal, crisis, abuse, or emergency risk. RAFIQ public mode should not answer it as ordinary guidance.'
    when 'scholar_escalation' then
      'This question may require a qualified scholarly ruling. RAFIQ public mode should not issue a halal/haram decision.'
    when 'source_unavailable' then
      'No release-approved public evidence is available for this question yet. RAFIQ public mode should not generate an answer.'
    else
      'Release-approved public evidence is available. A future public answer may summarize only the cited evidence, preserve source labels, and avoid uncited religious claims.'
  end;

  return jsonb_build_object(
    'notice', public_api.public_release_notice(),
    'answerDraft', jsonb_build_object(
      'questionText', question_text,
      'detectedIntent', detected_intent,
      'requestedLanguage', requested_language,
      'domainFilter', domain_filter,
      'responseState', response_state,
      'retrievedSourceIds', source_ids,
      'evidenceItems', evidence_payload,
      'validationGateResults', gate_payload,
      'draftAnswer', answer_text,
      'modelName', 'deterministic_public_guardrail_v1',
      'policyVersion', 'phase6_checkpoint_03_public_v1',
      'publicReleaseReady', evidence_count > 0 and response_state = 'approved_with_disclaimer'
    ),
    'search', search_payload
  );
end;
$$;

create or replace function public_api.create_public_guided_answer(
  p_question text,
  p_intent text default null,
  p_language text default 'en',
  p_domain text default 'all',
  p_limit integer default 5
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public_api, content, public
as $$
declare
  draft_payload jsonb;
  draft jsonb;
  evidence_count integer;
  response_state text;
  prompt_status text;
  evidence_prompt_payload jsonb;
  citation_ids_payload jsonb;
  guided_answer_text text;
begin
  draft_payload := public_api.create_public_answer_draft(p_question, p_intent, p_language, p_domain, p_limit);
  draft := draft_payload->'answerDraft';
  response_state := draft->>'responseState';
  evidence_count := jsonb_array_length(coalesce(draft->'evidenceItems', '[]'::jsonb));

  prompt_status := case
    when response_state in ('scholar_escalation', 'safety_escalation', 'blocked') then 'blocked_by_guardrail'
    when evidence_count = 0 then 'blocked_no_public_evidence'
    else 'model_ready'
  end;

  evidence_prompt_payload := coalesce((
    select jsonb_agg(jsonb_build_object(
             'citationId', evidence_item->>'citationId',
             'domain', evidence_item->>'domain',
             'title', evidence_item->>'title',
             'snippet', evidence_item->>'snippet',
             'reference', evidence_item->'reference',
             'target', evidence_item->'target',
             'release', evidence_item->'release',
             'publicReleaseStatus', evidence_item->>'publicReleaseStatus'
           ) order by ordinality)
      from jsonb_array_elements(coalesce(draft->'evidenceItems', '[]'::jsonb)) with ordinality as evidence(evidence_item, ordinality)
  ), '[]'::jsonb);

  citation_ids_payload := coalesce((
    select jsonb_agg(evidence_item->>'citationId' order by ordinality)
      from jsonb_array_elements(coalesce(draft->'evidenceItems', '[]'::jsonb)) with ordinality as evidence(evidence_item, ordinality)
  ), '[]'::jsonb);

  guided_answer_text := case prompt_status
    when 'model_ready' then
      'Public guided answer preview: RAFIQ found ' || evidence_count::text ||
      ' release-approved evidence item(s). A connected model may answer only from these citations.'
    else draft->>'draftAnswer'
  end;

  return jsonb_build_object(
    'notice', public_api.public_release_notice(),
    'guidedAnswer', jsonb_build_object(
      'promptVersion', 'phase6_checkpoint_03_public_prompt_v1',
      'promptStatus', prompt_status,
      'responseState', response_state,
      'systemPrompt', 'You are RAFIQ public guided-answer assistant. Use only release-approved public evidence. If promptStatus is not model_ready, refuse to answer and return the no-public-evidence or escalation message.',
      'userPrompt', 'Question: ' || (draft->>'questionText') || E'\n' ||
        'Detected intent: ' || (draft->>'detectedIntent') || E'\n' ||
        'Response state: ' || response_state || E'\n' ||
        'Instruction: answer only from release-approved cited evidence.',
      'evidencePrompt', evidence_prompt_payload,
      'guidedAnswer', guided_answer_text,
      'citationIds', citation_ids_payload,
      'modelProvider', 'not_connected',
      'modelName', 'deterministic_public_prompt_preview_v1',
      'publicReleaseReady', prompt_status = 'model_ready'
    ),
    'answerDraft', draft,
    'search', draft_payload->'search'
  );
end;
$$;

revoke all on function public_api.detect_public_answer_intent(text)
  from public;
revoke all on function public_api.create_public_answer_draft(text, text, text, text, integer)
  from public;
revoke all on function public_api.create_public_guided_answer(text, text, text, text, integer)
  from public;

grant execute on function public_api.detect_public_answer_intent(text)
  to anon, authenticated, service_role;
grant execute on function public_api.create_public_answer_draft(text, text, text, text, integer)
  to anon, authenticated, service_role;
grant execute on function public_api.create_public_guided_answer(text, text, text, text, integer)
  to anon, authenticated, service_role;
