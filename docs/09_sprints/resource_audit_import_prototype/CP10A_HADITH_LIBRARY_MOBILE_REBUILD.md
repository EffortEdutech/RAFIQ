# CP10A - Hadith Library Mobile Rebuild

Date: 2026-07-03  
Status: Pass  
Sprint: RAFIQ Orchestrator-First Product Sprint

## Objective

Rebuild the Hadith route as a mobile-first library surface where the user can browse collections, select a collection, move through narration indexes, and open narration details while keeping reliability and practice caution visible.

## Completed

- Rebuilt `/hadith` from a theme-led support page into a library-first mobile route.
- Added collection search by collection/source name.
- Added source-family collection cards with record count and text-version count.
- Added selected collection summary with collection key and narration total.
- Added narration index with page range and Previous/Next controls.
- Added narration rows that open `/hadith/[hadithRecordId]`.
- Kept reliability/practice caution visible without pretending chapter metadata exists.
- Restarted stale Expo dev server and served the current static mobile export on `http://127.0.0.1:8057`.

## Product Owner Acceptance

| Gate | Status | Evidence |
| --- | --- | --- |
| Hadith route feels like a library, not a theme-card support widget. | Pass | `/hadith` now starts with library stats, collection search, collection shelf, selected collection, and narration index. |
| User can choose among Hadith collections on mobile. | Pass | Browser check showed Bukhari, Muslim, Sahih-Bukhari, Sahih-Muslim, and other collection cards after data load. |
| User can navigate narration list. | Pass | Narration index shows `1-12 of 7563` with `Prev` and `Next` controls. |
| User can open narration detail. | Pass | Each narration row routes to `/hadith/[hadithRecordId]`. |
| UI does not invent chapter/book hierarchy not present in API contract. | Pass | CP10A uses collection and narration-number navigation only. |
| Mobile rendering avoids overflow and repeated-label regressions. | Pass | Browser check at 390x844 found no horizontal overflow and no duplicated bad labels. |

## Verification

- `corepack pnpm build` - Pass.
- `corepack pnpm -C apps/mobile exec expo export --platform web` - Pass.
- `scripts/check_phase5_runtime.ps1` - Pass.
- Browser verification at 390x844 on `http://127.0.0.1:8057/hadith` - Pass.

## Browser Evidence

- Hadith library visible.
- Find Collection visible.
- Selected Collection visible.
- Narration Index visible.
- Before Practice visible.
- Bukhari collections visible.
- Prev/Next controls visible.
- No `HHadith`, `SSunnah`, `TafsirTafsir`, `MercyMercy`, or `LLearn` duplicate-label regressions.
- `scrollWidth` matched `clientWidth` at mobile viewport.

## Known Limits

- The current Hadith API does not expose a formal book/chapter hierarchy in the shared mobile contract.
- CP10A therefore does not claim chapter navigation; it provides collection and narration index navigation.
- Stronger Hadith learning/practice mapping remains CP10B.
- Tafsir Reading Room remains CP10C.

## Close-Out

- Completed: Hadith Library Mobile Rebuild.
- Next planned: CP10B - Hadith Learning/Practice Map.
- Ad-hoc first: none blocking. Future backend work should expose Hadith book/chapter metadata if available in canonical data.
- Checklist update: CP10A marked Pass; `/hadith` route assessment updated.
- Documentation update: this report, checklist, and decision register updated.
