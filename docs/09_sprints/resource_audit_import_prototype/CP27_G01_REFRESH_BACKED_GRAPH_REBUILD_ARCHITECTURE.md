# CP27-G01 - Refresh-Backed Graph Rebuild Architecture

Date: 2026-07-16

Status: Complete

Scope: Architecture for rebuilding RAFIQ full private resource graph and vault from CP26 snapshot batches.

## 1. Purpose

CP27-G01 defines how RAFIQ will rebuild the private resource graph and vault from CP26 snapshot artifacts.

The checkpoint is architecture-only. It does not generate a new graph, vault, API route, UI route, or public artifact. It locks the source input, output layout, mapper responsibilities, diff plan, public boundary, and verifier plan before CP27-G02 mapper implementation begins.

Public release remains blocked.

## 2. Controlling Baseline

| Baseline | Value |
| --- | --- |
| Source snapshot batch | `cp26-snapshot-prototype-s03` |
| Source snapshot manifest | `data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json` |
| CP26 close-out | `CP26_S08_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md` |
| CP26 combined verification | `data/snapshots/cp26/verification/cp26-combined-verification-s07/combined-verification-summary.json` |
| CP22 graph baseline | `data/graphify/full-private/manifest.json` |
| CP22 vault baseline | `data/vault/full-private/manifest.json` |

Baseline counts:

| Metric | Value |
| --- | ---: |
| CP22 graph nodes | 79,657 |
| CP22 graph edges | 147,689 |
| CP22 graph partitions | 11 |
| CP22 graph indexes | 12 |
| CP22 vault artifacts | 158 |
| CP26 source groups | 13 |
| CP26 snapshot artifacts | 13 |
| CP26 unresolved references | 77 |
| CP26 high/critical blockers | 30 |
| Public-safe graph nodes | 0 |
| Public-safe graph edges | 0 |
| Public-safe vault artifacts | 0 |

## 3. Architecture

CP27 introduces a refresh-backed graph/vault rebuild pipeline:

```text
CP26 snapshot batch
  -> CP27 snapshot-to-node/edge mapper
  -> refreshed graph partitions
  -> refreshed graph indexes
  -> refreshed graph manifest/checksum ledger
  -> refreshed vault pack generator
  -> refreshed vault manifest/checksum ledger
  -> CP22 baseline diff
  -> CP27 combined verifier
```

The refreshed graph and vault are private derived metadata. They do not become canonical source tables.

## 4. Source Group Mapping Plan

| CP26 source group | CP27 graph role | Expected CP22 baseline partition |
| --- | --- | --- |
| `source_registry` | source, manifest, checksum, attribution, licensing nodes | `sources`, `governance` |
| `raw_lineage` | import, parser, validation, lineage quality nodes | `quality`, `sources` |
| `quran` | Quran identity and ayah metadata nodes | `quran` |
| `translations` | translation edition/text metadata nodes | `translations` |
| `tafsir` | tafsir edition/passage metadata nodes | `tafsir` |
| `topics_themes` | source topic, theme, and ayah group nodes | `topics` |
| `hadith` | hadith collection, edition, record, and reference nodes | `hadith` |
| `hadith_quality` | grade, verification, normalization, and quality nodes | `hadith-grades`, `quality` |
| `cross_domain_links` | Quran/hadith/topic/theme relationship edges | cross-partition edges |
| `private_retrieval` | private retrieval and validation evidence nodes | `product-evidence` |
| `private_review` | private review and remediation state nodes | `product-evidence`, `quality` |
| `private_audit` | audit and decision ledger evidence nodes | `product-evidence`, `quality` |
| `graph_vault_baseline` | baseline comparison and rebuild provenance nodes | `governance`, `sources` |

## 5. Output Policy

CP27 outputs must be written to new refresh-specific locations:

```text
data/graphify/cp27-refresh/
data/vault/cp27-refresh/
data/graphify/cp27-refresh/diff/
```

CP27 must not overwrite:

```text
data/graphify/full-private/
data/vault/full-private/
```

Those folders remain the CP22 comparison baseline until a later explicit close-out promotes a refreshed graph/vault output.

## 6. Manifest Policy

The refreshed graph manifest must record:

- `schemaVersion`;
- `graphId`;
- `sourceSnapshotBatchId`;
- `sourceSnapshotManifestPath`;
- `sourceSnapshotManifestSha256`;
- `baselineGraphManifestPath`;
- `baselineGraphChecksumSha256`;
- partition list with counts and checksums;
- index list with counts and checksums;
- public-boundary counts;
- unresolved/deferred/blocked counts;
- generator script path;
- verification command.

The refreshed vault manifest must record:

- `schemaVersion`;
- `vaultId`;
- `sourceGraphId`;
- `sourceGraphChecksumSha256`;
- `sourceSnapshotBatchId`;
- artifact list with counts and checksums;
- category counts;
- public-boundary counts;
- no-raw-body and no-public-release flags;
- verification command.

## 7. Partition And Index Strategy

The CP27 graph should retain the CP22 partition vocabulary where possible:

```text
sources
governance
quran
translations
tafsir
topics
hadith
hadith-grades
quality
product-evidence
cp21c-reference
```

The CP27 graph should retain the CP22 index vocabulary where possible:

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

If a partition or index cannot be regenerated from CP26 snapshot inputs, CP27-G03 must mark it as `deferred` or `blocked` with a reason. Silent omission is not allowed.

## 8. Diff Strategy

CP27-G05 must compare refreshed outputs against CP22 baseline with these statuses:

| Status | Meaning |
| --- | --- |
| `matched` | Same ID and equivalent checksum/content where applicable. |
| `added` | Present in CP27 but not CP22. |
| `removed` | Present in CP22 but not CP27. |
| `changed` | Same ID but changed content or metadata. |
| `deferred` | Not regenerated because CP26 snapshot lacks sufficient safe source detail. |
| `blocked` | Cannot be regenerated because unresolved references, blockers, or governance constraints prevent it. |

The diff must keep unresolved references and high/critical blockers visible.

## 9. Vault Rebuild Strategy

Vault regeneration must follow the refreshed graph manifest.

The CP27 vault generator may use CP22 vault category vocabulary:

```text
governance
hadith
quality
quran
release-gates
sources
tafsir
topics
validation
```

Vault packs remain review/navigation artifacts only. They must not become canonical source data, must not copy raw Quran/tafsir/translation/hadith text bodies, and must remain `publicSafe=false`.

## 10. Public Boundary

CP27 must preserve:

| Boundary | Required value |
| --- | ---: |
| Public-safe graph nodes | 0 |
| Public-safe graph edges | 0 |
| Public-safe vault artifacts | 0 |
| Public-safe snapshot rows | 0 |
| Public release approved | false |
| Public CP27 graph/vault route exposed | false |

Any change to these values must stop the checkpoint and require a separate Product Owner, rights/attribution, editorial, scholar/content, and security decision.

## 11. Verification Plan

CP27-G01 is verified by:

```powershell
node scripts\check_cp27_g01_refresh_backed_graph_architecture.mjs
```

Future CP27 verifiers should add:

- mapper contract checks;
- graph manifest and checksum checks;
- partition/index checks;
- vault manifest and checksum checks;
- CP22 baseline diff checks;
- public-boundary checks;
- no-secret marker checks;
- internal UI bounded-payload checks if CP27-G06 adds UI proof.

## 12. Next Checkpoint

Proceed next with:

```text
CP27-G02 - Snapshot-To-Node And Snapshot-To-Edge Mapper
```

CP27-G02 should implement the deterministic mapping contract and produce a mapper proof before any refreshed graph partition is promoted as complete.
