set role service_role;

select private_api.search_content('mercy', 'all', 5, 0);
select private_api.search_content('zzzz-no-rahiq-result', 'all', 5, 0);
select private_api.refresh_private_review_queue();

with assertion_failures as (
  select 'review_queue_populated' as check_name
   where not exists (
     select 1 from content.private_review_queue_items
   )
  union all
  select 'retrieval_trace_queue_present'
   where not exists (
     select 1
       from content.private_review_queue_items
      where queue_type = 'retrieval_trace'
   )
  union all
  select 'source_gap_queue_present'
   where not exists (
     select 1
       from content.private_review_queue_items
      where queue_type = 'source_gap'
   )
  union all
  select 'verification_claim_queue_present'
   where not exists (
     select 1
       from content.private_review_queue_items
      where queue_type = 'verification_claim'
   )
  union all
  select 'grade_assertion_queue_present'
   where not exists (
     select 1
       from content.private_review_queue_items
      where queue_type = 'grade_assertion'
   )
  union all
  select 'list_review_queue_returns_items'
   where jsonb_array_length(private_api.list_review_queue('all', null, 10, 0)->'items') = 0
  union all
  select 'review_queue_detail_returns_item'
   where (
     select private_api.get_review_queue_item(id)->'item' is null
       from content.private_review_queue_items
      order by created_at desc
      limit 1
   )
)
select count(*) as phase5_review_queue_assertion_failures,
       coalesce(jsonb_agg(check_name order by check_name), '[]'::jsonb) as failed_checks
  from assertion_failures;

reset role;
