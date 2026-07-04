set role service_role;

with ready as (
  select private_api.create_guided_answer('What does Islam say about mercy?', null, 'en', 'all', 5) as payload
),
ruling as (
  select private_api.create_guided_answer('Is this halal or haram?', null, 'en', 'all', 5) as payload
),
missing as (
  select private_api.create_guided_answer('zzzz-no-rahiq-guided-answer-evidence', null, 'en', 'all', 5) as payload
),
lookup as (
  select private_api.get_guided_answer(((select payload from ready) #>> '{guidedAnswer,guidedAnswerId}')::uuid) as payload
),
assertion_failures as (
  select 'guided_answer_has_private_notice' as check_name
   where (select payload #>> '{notice,label}' from ready) <> 'UNAPPROVED CONTENT - NOT FOR PUBLICATION'
  union all
  select 'evidence_backed_question_is_model_ready'
   where (select payload #>> '{guidedAnswer,promptStatus}' from ready) <> 'model_ready'
  union all
  select 'guided_answer_has_prompt_package'
   where (select payload #>> '{guidedAnswer,systemPrompt}' from ready) not like 'You are RAFIQ private%'
  union all
  select 'guided_answer_has_evidence_prompt'
   where jsonb_array_length((select payload #> '{guidedAnswer,evidencePrompt}' from ready)) = 0
  union all
  select 'guided_answer_has_citation_ids'
   where jsonb_array_length((select payload #> '{guidedAnswer,citationIds}' from ready)) = 0
  union all
  select 'ruling_is_blocked_by_guardrail'
   where (select payload #>> '{guidedAnswer,promptStatus}' from ruling) <> 'blocked_by_guardrail'
  union all
  select 'missing_evidence_is_blocked'
   where (select payload #>> '{guidedAnswer,promptStatus}' from missing) <> 'blocked_no_evidence'
  union all
  select 'guided_lookup_round_trips'
   where (select payload #>> '{guidedAnswer,guidedAnswerId}' from lookup) <>
         (select payload #>> '{guidedAnswer,guidedAnswerId}' from ready)
)
select count(*) as phase5_guided_answer_assertion_failures,
       coalesce(jsonb_agg(check_name order by check_name), '[]'::jsonb) as failed_checks
  from assertion_failures;

reset role;
