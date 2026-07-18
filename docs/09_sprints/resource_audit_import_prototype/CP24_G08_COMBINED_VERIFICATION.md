# CP24-G08 - Combined Verification

Date: 2026-07-14

Status: Complete

Scope: Combined verifier for CP22 graph/vault, CP23 reviewer workflow, and CP24 graph-aware retrieval prototype artifacts, private API, and internal UI. This checkpoint does not approve public release.

## 1. Purpose

CP24-G08 provides the one-command proof that the CP24 graph-aware retrieval prototype remains connected to the CP22/CP23 foundations and still respects the private/public boundary.

## 2. Combined Verifier

Command:

```powershell
node scripts\check_cp24_combined_verification.mjs
```

The verifier checks:

- CP22 full private graph and vault combined verification;
- CP23 close-out and combined verification;
- CP24-G07 internal UI verifier;
- CP24 graph-aware retrieval sprint verifier;
- CP24 generated artifact checksums and counts;
- CP24 private API and internal UI route boundaries;
- public-safe zero state across CP22 and CP24.

## 3. Inherited Checks

The combined verifier inherits:

| Check | Command |
| --- | --- |
| CP22 combined graph/vault proof | `node scripts\check_cp22_combined_verification.mjs` |
| CP23 close-out proof | `node scripts\check_cp23_close_out.mjs` |
| CP23 combined reviewer proof | `node scripts\check_cp23_combined_verification.mjs` |
| CP24-G07 UI/API/artifact proof | `node scripts\check_cp24_g07_internal_ui_prototype.mjs` |
| CP24 sprint plan proof | `node scripts\check_cp24_graph_aware_retrieval_plan.mjs` |

## 4. Boundary Checks

G08 verifies:

- selected CP24 candidates have source/provenance/release refs;
- route items remain bounded;
- validation routes keep 11 gate results per fixture;
- remediation items remain private;
- no public CP24 route exists;
- no `.env` file path access is introduced;
- generated candidates and public-boundary artifacts stay `publicSafe: false` or public-safe count zero.

## 5. Current Results

| Count | Value |
| --- | ---: |
| CP24 fixtures | 10 |
| CP24 candidates | 87 |
| Selected candidates | 15 |
| Escalation candidates | 13 |
| Evidence routes | 10 |
| Validation gate results | 110 |
| Remediation items | 72 |
| CP22 graph nodes | 79,657 |
| CP22 graph edges | 147,689 |
| CP22 vault artifacts | 158 |
| Public-safe CP24 candidates | 0 |
| Public-safe CP24 route items | 0 |
| Public-safe CP22 graph/vault artifacts | 0 |

## 6. Public Boundary

G08 preserves:

- `publicSafeCandidateCount: 0`;
- `publicSafeRouteItemCount: 0`;
- `publicSafeNodeCount: 0`;
- `publicSafeEdgeCount: 0`;
- `publicSafeArtifactCount: 0`;
- `publicReleaseApproved: false`;
- `publicRouteExposed: false`.

## 7. Acceptance

CP24-G08 is complete when:

- combined verifier exists;
- CP23 close-out verifier is inherited;
- graph/vault reference checks pass;
- public boundary checks pass;
- generated CP24 artifact checks pass;
- `node scripts\check_cp24_combined_verification.mjs` passes.

Status: complete.
