# CP29 - Retrieval Remediation And Selected-Candidate Unlock Sprint Plan

Date: 2026-07-18

Status: CP29-R08 complete

Scope: Remediate CP27/CP28 blocker families that keep CP28 selected candidates and selected route items at zero, then prove selected-candidate unlock without bypassing validation gates.

Public release status: Blocked.

## 1. Objective

CP29 starts from CP28 close-out.

The goal is to convert CP28's healthy refusal state into an actionable remediation sprint:

```text
blocker baseline -> reference/provenance repair -> quality review -> escalation separation -> regenerate CP27/CP28 -> selected-candidate unlock proof
```

CP29 does not approve public release.

## 2. Baseline

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

## 3. Product Boundaries

1. CP29 may plan and verify remediation of private graph/vault/retrieval blockers.
2. CP29 must not make religious approval, authenticity, public-safe, or public-release claims.
3. Escalation candidates remain separate from ordinary selected-candidate unlock.
4. CP29 must not export raw Quran, translation, tafsir, or hadith text bodies.
5. CP29 must not add a public route.
6. CP29 must not read or print `.env` values, secrets, service-role keys, private tokens, or credentials.

## 4. Implementation Surface

| Surface | Role |
| --- | --- |
| `data/remediation/cp29/` | CP29 remediation baseline, manifests, pointers, and future unlock artifacts. |
| `data/retrieval/cp28/` | CP28 blocker and selected-candidate baseline inputs. |
| `data/graphify/cp27-refresh/` | Refreshed graph blocker inputs and regeneration targets. |
| `data/vault/cp27-refresh/` | Refreshed vault blocker inputs and regeneration targets. |
| `scripts/` | CP29 generators and verifiers. |
| `docs/09_sprints/resource_audit_import_prototype/` | CP29 sprint docs, reports, and acceptance checklist. |

## 5. Checkpoints

### CP29-R01 - Remediation Architecture And Unlock Baseline

Status: Complete. See `CP29_R01_REMEDIATION_ARCHITECTURE_AND_UNLOCK_BASELINE.md`.

Deliverables:

- `scripts/generate_cp29_r01_remediation_unlock_plan.mjs`;
- `scripts/check_cp29_r01_remediation_unlock_plan.mjs`;
- `data/remediation/cp29/remediation-unlock-plan.json`;
- `data/remediation/cp29/manifest.json`;
- `data/remediation/cp29/latest-remediation.json`;
- CP29-R01 report.

### CP29-R02 - Reference And Provenance Repair Plan

Status: Complete. See `CP29_R02_REFERENCE_AND_PROVENANCE_REPAIR_PLAN.md`.

Purpose: target unresolved references and source/provenance gap candidates before any selected-candidate unlock attempt.

Deliverables:

- `scripts/generate_cp29_r02_reference_provenance_repair_plan.mjs`;
- `scripts/check_cp29_r02_reference_provenance_repair_plan.mjs`;
- `data/remediation/cp29/reference-provenance-repair-plan.json`;
- updated `data/remediation/cp29/manifest.json`;
- updated `data/remediation/cp29/latest-remediation.json`;
- CP29-R02 report.

### CP29-R03 - Quality Review Burn-Down Plan

Status: Complete. See `CP29_R03_QUALITY_REVIEW_BURN_DOWN_PLAN.md`.

Purpose: group `review_required` candidates by owner, severity, fixture, graph partition, and source group.

Deliverables:

- `scripts/generate_cp29_r03_quality_review_burn_down_plan.mjs`;
- `scripts/check_cp29_r03_quality_review_burn_down_plan.mjs`;
- `data/remediation/cp29/quality-review-burn-down-plan.json`;
- updated `data/remediation/cp29/manifest.json`;
- updated `data/remediation/cp29/latest-remediation.json`;
- CP29-R03 report.

### CP29-R04 - Escalation Lane Separation

Status: Complete. See `CP29_R04_R05_FAST_SPRINT_ESCALATION_AND_DIFF_PROOF.md`.

Purpose: separate hadith-grade and safety escalation lanes from ordinary selected-candidate unlock.

Deliverables:

- `data/remediation/cp29/escalation-lane-separation.json`;
- R04 section in the fast-sprint report.

### CP29-R05 - Regeneration And Diff Proof

Status: Complete. See `CP29_R04_R05_FAST_SPRINT_ESCALATION_AND_DIFF_PROOF.md`.

Purpose: rerun refreshed graph/vault and CP28 retrieval artifacts after remediation and record deltas.

Fast-sprint note: R05 records a zero-delta proof because no actual source repair, quality decision, escalation decision, CP27 regeneration, or CP28 rerun was applied in this checkpoint.

Deliverables:

- `scripts/generate_cp29_r04_r05_fast_sprint.mjs`;
- `scripts/check_cp29_r04_r05_fast_sprint.mjs`;
- `data/remediation/cp29/regeneration-diff-proof.json`;
- updated `data/remediation/cp29/manifest.json`;
- updated `data/remediation/cp29/latest-remediation.json`;
- CP29-R04/R05 fast-sprint report.

### CP29-R06 - Selected-Candidate Unlock Verification

Status: Complete. See `CP29_R08_COMBINED_VERIFICATION_AND_CLOSE_OUT.md`.

Purpose: prove selected candidates and selected route items can appear only when blocker and validation gates permit.

Fast close-out note: R06 verifies selected-candidate unlock remains blocked as expected because R05 recorded no real remediation/regeneration delta.

### CP29-R07 - Private Route Readiness Decision

Status: Complete. See `CP29_R08_COMBINED_VERIFICATION_AND_CLOSE_OUT.md`.

Purpose: decide whether a real CP28 private source route can be implemented after unlock proof.

Fast close-out note: R07 defers real private selected-evidence route implementation because selected route items remain zero.

### CP29-R08 - Combined Verification And Close-Out

Status: Complete. See `CP29_R08_COMBINED_VERIFICATION_AND_CLOSE_OUT.md`.

Purpose: close CP29 and select the next scope.

Deliverables:

- `scripts/generate_cp29_r06_r08_combined_close_out.mjs`;
- `scripts/check_cp29_r06_r08_combined_close_out.mjs`;
- `data/remediation/cp29/selected-candidate-unlock-verification.json`;
- `data/remediation/cp29/private-route-readiness-decision.json`;
- `data/remediation/cp29/combined-verification.json`;
- updated `data/remediation/cp29/manifest.json`;
- updated `data/remediation/cp29/latest-remediation.json`;
- CP29-R08 close-out report.

## 6. Acceptance Gates

CP29 cannot close unless:

- CP28 close-out remains valid;
- CP29 remediation artifacts have manifests and checksums;
- unresolved reference and quality blocker deltas are visible;
- selected-candidate unlock does not include escalation candidates;
- selected candidates, if any, have validation handoff and complete operational refs;
- public-safe candidate and route item counts remain zero;
- no public route exposes private graph/vault/retrieval/remediation artifacts.

## 7. Recommended Next Action

Proceed next with:

```text
CP30 - Private Guidance Loop Integration
```

Reason: CP29 is complete as a private remediation planning and blocked-unlock proof. CP30 can integrate the private guidance loop while keeping unresolved references, review blockers, escalation separation, and public-release boundaries visible.
