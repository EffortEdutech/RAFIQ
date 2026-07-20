# CP29 - Retrieval Remediation And Selected-Candidate Unlock Acceptance Checklist

Date: 2026-07-18

Status: CP29-R08 complete

Scope: Remediate CP27/CP28 retrieval blockers and prove selected-candidate unlock without public release.

## Status Legend

- Pass: implemented or documented and verified.
- Fail: implemented or documented but verification failed.
- Not Started: planned but not yet implemented.
- Blocked: cannot proceed without missing input, data, or decision.
- Deferred: intentionally moved outside CP29.

## 1. CP29-R01 Remediation Architecture And Unlock Baseline

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP29-R01-01 | CP29 remediation/unlock plan artifact exists. | Pass | `data/remediation/cp29/remediation-unlock-plan.json`. |
| CP29-R01-02 | CP28 selected-candidate baseline is recorded as zero. | Pass | `remediation-unlock-plan.json`; selected candidates `0`, selected route items `0`. |
| CP29-R01-03 | CP27 unresolved reference and blocker baseline is recorded. | Pass | Unresolved references `77`, high/critical blockers `30`. |
| CP29-R01-04 | Blocker taxonomy maps reason families to CP29 checkpoints. | Pass | `remediation-unlock-plan.json`; `unlockBlockers` and `phasePlan`. |
| CP29-R01-05 | Public-safe candidate and route item counts remain zero. | Pass | `scripts/check_cp29_r01_remediation_unlock_plan.mjs`. |

## 2. CP29-R02 Reference And Provenance Repair Plan

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP29-R02-01 | Reference/provenance repair plan artifact exists. | Pass | `data/remediation/cp29/reference-provenance-repair-plan.json`. |
| CP29-R02-02 | CP27 unresolved refs are grouped by source group and graph partition. | Pass | `reference-provenance-repair-plan.json`; `groupingSummary`. |
| CP29-R02-03 | Source/provenance gap candidates are assigned repair actions. | Pass | `repairTargets` includes `source_or_provenance_gap_fixture` and `raw_lineage`. |
| CP29-R02-04 | Regeneration commands are documented. | Pass | `regenerationPlan` covers CP26, CP27, CP28, and CP29-R05. |
| CP29-R02-05 | Public-safe counts remain zero. | Pass | `scripts/check_cp29_r02_reference_provenance_repair_plan.mjs`. |

## 3. CP29-R03 Quality Review Burn-Down Plan

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP29-R03-01 | Quality review burn-down artifact exists. | Pass | `data/remediation/cp29/quality-review-burn-down-plan.json`. |
| CP29-R03-02 | `review_required` candidates are grouped by owner and severity. | Pass | `quality-review-burn-down-plan.json`; `groupingSummary`. |
| CP29-R03-03 | High/critical blocker deltas are measurable. | Pass | `burnDownMetrics`; current `38`, target `0`, actual delta unapplied in R03. |
| CP29-R03-04 | Reviewer handoff remains private. | Pass | `reviewerQueues`; public release remains `false`. |
| CP29-R03-05 | Public-safe counts remain zero. | Pass | `scripts/check_cp29_r03_quality_review_burn_down_plan.mjs`. |

## 4. CP29-R04 Escalation Lane Separation

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP29-R04-01 | Escalation lane artifact exists. | Pass | `data/remediation/cp29/escalation-lane-separation.json`. |
| CP29-R04-02 | Hadith-grade escalation remains separate from ordinary unlock. | Pass | `grade_uncertainty_requires_escalation_review`; `7` candidates; `scholar_reviewer`. |
| CP29-R04-03 | Safety escalation remains separate from ordinary unlock. | Pass | `safety_escalation_required`; `8` candidates; `product_owner`. |
| CP29-R04-04 | Escalation lanes include reviewer/product owner owners. | Pass | `groupingSummary.byRecommendedOwner`. |
| CP29-R04-05 | Public-safe counts remain zero. | Pass | `scripts/check_cp29_r04_r05_fast_sprint.mjs`. |

## 5. CP29-R05 Regeneration And Diff Proof

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP29-R05-01 | Regeneration proof artifact exists. | Pass | `data/remediation/cp29/regeneration-diff-proof.json`. |
| CP29-R05-02 | CP27 graph/vault deltas are recorded. | Pass | Zero-delta proof: unresolved refs `77 -> 77`, high/critical blockers `30 -> 30`. |
| CP29-R05-03 | CP28 retrieval deltas are recorded. | Pass | Zero-delta proof: candidates `70 -> 70`, remediation `70 -> 70`. |
| CP29-R05-04 | Selected-candidate delta is explicit. | Pass | Selected candidates `0 -> 0`; selected route items `0 -> 0`. |
| CP29-R05-05 | Public-safe counts remain zero. | Pass | `scripts/check_cp29_r04_r05_fast_sprint.mjs`. |

## 6. CP29-R06 Selected-Candidate Unlock Verification

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP29-R06-01 | Selected-candidate unlock proof exists. | Pass | `data/remediation/cp29/selected-candidate-unlock-verification.json`. |
| CP29-R06-02 | Selected candidates have complete operational refs. | Pass | Blocked as expected; selected candidates remain `0`, so no incomplete selected refs are exposed. |
| CP29-R06-03 | Selected route items have validation handoff. | Pass | Blocked as expected; selected route items remain `0`. |
| CP29-R06-04 | Escalation candidates remain excluded from ordinary unlock. | Pass | Escalation leakage into ordinary unlock is `0`. |
| CP29-R06-05 | Public-safe counts remain zero. | Pass | `scripts/check_cp29_r06_r08_combined_close_out.mjs`. |

## 7. CP29-R07 Private Route Readiness Decision

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP29-R07-01 | Private route readiness decision exists. | Pass | `data/remediation/cp29/private-route-readiness-decision.json`. |
| CP29-R07-02 | API/UI route implementation is approved or deferred. | Pass | Deferred because selected route items remain `0`. |
| CP29-R07-03 | Payload caps are documented. | Pass | Selected candidate/route payload caps remain `0`. |
| CP29-R07-04 | No public route is added. | Pass | Route readiness decision keeps `publicRouteExposed: false`. |
| CP29-R07-05 | Public-safe counts remain zero. | Pass | `scripts/check_cp29_r06_r08_combined_close_out.mjs`. |

## 8. CP29-R08 Combined Verification And Close-Out

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP29-R08-01 | Combined verifier exists. | Pass | `scripts/check_cp29_r06_r08_combined_close_out.mjs`. |
| CP29-R08-02 | CP29 final counts are documented. | Pass | `data/remediation/cp29/combined-verification.json`. |
| CP29-R08-03 | Known limitations are documented. | Pass | `CP29_R08_COMBINED_VERIFICATION_AND_CLOSE_OUT.md`; remaining blockers section. |
| CP29-R08-04 | Next scope decision is recorded. | Pass | Next scope: CP30 - Private Guidance Loop Integration. |
| CP29-R08-05 | Public release remains blocked. | Pass | Public-safe candidates/routes remain `0`; public release `false`. |

## 9. Overall Readiness

Current status: CP29-R08 is complete. CP30 should start next.

Recommended next action:

1. Run `node scripts\check_cp29_r06_r08_combined_close_out.mjs`.
2. Start `CP30 - Private Guidance Loop Integration`.
