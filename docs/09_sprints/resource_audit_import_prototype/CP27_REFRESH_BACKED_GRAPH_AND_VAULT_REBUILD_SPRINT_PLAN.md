# CP27 - Refresh-Backed Graph And Vault Rebuild Sprint Plan

Date: 2026-07-16

Status: CP27 complete; recommended next scope CP28

Owner: RAFIQ private resource graph, vault, snapshot refresh, and product intelligence workstream

## 1. Objective

CP27 rebuilds the RAFIQ full private resource graph and private vault packs from CP26 snapshot batches.

The purpose is to move CP22 graph/vault artifacts from static generated outputs into a refresh-backed pipeline. CP27 must prove that snapshot-backed graph/vault generation can either match the CP22 baseline or intentionally supersede it with documented diffs, checksums, and public-boundary proof.

CP27 does not approve public release. Public release remains blocked.

## 2. Baseline

CP27 starts after CP26 close-out.

| Baseline | Status | Evidence |
| --- | --- | --- |
| CP22 full private resource graph and vault | Complete | `CP22_G10_CLOSE_OUT_REPORT.md`; `data/graphify/full-private/manifest.json`; `data/vault/full-private/manifest.json` |
| CP26 live snapshot export and refresh | Complete | `CP26_S08_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`; `data/snapshots/cp26/latest-verification.json` |

Inherited CP22 baseline:

- graph nodes: 79,657;
- graph edges: 147,689;
- graph partitions: 11;
- graph indexes: 12;
- vault artifacts: 158;
- vault categories: 9;
- graph public-safe nodes: 0;
- graph public-safe edges: 0;
- vault public-safe artifacts: 0.

Inherited CP26 source snapshot:

- snapshot batch: `cp26-snapshot-prototype-s03`;
- source groups: 13;
- snapshot artifacts: 13;
- unresolved references: 77;
- high/critical blockers: 30;
- public-safe snapshot rows: 0.

## 3. Product Boundaries

CP27 must preserve these boundaries:

1. Canonical source tables remain authoritative.
2. CP26 snapshot artifacts are private operational inputs, not canonical content tables.
3. CP27 graph and vault outputs are derived private metadata.
4. No raw Quran, tafsir, translation, or hadith text body is exported into graph/vault artifacts unless a later approved content export scope explicitly permits it.
5. Public-safe graph nodes, graph edges, vault artifacts, and snapshot rows remain zero.
6. No public route can expose CP27 graph, vault, snapshot, diff, or remediation artifacts.
7. Unresolved references and high/critical blockers must remain visible.
8. Graph/vault diffs must distinguish `matched`, `added`, `removed`, `changed`, `deferred`, and `blocked`.
9. CP27 must not read or print `.env` values, secrets, service-role keys, private tokens, or credentials.

## 4. Expected Implementation Surface

| Surface | Expected role |
| --- | --- |
| `docs/09_sprints/resource_audit_import_prototype/` | CP27 architecture, mapper, regeneration, diff, UI, verification, and close-out docs. |
| `scripts/` | CP27 mapper, graph rebuild, vault rebuild, diff, and verifier scripts. |
| `data/snapshots/cp26/` | Source snapshot batch and refresh pointers. |
| `data/graphify/cp27-refresh/` | Planned refreshed graph output area. |
| `data/vault/cp27-refresh/` | Planned refreshed vault output area. |
| `data/graphify/full-private/` | CP22 comparison baseline only. |
| `data/vault/full-private/` | CP22 vault comparison baseline only. |
| `apps/api/src/modules/private-content/` | Later private status/inspection endpoints if CP27-G06 selects API proof. |
| `apps/mobile/app/review-workbench.tsx` or `apps/mobile/app/knowledge-graphify.tsx` | Later internal inspection surface if CP27-G06 selects UI proof. |

## 5. Checkpoints

### CP27-G01 - Refresh-Backed Graph Rebuild Architecture

Purpose: define architecture before implementation.

Status: Complete. See `CP27_G01_REFRESH_BACKED_GRAPH_REBUILD_ARCHITECTURE.md`.

Deliverables:

- CP27 architecture report;
- snapshot-to-graph/vault dependency map;
- output folder and manifest policy;
- partition/index regeneration strategy;
- graph/vault diff strategy;
- public-boundary and verifier plan.

Acceptance:

- CP26 close-out is the controlling baseline;
- CP22 graph/vault baseline counts are recorded;
- CP26 snapshot batch is identified as the source input;
- public release remains blocked;
- no implementation claims are made before mapper work starts.

### CP27-G02 - Snapshot-To-Node And Snapshot-To-Edge Mapper

Purpose: define and prototype deterministic mapping from CP26 snapshot groups to graph nodes and edges.

Status: Complete. See `CP27_G02_SNAPSHOT_TO_NODE_EDGE_MAPPER.md`.

Deliverables:

- CP27 snapshot-to-node/edge mapper contract;
- source group to partition, node-family, edge-family, and index map;
- deterministic private graph ID policy;
- deferred and blocked mapper report;
- mapper checksum ledger and latest pointer.

