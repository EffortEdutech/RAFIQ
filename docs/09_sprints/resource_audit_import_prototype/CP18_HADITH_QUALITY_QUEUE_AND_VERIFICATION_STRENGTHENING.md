# CP18 - Hadith Quality Queue And Verification Strengthening

Date: 2026-07-05  
Status: Pass for current scope

## Objective

Turn Hadith text-quality findings into a user-facing and orchestrator-facing verification signal, so RAFIQ can keep narrations available for study while withholding damaged meaning text from guidance.

## Completed

- Added shared Hadith text-quality severity, flags, and summary contract.
- Enriched Hadith detail API responses with automated quality flags for blank text, damaged phrases, repeated wording, suspicious short text, and suspicious long text.
- Marked damaged meaning text as `withheld`.
- Updated anchored Hadith guidance so withheld meaning text is not used as Sunnah support copy.
- Updated narration study room with a compact verification map covering grade, meaning quality, and share boundary.
- Kept Arabic text, reference, collection, grade, and reliability visible even when a meaning version is withheld.

## Resource Stance

All imported resources remain available for development and private RAFIQ study workflows. Quality gates withhold only specific damaged text versions from user guidance/display until review; they do not block the whole resource from development.

## Verification

| Check | Status | Evidence |
| --- | --- | --- |
| Damaged meaning text is detected. | Pass | `scripts/check_cp18_hadith_quality_verification.mjs` found `known_broken_phrase` on the damaged fixture. |
| Damaged meaning text is withheld. | Pass | CP18 script confirmed `qualitySeverity: withheld` and counted withheld text versions. |
| Normal anchored narration remains usable. | Pass | CP18 script confirmed Bukhari #1 has a non-withheld readable text version and remains first anchored Sunnah support. |
| Build/export/runtime pass. | Pass | Root build, mobile export, and runtime check passed. |
| Mobile QA passes. | Pass | Chrome 390 x 844 showed narration verification, quality note, no overflow, and no console errors. |

## Next Planned

CP19 - Orchestration Evaluation Matrix for guidance quality, ranking, and blocked/no-evidence behavior.

## Ad-Hoc First

- Continue replacement/verification work for flagged Hadith meaning records before final Product Owner GO.
- Keep tafsir and hadith resources development-available while quality gates protect user-facing guidance.

## Checklist Update

- CP18 marked `Pass`.
- TECH-025 added.

## Documentation Update

- Master sprint plan updated.
- Acceptance checklist updated.
- Decision register updated with OFP-DEC-043 and OFP-DEC-044.
