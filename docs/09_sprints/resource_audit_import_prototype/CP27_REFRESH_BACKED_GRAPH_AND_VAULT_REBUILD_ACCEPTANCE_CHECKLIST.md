# CP27 - Refresh-Backed Graph And Vault Rebuild Acceptance Checklist

Date: 2026-07-16

Status: CP27 complete; recommended next scope CP28

Scope: Rebuild the full private RAFIQ resource graph and vault from CP26 snapshot batches.

## Status Legend

- Pass: implemented or documented and verified for the checkpoint.
- Fail: implemented or documented but verification failed.
- Not Started: planned but not yet implemented.
- Blocked: cannot proceed without missing input, data, or decision.
- Deferred: intentionally moved outside CP27.

## 1. Program Readiness

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP27-R01 | CP27 is documented as the post-CP26 refresh-backed graph/vault rebuild sprint. | Pass | `CP27_REFRESH_BACKED_GRAPH_AND_VAULT_REBUILD_SPRINT_PLAN.md`. |
| CP27-R02 | CP26 close-out is the controlling baseline. | Pass | `CP26_S08_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`. |
| CP27-R03 | CP22 graph/vault baseline is preserved as comparison input. | Pass | `data/graphify/full-private/manifest.json`; `data/vault/full-private/manifest.json`. |
| CP27-R04 | CP27 remains private-only and does not approve public release. | Pass | CP27 sprint plan product boundaries. |
| CP27-R05 | CP27 public-safe counts are required to remain zero. | Pass | CP27 sprint plan acceptance gates. |

## 2. CP27-G01 Refresh-Backed Graph Rebuild Architecture

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP27-G01-01 | Architecture report is complete. | Pass | `CP27_G01_REFRESH_BACKED_GRAPH_REBUILD_ARCHITECTURE.md`; `scripts/check_cp27_g01_refresh_backed_graph_architecture.mjs`. |
| CP27-G01-02 | Snapshot-to-graph/vault dependency map is complete. | Pass | `CP27_G01_REFRESH_BACKED_GRAPH_REBUILD_ARCHITECTURE.md`; source group mapping table. |
| CP27-G01-03 | Output folder and manifest policy is documented. | Pass | `CP27_G01_REFRESH_BACKED_GRAPH_REBUILD_ARCHITECTURE.md`; output and manifest policy sections. |
| CP27-G01-04 | Partition/index regeneration strategy is documented. | Pass | `CP27_G01_REFRESH_BACKED_GRAPH_REBUILD_ARCHITECTURE.md`; partition and index strategy section. |
| CP27-G01-05 | Diff, public-boundary, and verifier plan is documented. | Pass | `CP27_G01_REFRESH_BACKED_GRAPH_REBUILD_ARCHITECTURE.md`; diff, public boundary, and verification sections. |

## 3. CP27-G02 Snapshot-To-Node And Snapshot-To-Edge Mapper

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP27-G02-01 | Mapper contract exists. | Pass | `CP27_G02_SNAPSHOT_TO_NODE_EDGE_MAPPER.md`; `data/graphify/cp27-refresh/mapper/cp27-g02-snapshot-graph-mapper/mapper-contract.json`; `scripts/check_cp27_g02_snapshot_graph_mapper.mjs`. |
| CP27-G02-02 | Source group to node/edge family mapping exists. | Pass | `data/graphify/cp27-refresh/mapper/cp27-g02-snapshot-graph-mapper/source-group-mapping.json`; all 13 CP26 source groups mapped. |
| CP27-G02-03 | Deterministic ID policy exists. | Pass | `CP27_G02_SNAPSHOT_TO_NODE_EDGE_MAPPER.md`; mapper contract ID policy. |
| CP27-G02-04 | Unmapped/deferred source groups are reported. | Pass | `data/graphify/cp27-refresh/mapper/cp27-g02-snapshot-graph-mapper/deferred-blocked-report.json`; unmapped groups = 0; deferred items = 3; blocked items = 1. |
| CP27-G02-05 | Public-safe counts remain zero. | Pass | `data/graphify/cp27-refresh/latest-mapper.json`; public-safe snapshot rows, graph nodes, graph edges, and vault artifacts remain 0. |

## 4. CP27-G03 Partition And Index Regeneration From Snapshots

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP27-G03-01 | Refreshed graph manifest is generated. | Pass | `CP27_G03_PARTITION_AND_INDEX_REGENERATION.md`; `data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/manifest.json`; `scripts/check_cp27_g03_partition_index_graph.mjs`. |
| CP27-G03-02 | Refreshed partitions are generated. | Pass | `data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/partitions/*.json`; 10 refreshed partitions. |
| CP27-G03-03 | Refreshed indexes are generated. | Pass | `data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/indexes/*.json`; 12 refreshed indexes. |
| CP27-G03-04 | Checksums are generated and verified. | Pass | `data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/checksum-ledger.json`; latest graph pointer checksum verified. |
| CP27-G03-05 | Public-safe graph counts remain zero. | Pass | `data/graphify/cp27-refresh/latest-graph.json`; public-safe graph nodes and edges remain 0. |

