# CP21C - Semantic Ranking And Cross-Source Selection Contract

Date: 2026-07-07  
Status: Contract Pass; implementation pending

## Objective

Move orchestration quality beyond deterministic theme expansion by defining a measured ranking matrix for Quran, tafsir, Hadith, and source search selection.

## Ranking Requirements

- General guidance should prefer Quran anchor first.
- Tafsir should match the selected ayah, not only broad theme.
- Hadith support should be relevant, verified, and not primary when quality is weak or withheld.
- Direct ayah input must keep the requested ayah as anchor.
- Opened Hadith guidance must keep the opened narration first.
- Source Search must avoid repeated low-value rows in the first screen.
- No-evidence prompts must block rather than invent a path.

## Required Evaluation Matrix

CP21C implementation must include at least 20 prompts:

| Group | Minimum Cases |
| --- | --- |
| Quran-first needs | 6 |
| Worship/prayer needs | 3 |
| Emotional/spiritual reflection | 3 |
| Direct ayah references | 3 |
| Hadith-record anchored guidance | 2 |
| Source Search research queries | 2 |
| Blocked/no-evidence prompts | 1 |

## Scoring

| Signal | Points |
| --- | --- |
| Correct response state | 20 |
| Quran anchor suitable where expected | 20 |
| Tafsir route available and relevant | 15 |
| Hadith support relevant and verified where expected | 15 |
| Reflection and one action present | 10 |
| Source links open study rooms | 10 |
| No duplicate exact source rows crowd first results | 5 |
| No internal/developer/release language | 5 |

Minimum pass score: `85`.

## Implementation Acceptance

CP21C passes only when:

- matrix has at least 20 cases;
- every H0 safety/escalation case is excluded or scored separately from ordinary guidance;
- average score is at least `85`;
- no single critical case scores below `75`;
- failures produce a ranked remediation list.

## Next

Implement after CP21B risk state contract is in place, so ranking does not accidentally optimize unsafe answers.
