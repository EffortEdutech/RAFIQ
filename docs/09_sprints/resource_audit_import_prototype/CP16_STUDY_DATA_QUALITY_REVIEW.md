# CP16 - Study Data Quality Review

Date: 2026-07-04  
Status: Pass for current scope

## Objective

Move RAFIQ from "content appears" to "content is study-safe."

CP16 focuses on two Product Owner concerns:

- damaged Hadith meaning text must be measured and kept out of guidance until reviewed;
- Quran study should let users compare translation choices without turning the reading room into clutter.

## Completed

- Added `scripts/check_cp16_hadith_quality_scan.mjs`.
- The scan checks non-Arabic Hadith meaning records for repeated words, known broken phrases, suspiciously short text, suspiciously long text, and blank text.
- The scan outputs a review queue shape with severity, record identity, flags, and sample text.
- Current scan result: 406,459 non-Arabic meaning records scanned; 5,405 review candidates flagged; 13 known broken-phrase candidates found.
- Added a quarantine rule: flagged Hadith meaning records should not be used in user-facing guidance until reviewed or replaced.
- Added compact translation selection to the ayah study room for English and Malay study editions.
- Updated OpenAPI target documentation so translation Source Search targets include `translationTextId`.
- Clarified the master sprint runway from CP16 through CP20.

## Acceptance

| Gate | Status | Evidence |
| --- | --- | --- |
| Hadith meaning quality can be measured. | Pass | `scripts/check_cp16_hadith_quality_scan.mjs` produces counts and review candidates. |
| Damaged meaning records have a quarantine rule. | Pass | CP16 report and script output define the rule. |
| Quran translation choice is available without clutter. | Pass | Ayah study Meaning panel uses compact English/Malay options; main Quran reading remains reading-first. Fresh static export QA passed at 390 x 844 with no overflow or console errors. |
| Sprint direction is clear. | Pass | Master plan now states the CP16-CP20 runway. |

## Next Planned

CP17 - Tafsir Reading Room And Tafsir Learning Depth.

## Ad-Hoc First

- Review/replace flagged Hadith meaning records before public release.
- Keep translation and tafsir rights approval as a release blocker, not a private-study blocker.
- Restart the stale Expo dev server on `8057` before Product Owner inspection, or review the freshly exported static build.

## Checklist Update

- CP16 marked `Pass`.
- TECH-023 added.

## Documentation Update

- Master sprint plan updated.
- Acceptance checklist updated.
- Decision register updated with OFP-DEC-039, OFP-DEC-040, and OFP-DEC-041.