## 5. CP27-G04 Vault Pack Regeneration From Refreshed Graph

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP27-G04-01 | Refreshed vault manifest is generated. | Pass | `CP27_G04_VAULT_PACK_REGENERATION.md`; `data/vault/cp27-refresh/vault/cp27-g04-refresh-vault/manifest.json`; `scripts/check_cp27_g04_vault_packs.mjs`. |
| CP27-G04-02 | Refreshed vault packs are generated. | Pass | `data/vault/cp27-refresh/vault/cp27-g04-refresh-vault/packs/**/*.md`; 26 private vault artifacts. |
| CP27-G04-03 | Vault packs reference refreshed graph IDs. | Pass | `data/vault/cp27-refresh/vault/cp27-g04-refresh-vault/manifest.json`; all pack entries include refreshed graph node IDs. |
| CP27-G04-04 | Vault checksums are generated and verified. | Pass | `data/vault/cp27-refresh/vault/cp27-g04-refresh-vault/checksum-ledger.json`; latest vault pointer checksum verified. |
| CP27-G04-05 | Public-safe vault counts remain zero. | Pass | `data/vault/cp27-refresh/latest-vault.json`; public-safe vault artifacts remain 0. |

## 6. CP27-G05 Graph/Vault Diff Proof Against CP22 Baseline

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP27-G05-01 | Graph diff summary is generated. | Pass | `CP27_G05_GRAPH_VAULT_DIFF_PROOF.md`; `data/graphify/cp27-refresh/diff/cp27-g05-graph-vault-baseline-diff/graph-diff-summary.json`; `scripts/check_cp27_g05_graph_vault_diff.mjs`. |
| CP27-G05-02 | Vault diff summary is generated. | Pass | `data/graphify/cp27-refresh/diff/cp27-g05-graph-vault-baseline-diff/vault-diff-summary.json`. |
| CP27-G05-03 | Matched, added, removed, changed, deferred, and blocked counts are visible. | Pass | `data/graphify/cp27-refresh/diff/cp27-g05-graph-vault-baseline-diff/manifest.json`; graph and vault classification counts. |
| CP27-G05-04 | CP22 baseline checksums remain unchanged. | Pass | `data/graphify/cp27-refresh/diff/cp27-g05-graph-vault-baseline-diff/checksum-comparison-ledger.json`; baseline manifest checksums verified. |
| CP27-G05-05 | Public boundary remains blocked. | Pass | `data/graphify/cp27-refresh/diff/cp27-g05-graph-vault-baseline-diff/public-boundary-diff.json`; public release blocked and public-safe counts 0. |

## 7. CP27-G06 Graph/Vault Internal UI Inspection Proof

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP27-G06-01 | Internal status proof exists. | Pass | `CP27_G06_INTERNAL_UI_INSPECTION_PROOF.md`; `data/graphify/cp27-refresh/internal-ui/cp27-g06-internal-ui-inspection-proof/status-proof.json`; `scripts/check_cp27_g06_internal_ui_proof.mjs`. |
| CP27-G06-02 | Refreshed graph/vault counts are visible. | Pass | `GET /api/private-content/knowledge-graphify/cp27`; `apps/mobile/app/knowledge-graphify.tsx`; graph nodes 147, edges 125, vault artifacts 26. |
| CP27-G06-03 | CP22 vs CP27 diff is visible. | Pass | Internal UI and proof show CP22 79,657 nodes / 147,689 edges / 158 vault artifacts versus CP27 147 nodes / 125 edges / 26 vault artifacts. |
| CP27-G06-04 | Full graph/vault dumps are not sent to the client. | Pass | `PrivateCp27InternalUiInspectionResponse.responseBoundary`; static proof flags `fullGraphDumpIncluded: false` and `fullVaultDumpIncluded: false`. |
| CP27-G06-05 | Public-release blocked state remains visible. | Pass | `publicBoundary.publicReleaseApproved: false`; public-safe snapshot rows, graph nodes, graph edges, and vault artifacts remain 0. |

## 8. CP27-G07 Combined Verification And Close-Out

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP27-G07-01 | Combined CP27 verifier exists. | Pass | `scripts/check_cp27_g07_combined_verification.mjs`; `scripts/generate_cp27_g07_combined_verification.mjs`. |
| CP27-G07-02 | Graph/vault rebuild checks pass. | Pass | `node scripts\check_cp27_g07_combined_verification.mjs`; refreshed graph nodes 147, edges 125, vault artifacts 26. |
| CP27-G07-03 | Diff checks pass. | Pass | `data/graphify/cp27-refresh/latest-verification.json`; CP22 baseline comparison remains visible. |
| CP27-G07-04 | Public boundary checks pass. | Pass | Public-safe snapshot rows, graph nodes, graph edges, and vault artifacts remain 0; public release remains blocked. |
| CP27-G07-05 | Close-out and next scope decision are complete. | Pass | `CP27_G07_COMBINED_VERIFICATION_AND_CLOSE_OUT.md`; next scope is CP28. |

## 9. Overall Readiness

Current status: CP27 is complete. CP28 should start next.

Recommended next action:

1. Run `node scripts\check_cp27_g07_combined_verification.mjs`.
2. Start `CP28 - Retrieval Engine Integration From Refreshed Graph`.
