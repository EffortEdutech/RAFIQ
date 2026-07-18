# CP26-S02 - Snapshot Contracts And Manifest Schema

Date: 2026-07-16

Checkpoint: CP26-S02 - Snapshot Contracts And Manifest Schema

Status: Complete

## 1. Purpose

CP26-S02 turns the CP26-S01 snapshot architecture into explicit shared contracts for private snapshot batches, source groups, artifact references, checksum ledgers, refresh runs, unresolved-reference reports, rollback manifests, and snapshot status responses.

This checkpoint defines contracts only. It does not export live database rows, refresh generated artifacts, expose public routes, or approve public release.

## 2. Baseline

CP26-S02 inherits:

```powershell
node scripts\check_cp26_s01_snapshot_architecture_source_map.mjs
```

The controlling source map remains `CP26_S01_SNAPSHOT_ARCHITECTURE_AND_SOURCE_MAP.md`.

## 3. Shared TypeScript Contracts

The following contracts are defined in `packages/shared/src/private-content.ts`:

| Contract | Purpose |
| --- | --- |
| `PrivateCp26SnapshotGroupKey` | Enumerates the 13 snapshot source groups locked in CP26-S01. |
| `PrivateCp26ArtifactFamily` | Classifies snapshot, graph, vault, retrieval, review, audit, remediation, diff, rollback, and unresolved-reference artifacts. |
| `PrivateCp26PublicBoundaryStatus` | Locks the private/public boundary with public-safe counts at zero. |
| `PrivateCp26SnapshotArtifactRef` | Describes a checksummed private artifact with canonical, graph, edge, and vault refs. |
| `PrivateCp26SnapshotSourceGroup` | Describes one bounded source snapshot group and its source tables/files. |
| `PrivateCp26ChecksumLedgerEntry` | Describes one checksum entry and change status. |
| `PrivateCp26ChecksumLedger` | Describes the checksum ledger for a snapshot batch. |
| `PrivateCp26SnapshotBatchManifest` | Describes the top-level CP26 snapshot batch manifest. |
| `PrivateCp26RefreshRun` | Describes a refresh run consuming a snapshot batch. |
| `PrivateCp26UnresolvedReference` | Describes one unresolved reference found during export or refresh. |
| `PrivateCp26UnresolvedReferenceReport` | Describes unresolved-reference counts and blocking status. |
| `PrivateCp26RollbackManifest` | Describes generated-artifact rollback steps. |
| `PrivateCp26SnapshotStatusResponse` | Describes the future private API/status response shape. |

## 4. Snapshot Batch Manifest Contract

`PrivateCp26SnapshotBatchManifest` is the top-level contract for `data/snapshots/cp26/batches/<batch>/manifest.json`.

Required boundaries:

- `schemaVersion: 'cp26.snapshot-batch-manifest.v1'`;
- `sourceCheckpoint: 'CP26-S01'`;
- `privateOnly: true`;
- `publicReleaseApproved: false`;
- `sourceGroups` must contain bounded `PrivateCp26SnapshotSourceGroup` entries;
- `artifactRefs` and `derivedOutputs` must use `PrivateCp26SnapshotArtifactRef`;
- `checksumLedgerPath` and `checksumLedgerSha256` are required;
- public-safe counts must remain zero.

Required counts:

- `sourceGroupCount`;
- `snapshotArtifactCount`;
- `derivedOutputCount`;
- `unresolvedReferenceCount`;
- `highOrCriticalBlockerCount`;
- zero public-safe graph, vault, and snapshot counts.

## 5. Source Snapshot Metadata Contract

`PrivateCp26SnapshotSourceGroup` records:

- snapshot group key;
- source tables;
- source files;
- snapshot output path;
- schema version;
- row count;
- checksum;
- canonical ref count;
- provenance ref count;
- release state ref count;
- unresolved reference count;
- quality warning count;
- public boundary status;
- warnings.

The contract keeps canonical refs separate from graph/vault IDs by design. Snapshot source groups are source metadata and bounded content slices, not graph nodes.

## 6. Checksum Ledger Contract

`PrivateCp26ChecksumLedger` records:

- `schemaVersion: 'cp26.checksum-ledger.v1'`;
- `sourceSnapshotBatchId`;
- `generatedAt`;
- `generatedBy`;
- `algorithm: 'sha256'`;
- checksum entries;
- status counts for `new`, `unchanged`, `changed`, `removed`, `missing`, and `stale`;
- public boundary status.

Every `PrivateCp26ChecksumLedgerEntry` must point to a `PrivateCp26SnapshotArtifactRef`.

## 7. Refresh Run Contract

`PrivateCp26RefreshRun` records:

- refresh run ID;
- source snapshot batch ID;
- source snapshot manifest path;
- source snapshot manifest checksum;
- checkpoint;
- started/completed timestamps;
- generated-by command or tool;
- status;
- refreshed outputs;
- unresolved-reference report path;
- rollback manifest path;
- output and blocker counts;
- public boundary status.

Refresh statuses are:

```text
not_started
running
pass
fail
blocked
rolled_back
```

## 8. Public Boundary Contract

`PrivateCp26PublicBoundaryStatus` requires:

- `privateOnly: true`;
- `publicReleaseApproved: false`;
- `publicRouteExposed: false`;
- `publicSafeChangeRequested: false`;
- all public-safe snapshot, graph, vault, retrieval, route, review, and audit counts set to `0`;
- a human-readable boundary message.

This contract must be embedded in source groups, artifact refs, manifests, checksum ledgers, refresh runs, unresolved-reference reports, rollback manifests, and status responses.

## 9. Error, Unresolved Reference, And Rollback Contracts

`PrivateCp26UnresolvedReferenceReport` records unresolved source, provenance, release-state, canonical, graph, vault, retrieval, review, audit, and remediation references.

Each unresolved reference records:

- reference ID;
- reference type;
- snapshot group;
- severity;
- blocking status;
- message;
- affected artifact IDs.

`PrivateCp26RollbackManifest` is limited to generated private artifacts only. It is not a database rollback and not a git reset.

Rollback target:

```text
generated_private_artifacts_only
```

## 10. Private Status Response Contract

`PrivateCp26SnapshotStatusResponse` defines a future private status payload for:

```text
GET /api/private-content/snapshots/cp26
```

This route is not implemented in CP26-S02. The contract exists so CP26-S06 can implement or prove the private status surface without inventing payload shape later.

## 11. Verification

CP26-S02 is verified by:

```powershell
node scripts\check_cp26_s02_snapshot_contracts.mjs
```

The verifier confirms:

- CP26-S01 still passes;
- S02 report exists and records complete status;
- all CP26 shared TypeScript contract names are exported;
- private/public boundary literal values are locked;
- the route is private-only;
- the sprint plan marks S02 complete and S03 next;
- the checklist marks all S02 rows as Pass;
- no `.env` access is introduced.

## 12. Completion Statement

CP26-S02 is complete.

Next checkpoint:

```text
CP26-S03 - Private Snapshot Export Prototype
```
