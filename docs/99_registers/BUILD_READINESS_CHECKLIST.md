# RAFIQ Build Readiness Checklist

Last updated: 2026-06-12

## Ready To Start

- Product vision is clear.
- Brand usage is defined.
- Canonical document map exists.
- MVP scope is now separated from Post-MVP platform features.
- AI validation gates are defined.
- Localization rules are defined.
- Content governance and trust rules are defined.
- Supabase responsibilities and RLS rules are defined at build-gate level.
- API endpoint implementation requirements are defined.
- Deployment gates are defined.
- Backend/development alignment review is complete.
- Resource Audit & Import Prototype sprint pack is prepared.
- Day 2 Quran Foundation decision gate is finalized.
- Full platform development while content approval is pending is authorized
  under `BUILD_PENDING_CONTENT_APPROVAL_DECISION.md`.

## Current Phase

RAFIQ should now execute:

`docs/09_sprints/resource_audit_import_prototype/SPRINT_PLAN.md`

This phase informs the production schema and import adapters. Platform
implementation may proceed in parallel using private staging content, but
production promotion and public retrieval remain gated.

## Authorized While Approval Is Pending

- Build the complete platform architecture and user experience.
- Import every technically validated dataset into the complete private
  platform.
- Enable and test every content-dependent feature against all available
  validated content.
- Implement and test search, retrieval, AI/RAG, rendering, indexing, caching,
  source relationships, and rollback end to end.
- Build content review, attribution, approval, replacement, and rollback tools.
- Deploy private production-like test environments with access controls.

Approval status does not disable private platform functionality. Do not expose
unapproved source content through a public deployment.

## Must Complete Before Public Content Release

- Verify every source URL and license.
- Approve Quran text source.
- Approve launch translations.
- Approve hadith source and grade source.
- Confirm tafsir source rights.
- Define attribution text per source.
- Add checksums or integrity checks for imported content.
- Complete source audit forms for P0 resources.
- Complete import validation reports for representative staging imports.
- Produce canonical schema recommendations from real resource structures.
- Resolve Quran Bismillah storage/rendering without modifying licensed source text.
- Resolve QUL resource provenance and copyright information before production use.

## Must Complete Before Public Launch

- Complete MVP Core flow end to end.
- Test RLS isolation for user data.
- Confirm service keys are server-only.
- Run AI validation gate tests.
- Create approved launch content for MVP themes.
- Test account deletion and data deletion/export paths.
- Configure backups, monitoring, and rollback.

## Remaining Open Questions

- Launch language order: English first, Malay first, or bilingual.
- Whether Journeys ships in MVP or waits until Post-MVP.
- Which exact source datasets are legally safe for production.
