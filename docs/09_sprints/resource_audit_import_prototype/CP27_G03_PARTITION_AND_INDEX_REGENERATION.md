# CP27-G03 - Partition And Index Regeneration From Snapshots

Date: 2026-07-16

Status: Complete

Owner: RAFIQ private resource graph, vault, snapshot refresh, and product intelligence workstream

## 1. Purpose

CP27-G03 consumes the CP27-G02 mapper and generates refreshed private graph partitions and indexes from the CP26 snapshot batch.

This checkpoint proves that snapshot-backed graph structure can be regenerated into deterministic partition and index artifacts. It does not claim full CP22 node/edge parity because CP26-S03 is still a bounded summary snapshot, not a full canonical row export.

## 2. Source Inputs

| Input | Role |
| --- | --- |
| `data/graphify/cp27-refresh/latest-mapper.json` | Latest CP27-G02 mapper pointer. |
| `data/graphify/cp27-refresh/mapper/cp27-g02-snapshot-graph-mapper/mapper-contract.json` | Mapper contract and ID policy. |
| `data/graphify/cp27-refresh/mapper/cp27-g02-snapshot-graph-mapper/source-group-mapping.json` | Source group to partition/node/edge mapping. |
| `data/graphify/full-private/manifest.json` | CP22 graph comparison baseline only. |
| `data/vault/full-private/manifest.json` | CP22 vault comparison baseline only. |

The CP22 baseline remains a comparison input and is not overwritten.

## 3. Generated Artifacts

| Artifact | Purpose |
| --- | --- |
| `data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/manifest.json` | Refreshed graph manifest, counts, checksums, source mapper references, and public boundary. |
| `data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/summary.json` | Compact graph summary for later API/UI status proof. |
| `data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/partitions/*.json` | Refreshed graph partitions generated from the mapper. |
| `data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/indexes/*.json` | Refreshed graph indexes generated from partition nodes and edges. |
| `data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/checksum-ledger.json` | Checksums for manifest, summary, partitions, and indexes. |
| `data/graphify/cp27-refresh/latest-graph.json` | Latest refreshed graph pointer for CP27-G04 and later checkpoints. |

## 4. Generated Counts

| Count | Value |
| --- | ---: |
| Source groups mapped | 13 |
| Partitions generated | 10 |
| Indexes generated | 12 |
| Nodes generated | 147 |
| Edges generated | 125 |
| Deferred items preserved | 3 |
| Blocked items preserved | 1 |
| Unresolved references preserved | 77 |
| High/critical blockers preserved | 30 |

Generated partitions:

```text
governance
hadith
hadith-grades
product-evidence
quality
quran
sources
tafsir
topics
translations
```

Generated indexes:

```text
by-node-id
by-edge-id
by-canonical-ref
by-source-id
by-snapshot-id
by-ayah-key
by-hadith-key
by-topic-key
by-release-state
by-review-state
by-quality-state
public-boundary
```

## 5. Regeneration Boundary

CP27-G03 regenerates graph structure from summary snapshots:

- one or more private snapshot-group nodes per target partition;
- private node-family nodes from CP27-G02 node families;
- private edge-family proof edges from CP27-G02 edge families;
- deterministic indexes over generated nodes and edges;
- checksum proof over every generated graph artifact.

It does not export raw Quran, tafsir, translation, or hadith text bodies.

It does not replace `data/graphify/full-private/`.

It does not approve public release.

## 6. Public Boundary

| Boundary item | Value |
| --- | ---: |
| Public release approved | false |
| Public route exposed | false |
| Raw text bodies exported | false |
| Public-safe snapshot rows | 0 |
| Public-safe graph nodes | 0 |
| Public-safe graph edges | 0 |
| Public-safe vault artifacts | 0 |

## 7. Verification

Verifier:

```powershell
node scripts\check_cp27_g03_partition_index_graph.mjs
```

The verifier:

- runs CP27-G02 verification first;
- regenerates CP27-G03 graph artifacts;
- validates latest graph pointer checksum;
- validates partition and index counts;
- validates checksum ledger entries;
- validates source mapper and CP26 snapshot references;
- validates unresolved references and blockers remain visible;
- validates public-safe counts remain zero.

## 8. Next Checkpoint

Proceed next with:

```text
CP27-G04 - Vault Pack Regeneration From Refreshed Graph
```

CP27-G04 should consume `data/graphify/cp27-refresh/latest-graph.json` and generate private vault packs from the refreshed graph without overwriting the CP22 full-private vault baseline.
