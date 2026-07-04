create temp table if not exists phase5_answer_validation_payloads (
  payload_key text primary key,
  payload jsonb not null
);

truncate table phase5_answer_validation_payloads;

insert into phase5_answer_validation_payloads(payload_key, payload)
values (
  'ready',
  private_api.create_guided_answer('What does Islam say about mercy?', null, 'en', 'all', 5)
);

insert into phase5_answer_validation_payloads(payload_key, payload)
values (
  'adapter',
  private_api.create_model_adapter_run(
    (select (payload #>> '{guidedAnswer,guidedAnswerId}')::uuid from phase5_answer_validation_payloads where payload_key = 'ready'),
    false,
    'disabled',
    'not_configured',
    'disabled_dry_run'
  )
);

insert into phase5_answer_validation_payloads(payload_key, payload)
values (
  'valid_run',
  private_api.create_answer_validation_run(
    (select (payload #>> '{guidedAnswer,guidedAnswerId}')::uuid from phase5_answer_validation_payloads where payload_key = 'ready'),
    (select (payload #>> '{modelAdapterRun,modelAdapterRunId}')::uuid from phase5_answer_validation_payloads where payload_key = 'adapter'),
    null
  )
);

insert into phase5_answer_validation_payloads(payload_key, payload)
values (
  'missing_citations',
  private_api.create_answer_validation_run(
    (select (payload #>> '{guidedAnswer,guidedAnswerId}')::uuid from phase5_answer_validation_payloads where payload_key = 'ready'),
    null,
    'Private answer text with no citation identifiers.'
  )
);

insert into phase5_answer_validation_payloads(payload_key, payload)
values (
  'uncited_claim',
  private_api.create_answer_validation_run(
    (select (payload #>> '{guidedAnswer,guidedAnswerId}')::uuid from phase5_answer_validation_payloads where payload_key = 'ready'),
    null,
    'This is halal and obligatory.'
  )
);

insert into phase5_answer_validation_payloads(payload_key, payload)
values (
  'blocked_guided',
  private_api.create_guided_answer('Is this halal or haram?', null, 'en', 'all', 5)
);

insert into phase5_answer_validation_payloads(payload_key, payload)
values (
  'blocked_validation',
  private_api.create_answer_validation_run(
    (select (payload #>> '{guidedAnswer,guidedAnswerId}')::uuid from phase5_answer_validation_payloads where payload_key = 'blocked_guided'),
    null,
    null
  )
);

insert into phase5_answer_validation_payloads(payload_key, payload)
values (
  'review_update',
  private_api.update_answer_validation_reviewer_action(
    (select (payload #>> '{answerValidationRun,answerValidationRunId}')::uuid from phase5_answer_validation_payloads where payload_key = 'valid_run'),
    'needs_correction',
    'checkpoint 13 sql test'
  )
);

with failures as (
  select 'valid_run_has_private_notice' as check_name
   where (select payload #>> '{notice,label}' from phase5_answer_validation_payloads where payload_key = 'valid_run') <> 'UNAPPROVED CONTENT - NOT FOR PUBLICATION'
  union all
  select 'valid_run_passes_with_review_required'
   where (select payload #>> '{answerValidationRun,validationStatus}' from phase5_answer_validation_payloads where payload_key = 'valid_run') <> 'passed_private_review_required'
  union all
  select 'valid_run_keeps_citations'
   where jsonb_array_length((select payload #> '{answerValidationRun,citationIds}' from phase5_answer_validation_payloads where payload_key = 'valid_run')) = 0
  union all
  select 'valid_run_has_no_missing_citations'
   where jsonb_array_length((select payload #> '{answerValidationRun,missingCitationIds}' from phase5_answer_validation_payloads where payload_key = 'valid_run')) <> 0
  union all
  select 'missing_citation_failure_detected'
   where (select payload #>> '{answerValidationRun,validationStatus}' from phase5_answer_validation_payloads where payload_key = 'missing_citations') <> 'failed_missing_citations'
  union all
  select 'uncited_claim_failure_detected'
   where (select payload #>> '{answerValidationRun,validationStatus}' from phase5_answer_validation_payloads where payload_key = 'uncited_claim') <> 'failed_uncited_claims'
  union all
  select 'guardrail_block_detected'
   where (select payload #>> '{answerValidationRun,validationStatus}' from phase5_answer_validation_payloads where payload_key = 'blocked_validation') <> 'blocked_by_guardrail'
  union all
  select 'review_action_round_trips'
   where (select payload #>> '{answerValidationRun,reviewerActionStatus}' from phase5_answer_validation_payloads where payload_key = 'review_update') <> 'needs_correction'
  union all
  select 'review_queue_item_created'
   where not exists (
     select 1
       from content.private_review_queue_items
      where queue_type = 'answer_validation'
        and subject_type = 'private_answer_validation_run'
        and subject_id = (select payload #>> '{answerValidationRun,answerValidationRunId}' from phase5_answer_validation_payloads where payload_key = 'valid_run')
   )
  union all
  select 'review_queue_action_updated'
   where not exists (
     select 1
       from content.private_review_queue_items
      where queue_type = 'answer_validation'
        and subject_type = 'private_answer_validation_run'
        and subject_id = (select payload #>> '{answerValidationRun,answerValidationRunId}' from phase5_answer_validation_payloads where payload_key = 'valid_run')
        and review_status = 'needs_correction'
   )
)
select count(*) as phase5_answer_validation_assertion_failures,
       coalesce(jsonb_agg(check_name order by check_name), '[]'::jsonb) as failing_checks
  from failures;
