# CP29-R04/R05 Fast Sprint - Escalation And Diff Proof

Date: 2026-07-18

Status: Complete

Scope: Combine CP29-R04 escalation lane separation and CP29-R05 regeneration/diff proof baseline.

Public release status: Blocked.

## 1. Purpose

This fast sprint compresses R04 and R05 without removing their audit boundaries.

R04 separates hadith-grade and safety escalation candidates from ordinary selected-candidate unlock. R05 records the regeneration/diff proof baseline and explicitly confirms no real remediation, regeneration, or unlock delta has been applied yet.

## 2. Generated Artifacts

| Artifact | Path | Purpose |
| --- | --- | --- |
| Escalation lane separation | `data/remediation/cp29/escalation-lane-separation.json` | Separates hadith-grade and safety escalation lanes. |
| Regeneration/diff proof | `data/remediation/cp29/regeneration-diff-proof.json` | Records before/after counts, zero deltas, and preconditions for real regeneration. |
| CP29 manifest | `data/remediation/cp29/manifest.json` | Current CP29 artifact paths and checksums advanced to R05. |
| Latest remediation pointer | `data/remediation/cp29/latest-remediation.json` | Current CP29 pointer advanced to R05. |
| Generator | `scripts/generate_cp29_r04_r05_fast_sprint.mjs` | Rebuilds R04 and R05 fast-sprint artifacts. |
| Verifier | `scripts/check_cp29_r04_r05_fast_sprint.mjs` | Verifies R03 continuity, R04 separation, R05 zero-delta proof, docs, and public boundary. |

## 3. Escalation Lane Separation

| Lane | Owner | Candidate count |
| --- | --- | ---: |
| Hadith-grade uncertainty | `scholar_reviewer` | 7 |
| Safety escalation | `product_owner` | 8 |

All `15` escalation candidates remain excluded from ordinary selected-candidate unlock.

## 4. Regeneration And Diff Proof

R05 records a baseline proof only.

| Metric | Before | After | Delta |
| --- | ---: | ---: | ---: |
| CP27 unresolved references | 77 | 77 | 0 |
| CP27 high/critical blockers | 30 | 30 | 0 |
| CP28 selected candidates | 0 | 0 | 0 |
| CP28 selected route items | 0 | 0 | 0 |
| CP28 remediation items | 70 | 70 | 0 |
| CP28 high/critical remediation items | 38 | 38 | 0 |
| Public-safe candidates | 0 | 0 | 0 |
| Public-safe route items | 0 | 0 | 0 |

This is intentional. R05 does not pretend real repair has happened.

## 5. Preconditions For Real Regeneration

Real regeneration requires:

1. CP29-R02 reference/provenance repairs applied.
2. CP29-R03 quality review decisions recorded.
3. CP29-R04 escalation decisions recorded.
4. CP26 snapshot refresh rerun.
5. CP27 graph/vault refresh rerun.
6. CP28 retrieval artifacts rerun.
7. CP29-R05 diff proof regenerated from the new pointers.

## 6. Unlock Boundary

Selected-candidate unlock remains blocked.

R06 may verify unlock only if future artifacts show real remediation and regeneration deltas. Current R05 proves the opposite: no unlock delta exists yet.

## 7. Public Boundary

CP29-R04/R05 remains private-only:

- public release is not approved;
- no public route is added;
- escalation candidates do not enter ordinary unlock;
- public-safe candidates remain zero;
- public-safe route items remain zero;
- raw Quran, translation, tafsir, and hadith content bodies are not exported.

## 8. Verification

Run:

```powershell
node scripts\check_cp29_r04_r05_fast_sprint.mjs
```

The verifier rebuilds R03 continuity, generates R04/R05 artifacts, validates checksums, confirms escalation separation, confirms zero regeneration deltas, confirms unlock remains blocked, and confirms public-safe counts remain zero.

## 9. Next Checkpoint

Proceed next with:

```text
CP29-R06 - Selected-Candidate Unlock Verification
```

Status: complete.
