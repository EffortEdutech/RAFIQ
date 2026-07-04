# Phase 6 Checkpoint 01 Report: Public Promotion Design

Date: 2026-06-19  
Status: Completed  
Scope: Public/private deployment separation and release-filtered `public_api` design.

## Decision

Phase 6 public-promotion design has started.

Decision:

- GO for public API design and release-filter implementation.
- NO-GO for public content release.
- NO-GO for public AI/RAG answers.

## What Was Added

Database:

- `public_api.public_release_notice()`
- `public_api.release_approved_entities`
- `public_api.release_gate_passed(entity_type, entity_id)`
- `public_api.public_release_readiness()`
- `public_api.list_release_approved_entities(entity_type, limit, offset)`
- `public_api.search_public_content(query, domain, limit, offset)`

Deployment/API contract:

- `RAFIQ_DEPLOYMENT_MODE=private_local`
- `RAFIQ_PUBLIC_CONTENT_ENABLED=false`
- `/api/health` now reports:
  - deployment mode;
  - public-content enabled flag;
  - public release GO flag.

## Release Filter Rule

An entity is public-release eligible only when the latest release state passes:

- `technical_status in ('validated', 'approved')`
- `rights_status = 'approved'`
- `attribution_status = 'approved'`
- `editorial_status = 'approved'`
- `scholar_content_status = 'approved'`
- `publication_status in ('public', 'published')`

Current result: `0` public-approved entities.

## Safety Properties

The public design is intentionally callable but empty:

- `public_api` is accessible to client roles only through release-filtered
  functions/views.
- `private_api` remains blocked from `anon` and `authenticated`.
- `content` remains blocked from `anon`.
- public search returns zero results while content is pending.
- private-only entities fail `public_api.release_gate_passed(...)`.

## Verification

Executable verification:

- `supabase/tests/phase6_public_promotion_design.sql`
- `scripts/check_phase5_runtime.ps1`
- `corepack pnpm build`

Verification result:

- Phase 6 public promotion assertion failures: `0`

## Next Phase 6 Step

Design the approval-aware public search and public answer retrieval contracts
over the release-filtered `public_api` surface. Keep all current content
private-only until Product Owner public scope approval and all source approval
gates pass.
