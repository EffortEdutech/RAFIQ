# CP29-R03 - Quality Review Burn-Down Plan

Date: 2026-07-18

Status: Complete

Scope: Convert CP29 quality review blockers into private reviewer queues and measurable burn-down targets.

Public release status: Blocked.

## 1. Purpose

CP29-R03 targets the `cp27_quality_state_review_required` blocker family.

This checkpoint creates the quality review burn-down plan only. It does not make reviewer decisions, does not change source data, does not regenerate CP27/CP28 artifacts, and does not unlock selected candidates.

## 2. Generated Artifacts

| Artifact | Path | Purpose |
| --- | --- | --- |
| Quality review burn-down plan | `data/remediation/cp29/quality-review-burn-down-plan.json` | Grouped quality targets, owner queues, burn-down metrics, and unlock boundary. |
| CP29 manifest | `data/remediation/cp29/manifest.json` | R03 artifact paths and checksums while preserving R01/R02 pointers. |
| Latest remediation pointer | `data/remediation/cp29/latest-remediation.json` | Current CP29 pointer advanced to R03. |
| Generator | `scripts/generate_cp29_r03_quality_review_burn_down_plan.mjs` | Rebuilds the R03 quality review plan from CP29-R02 and CP28 validation handoff. |
| Verifier | `scripts/check_cp29_r03_quality_review_burn_down_plan.mjs` | Verifies R02 continuity, R03 grouping, checksums, docs, and public boundary. |

## 3. Quality Review Scope

| Metric | Count |
| --- | ---: |
| Quality review candidates | 38 |
| Critical quality candidates | 15 |
| High quality candidates | 23 |
| Reference overlap candidates | 38 |
| Source/provenance gap overlap candidates | 8 |
| Escalation overlap candidates | 15 |
| Selected candidates | 0 |
| Selected route items | 0 |

R03 groups quality targets by:

- recommended owner;
- severity;
- fixture;
- graph partition;
- source group key.

## 4. Reviewer Queues

| Owner | Candidate count | Role |
| --- | ---: | --- |
| `technical_reviewer` | 16 | Raw lineage, audit, and internal quality-state consistency. |
| `product_owner` | 8 | Safety-sensitive quality blockers and product-boundary decisions. |
| `knowledge_editor` | 7 | Tafsir/content metadata quality review. |
| `scholar_reviewer` | 7 | Hadith-grade or religious-content quality escalation review. |

Reviewer queues are private handoffs. They create work targets and exit criteria only; they do not approve public release or religious authority claims.

## 5. Burn-Down Boundary

R03 records measurable burn-down targets:

| Metric | Current | Target after review and regeneration |
| --- | ---: | ---: |
| Quality review candidates | 38 | 0 |
| High/critical remediation items | 38 | 0 |

The actual delta is not applied in R03. It must be measured after reviewer decisions and regeneration in CP29-R05.

## 6. Unlock Boundary

Selected-candidate unlock remains blocked in R03.

Unlock cannot be claimed until:

1. R02 reference/provenance repairs are applied;
2. R03 quality reviews produce private decisions;
3. R04 separates hadith-grade and safety escalation lanes;
4. CP27/CP28 artifacts are regenerated;
5. CP29-R05 records diff proof;
6. CP29-R06 verifies selected candidates and selected route items.

## 7. Public Boundary

CP29-R03 remains private-only:

- public release is not approved;
- no public route is added;
- public-safe review items remain zero;
- public-safe candidates remain zero;
- public-safe route items remain zero;
- raw Quran, translation, tafsir, and hadith content bodies are not exported.

## 8. Verification

Run:

```powershell
node scripts\check_cp29_r03_quality_review_burn_down_plan.mjs
```

The verifier regenerates and checks R02 continuity, regenerates R03, validates manifest and pointer checksums, confirms owner/severity grouping, confirms burn-down deltas are measurable but unapplied, confirms unlock remains blocked, and confirms public-safe counts remain zero.

## 9. Next Checkpoint

Proceed next with:

```text
CP29-R04 - Escalation Lane Separation
```

Status: complete.