Acceptance:

- all 13 CP26 source groups are mapped;
- no source group is silently dropped;
- canonical refs remain authoritative and graph IDs remain derived;
- raw text bodies and public-safe export remain deferred or blocked;
- public-safe snapshot, graph, edge, and vault counts remain zero.

### CP27-G03 - Partition And Index Regeneration From Snapshots

Purpose: generate refreshed graph partitions and indexes from mapped nodes and edges.

Status: Complete. See `CP27_G03_PARTITION_AND_INDEX_REGENERATION.md`.

Deliverables:

- refreshed CP27 graph manifest;
- refreshed graph partitions generated from the CP27-G02 mapper;
- refreshed graph indexes generated from partition nodes and edges;
- checksum ledger for graph artifacts;
- latest graph pointer for CP27-G04.

Acceptance:

- refreshed graph manifest is generated under `data/graphify/cp27-refresh/`;
- refreshed partitions and indexes are generated without overwriting `data/graphify/full-private/`;
- CP27-G02 mapper and CP26 snapshot references are preserved;
- unresolved references and blockers remain visible;
- public-safe graph counts remain zero.

### CP27-G04 - Vault Pack Regeneration From Refreshed Graph

Purpose: regenerate private vault packs from refreshed graph outputs.

Status: Complete. See `CP27_G04_VAULT_PACK_REGENERATION.md`.

Deliverables:

- refreshed CP27 vault manifest;
- private vault packs generated from the CP27-G03 refreshed graph;
- vault checksum ledger;
- latest vault pointer for CP27-G05;
- public-boundary proof for vault artifacts.

Acceptance:

- refreshed vault manifest is generated under `data/vault/cp27-refresh/`;
- refreshed vault packs reference refreshed graph IDs;
- CP22 full-private vault remains a comparison baseline only;
- raw source text bodies are not exported into vault packs;
- public-safe vault artifact count remains zero.

### CP27-G05 - Graph/Vault Diff Proof Against CP22 Baseline

Purpose: compare refreshed CP27 graph/vault outputs against CP22 baseline.

Status: Complete. See `CP27_G05_GRAPH_VAULT_DIFF_PROOF.md`.

Deliverables:

- graph diff summary against CP22 baseline;
- vault diff summary against CP22 baseline;
- checksum comparison ledger;
- public-boundary diff proof;
- latest diff pointer for CP27-G06.

Acceptance:

- matched, added, removed, changed, deferred, and blocked statuses are visible;
- CP22 graph and vault baselines are comparison inputs only;
- CP27 summary graph/vault outputs do not claim CP22 parity;
- unresolved references and blockers remain visible;
- public-safe graph, edge, and vault counts remain zero.

### CP27-G06 - Graph/Vault Internal UI Inspection Proof

Purpose: make refreshed graph/vault rebuild status inspectable in internal RAFIQ UX if needed.

Status: Complete. See `CP27_G06_INTERNAL_UI_INSPECTION_PROOF.md`.

Deliverables:

- bounded CP27 private inspection route;
- shared CP27 internal UI response contract;
- mobile internal graph/vault inspection screen;
- generated internal UI proof artifact;
- verifier for route, UI, payload boundary, counts, and public-safe metadata.

Acceptance:

- refreshed graph/vault counts are visible in private UI;
- CP22-to-CP27 diff counts and statuses are visible;
- full graph and vault dumps are not sent to the client;
- public release remains blocked;
- public-safe graph, edge, vault, and snapshot counts remain zero.

### CP27-G07 - Combined Verification And Close-Out

Purpose: provide one command that verifies CP27 graph/vault rebuild, diff, public boundary, and close-out.

Status: Complete. See `CP27_G07_COMBINED_VERIFICATION_AND_CLOSE_OUT.md`.

Deliverables:

- combined CP27 verification summary artifact;
- latest CP27 verification pointer;
- close-out and next-scope decision report;
- single close-out proof command.

Acceptance:

- CP27-G01 through CP27-G06 verifiers pass;
- refreshed graph/vault rebuild checks pass;
- CP22 baseline diff and public-boundary checks pass;
- internal UI inspection proof remains bounded;
- CP28 is selected as the next private scope.

## 6. Acceptance Gates

CP27 cannot close unless:

- CP26-S08 close-out verification passes;
- refreshed graph output has a manifest and checksums;
- refreshed vault output has a manifest and checksums;
- CP22 baseline diff is generated and documented;
- canonical refs remain separate from graph/vault IDs;
- unresolved references and blockers remain visible;
- public-safe graph/vault/snapshot counts remain zero;
- no public route exposes private graph/vault rebuild artifacts;
- no `.env` values, secrets, service-role keys, private tokens, or credentials are read or printed.

## 7. Recommended Next Scope

CP27 is complete. Proceed next with:

```text
CP28 - Retrieval Engine Integration From Refreshed Graph
```

Reason: CP27 has made refreshed graph, vault, and diff state inspectable in RAFIQ internal UX without exposing full private dumps. CP28 should connect graph-aware retrieval to the refreshed graph/vault outputs instead of static CP24 fixtures.
