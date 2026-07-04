# CP14 Study Room Product Polish And Data Quality Triage

Date: 2026-07-04  
Sprint: RAFIQ Orchestrator-First Product Sprint  
Checkpoint: CP14 - Study Room Product Polish And Data Quality Triage  
Status: Pass for current scope, with data import follow-up required

## Objective

Make Quran/Hadith study rooms feel calmer and prevent damaged source text from becoming user-facing guidance.

CP14 focuses on product polish and data-quality triage. It does not claim that all imported Hadith meanings, Quran translations, or attribution records are complete. It ensures RAFIQ handles those gaps honestly and calmly.

## Implemented

- Hadith learning typography was softened on `/hadith` and narration study.
- Damaged Hadith meaning snippets are no longer promoted into orchestrator Sunnah support copy.
- Narration study now hides damaged meaning text and shows a caution note instead.
- User-facing source attribution replaced the internal-looking source trust screen for `/source-detail`.
- Source attribution now shows readable labels such as `Quran 2:255` and `Quran text source`, not ingestion-style identifiers.
- The user-facing attribution route no longer links to reviewer workspace.

## Data Quality Triage

| Issue | CP14 Handling | Follow-Up |
| --- | --- | --- |
| Hadith meaning text can contain damaged wording. | Hide flagged meaning text on narration detail; use safe fallback in Sunnah support. | Build corpus-level Hadith meaning quality scan and replacement workflow. |
| Ayah study may show missing translation. | Keep the gap visible as missing translation instead of inventing text. | Add translation coverage/indexing checkpoint. |
| Source detail can expose internal provenance shape. | Replace raw internal presentation with user-facing attribution language. | Improve source registry display names, license names, and attribution rows. |

## Browser Evidence

Viewport: 390 x 844 mobile Chrome via Playwright using system Chrome.

Screenshots:

- `artifacts/cp14/hadith-home-rerun.png`
- `artifacts/cp14/narration-study-final.png`
- `artifacts/cp14/source-attribution-final.png`
- `artifacts/cp14/ayah-study-rerun.png`

## Acceptance Evidence

| Gate | Status | Evidence |
| --- | --- | --- |
| Hadith home stays mobile-safe. | Pass | `/hadith` had no horizontal overflow, no console errors, and no internal/reviewer language. |
| Narration study does not expose damaged meaning as guidance. | Pass | `/hadith/b568137e-f5ab-f085-3c18-86e2ad9cf386` hid the damaged English meaning and showed the quality note. |
| Attribution is user-facing. | Pass | `/source-detail?entityType=quran_ayah_text&entityId=2%3A255` showed `Quran 2:255` and `Quran text source`; no reviewer workspace, raw source-trust labels, or internal provenance copy. |
| Ayah study remains stable. | Pass | `/quran/2/255` had no horizontal overflow or console errors. |
| Build passes. | Pass | `corepack pnpm build` passed. |
| Mobile export passes. | Pass | `corepack pnpm -C apps/mobile exec expo export --platform web` passed and exported the Arabic font assets. |
| Runtime passes. | Pass | `scripts/check_phase5_runtime.ps1` passed after restart. |

## Known Limits

- Some Hadith records still need corpus-level meaning-text correction or replacement.
- Quran translation coverage remains incomplete for some ayah study rooms.
- Attribution rows need better source/provider/license data before public release.
- The Hadith reading room still deserves a deeper product redesign after the data layer improves.

## Close-Out

- Completed: Hadith study typography softened; damaged Hadith snippets guarded in API and mobile; narration detail hides flagged meaning text; source attribution rebuilt as user-facing; build/export/runtime/browser QA passed.
- Next planned: CP15 - Translation Coverage And Attribution Data Upgrade.
- Ad-hoc first: none blocking before CP15. Data-quality import triage should happen before final Product Owner GO.
- Checklist update: CP14 marked Pass; TECH-021 added.
- Documentation update: CP14 report created; sprint plan, acceptance checklist, and decision register updated.
