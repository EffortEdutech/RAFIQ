# Phase 6 Checkpoint 02 Report: Public Search Contract

Date: 2026-06-19  
Status: Completed  
Scope: Approval-aware public search over the release-filtered `public_api` surface.

## Decision

Checkpoint 02 is approved for design and private-local verification.

Decision:

- GO for public search contract implementation.
- GO for public search API route availability.
- NO-GO for public content release because no entity has passed all release gates.
- NO-GO for public AI/RAG answers until Checkpoint 03 creates the equivalent public retrieval contract.

## What Was Added

Database:

- Replaced the placeholder `public_api.search_public_content(...)` with a ranked search contract.
- Public search reads candidate rows from the existing private search document index, but only returns rows whose exact canonical target entity appears in `public_api.release_approved_entities`.
- Search target mapping:
  - `quran` -> `quran_ayah`
  - `tafsir` -> `tafsir_passage`
  - `topic` -> `source_topic`
  - `ayah_theme` -> `source_ayah_theme_group`
  - `hadith` -> `hadith_record`

API and shared contracts:

- Added `PublicSearchResponse` shared types.
- Added `GET /api/public-content/search`.
- OpenAPI now exposes the public search route separately from private content routes.

## Release Filter Rule

Public search result eligibility requires:

1. the search document matches the query;
2. the search document maps to a canonical entity;
3. that canonical entity passes `public_api.release_approved_entities`;
4. the response includes a public release-filter object proving pending content is blocked.

Current result: `0` public search results for `mercy`.

Private search remains available for internal testing and returned results during runtime verification.

## Verification

Executable verification:

- `supabase/tests/phase6_public_promotion_design.sql`
- `corepack pnpm build`
- `scripts/check_phase5_runtime.ps1`

Verification result:

- Phase 6 SQL assertion failures: `0`
- TypeScript/NestJS build: passed
- Runtime public search results: `0`
- Runtime public search release filter: `active`
- Runtime private search results: `5`

## Next Phase 6 Step

Proceed to Checkpoint 03: Public AI/RAG Retrieval Contract.

That checkpoint should make public answer retrieval use only release-approved public search/evidence and refuse answers when approved evidence is unavailable.
