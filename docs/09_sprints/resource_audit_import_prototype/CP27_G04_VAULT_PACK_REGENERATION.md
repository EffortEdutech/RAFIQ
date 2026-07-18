# CP27-G04 - Vault Pack Regeneration From Refreshed Graph

Date: 2026-07-17

Status: Complete

Owner: RAFIQ private resource graph, vault, snapshot refresh, and product intelligence workstream

## 1. Purpose

CP27-G04 consumes the CP27-G03 refreshed graph and generates private Knowledge Vault packs from it.

This checkpoint proves that vault review/navigation artifacts can be regenerated from the snapshot-backed refreshed graph. It does not claim CP22 vault parity because CP27-G03 is still generated from CP26 summary snapshots.

## 2. Source Inputs

| Input | Role |
| --- | --- |
| `data/graphify/cp27-refresh/latest-graph.json` | Latest CP27-G03 refreshed graph pointer. |
| `data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/manifest.json` | Source graph manifest. |
| `data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/partitions/*.json` | Source graph partition nodes and edges. |
| `data/vault/full-private/manifest.json` | CP22 vault comparison baseline only. |

The CP22 vault baseline remains a comparison input and is not overwritten.

## 3. Generated Artifacts

| Artifact | Purpose |
| --- | --- |
| `data/vault/cp27-refresh/vault/cp27-g04-refresh-vault/manifest.json` | Refreshed vault manifest, counts, source graph references, and public boundary. |
| `data/vault/cp27-refresh/vault/cp27-g04-refresh-vault/summary.json` | Compact vault summary for later API/UI status proof. |
| `data/vault/cp27-refresh/vault/cp27-g04-refresh-vault/packs/**/*.md` | Private vault packs generated from refreshed graph nodes. |
| `data/vault/cp27-refresh/vault/cp27-g04-refresh-vault/checksum-ledger.json` | Checksums for manifest, summary, and vault packs. |
| `data/vault/cp27-refresh/latest-vault.json` | Latest refreshed vault pointer for CP27-G05 and later checkpoints. |

## 4. Generated Counts

| Count | Value |
| --- | ---: |
| Vault artifacts | 26 |
| Vault categories | 4 |
| Source graph nodes | 147 |
| Source graph edges | 125 |
| Graph nodes referenced | 147 |
| Public-safe vault artifacts | 0 |
| Public-safe graph nodes | 0 |
| Public-safe graph edges | 0 |
| Unresolved references preserved | 77 |
| High/critical blockers preserved | 30 |

Generated categories:

| Category | Artifacts |
| --- | ---: |
| `release-gates` | 2 |
| `partitions` | 10 |
| `source-groups` | 13 |
| `quality` | 1 |

## 5. Vault Boundary

CP27-G04 vault packs are private review and navigation artifacts:

- they are not canonical source data;
- they do not copy raw Quran, tafsir, translation, or hadith text bodies;
- they do not approve public release;
- they do not overwrite `data/vault/full-private`;

CP27-G04 does not overwrite `data/vault/full-private`; the CP22 vault baseline is read only as a comparison input.
- they preserve unresolved reference and blocker visibility.

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
node scripts\check_cp27_g04_vault_packs.mjs
```

The verifier:

- runs CP27-G03 verification first;
- regenerates CP27-G04 vault artifacts;
- validates latest vault pointer checksum;
- validates vault manifest, summary, pack, and checksum-ledger counts;
- validates source graph references;
- validates CP22 vault baseline is read as comparison input only;
- validates unresolved references and blockers remain visible;
- validates public-safe counts remain zero.

## 8. Next Checkpoint

Proceed next with:

```text
CP27-G05 - Graph/Vault Diff Proof Against CP22 Baseline
```

CP27-G05 should compare CP27 refreshed graph and vault outputs against the CP22 full-private baselines and classify differences as `matched`, `added`, `removed`, `changed`, `deferred`, or `blocked`.
