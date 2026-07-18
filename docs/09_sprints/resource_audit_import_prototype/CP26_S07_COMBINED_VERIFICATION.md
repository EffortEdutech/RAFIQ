# CP26-S07 - Combined Verification

Date: 2026-07-16

Status: Complete

Owner: RAFIQ private resource graph, live snapshot export, refresh, reviewer workflow, and operations workstream

## 1. Purpose

CP26-S07 provides the one-command verification gate for the CP26 live snapshot export and refresh sprint.

It proves that the inherited CP22, CP23, CP24, and CP25 private graph, retrieval, reviewer, remediation, and audit gates remain covered while the CP26 snapshot, refresh, checksum, rollback, API/UI status, and public-boundary checks remain intact.

CP26-S07 does not approve public release. Public release remains blocked.

## 2. One-Command Verifier

Run:

```powershell
node scripts\check_cp26_s07_combined_verification.mjs
```

The verifier checks inherited close-out gates as persisted boundary proofs instead of recursively invoking earlier combined verifiers. This keeps CP26-S07 usable as a single command while still checking the private/public boundary, stable counts, and close-out status.

The persisted CP22 boundary is checked from:

```text
data/graphify/full-private/manifest.json
data/vault/full-private/manifest.json
docs/09_sprints/resource_audit_import_prototype/CP22_G10_CLOSE_OUT_REPORT.md
```

The persisted CP23 boundary is checked from:

```text
data/review/cp23/manifest.json
docs/09_sprints/resource_audit_import_prototype/CP23_A10_CLOSE_OUT_AND_NEXT_SCOPE_DECISION_REPORT.md
```

The persisted CP24 boundary is checked from:

```text
data/retrieval/cp24/manifest.json
docs/09_sprints/resource_audit_import_prototype/CP24_G09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md
```

The persisted CP25 boundary is checked from:

```text
data/review/cp25/a07-export-manifest.json
docs/09_sprints/resource_audit_import_prototype/CP25_A09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md
```

The combined proof checks:

- persisted CP22 boundary: 79,657 graph nodes, 147,689 graph edges, 158 vault artifacts, and zero public-safe graph nodes, graph edges, or vault artifacts;
- persisted CP23 boundary: 8 audit events, 8 remediation items, 8 open blocking remediation items, private-only;
- persisted CP24 boundary: 10 fixtures, 15 selected candidates, 72 remediation items, zero public-safe candidates, private-only;
- persisted CP25 boundary: 72 audit export events, 72 remediation transitions, 66 unresolved actions, 12 open blockers, zero public-safe candidates and route items, private-only.

The verifier covers these CP26 gates through persisted checkpoint reports, generated artifacts, summary pointers, route-boundary checks, and script-presence checks:

```text
scripts/check_cp26_s01_snapshot_architecture_source_map.mjs
scripts/check_cp26_s02_snapshot_contracts.mjs
scripts/check_cp26_s03_private_snapshot_export.mjs
scripts/check_cp26_s04_refresh_pipeline.mjs
scripts/check_cp26_s05_checksum_diff_rollback.mjs
scripts/check_cp26_s06_private_status_proof.mjs
scripts/generate_cp26_s07_combined_verification.mjs
```

## 3. Generated Verification Summary

CP26-S07 generates:

```text
data/snapshots/cp26/verification/cp26-combined-verification-s07/combined-verification-summary.json
data/snapshots/cp26/latest-verification.json
```

The summary is private-only and records:

| Field | Value |
| --- | ---: |
| Inherited executable verifier scripts | 0 |
| Inherited persisted boundary checks | 4 |
| Total inherited gates | 4 |
| CP26 checkpoint scripts covered | 7 |
| CP22 graph nodes | 79,657 |
| CP22 graph edges | 147,689 |
| CP22 vault artifacts | 158 |
| CP23 open blocking remediation items | 8 |
| CP24 selected candidates | 15 |
| CP24 remediation items | 72 |
| CP25 unresolved actions | 66 |
| CP25 open blockers | 12 |
| Source groups | 13 |
| Snapshot artifacts | 13 |
| Refresh outputs | 4 |
| Total checksum entries | 17 |
| Unchanged entries | 13 |
| Added entries | 4 |
| Changed entries | 0 |
| Removed entries | 0 |
| Stale artifacts | 0 |
| Mismatched artifacts | 0 |
| Unresolved references | 77 |
| High/critical blockers | 30 |
| Public-safe snapshot rows | 0 |
| Public-safe graph nodes | 0 |
| Public-safe graph edges | 0 |
| Public-safe vault artifacts | 0 |

## 4. Public Boundary

The combined verifier checks that:

- `GET /api/private-content/snapshots/cp26` remains the private status route.
- No public CP26 snapshot route exists.
- The internal UI remains inside `/review-workbench`.
- The S06 status payload remains bounded.
- Full source rows, graph dumps, vault dumps, review dumps, and audit dumps are not exposed to the client.
- Public-safe counts remain zero.
- Public release remains blocked.

## 5. Acceptance Result

CP26-S07 acceptance is complete because:

- inherited CP22 through CP25 persisted boundary gates are included;
- CP26-S01 through CP26-S06 checkpoint artifacts and boundaries are included;
- snapshot export and refresh outputs remain checksum-traceable;
- rollback and stale artifact detection remain verified;
- unresolved references and high/critical blockers remain visible;
- public-safe counts remain zero;
- no public snapshot route is introduced;
- no `.env` path access is introduced.

## 6. Next Checkpoint

Proceed next with:

```text
CP26-S08 - Close-Out And Next Scope Decision
```

CP26-S08 should close the sprint, document limitations, preserve the public-release block, and choose the next product-development scope.
