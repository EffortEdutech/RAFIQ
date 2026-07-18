# CP27-G02 - Snapshot-To-Node And Snapshot-To-Edge Mapper

Date: 2026-07-16

Status: Complete

Owner: RAFIQ private resource graph, vault, snapshot refresh, and product intelligence workstream

## 1. Purpose

CP27-G02 defines and prototypes the deterministic mapper from the CP26 private snapshot batch into CP27 graph node families and edge families.

This checkpoint does not generate refreshed partitions, refreshed indexes, vault packs, or graph/vault diffs. Those begin in CP27-G03.

## 2. Source Inputs

| Input | Role |
| --- | --- |
| `data/snapshots/cp26/latest-manifest.json` | Latest private snapshot pointer. |
| `data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json` | Source snapshot manifest. |
| `data/graphify/full-private/manifest.json` | CP22 graph comparison baseline only. |
| `data/vault/full-private/manifest.json` | CP22 vault comparison baseline only. |

The CP22 baseline folders remain read-only comparison inputs for CP27. CP27-G02 writes only to `data/graphify/cp27-refresh/`.

## 3. Generated Artifacts

| Artifact | Purpose |
| --- | --- |
| `data/graphify/cp27-refresh/mapper/cp27-g02-snapshot-graph-mapper/mapper-contract.json` | Mapper contract, ID policy, counts, public boundary, and baseline references. |
| `data/graphify/cp27-refresh/mapper/cp27-g02-snapshot-graph-mapper/source-group-mapping.json` | Per-source-group mapping from CP26 snapshot group to CP27 partitions, node families, edge families, and indexes. |
| `data/graphify/cp27-refresh/mapper/cp27-g02-snapshot-graph-mapper/node-edge-plan.json` | Consolidated node-family, edge-family, partition, and index plan for CP27-G03. |
| `data/graphify/cp27-refresh/mapper/cp27-g02-snapshot-graph-mapper/deferred-blocked-report.json` | Unmapped, deferred, blocked, unresolved-reference, and blocker proof. |
| `data/graphify/cp27-refresh/mapper/cp27-g02-snapshot-graph-mapper/checksum-ledger.json` | Checksums for mapper artifacts. |
| `data/graphify/cp27-refresh/latest-mapper.json` | Latest mapper pointer for later CP27 steps. |

## 4. Mapper Contract

The mapper contract is private-only and binds:

- source snapshot batch: `cp26-snapshot-prototype-s03`;
- source snapshot manifest checksum from the latest CP26 pointer;
- CP22 graph and vault manifests as comparison baselines only;
- CP27 output area: `data/graphify/cp27-refresh/`;
- CP22-compatible partition and index vocabulary where possible;
- public release blocked state.

CP27-G02 maps all 13 CP26 source groups:

| Source group | Target partitions | Baseline comparison mode |
| --- | --- | --- |
| `source_registry` | `sources`, `governance` | `matched` |
| `raw_lineage` | `quality`, `sources` | `deferred` |
| `quran` | `quran` | `matched` |
| `translations` | `translations` | `matched` |
| `tafsir` | `tafsir` | `matched` |
| `topics_themes` | `topics` | `matched` |
| `hadith` | `hadith` | `matched` |
| `hadith_quality` | `hadith-grades`, `quality` | `matched` |
| `cross_domain_links` | `quran`, `hadith`, `topics`, `product-evidence` | `changed` |
| `private_retrieval` | `product-evidence` | `changed` |
| `private_review` | `product-evidence`, `quality` | `added` |
| `private_audit` | `product-evidence`, `quality` | `added` |
| `graph_vault_baseline` | `governance`, `sources` | `matched` |

## 5. Deterministic ID Policy

Canonical refs remain authoritative. Graph IDs are derived private metadata.

Node ID template:

```text
cp27:{partition}:{sourceGroupKey}:{entityFamily}:{stableKey}
```

Edge ID template:

```text
cp27:edge:{relationshipFamily}:{sha256(fromId + toId).slice(0,16)}
```

CP27-G02 keeps CP27 mapper IDs namespaced. CP27-G03 may preserve or rebuild exact CP22-compatible graph IDs only where canonical refs and partition semantics can be proven equivalent.

## 6. Deferred And Blocked Items

No source group is unmapped.

Deferred items:

- raw Quran, translation, tafsir, and hadith text body expansion;
- record-level raw lineage expansion;
- live provenance and release-state row expansion.

Blocked item:

- public-safe export remains blocked for every source group.

The mapper preserves the CP26 unresolved reference and blocker counts:

| Count | Value |
| --- | ---: |
| Unresolved references | 77 |
| High/critical blockers | 30 |

## 7. Public Boundary

| Boundary item | Value |
| --- | ---: |
| Public release approved | false |
| Public route exposed | false |
| Public-safe snapshot rows | 0 |
| Public-safe graph nodes | 0 |
| Public-safe graph edges | 0 |
| Public-safe vault artifacts | 0 |

## 8. Verification

Verifier:

```powershell
node scripts\check_cp27_g02_snapshot_graph_mapper.mjs
```

The verifier:

- runs CP27-G01 verification first;
- regenerates CP27-G02 mapper artifacts;
- validates latest snapshot pointer checksum;
- validates source group mapping coverage;
- validates deterministic ID policy;
- validates deferred and blocked reporting;
- validates checksum ledger entries;
- validates public-safe counts remain zero.

## 9. Next Checkpoint

Proceed next with:

```text
CP27-G03 - Partition And Index Regeneration From Snapshots
```

CP27-G03 should consume `data/graphify/cp27-refresh/latest-mapper.json` and generate refreshed graph partitions and indexes without overwriting the CP22 full-private baseline.
