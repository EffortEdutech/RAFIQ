# CP27-G06 - Graph/Vault Internal UI Inspection Proof

Date: 2026-07-17

Status: Complete

## 1. Purpose

CP27-G06 makes the refresh-backed CP27 graph, vault, and CP22 baseline diff inspectable inside the private RAFIQ UI.

This checkpoint does not publish content, does not approve public release, and does not claim CP22 parity. It proves that an internal reviewer can inspect the refreshed CP27 state through bounded summaries only.

## 2. Implemented Surfaces

| Surface | Evidence |
| --- | --- |
| Shared contract | `packages/shared/src/private-content.ts`; `PrivateCp27InternalUiInspectionResponse`. |
| Private API route | `GET /api/private-content/knowledge-graphify/cp27`. |
| API service | `apps/api/src/modules/private-content/private-content.service.ts`; `getKnowledgeGraphifyCp27()`. |
| API OpenAPI DTO | `apps/api/src/modules/private-content/private-content.openapi.ts`; `PrivateCp27InternalUiInspectionResponseDto`. |
| Mobile typed client | `apps/mobile/src/services/privateContentApi.ts`; `getKnowledgeGraphifyCp27()`. |
| Internal UI route | `apps/mobile/app/knowledge-graphify.tsx`. |
| Static proof artifact | `data/graphify/cp27-refresh/internal-ui/cp27-g06-internal-ui-inspection-proof/status-proof.json`. |
| Latest proof pointer | `data/graphify/cp27-refresh/latest-internal-ui-proof.json`. |
| Verifier | `scripts/check_cp27_g06_internal_ui_proof.mjs`. |

## 3. What The UI Shows

The private `/knowledge-graphify` screen now shows:

- CP27 refreshed graph counts: nodes, edges, partitions, indexes, unresolved references, and blockers;
- CP27 refreshed vault counts: private vault pack artifacts, categories, and referenced graph nodes;
- CP22-to-CP27 graph and vault comparison counts from CP27-G05;
- matched, added, removed, changed, deferred, and blocked diff classification counts;
- partition summary rows and index summary rows;
- vault category counts;
- artifact paths and checksum snippets;
- public-boundary state showing public release remains blocked and public-safe counts remain zero.

## 4. Response Boundary

The CP27-G06 route is intentionally bounded.

It returns:

- graph and vault summary counts;
- partition and index summary rows;
- vault category counts;
- diff classification totals;
- artifact paths and checksums;
- public-boundary flags.

It does not return:

- full graph partition node arrays;
- full graph edge arrays;
- full graph index bodies;
- vault pack Markdown bodies;
- raw Quran, tafsir, translation, or hadith text bodies;
- public-safe content exports.

The static proof records:

```text
fullGraphDumpIncluded: false
fullVaultDumpIncluded: false
rawSourceTextIncluded: false
fullPartitionBodiesIncluded: false
fullIndexBodiesIncluded: false
vaultMarkdownBodiesIncluded: false
```

## 5. Current Counts

| Area | Count |
| --- | ---: |
| CP27 refreshed graph nodes | 147 |
| CP27 refreshed graph edges | 125 |
| CP27 graph partitions | 10 |
| CP27 graph indexes | 12 |
| CP27 vault artifacts | 26 |
| CP27 vault categories | 4 |
| CP27 unresolved references | 77 |
| CP27 high/critical blockers | 30 |
| Public-safe graph nodes | 0 |
| Public-safe graph edges | 0 |
| Public-safe vault artifacts | 0 |

CP22 baseline comparison remains visible:

| Area | CP22 baseline | CP27 refreshed |
| --- | ---: | ---: |
| Graph nodes | 79,657 | 147 |
| Graph edges | 147,689 | 125 |
| Vault artifacts | 158 | 26 |

## 6. Verification

Run:

```powershell
node scripts\check_cp27_g06_internal_ui_proof.mjs
```

Expected result:

```text
CP27-G06 internal UI inspection proof verification passed.
```

## 7. Public Boundary

Public release remains blocked.

CP27-G06 is private-only and exposes no public route. Public-safe graph nodes, graph edges, vault artifacts, and snapshot rows remain zero.
