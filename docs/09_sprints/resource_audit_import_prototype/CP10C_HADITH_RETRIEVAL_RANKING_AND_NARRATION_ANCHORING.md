# CP10C Hadith Retrieval Ranking And Narration Anchoring

Date: 2026-07-03  
Status: Passed  
Checkpoint: CP10C - Hadith Retrieval Ranking And Narration Anchoring

## Objective

Make Hadith learning start from the narration the user opened, then add related support. CP10B showed a useful Practice Map, but the related Sunnah path could begin with a different narration for the same theme. CP10C fixes that product trust gap.

## Implemented

- Added `hadith_record` to `GuidanceSessionEntryPoint`.
- Added optional `hadithRecordId` to `GuidanceSessionRequest`.
- Added `hadithRecordId` query support in the private API guidance session endpoint.
- Updated the mobile private-content API client to pass `hadithRecordId`.
- Updated `/hadith/[hadithRecordId]` to create a `hadith_record` guidance session.
- Updated the orchestrator to fetch the opened Hadith record and prepend it as the first Sunnah support item.
- Deduped related Hadith results so the opened narration does not repeat as a related item.
- Improved related Hadith ranking by preferring same-collection support before lower-ranked general matches.
- Updated the Sunnah learning-path step to route back to the anchored narration detail page.
- Added repeatable verification script: `scripts/check_cp10c_hadith_anchor.ps1`.

## Acceptance Evidence

- `corepack pnpm build` passed.
- `scripts/check_cp10b_hadith_practice_map.ps1` passed.
- `scripts/check_cp10c_hadith_anchor.ps1` passed:
  - session status `ready`;
  - entry point `hadith_record`;
  - first support item anchored to `5afbb787-10dc-b1c9-8bc6-4beb0299d569`;
  - first reference `fawaz-linebyline:bukhari 1`;
  - Sunnah learning step route `/hadith/5afbb787-10dc-b1c9-8bc6-4beb0299d569`.
- `corepack pnpm -C apps/mobile exec expo export --platform web` passed.
- `scripts/check_phase5_runtime.ps1` passed after web export completed.
- Browser check at 390x844 passed:
  - Practice Map visible;
  - Intention visible;
  - Related Sunnah Path visible;
  - first related path item is `fawaz-linebyline / bukhari`;
  - reference `fawaz-linebyline:bukhari 1` visible;
  - no horizontal overflow.

## Known Limits

- Hadith book/chapter navigation is still limited by backend metadata availability.
- Anchoring is now correct for the opened narration, but deeper semantic ranking across all Hadith sources remains a future quality layer.
- The Hadith detail page still uses available local text versions; no new translation or verification authority was invented.

## Product Owner Close-Out

- Completed: Hadith detail sessions now anchor to the opened narration and show related support after the anchored record.
- Next planned: CP10D or CP11 should improve Hadith collection/chapter metadata if available, or move to deeper tafsir/Quran reading-room work.
- Ad-hoc first: none blocking.
- Checklist update: CP10C marked Pass.
- Documentation update: CP10C report, checklist, sprint plan, and decision register updated.
