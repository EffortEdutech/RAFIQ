# CP27-G05 - Graph/Vault Diff Proof Against CP22 Baseline

Date: 2026-07-17

Status: Complete

Owner: RAFIQ private resource graph, vault, snapshot refresh, and product intelligence workstream

## 1. Purpose

CP27-G05 compares the CP27 refreshed graph and vault outputs against the CP22 full-private baselines.

This checkpoint proves that differences are visible, classified, checksummed, and bounded. It does not claim CP22 parity because CP27-G03 and CP27-G04 are generated from CP26 summary snapshots.

## 2. Source Inputs

| Input | Role |
| --- | --- |
| `data/graphify/full-private/manifest.json` | CP22 graph baseline. |
| `data/vault/full-private/manifest.json` | CP22 vault baseline. |
| `data/graphify/cp27-refresh/latest-graph.json` | CP27 refreshed graph pointer. |
| `data/vault/cp27-refresh/latest-vault.json` | CP27 refreshed vault pointer. |

## 3. Generated Artifacts

| Artifact | Purpose |
| --- | --- |
| `data/graphify/cp27-refresh/diff/cp27-g05-graph-vault-baseline-diff/graph-diff-summary.json` | CP22 graph versus CP27 graph diff. |
| `data/graphify/cp27-refresh/diff/cp27-g05-graph-vault-baseline-diff/vault-diff-summary.json` | CP22 vault versus CP27 vault diff. |
| `data/graphify/cp27-refresh/diff/cp27-g05-graph-vault-baseline-diff/checksum-comparison-ledger.json` | Baseline and refreshed manifest checksum comparison. |
| `data/graphify/cp27-refresh/diff/cp27-g05-graph-vault-baseline-diff/public-boundary-diff.json` | Public-safe and public-release boundary comparison. |
| `data/graphify/cp27-refresh/diff/cp27-g05-graph-vault-baseline-diff/manifest.json` | Diff proof manifest. |
| `data/graphify/cp27-refresh/latest-diff.json` | Latest diff pointer. |

## 4. Diff Statuses

CP27-G05 uses these statuses:

- `matched`;
- `added`;
- `removed`;
- `changed`;
- `deferred`;
- `blocked`.

`deferred` is used where full parity depends on a future full canonical row snapshot. `blocked` is used for public release.

## 5. Graph Diff Summary

| Count | CP22 baseline | CP27 refreshed | Delta |
| --- | ---: | ---: | ---: |
| Graph nodes | 79,657 | 147 | -79,510 |
| Graph edges | 147,689 | 125 | -147,564 |
| Partitions | 11 | 10 | -1 |
| Indexes | 12 | 12 | 0 |
| Public-safe graph nodes | 0 | 0 | 0 |
| Public-safe graph edges | 0 | 0 | 0 |

The large node and edge delta is expected at this checkpoint. CP27 currently proves the refresh-backed pathway from summary snapshots; it is not CP22 parity.

## 6. Vault Diff Summary

| Count | CP22 baseline | CP27 refreshed | Delta |
| --- | ---: | ---: | ---: |
| Vault artifacts | 158 | 26 | -132 |
| Vault categories | 9 | 4 | -5 |
| Public-safe vault artifacts | 0 | 0 | 0 |

The vault delta is expected because CP27-G04 generated review/navigation packs from the CP27 summary refreshed graph.

## 7. Public Boundary

| Boundary item | Value |
| --- | ---: |
| Public release approved | false |
| Public route exposed | false |
| Public-safe snapshot rows | 0 |
| Public-safe graph nodes | 0 |
| Public-safe graph edges | 0 |
| Public-safe vault artifacts | 0 |
| Unresolved references | 77 |
| High/critical blockers | 30 |

## 8. Verification

Verifier:

```powershell
node scripts\check_cp27_g05_graph_vault_diff.mjs
```

The verifier:

- runs CP27-G04 verification first;
- regenerates CP27-G05 diff artifacts;
- verifies latest diff pointer checksum;
- verifies graph and vault diff counts;
- verifies required diff statuses are present;
- verifies checksum comparison entries;
- verifies public-safe counts remain zero.

## 9. Next Checkpoint

Proceed next with:

```text
CP27-G06 - Graph/Vault Internal UI Inspection Proof
```

CP27-G06 should make the CP27 graph, vault, and diff state inspectable in RAFIQ internal UX without sending full private graph or vault dumps to the client.
