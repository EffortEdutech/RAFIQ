set role service_role;

with generated as (
  select private_api.create_answer_draft('What does Islam say about mercy?', null, 'en', 'all', 5) as payload
),
safety as (
  select private_api.create_answer_draft('I need medical advice urgently', null, 'en', 'all', 5) as payload
),
ruling as (
  select private_api.create_answer_draft('Is this halal or haram?', null, 'en', 'all', 5) as payload
),
missing as (
  select private_api.create_answer_draft('zzzz-no-rahiq-answer-evidence', null, 'en', 'all', 5) as payload
),
lookup as (
  select private_api.get_answer_draft(((select payload from generated) #>> '{answerDraft,answerDraftId}')::uuid) as payload
),
assertion_failures as (
  select 'guarded_answer_has_private_notice' as check_name
   where (select payload #>> '{notice,label}' from generated) <> 'UNAPPROVED CONTENT - NOT FOR PUBLICATION'
  union all
  select 'guarded_answer_has_evidence'
   where jsonb_array_length((select payload #> '{answerDraft,evidenceItems}' from generated)) = 0
  union all
  select 'guarded_answer_has_trace'
   where (select payload #>> '{answerDraft,retrievalTraceId}' from generated) is null
  union all
  select 'guarded_answer_is_not_llm'
   where (select payload #>> '{answerDraft,modelName}' from generated) <> 'deterministic_guardrail_v1'
  union all
  select 'safety_question_escalates'
   where (select payload #>> '{answerDraft,responseState}' from safety) <> 'safety_escalation'
  union all
  select 'ruling_question_escalates'
   where (select payload #>> '{answerDraft,responseState}' from ruling) <> 'scholar_escalation'
  union all
  select 'missing_source_blocks_generation'
   where (select payload #>> '{answerDraft,responseState}' from missing) <> 'source_unavailable'
  union all
  select 'lookup_round_trips'
   where (select payload #>> '{answerDraft,answerDraftId}' from lookup) <>
         (select payload #>> '{answerDraft,answerDraftId}' from generated)
)
select count(*) as phase5_answer_guardrail_assertion_failures,
       coalesce(jsonb_agg(check_name order by check_name), '[]'::jsonb) as failed_checks
  from assertion_failures;

reset role;
