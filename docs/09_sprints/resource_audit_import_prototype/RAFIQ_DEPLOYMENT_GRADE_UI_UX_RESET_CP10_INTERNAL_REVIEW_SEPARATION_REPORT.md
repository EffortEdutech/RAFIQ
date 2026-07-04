# RAFIQ Deployment-Grade UI/UX Reset CP10 Internal Review Separation Report

Date: 2026-06-28  
Sprint: RAFIQ Deployment-Grade UI/UX Reset  
Checkpoint: CP10 - Internal Review Separation  
Status: Complete

## Purpose

CP10 keeps RAFIQ's reviewer and QA power without weakening the normal product experience.

Review, evidence, and source-trust details should be available to the development team, but they must not appear as ordinary user destinations.

## Implemented

Files:

`apps/mobile/src/components/RafiqNavigationBar.tsx`  
`apps/mobile/app/review.tsx`  
`apps/mobile/app/review/[queueItemId].tsx`  
`apps/mobile/app/source-detail.tsx`

The CP10 update includes:

- internal navigation labels changed to `Product Home`, `Library`, and `Internal Review`;
- `/review` strengthened with an Internal Workspace Boundary panel;
- Review route explicitly says it is outside the normal RAFIQ journey;
- source trust details are described as secondary, entity-specific links;
- `/review/[queueItemId]` moved into `PrivateWorkspaceShell` with internal navigation;
- `/source-detail` moved into `PrivateWorkspaceShell` with internal navigation;
- review and source-detail screens now use RAFIQ's private/internal visual system instead of raw utility pages;
- `/hadith` remains available as the Sunnah Support surface, but stays out of top-level product navigation by design.

## Hadith Visibility Note

Hadith is not in the top navigation because the approved navigation target is:

```text
Today | Companion | Quran | Library | Profile
```

The sprint direction frames Hadith as:

```text
Sunnah support within guidance, Quran, and Library
```

The route remains available at `/hadith`, and users reach it from Companion, Quran, Library, and internal secondary links.

## Acceptance Check

| CP10 Acceptance Item | Status | Evidence |
| --- | --- | --- |
| Review route visually marked as internal workspace. | Implemented | `/review` has Internal Workspace Boundary plus internal shell/navigation. |
| Review removed from normal product navigation. | Implemented | Product nav remains Today, Companion, Quran, Library, Profile. |
| Source/review details available from secondary links only. | Implemented | Review detail and source-detail are internal routes, linked from queue/evidence/source context. |
| Internal queue remains usable. | Implemented | Queue filters, pagination, and evidence links remain in place. |
| Normal user journey never lands on Review by accident. | Implemented | Review is absent from product nav and framed as internal when opened directly. |
| Development team can still access Review directly. | Implemented | `/review` and `/review/[queueItemId]` remain available. |

## Verification

| Check | Result |
| --- | --- |
| Root build | Passed: `corepack pnpm build` |
| Expo web export | Passed: `corepack pnpm -C apps/mobile exec expo export --platform web` |

## Browser QA

| Check | Result |
| --- | --- |
| Runtime check after dev-server restart | Passed: `scripts/check_phase5_runtime.ps1` |
| Product nav smoke | Passed: Today, Companion, Quran, Library, and Profile are visible; Review and Hadith are not top-level product nav items. |
| Desktop browser smoke on `/review` | Passed: Internal Workspace Boundary, queue summary, filters, evidence links, and internal navigation are visible. |
| Review detail smoke | Passed: `/review/5d62ae72-b5a7-4618-937f-bb716c489be8` renders internal evidence boundary, evidence fields, and queue return path. |
| Source-detail smoke | Passed: `/source-detail?entityType=quran_ayah&entityId=1` renders Internal Source Trust, release state, provenance, and internal navigation. |
| Hadith route reachability smoke | Passed: `/hadith` renders Hadith As Sunnah Support and Sunnah Shelves while remaining outside top-level nav. |
| Mobile browser smoke on `/review` | Passed at 390px width: internal boundary, queue summary, and evidence links render with no document-level horizontal overflow. |
| Console errors | Passed: no browser console errors found during smoke checks. |

## Decision

CP10 is complete.

Proceed to CP11 - Responsive, Accessibility, And Browser QA.
