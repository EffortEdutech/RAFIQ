# CP10B Hadith Learning Practice Map

Date: 2026-07-03  
Status: Passed for current checkpoint  
Checkpoint: CP10B - Hadith Learning/Practice Map

## Objective

Turn a Hadith detail page from a plain narration display into a compact learning and practice surface:

- keep reliability visible before use;
- show Arabic original when available;
- select the best available meaning text without defaulting to an unsuitable language first;
- connect the narration to a Quran-centered practice lens;
- show one careful action and one boundary;
- request related Hadith-scoped Sunnah support from the orchestrator.

## Implemented

- Rebuilt `/hadith/[hadithRecordId]` detail flow with a `Practice Map`.
- Added multilingual theme detection for intention terms including `intention`, `niat`, `niyyah`, and `niyet`.
- Added language preference order for narration meaning text: English, Malay, Indonesian, Turkish, Bengali, Russian, Tamil, Urdu.
- Added Arabic original display when available, followed by the selected meaning text.
- Added `Related Sunnah Path` using `createGuidanceSession` with `entryPoint=learn_theme` and `domain=hadith`.
- Added repeatable runtime check script: `scripts/check_cp10b_hadith_practice_map.ps1`.

## Acceptance Evidence

- `corepack pnpm build` passed.
- `corepack pnpm -C apps/mobile exec expo export --platform web` passed.
- `scripts/check_phase5_runtime.ps1` passed.
- Browser check at 390x844 for `/hadith/5afbb787-10dc-b1c9-8bc6-4beb0299d569` confirmed:
  - no horizontal overflow;
  - Arabic original is visible;
  - Indonesian meaning fallback is visible for a record without English/Malay meaning text;
  - `Practice Map` appears;
  - theme detected as `Intention`;
  - `Quran lens`, `Careful action`, and `Boundary` are visible;
  - `Related Sunnah Path` is visible.

## Known Limits

- Superseded by CP10C: narration anchoring is now handled by the `hadith_record` guidance entry point.
- Backend Hadith book/chapter hierarchy remains unavailable; CP10B does not invent it.

## Product Owner Close-Out

- Completed: Hadith detail now connects reliability, narration, Quran lens, action, caution, and related Sunnah support.
- Next planned: CP10C should improve Hadith retrieval ranking and add first-class narration-to-session anchoring.
- Ad-hoc first: none blocking after export/browser verification; known ranking gap should be handled before calling Hadith learning mature.
- Checklist update: CP10B marked Pass for current scope.
- Documentation update: CP10B report, checklist, and decision register updated.
