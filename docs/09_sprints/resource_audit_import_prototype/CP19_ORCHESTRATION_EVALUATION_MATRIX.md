# CP19 - Orchestration Evaluation Matrix

Date: 2026-07-06  
Status: Pass for current scope

## Objective

Measure whether RAFIQ's orchestrator selects Quran, tafsir, Hadith/Sunnah support, ranking, and no-evidence behavior at the level expected for the private companion MVP.

## Completed

- Added repeatable CP19 evaluation script: `scripts/check_cp19_orchestration_matrix.mjs`.
- Tested natural user language for patience and prayer focus.
- Tested direct Quran ayah guidance for `2:255`.
- Tested anchored Hadith-record guidance for Bukhari #1.
- Tested no-evidence blocking for an unmapped private phrase.
- Tested Source Search ranking/deep routing for `2:255` across Quran, translation, and tafsir.
- Tightened Source Search dedupe so exact Quran ayah rows appear once instead of repeating in top results.

## Evaluation Matrix

| Case | Result | Evidence |
| --- | --- | --- |
| Natural patience | Pass | `ready`, score `100`, Quran `2:45`, tafsir route available, 6 Quran evidence items. |
| Natural prayer focus | Pass | `ready`, score `100`, Quran `2:238`, tafsir route available, 6 Quran evidence items. |
| Direct ayah `2:255` | Pass | `ready`, score `100`, Quran `2:255`, tafsir room `/tafsir/bd7fc272-cafb-4619-810a-3c77bb00e31a`. |
| Anchored Hadith intention | Pass | `ready`, score `100`, opened narration remains first Sunnah support, 6 Sunnah evidence items. |
| Unknown no-evidence phrase | Pass | `blocked_no_evidence`, no Quran anchor, no Sunnah support, no evidence. |
| Source Search `2:255` | Pass | Quran group `1`, translation group `1`, tafsir group `10`; exact routes open `/quran/2/255` and `/tafsir/:passageId`. |

## Findings

- Quran-first behavior is working for general guidance cases.
- Tafsir room routing is working from both guidance and source research.
- Hadith-only scoped behavior is working without forcing a Quran anchor.
- No-evidence behavior remains safely blocked.
- Source Search ranking needed one correction: duplicate Quran ayah rows were removed so the first screen gives more knowledge density.

## Verification

| Check | Status | Evidence |
| --- | --- | --- |
| CP19 matrix script | Pass | `corepack pnpm exec node scripts/check_cp19_orchestration_matrix.mjs`. |
| Root build | Pass | `corepack pnpm build`. |
| Runtime health | Pass | `scripts/check_phase5_runtime.ps1`. |

## Next Planned

CP20 - Product Owner Private Companion MVP Go/No-Go Review.

## Ad-Hoc First

- Continue improving semantic ranking beyond deterministic theme expansion.
- Add scholar-escalation/risk classification cases before public or broad user testing.
- Continue Hadith replacement review for flagged meaning records.

## Checklist Update

- CP19 marked `Pass`.
- TECH-026 added.

## Documentation Update

- Master sprint plan updated.
- Acceptance checklist updated.
- Decision register updated with OFP-DEC-045.
