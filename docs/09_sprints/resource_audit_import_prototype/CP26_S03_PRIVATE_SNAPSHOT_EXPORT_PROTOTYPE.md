# CP26-S03 - Private Snapshot Export Prototype

Date: 2026-07-16

Checkpoint: CP26-S03 - Private Snapshot Export Prototype

Status: Complete

## 1. Purpose

CP26-S03 creates the first bounded private snapshot export prototype for RAFIQ's live snapshot and refresh track.

This checkpoint uses checked-in private CP22, CP24, and CP25 artifacts as safe snapshot inputs. It does not connect to a live database, does not read `.env` files, does not export secrets, does not copy raw Quran, tafsir, translation, or hadith text bodies, and does not approve public release.

## 2. Generator

Prototype export command:

```powershell
node scripts\generate_cp26_s03_private_snapshot_export.mjs
```

The generator writes:

```text
data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/
data/snapshots/cp26/latest-manifest.json
```

The batch ID is stable for this prototype:

```text
cp26-snapshot-prototype-s03
```

The timestamp is fixed for deterministic reruns against the same inputs:

```text
2026-07-16T00:00:00.000Z
```

## 3. Generated Artifacts

Primary files:

| Artifact | Path |
| --- | --- |
| Batch manifest | `data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json` |
| Checksum ledger | `data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/checksum-ledger.json` |
| Latest pointer | `data/snapshots/cp26/latest-manifest.json` |

Snapshot files:

| Snapshot group | File |
| --- | --- |
| `source_registry` | `source-registry.snapshot.json` |
| `raw_lineage` | `raw-lineage.snapshot.json` |
| `quran` | `quran.snapshot.json` |
| `translations` | `translations.snapshot.json` |
| `tafsir` | `tafsir.snapshot.json` |
| `topics_themes` | `topics-themes.snapshot.json` |
| `hadith` | `hadith.snapshot.json` |
| `hadith_quality` | `hadith-quality.snapshot.json` |
| `cross_domain_links` | `cross-domain-links.snapshot.json` |
| `private_retrieval` | `private-retrieval.snapshot.json` |
| `private_review` | `private-review.snapshot.json` |
| `private_audit` | `private-audit.snapshot.json` |
| `graph_vault_baseline` | `graph-vault-baseline.snapshot.json` |

## 4. Manifest Summary

The generated manifest records:

```text
schemaVersion: cp26.snapshot-batch-manifest.v1
checkpoint: CP26-S03
sourceCheckpoint: CP26-S01
sourceGroupCount: 13
snapshotArtifactCount: 13
derivedOutputCount: 0
unresolvedReferenceCount: 77
highOrCriticalBlockerCount: 30
publicSafeSnapshotRowCount: 0
publicSafeGraphNodeCount: 0
publicSafeGraphEdgeCount: 0
publicSafeVaultArtifactCount: 0
```

S03 intentionally has `derivedOutputCount: 0` because refresh output generation belongs to CP26-S04.

## 5. Source Coverage

CP26-S03 covers the source groups locked in CP26-S01 and CP26-S02:

| Area | Snapshot handling |
| --- | --- |
| Source registry and manifests | Summarized from CP22 graph source inputs and vault source packs. |
| Raw lineage | Summarized from private graph warnings and quality partition metadata. |
| Quran | Summarized from CP22 Quran partition and ayah index metadata. |
| Translations | Summarized from CP22 translation partition metadata. |
| Tafsir | Summarized from CP22 tafsir partition metadata and quality warnings. |
| Topics/themes | Summarized from CP22 topic partition and topic index metadata. |
| Hadith | Summarized from CP22 hadith partition and hadith index metadata. |
| Hadith quality | Summarized from CP22 hadith-grade and quality partitions. |
| Cross-domain links | Summarized from graph canonical and edge indexes. |
| Private retrieval | Summarized from CP24 retrieval manifest. |
| Private review | Summarized from CP25 review/remediation manifest. |
| Private audit | Summarized from CP25 audit and A07 export manifests. |
| Graph/vault baseline | Summarized from CP22 graph and vault manifests. |

## 6. Public Boundary

Public release remains blocked.

The generated manifest, source snapshots, checksum ledger, and latest pointer all carry:

- `privateOnly: true`;
- `publicReleaseApproved: false`;
- `publicRouteExposed: false`;
- public-safe counts remain zero.

CP26-S03 snapshot rows are private operational summaries. They are not canonical source replacements and are not public study-pack material.

## 7. Verification

CP26-S03 is verified by:

```powershell
node scripts\check_cp26_s03_private_snapshot_export.mjs
```

The verifier:

- confirms the CP26-S02 contract report is complete;
- reruns the S03 generator;
- verifies the batch manifest, checksum ledger, latest pointer, and all 13 snapshot files;
- recomputes snapshot and ledger checksums;
- verifies private-only and public-safe zero boundaries;
- verifies sprint plan and checklist status;
- confirms no quoted `.env` path access is introduced.

## 8. Completion Statement

CP26-S03 is complete.

Next checkpoint:

```text
CP26-S04 - Refresh Pipeline Prototype
```
