# CP15 Translation Coverage And Attribution Data Upgrade

Date: 2026-07-04  
Sprint: RAFIQ Orchestrator-First Product Sprint  
Checkpoint: CP15 - Translation Coverage And Attribution Data Upgrade  
Status: Pass for current scope, with production-rights follow-up required

## Objective

Restore stored Quran translation coverage in study rooms and make translation attribution meaningful to users without pretending public publication rights are complete.

CP15 is a data-path checkpoint. RAFIQ must not invent Quran translations. It must use stored translation rows, route translation source results to the correct attribution target, and show rights status honestly.

## Root Cause

The selected English translation edition existed in the API payload, but ayah translation text was always null because the retrieval RPC joined only `variant_type = 'plain'`.

Phase 3 imported display translations as `variant_type = 'simple'`. The data existed, but the RPC did not select it.

## Implemented

- Added migration `20260704000000_cp15_translation_variant_and_attribution.sql`.
- Updated `private_api.get_quran_surah` to select stored translation rows with `variant_type in ('simple', 'plain')`, preferring `simple`.
- Added `translationTextId` to source-search result targets.
- Updated generated translation Source Search results so Attribution opens `translation_text`, not a generic Quran text target.
- Added a careful API attribution fallback for translation records when the source snapshot has no `attributionText`.
- Added `scripts/check_cp15_translation_attribution.mjs` as a repeatable API UAT check.

## Evidence

API check:

- `node scripts/check_cp15_translation_attribution.mjs` passed.
- Ayah `2:255` returns stored Saheeh International translation text.
- Source Search returns a translation result for `2:255`.
- Translation attribution includes a source statement: Saheeh International translation via Quranic Universal Library, with rights/publication still pending.

Browser QA:

- Viewport: 390 x 844 mobile Chrome via Playwright using system Chrome.
- Screenshots:
  - `artifacts/cp15/ayah-2-255.png`
  - `artifacts/cp15/sources-translation-2-255.png`
  - `artifacts/cp15/translation-attribution.png`

## Acceptance Evidence

| Gate | Status | Evidence |
| --- | --- | --- |
| Common ayah study room shows stored translation. | Pass | `/quran/2/255` shows the stored Saheeh International translation instead of missing-translation copy. |
| Source Search can retrieve translation result. | Pass | `/sources?q=2:255&domain=translation` returns one translation result with `translationTextId`. |
| Translation attribution opens the correct study item. | Pass | Translation result attribution routes to `/source-detail?entityType=translation_text&entityId=...`. |
| Attribution is readable and honest. | Pass | Attribution page shows source, provider, license, fallback source statement, and pending/private status. |
| Mobile layout remains stable. | Pass | Browser QA found no horizontal overflow or console errors. |
| Runtime passes. | Pass | `scripts/check_phase5_runtime.ps1` passed. |
| Build passes. | Pass | `corepack pnpm build` passed. |
| Mobile export passes. | Pass | `corepack pnpm -C apps/mobile exec expo export --platform web` passed. |

## Known Limits

- Production/public use remains blocked until translation rights and attribution approval are complete.
- The fallback attribution statement is a private study acknowledgement, not final public-license wording.
- CP15 fixed the Quran translation display path; broader multilingual selector UX and translation comparison remain future work.
- Hadith meaning corpus quality scan remains a separate data-quality checkpoint.

## Close-Out

- Completed: translation variant retrieval fixed; translation Source Search attribution target fixed; translation source attribution fallback added; CP15 API UAT, runtime, build, export, and mobile browser QA passed.
- Next planned: CP16 - Study Data Quality Review: Hadith Meaning Scan And Quran Translation Selection.
- Ad-hoc first: none blocking. Production-rights approval remains a release blocker, not a private-study blocker.
- Checklist update: CP15 marked Pass; TECH-022 added.
- Documentation update: CP15 report created; sprint plan, checklist, and decision register updated.
