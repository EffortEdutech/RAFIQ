# RAFIQ Public UI/UX CP07 - Public Source Detail UX Report

Date: 2026-06-20  
Sprint: RAFIQ Public UI/UX Implementation Sprint  
Checkpoint: CP07 - Public Source Detail UX  
Status: Complete  
Decision: Approved for CP08 Quran And Hadith Preview Surfaces

## Objective

Implement a public-safe source-detail contract and UI that can show attribution, source status, public release state, rollback state, and permitted-use notes without exposing private internals.

## Implemented

Updated API/shared contract:

- `packages/shared/src/public-content.ts`
- `apps/api/src/modules/public-content/public-content.controller.ts`
- `apps/api/src/modules/public-content/public-content.service.ts`
- `apps/api/src/modules/public-content/public-content.repository.ts`
- `apps/api/src/modules/public-content/public-content.dto.ts`
- `apps/api/src/modules/public-content/public-content.openapi.ts`

Updated mobile app:

- `apps/mobile/src/services/publicContentApi.ts`
- `apps/mobile/app/public/source/[id].tsx`
- `apps/mobile/app/public/search.tsx`

Updated verification:

- `scripts/check_phase5_runtime.ps1`

## Public Source Detail Contract

New endpoint:

`GET /api/public-content/source/detail?entityType={entityType}&entityId={entityId}`

Current behavior:

- returns `PUBLIC RELEASE FILTER ACTIVE` notice;
- returns `not_public` for entities that have not passed the public release gate;
- returns no private provenance;
- returns no raw-object path;
- returns no reviewer notes;
- returns no retrieval traces;
- returns no validation internals;
- documents which private fields are excluded.

## Public UI Behavior

Verified public route:

`/public/source/demo-source?entityType=quran_ayah_text`

The page displays:

- public source status;
- entity type and entity ID;
- release gate result;
- unavailable reason;
- rights, attribution, editorial, scholar/content, publication, and rollback status cards;
- public attribution payload fields;
- permitted-use note;
- private-field exclusion list.

## Runtime Verification

Observed public source-detail API result:

| Field | Result |
| --- | --- |
| `notice.label` | `PUBLIC RELEASE FILTER ACTIVE` |
| `sourceDetail.publicStatus` | `not_public` |
| `sourceDetail.publicReleaseGatePassed` | `false` |
| `sourceDetail.rollbackStatus` | `excluded_from_public_release` |
| `privateFieldsExcluded` includes `rawObjectPath` | Pass |
| `privateFieldsExcluded` includes `reviewerNotes` | Pass |
| `privateFieldsExcluded` includes `retrievalTraces` | Pass |
| `privateFieldsExcluded` includes `validationInternals` | Pass |

## Browser Verification

Verified at:

- `http://127.0.0.1:8057/public/source/demo-source?entityType=quran_ayah_text`

Observed:

| Check | Result |
| --- | --- |
| Source status visible | Pass |
| Entity type visible | Pass |
| Entity ID visible | Pass |
| Release gate result visible | Pass |
| Rights/attribution/editorial/scholar/publication statuses visible | Pass |
| Rollback status visible | Pass |
| Public attribution payload section visible | Pass |
| Private fields excluded section visible | Pass |
| `/review` absent from public navigation | Pass |

## Build And Runtime Verification

| Command | Result |
| --- | --- |
| `corepack pnpm build` | Passed |
| `corepack pnpm -C apps/mobile exec expo export --platform web` | Passed |
| `scripts/check_phase5_runtime.ps1` | Passed |

## Acceptance Evidence

CP07 satisfies checklist items:

- UX-024: public source-detail page built;
- UX-025: attribution, license/status, source version placeholders, permitted-use note, and rollback state displayed;
- UX-026: raw-object paths, reviewer notes, private traces, validation internals, and service-role details excluded.

## Remaining Boundaries

- Real public attribution details remain unavailable until a source entity passes all public release gates.
- The endpoint currently returns public-safe `not_public` payloads for pending/private entities.
- Public launch remains NO-GO.

## Next Checkpoint

Proceed to CP08: Quran And Hadith Preview Surfaces.

CP08 should build read-only public preview surfaces for Quran and Hadith using approved fixture or private-preview mode only, with source and approval labels clearly visible.
