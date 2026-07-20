# CP29-R01 - Remediation Architecture And Unlock Baseline

Date: 2026-07-18

Status: Complete

Scope: Establish the CP29 remediation baseline and selected-candidate unlock architecture from CP28 close-out.

## 1. Purpose

CP29-R01 converts CP28's close-out result into a remediation plan.

CP28 correctly selected zero candidates because CP27 still exposes unresolved references and high/critical blockers. CP29 now targets those blockers so a later rerun can unlock selected candidates without bypassing validation gates.

## 2. Generated Artifacts

| Artifact | Path | Purpose |
| --- | --- | --- |
| Remediation unlock plan | `data/remediation/cp29/remediation-unlock-plan.json` | Baseline counts, blocker taxonomy, phase plan, and selected-candidate unlock policy. |
| CP29 manifest | `data/remediation/cp29/manifest.json` | Artifact paths, checksums, baseline counts, and verifier pointer. |
| Latest remediation pointer | `data/remediation/cp29/latest-remediation.json` | Current CP29 pointer. |
| Generator | `scripts/generate_cp29_r01_remediation_unlock_plan.mjs` | Rebuilds the CP29-R01 baseline. |
| Verifier | `scripts/check_cp29_r01_remediation_unlock_plan.mjs` | Verifies CP28 close-out, CP29 artifacts, docs, roadmap update, and public boundary. |

## 3. Current Baseline

| Metric | Count |
| --- | ---: |
| CP27 graph nodes | 147 |
| CP27 graph edges | 125 |
| CP27 vault artifacts | 26 |
| CP27 unresolved references | 77 |
| CP27 high/critical blockers | 30 |
| CP28 candidates | 70 |
| CP28 selected candidates | 0 |
| CP28 selected route items | 0 |
| CP28 remediation items | 70 |
| CP28 high/critical remediation items | 38 |
| Public-safe candidates | 0 |
| Public-safe route items | 0 |

## 4. Blocker Taxonomy

| Reason family | Candidate count | Target checkpoint |
| --- | ---: | --- |
| `cp27_unresolved_references_present` | 70 | CP29-R02 |
| `cp27_quality_state_review_required` | 38 | CP29-R03 |
| `source_or_provenance_gap_fixture` | 8 | CP29-R02 |
| `safety_escalation_required` | 8 | CP29-R04 |
| `grade_uncertainty_requires_escalation_review` | 7 | CP29-R04 |

## 5. Unlock Policy

Selected-candidate unlock requires:

1. CP27 unresolved references to be repaired or explicitly resolved.
2. CP27 high/critical quality blockers to be reviewed or routed.
3. Source/provenance gaps to be repaired before promotion.
4. Hadith-grade and safety escalation candidates to remain outside ordinary unlock.
5. CP27 graph/vault regeneration.
6. CP28 retrieval rerun.
7. Validation handoff proof for any selected route item.

## 6. Public Boundary

CP29-R01 remains private-only:

- public release is not approved;
- no public route is added;
- public-safe candidates remain zero;
- public-safe route items remain zero;
- raw Quran, translation, tafsir, and hadith text bodies are not exported;
- CP29 is a remediation and unlock proof track, not a public release track.

## 7. Verification

Run:

```powershell
node scripts\check_cp29_r01_remediation_unlock_plan.mjs
```

The verifier confirms CP28 close-out and combined verification artifacts, regenerates the CP29-R01 plan, validates checksums, verifies reason taxonomy, confirms the roadmap supersession, and confirms public-safe counts remain zero.

## 8. Next Checkpoint

Proceed next with:

```text
CP29-R02 - Reference And Provenance Repair Plan
```

Status: complete.
