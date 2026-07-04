# Phase 6 Checkpoint 03 Report: Public AI/RAG Retrieval Contract

Date: 2026-06-19  
Status: Completed  
Scope: Public answer and guided-answer retrieval contracts over release-approved public evidence only.

## Decision

Checkpoint 03 is approved for design and private-local verification.

Decision:

- GO for public AI/RAG retrieval contract implementation.
- GO for public answer and guided-answer API route availability.
- NO-GO for public AI/RAG answers because no release-approved public evidence exists yet.
- NO-GO for public model execution.

## What Was Added

Database:

- `public_api.detect_public_answer_intent(question)`
- `public_api.create_public_answer_draft(question, intent, language, domain, limit)`
- `public_api.create_public_guided_answer(question, intent, language, domain, limit)`

API and shared contracts:

- `GET /api/public-content/answer/draft`
- `GET /api/public-content/answer/guided`
- shared public answer draft and guided-answer response types
- OpenAPI response DTOs for public answer retrieval

## Public Retrieval Rule

Public answer retrieval may use only:

1. `public_api.search_public_content(...)`;
2. search results that passed `public_api.release_approved_entities`;
3. citation-bound evidence items returned by public search;
4. deterministic guardrail/prompt packaging.

It must not:

- call `private_api.search_content`;
- expose private retrieval traces;
- expose pending/private evidence;
- call a model provider;
- generate a religious answer without release-approved public evidence.

## Current Behavior

Current public approved evidence count is `0`.

Therefore:

- public search returns `0` results;
- public answer draft returns `source_unavailable`;
- public guided answer returns `blocked_no_public_evidence`;
- public release remains NO-GO.

Private testing remains unaffected:

- private search returns results;
- private answer draft remains `approved_with_disclaimer`;
- private guided answer remains `model_ready`;
- model adapter remains disabled.

## Verification

Executable verification:

- `supabase/tests/phase6_public_promotion_design.sql`
- `corepack pnpm build`
- `scripts/check_phase5_runtime.ps1`
- `scripts/check_phase5_scaffold.ps1`

Verification result:

- Phase 6 SQL assertion failures: `0`
- TypeScript/NestJS build: passed
- Runtime public search results: `0`
- Runtime public answer state: `source_unavailable`
- Runtime public guided prompt status: `blocked_no_public_evidence`
- Runtime private guided prompt status: `model_ready`

## Next Phase 6 Step

Proceed to Checkpoint 04: Product Owner Public-Scope Approval Checklist.

That checkpoint should define the exact approval form for deciding which source versions, languages, topics, tafsir, and Hadith collections may enter public release.
