# CP28-R06 - Retrieval Regression Suite And Public-Boundary Verifier

Date: 2026-07-18

Status: Complete

Scope: Provide one combined verifier for CP24 regression, CP27 refreshed inputs, CP28 retrieval artifacts, and public-boundary rules.

## 1. Purpose

CP28-R06 proves that the refreshed retrieval chain remains internally consistent and private-only.

It combines:

- CP24 regression baseline;
- CP27 refreshed graph/vault pointer checks;
- CP28 candidate collection;
- CP28 ranking and explanation;
- CP28 validation handoff;
- CP28 private API/UI proof;
- public-boundary checks.

## 2. Generated Artifacts

| Artifact | Path | Purpose |
| --- | --- | --- |
| Combined verification | `data/retrieval/cp28/combined-verification.json` | Combined CP28 regression and public-boundary proof. |
| Retrieval manifest | `data/retrieval/cp28/manifest.json` | Adds combined verification path, checksum, counts, and verifier pointer. |
| Latest retrieval pointer | `data/retrieval/cp28/latest-retrieval.json` | Advances the CP28 retrieval pointer to CP28-R06. |
| Generator | `scripts/generate_cp28_r06_combined_verification.mjs` | Rebuilds combined verification summary. |
| Verifier | `scripts/check_cp28_combined_verification.mjs` | Runs CP28-R05 verification and validates combined proof. |

## 3. Combined Verifier

Run:

```powershell
node scripts\check_cp28_combined_verification.mjs
```

This command regenerates R05, regenerates R06, validates checksums, verifies counts, and checks public-boundary conditions.

## 4. Inherited Checks

The combined verifier confirms:

- CP24 candidate count remains `87`;
- CP24 selected candidate count remains `15`;
- CP24 public-safe candidate count remains `0`;
- CP27 graph nodes remain `147`;
- CP27 unresolved references remain visible at `77`;
- CP27 high/critical blockers remain visible at `30`;
- CP28 selected candidates and selected route items remain `0`;
- CP28 public-safe candidate and route item counts remain `0`.

## 5. Current Results

| Metric | Count |
| --- | ---: |
| CP28 candidates | 70 |
| Selected candidates | 0 |
| Held candidates | 55 |
| Escalation candidates | 15 |
| Ordinary average score | 15.4 |
| Evidence routes | 10 |
| Selected route items | 0 |
| Review route items | 55 |
| Escalation route items | 15 |
| Remediation items | 70 |
| High/critical remediation items | 38 |
| Private API/UI fixture payloads | 10 |
| Public-safe candidates | 0 |
| Public-safe route items | 0 |

## 6. Public Boundary

CP28-R06 confirms:

- public release remains blocked;
- no public route is exposed;
- public-safe candidate count is zero;
- public-safe route item count is zero;
- CP28 source route remains deferred;
- no raw source text bodies are exported.

## 7. Next Checkpoint

Proceed next with:

```text
CP28-R07 - Close-Out
```

Status: complete.
