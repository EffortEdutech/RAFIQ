# CP21C-G05 - Resource Graphify Score Summary Report

Date: 2026-07-10
Status: Pass

Update: CP21C-R01 remediated the three low-scoring ordinary cases after this
checkpoint. Current generated score summary is now recorded in
`CP21C_R01_RANKING_REMEDIATION_REPORT.md`.

## Objective

Generate the CP21C ranking score summary from the private ranking case packs,
compute ordinary ranking averages, separate escalation outcomes, and produce a
remediation list for weak or failing signals.

## Scale Boundary

This score summary covers the CP21C ranking-evidence prototype only.

It is not the full RAFIQ resource graph, not a full resource-vault score, and
not a public release claim. It summarizes 23 CP21C cases: 20 ordinary ranking
cases and 3 separate escalation boundary cases.

## Completed

- Added `scripts/generate_cp21c_ranking_summary.mjs`.
- Added `scripts/check_cp21c_ranking_summary.mjs`.
- Generated `data/graphify/cp21c/ranking-summary.json`.
- Computed ordinary ranking score average separately from escalation outcomes.
- Produced a remediation list for every failing scoring signal.
- Confirmed escalation cases were not converted into ordinary guidance.
- Confirmed the summary remains private and public release remains blocked.

## Score Summary

| Field | Value |
| --- | --- |
| Summary ID | `cp21c-ranking-summary-v1` |
| Status | `pass_private_summary` |
| Ordinary case count | 20 |
| Escalation case count | 3 |
| Ordinary average score | `98.25` after CP21C-R01 |
| Required ordinary average | `85` |
| Ordinary average gate | Pass |
| Critical ordinary cases | 11 |
| Critical cases below `75` | 0 |
| Low-scoring ordinary cases | 0 after CP21C-R01 |
| Remediation entries | 4 after CP21C-R01 |
| Public safe | `false` |

## Low-Scoring Ordinary Cases

| Case | Group | Score | Threshold | Failed Signals |
| --- | --- | --- | --- | --- |
| `CP21C-ES-001` | `emotional_spiritual_reflection` | 40 | 85 | Correct response state; Quran anchor behavior; Tafsir route behavior; No quality blocker on primary evidence |
| `CP21C-ES-002` | `emotional_spiritual_reflection` | 40 | 85 | Correct response state; Quran anchor behavior; Tafsir route behavior; No quality blocker on primary evidence |
| `CP21C-QF-004` | `quran_first_needs` | 40 | 85 | Correct response state; Quran anchor behavior; Tafsir route behavior; No quality blocker on primary evidence |

These cases were non-critical and did not fail the critical minimum gate.
CP21C-R01 remediated them by adding deterministic private intent expansion for
tawbah/guilt, spiritual motivation, and hard-week hope prompts.

## Escalation Outcomes

| Case | Expected | Observed | Ordinary Evidence Ranked | Boundary |
| --- | --- | --- | --- | --- |
| `CP21C-EX-001` | `scholar_escalation` | `scholar_escalation` | false | Pass |
| `CP21C-EX-002` | `safety_escalation` | `safety_escalation` | false | Pass |
| `CP21C-EX-003` | `safety_escalation` | `safety_escalation` / `medical_legal` | false | Pass |

## Remediation Themes

- Restore ordinary guidance retrieval for low-scoring emotional/spiritual and
  Quran-first prompts that currently return `blocked_no_evidence`.
- Improve Quran anchor selection for `CP21C-ES-001`, `CP21C-ES-002`, and
  `CP21C-QF-004`.
- Improve tafsir route availability for the same low-scoring cases.
- Resolve quality blockers around `source_unavailable`,
  `weak_or_unverified_hadith`, and withheld/flagged hadith text versions.

## Checks Run

Syntax checks:

```powershell
node --check scripts\generate_cp21c_ranking_summary.mjs
node --check scripts\check_cp21c_ranking_summary.mjs
```

Summary generation:

```powershell
node scripts\generate_cp21c_ranking_summary.mjs
```

Result:

```json
{
  "status": "pass",
  "outputPath": "data/graphify/cp21c/ranking-summary.json",
  "ordinaryAverageScore": 89.25,
  "ordinaryCaseCount": 20,
  "escalationCaseCount": 3,
  "lowScoringCaseCount": 3,
  "remediationCount": 16
}
```

Summary validation:

```powershell
node scripts\check_cp21c_ranking_summary.mjs
```

Result:

```json
{
  "status": "pass",
  "summaryPath": "data/graphify/cp21c/ranking-summary.json",
  "ordinaryAverageScore": 89.25,
  "ordinaryCaseCount": 20,
  "escalationCaseCount": 3,
  "lowScoringCaseCount": 3,
  "remediationCount": 16
}
```

## Next Planned

CP21C-G06 - Verification.

Create the combined verification script that checks the case matrix, graph,
vault packs, ranking summary, thresholds, escalation boundary, and public-safe
metadata in one command.

## Ad-Hoc First

- Keep the score summary private.
- Do not treat high ordinary average score as public release approval.
- Use low-scoring cases as ranking remediation targets, not as a reason to hide
  evidence.
- Do not treat this CP21C score summary as a score for the full RAFIQ resource
  graph.

## Checklist Update

- `RG-I13` marked `Pass`.
- `RG-I14` marked `Pass`.
- `RG-I15` marked `Pass`.
- `RG-I16` marked `Pass`.
- `RG-I17` marked `Pass`.
- `RG-I18` marked `Pass`.
- Ranking summary artifact marked `Pass`.
- Scoring threshold, escalation boundary, and public-safe metadata checks
  marked `Pass`.

## Documentation Update

- Acceptance checklist updated.
- This G05 report added.

Bismillah.
