# CP27-G07 - Combined Verification And Close-Out

Date: 2026-07-17

Status: Complete

Scope: CP27 refresh-backed graph and vault rebuild close-out.

## 1. Close-Out Decision

CP27 is complete for private refresh-backed graph and vault rebuild prototype use.

CP27 proves that RAFIQ can rebuild a private graph and private vault from CP26 snapshot-derived mapping outputs, compare the refreshed graph/vault against the CP22 baseline, expose the refreshed state through bounded internal UI inspection, and preserve public-boundary controls.

CP27 does not approve public release. Public release remains blocked.

## 2. Delivered Checkpoints

| Checkpoint | Status | Primary evidence |
| --- | --- | --- |
| CP27-G01 - Refresh-Backed Graph Rebuild Architecture | Complete | `CP27_G01_REFRESH_BACKED_GRAPH_REBUILD_ARCHITECTURE.md` |
| CP27-G02 - Snapshot-To-Node And Snapshot-To-Edge Mapper | Complete | `CP27_G02_SNAPSHOT_TO_NODE_EDGE_MAPPER.md` |
| CP27-G03 - Partition And Index Regeneration From Snapshots | Complete | `CP27_G03_PARTITION_AND_INDEX_REGENERATION.md` |
| CP27-G04 - Vault Pack Regeneration From Refreshed Graph | Complete | `CP27_G04_VAULT_PACK_REGENERATION.md` |
| CP27-G05 - Graph/Vault Diff Proof Against CP22 Baseline | Complete | `CP27_G05_GRAPH_VAULT_DIFF_PROOF.md` |
| CP27-G06 - Graph/Vault Internal UI Inspection Proof | Complete | `CP27_G06_INTERNAL_UI_INSPECTION_PROOF.md` |
| CP27-G07 - Combined Verification And Close-Out | Complete | This report |

## 3. Final Proof Command

Use this command as the CP27 close-out proof:

```powershell
node scripts\check_cp27_g07_combined_verification.mjs
```

The close-out verifier includes the CP27-G06 internal UI proof command:

```powershell
node scripts\check_cp27_g06_internal_ui_proof.mjs
```

## 4. Final Artifact Counts

| Metric | Value |
| --- | ---: |
| CP26 source groups mapped | 13 |
| CP27 refreshed graph nodes | 147 |
| CP27 refreshed graph edges | 125 |
| CP27 graph partitions | 10 |
| CP27 graph indexes | 12 |
| CP27 vault artifacts | 26 |
| CP27 vault categories | 4 |
| CP27 graph nodes referenced by vault | 147 |
| CP27 unresolved references | 77 |
| CP27 high/critical blockers | 30 |
| Public-safe snapshot rows | 0 |
| Public-safe graph nodes | 0 |
| Public-safe graph edges | 0 |
| Public-safe vault artifacts | 0 |

CP22 baseline comparison remains intentionally visible:

| Metric | CP22 baseline | CP27 refreshed |
| --- | ---: | ---: |
| Graph nodes | 79,657 | 147 |
| Graph edges | 147,689 | 125 |
| Vault artifacts | 158 | 26 |

## 5. Product Boundary

CP27 remains private-only:

- CP26 snapshot artifacts are private operational inputs;
- CP27 graph and vault artifacts are derived private metadata;
- canonical Quran, tafsir, translation, hadith, provenance, release-state, and review tables remain authoritative;
- CP22 full-private graph and vault are preserved as comparison baselines only;
- CP27 does not claim CP22 parity;
- no raw Quran, tafsir, translation, or hadith text body is exported into CP27 graph/vault artifacts;
- `GET /api/private-content/knowledge-graphify/cp27` is a bounded private inspection route;
- `/knowledge-graphify` displays bounded internal graph/vault status only;
- full graph dumps, full vault dumps, full index bodies, vault Markdown bodies, and raw source text are not sent to the client;
- public-safe counts remain zero.

## 6. Known Limitations

The following limitations remain intentional or deferred:

- CP27 is a refresh-backed prototype, not a full production rebuild service.
- The refreshed graph/vault intentionally summarizes CP26 snapshot-derived resources and does not match the full CP22 scale.
- CP27 reports 77 unresolved references and 30 high/critical blockers; these are visible and not hidden.
- CP27-G05 proves diff visibility and baseline protection, not CP22 parity.
- CP27-G06 private UI proof is an inspection cockpit, not a public product graph browser.
- Public release is not approved.

## 7. Next Scope Decision

Recommended next scope:

```text
CP28 - Retrieval Engine Integration From Refreshed Graph
```

Rationale:

- CP27 now proves refreshed graph and vault outputs can be regenerated from CP26 snapshot-derived artifacts.
- CP28 should make graph-aware retrieval consume refreshed graph/vault outputs instead of static CP24 fixtures.
- CP28 should preserve validation handoff, reviewer visibility, and public-boundary constraints.

Expected CP28 checkpoint sequence:

| Checkpoint | Purpose |
| --- | --- |
| CP28-R01 | Retrieval architecture from refreshed graph/vault |
| CP28-R02 | Candidate collection from snapshot-backed graph indexes |
| CP28-R03 | Ranking and explanation using allowed operational signals |
| CP28-R04 | Evidence route rebuild and validation handoff |
| CP28-R05 | Retrieval API and private UI integration |
| CP28-R06 | Retrieval regression suite and public-boundary verifier |
| CP28-R07 | Close-out |

## 8. Handoff Notes

For the next checkpoint, start documentation-first:

```text
CP28-R01 - Retrieval Architecture From Refreshed Graph/Vault
```

CP28 must preserve the CP27 public boundary:

- public-safe graph nodes: `0`;
- public-safe graph edges: `0`;
- public-safe vault artifacts: `0`;
- public-safe snapshot rows: `0`;
- public release approved: `false`.

Any change to those values requires a separate Product Owner, rights/attribution, editorial, scholar/content, and security decision.
