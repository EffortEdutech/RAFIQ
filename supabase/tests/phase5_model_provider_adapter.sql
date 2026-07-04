set role service_role;

with guided_ready as (
  select private_api.create_guided_answer('What does Islam say about mercy?', null, 'en', 'all', 5) as payload
),
adapter_disabled as (
  select private_api.create_model_adapter_run(
    ((select payload from guided_ready) #>> '{guidedAnswer,guidedAnswerId}')::uuid,
    false,
    'disabled',
    'not_configured',
    'disabled_dry_run'
  ) as payload
),
guided_blocked as (
  select private_api.create_guided_answer('Is this halal or haram?', null, 'en', 'all', 5) as payload
),
adapter_guardrail as (
  select private_api.create_model_adapter_run(
    ((select payload from guided_blocked) #>> '{guidedAnswer,guidedAnswerId}')::uuid,
    true,
    'configured_test_provider',
    'configured_test_model',
    'disabled_dry_run'
  ) as payload
),
adapter_lookup as (
  select private_api.get_model_adapter_run(
    ((select payload from adapter_disabled) #>> '{modelAdapterRun,modelAdapterRunId}')::uuid
  ) as payload
),
assertion_failures as (
  select 'adapter_has_private_notice' as check_name
   where (select payload #>> '{notice,label}' from adapter_disabled) <> 'UNAPPROVED CONTENT - NOT FOR PUBLICATION'
  union all
  select 'adapter_disabled_by_default'
   where (select payload #>> '{modelAdapterRun,adapterStatus}' from adapter_disabled) <> 'disabled_by_configuration'
  union all
  select 'adapter_records_request_payload'
   where (select payload #>> '{modelAdapterRun,requestPayload,guidedAnswerId}' from adapter_disabled) is null
  union all
  select 'adapter_guardrail_blocks_even_when_provider_enabled'
   where (select payload #>> '{modelAdapterRun,adapterStatus}' from adapter_guardrail) <> 'blocked_by_guardrail'
  union all
  select 'adapter_lookup_round_trips'
   where (select payload #>> '{modelAdapterRun,modelAdapterRunId}' from adapter_lookup) <>
         (select payload #>> '{modelAdapterRun,modelAdapterRunId}' from adapter_disabled)
)
select count(*) as phase5_model_adapter_assertion_failures,
       coalesce(jsonb_agg(check_name order by check_name), '[]'::jsonb) as failed_checks
  from assertion_failures;

reset role;
