# CP26-S05 - Checksum, Diff, And Rollback Proof

Date: 2026-07-16

Checkpoint: CP26-S05 - Checksum, Diff, And Rollback Proof

Status: Complete

## 1. Purpose

CP26-S05 proves that RAFIQ's private CP26 snapshot and refresh outputs can be audited, compared, and rolled back safely at the generated-artifact layer.

This checkpoint does not delete artifacts, does not mutate canonical Quran, tafsir, translation, hadith, grade, verification, provenance, reviewer, remediation, or audit tables, does not read `.env` files, does not export secrets, and does not approve public release.

## 2. Generator

Prototype proof command:

```powershell
node scripts\generate_cp26_s05_checksum_diff_rollback.mjs
```

The generator reads:

```text
data/snapshots/cp26/latest-manifest.json
data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/checksum-ledger.json
data/snapshots/cp26/latest-refresh.json
data/snapshots/cp26/refresh/cp26-refresh-prototype-s04/refresh-run.json
```

The generator writes:

```text
data/snapshots/cp26/diff/cp26-checksum-diff-rollback-proof-s05/
data/snapshots/cp26/latest-diff.json
```

## 3. Generated Artifacts

| Artifact | Path |
| --- | --- |
| Proof manifest | `data/snapshots/cp26/diff/cp26-checksum-diff-rollback-proof-s05/manifest.json` |
| Before/after checksum ledger | `data/snapshots/cp26/diff/cp26-checksum-diff-rollback-proof-s05/checksum-comparison-ledger.json` |
| Snapshot diff summary | `data/snapshots/cp26/diff/cp26-checksum-diff-rollback-proof-s05/snapshot-diff-summary.json` |
| Artifact diff summary | `data/snapshots/cp26/diff/cp26-checksum-diff-rollback-proof-s05/artifact-diff-summary.json` |
| Rollback manifest | `data/snapshots/cp26/diff/cp26-checksum-diff-rollback-proof-s05/rollback-manifest.json` |
| Stale artifact detection proof | `data/snapshots/cp26/diff/cp26-checksum-diff-rollback-proof-s05/stale-artifact-detection.json` |
| Latest diff pointer | `data/snapshots/cp26/latest-diff.json` |

## 4. Proof Summary

The generated proof manifest records:

```text
schemaVersion: cp26.checksum-diff-rollback-proof-manifest.v1
checkpoint: CP26-S05
sourceSnapshotBatchId: cp26-snapshot-prototype-s03
refreshRunId: cp26-refresh-prototype-s04
beforeSnapshotEntryCount: 13
afterRefreshEntryCount: 4
totalChecksumEntryCount: 17
unchangedCount: 13
addedCount: 4
changedCount: 0
removedCount: 0
staleArtifactCount: 0
mismatchedArtifactCount: 0
detectedMismatchProbeCount: 1
rollbackStepCount: 6
unresolvedReferenceCount: 77
highOrCriticalBlockerCount: 30
publicSafeSnapshotRowCount: 0
publicSafeGraphNodeCount: 0
publicSafeGraphEdgeCount: 0
publicSafeVaultArtifactCount: 0
```

The `detectedMismatchProbeCount: 1` entry is an intentional verifier probe that proves the stale/mismatch detector recognizes a bad expected checksum. It does not mean a real RAFIQ artifact is mismatched.

## 5. Rollback Boundary

Rollback target:

```text
generated_private_artifacts_only
```

The rollback manifest is a private operational procedure. It only covers generated CP26 refresh outputs and the latest refresh pointer. It does not roll back Git, database tables, source snapshots, reviewer audit history, remediation history, Quran content, tafsir content, translation content, hadith content, or public routes.

The rollback manifest preserves the 13 S03 snapshot artifact refs as the prior protected baseline and records explicit restore steps for:

- four S04 refreshed outputs;
- the latest refresh pointer;
- the refresh run status marker.

## 6. Public Boundary

Public release remains blocked.

The proof manifest, checksum comparison ledger, diff summaries, rollback manifest, stale artifact detection report, and latest diff pointer all carry:

- `privateOnly: true`;
- `publicReleaseApproved: false`;
- `publicRouteExposed: false`;
- public-safe counts remain zero.

CP26-S05 output is private operations proof. It is not a public resource graph, public vault, public retrieval surface, or public release approval.

## 7. Verification

CP26-S05 is verified by:

```powershell
node scripts\check_cp26_s05_checksum_diff_rollback.mjs
```

The verifier:

- regenerates the S04 refresh outputs;
- regenerates the S05 checksum, diff, and rollback proof;
- recomputes checksums for every S03 snapshot and S04 refreshed artifact;
- verifies unchanged, added, changed, removed, stale, mismatched, unresolved, and blocker counts;
- verifies rollback target and restore steps;
- verifies intentional stale/mismatch probe detection;
- verifies private-only and public-safe zero boundaries;
- verifies sprint plan and checklist status;
- confirms no quoted `.env` path access is introduced.

## 8. Completion Statement

CP26-S05 is complete.

Next checkpoint:

```text
CP26-S06 - Private API And Internal UI Status Proof
```
