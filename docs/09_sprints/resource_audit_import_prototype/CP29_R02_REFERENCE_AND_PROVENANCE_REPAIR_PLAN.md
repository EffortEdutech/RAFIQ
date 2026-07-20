# CP29-R02 - Reference And Provenance Repair Plan

Date: 2026-07-18

Status: Complete

Scope: Convert CP29-R01 reference and provenance blocker families into grouped repair targets.

Public release status: Blocked.

## 1. Purpose

CP29-R02 plans the repair work for the blocker families that prevent selected-candidate unlock:

1. `cp27_unresolved_references_present`;
2. `source_or_provenance_gap_fixture`.

This checkpoint does not repair source data, does not regenerate the graph, and does not unlock selected candidates. It makes the repair work measurable and ready for the later regeneration/diff checkpoint.

## 2. Generated Artifacts

| Artifact | Path | Purpose |
| --- | --- | --- |
| Reference/provenance repair plan | `data/remediation/cp29/reference-provenance-repair-plan.json` | Grouped repair targets, owners, operational refs, and regeneration sequence. |
| CP29 manifest | `data/remediation/cp29/manifest.json` | R02 artifact paths and checksums while preserving the R01 baseline pointer. |
| Latest remediation pointer | `data/remediation/cp29/latest-remediation.json` | Current CP29 pointer advanced to R02. |
| Generator | `scripts/generate_cp29_r02_reference_provenance_repair_plan.mjs` | Rebuilds the R02 repair plan from CP29-R01 and CP28 validation handoff. |
| Verifier | `scripts/check_cp29_r02_reference_provenance_repair_plan.mjs` | Verifies R01 continuity, R02 grouping, checksums, docs, and public boundary. |

## 3. Reference Repair Scope

| Metric | Count |
| --- | ---: |
| CP27 unresolved references | 77 |
| CP28 candidates needing reference repair | 70 |
| CP28 selected candidates | 0 |
| CP28 selected route items | 0 |
| Public-safe candidates | 0 |
| Public-safe route items | 0 |

The R02 artifact groups reference repair targets by:

- reason family;
- graph partition;
- source group key;
- regression fixture;
- recommended owner.

## 4. Source And Provenance Gap Scope

| Metric | Count |
| --- | ---: |
| Source/provenance gap candidates | 8 |
| Source/provenance repair source group | `raw_lineage` |
| Selected-candidate unlock allowed at R02 | 0 |

The source/provenance lane is intentionally separate because raw lineage gaps must be repaired in the source/snapshot workflow before graph/vault/retrieval regeneration can safely change selection state.

## 5. Regeneration Boundary

R02 records the repair sequence only:

1. Verify the R02 repair plan.
2. Repair source/provenance metadata in the private source workflow.
3. Regenerate CP26 snapshots if source/provenance metadata changed.
4. Regenerate CP27 graph and vault artifacts.
5. Rerun CP28 retrieval collection, ranking, evidence route, API/UI proof, and combined verification.
6. Generate CP29-R05 regeneration and diff proof before any selected-candidate unlock claim.

## 6. Unlock Boundary

Selected-candidate unlock remains blocked in R02.

Unlock cannot be claimed until:

1. reference/provenance repairs are actually applied;
2. CP27 graph/vault artifacts are regenerated;
3. CP28 retrieval artifacts are rerun;
4. quality blockers are handled in CP29-R03;
5. escalation candidates are separated in CP29-R04;
6. CP29-R05 diff proof shows the new state.

## 7. Public Boundary

CP29-R02 remains private-only:

- public release is not approved;
- no public route is added;
- public-safe candidates remain zero;
- public-safe route items remain zero;
- raw Quran, translation, tafsir, and hadith content bodies are not exported;
- the plan contains operational IDs, source refs, canonical refs, graph refs, edge refs, and vault pack refs only.

## 8. Verification

Run:

```powershell
node scripts\check_cp29_r02_reference_provenance_repair_plan.mjs
```

The verifier regenerates and checks R01 continuity, regenerates R02, validates manifest and pointer checksums, confirms reference/provenance grouping, confirms unlock remains blocked, and confirms public-safe counts remain zero.

## 9. Next Checkpoint

Proceed next with:

```text
CP29-R03 - Quality Review Burn-Down Plan
```

Status: complete.
