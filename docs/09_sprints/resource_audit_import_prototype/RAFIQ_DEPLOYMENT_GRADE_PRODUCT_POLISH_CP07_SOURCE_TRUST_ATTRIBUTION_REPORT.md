# RAFIQ Deployment-Grade Product Polish CP07 Source Trust And Attribution Report

Date completed: 2026-06-25  
Sprint: RAFIQ Deployment-Grade Product Polish  
Checkpoint: CP07 - Source Trust And Attribution Experience Polish  
Status: Complete

## Objective

Make source trust and attribution feel like a user-facing RAFIQ product feature, not an admin/status appendix.

## Changes Implemented

| Area | Upgrade |
| --- | --- |
| Source Trust page | Reframed `/public/sources` around the promise that trust is part of the product. |
| Trust story | Added a source journey from private import to public approval or rollback. |
| User-facing trust | Added plain-language trust promises for attribution, release filters, rollback, and authority boundaries. |
| Attribution checklist | Added the public attribution payload requirements users should expect. |
| Source-detail preview paths | Added Quran and Hadith public-safe source-detail preview links. |
| Source Detail page | Reframed `/public/source/[id]` as a public-safe trust record. |
| Release gates | Upgraded rights, attribution, editorial, scholar/content, and publication status display. |
| Attribution payload | Preserved source identity, edition, license, attribution, and required-link fields with pending-state copy. |
| Public boundary | Replaced raw private excluded-field names with user-facing exclusion categories. |
| Next paths | Added routes back to Source Trust, Search, and Guided Answer. |

## Verification

Passed:

- `corepack pnpm build`;
- `corepack pnpm -C apps/mobile exec expo export --platform web`;
- `scripts/check_phase5_runtime.ps1`;
- browser desktop verification for `/public/sources`;
- browser desktop verification for `/public/source/quran-preview?entityType=quran_ayah_text`;
- browser mobile `390x844` verification for both routes.

Browser verification confirmed:

- Sources title visible: `Trust is part of the product, not a footnote.`;
- source journey visible;
- attribution payload visible;
- release gates visible;
- source-detail public-safe categories visible;
- old source-trust copy no longer visible;
- no encoding artifacts;
- no raw JSON visible;
- no visible private route, review queue, retrieval trace, or private-content leaks;
- no horizontal overflow on desktop;
- no horizontal overflow on mobile `390x844`.

## React Review

The TSX edits were checked against the React best-practices checklist:

- mapped lists use stable keys;
- source-detail side effects keep dependency arrays explicit;
- no unnecessary memoization beyond the derived release summary;
- public links remain semantic `Link` elements;
- private operational field names are not rendered in public copy.

## Decision

CP07 is approved as complete.

Source trust now reads as part of RAFIQ's public value proposition: transparent, gated, attributable, and rollback-aware.

## Next Step

Proceed to CP08: Deployment Readiness QA.
