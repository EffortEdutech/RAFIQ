# Phase 6 Checkpoint 06 Report: Approved Fixture Content Test

Date: 2026-06-20  
Status: Completed  
Scope: Controlled approved fixture test for public search, public answer retrieval, and rollback behavior.

## Decision

Checkpoint 06 is approved as an executable public/private separation test.

Decision:

- GO for approved fixture testing pattern.
- GO for release-filter positive-path verification.
- GO for rollback verification.
- NO-GO for real public content release.
- NO-GO for public launch.

## What Was Added

Executable test:

- `supabase/tests/phase6_public_fixture_content.sql`

The test creates a synthetic approved fixture inside a transaction:

- fixture search document: `phase6-fixture:source_topic:approved-mercy`
- fixture release entity: `source_topic / phase6-approved-fixture-topic-001`
- all release gates set to approved;
- publication status set to `public`;
- public search, answer draft, and guided answer tested;
- fixture then changed back to `private_only`;
- public search and answer behavior retested;
- transaction rolled back so no fixture remains.

## What Was Proven

With the fixture approved:

- `public_api.release_approved_entities` sees the fixture;
- `public_api.search_public_content(...)` returns exactly the fixture;
- `public_api.create_public_answer_draft(...)` returns `approved_with_disclaimer`;
- `public_api.create_public_guided_answer(...)` returns `model_ready`;
- evidence and citation counts are exactly `1`.

After rollback:

- public search no longer returns the fixture;
- public answer returns `source_unavailable`;
- private search still returns normal private results;
- no private canonical records are deleted.

## Verification

Executable verification:

- `supabase/tests/phase6_public_fixture_content.sql`
- `supabase/tests/phase6_public_promotion_design.sql`
- `corepack pnpm build`
- `scripts/check_phase5_scaffold.ps1`
- `scripts/check_phase5_runtime.ps1`

Verification result:

- Phase 6 approved fixture assertion failures: `0`
- Phase 6 normal public-promotion assertion failures: `0`
- Build: passed
- Scaffold check: passed
- Runtime check: passed
- Runtime public search results after rollback: `0`
- Runtime public answer state after rollback: `source_unavailable`
- Runtime public guided prompt after rollback: `blocked_no_public_evidence`

## Current Status

RAFIQ now has both negative and positive public-release tests:

- negative path: real pending content stays blocked;
- positive path: approved fixture content becomes publicly searchable and answer-retrievable;
- rollback path: approved fixture can be removed from public search and answer retrieval without deleting private data.

Public launch remains NO-GO because no real source has passed rights, attribution, editorial, scholar/content, and Product Owner approval.

## Next Phase 6 Step

Proceed to Checkpoint 07: Public Page Design And Read-Only UX.

That checkpoint should design the first public Quran/Hadith/search/answer pages using only public APIs, public attribution rules, and approved-release filters.
