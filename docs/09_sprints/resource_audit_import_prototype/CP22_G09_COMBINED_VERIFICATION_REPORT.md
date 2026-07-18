# CP22-G09 - Combined Verification Report

Date: 2026-07-13

Status: Complete

Scope: Add and run one combined verifier for the CP22 full private RAFIQ
resource graph, vault packs, internal UI payload boundary, public-safe metadata,
source/provenance coverage, indexes, and performance counts.

## Summary

CP22-G09 adds the one-command verifier:

```text
scripts/check_cp22_combined_verification.mjs
```

The verifier runs the inherited CP22-G06 graph verifier and CP22-G07 vault
verifier, then adds combined checks for:

- graph schema and manifest consistency;
- partition checksum integrity;
- cross-partition edge references;
- source, provenance, and release-state coverage for content-bearing and
  validation-bearing nodes;
- index consistency for node, edge, canonical, source, snapshot, ayah, hadith,
  topic, release-state, review-state, quality-state, and public-boundary
  indexes;
- vault manifest and artifact graph-node references;
- public/private boundary metadata;
- internal UI payload boundaries and route wiring;
- generated artifact secret-marker scan;
- counts by node type, edge type, partition, release state, review state, and
  quality state;
- verifier runtime duration.

## One-Command Verification Output

Command:

```powershell
node scripts/check_cp22_combined_verification.mjs
```

Result:

```json
{
  "status": "pass",
  "checkpoint": "CP22-G09",
  "durationMs": 5040,
  "graph": {
    "graphId": "rafiq-full-private-resource-graph",
    "sourceCheckpoint": "CP22-G06",
    "nodeCount": 79657,
    "edgeCount": 147689,
    "partitionCount": 11,
    "indexCount": 12,
    "publicSafeNodeCount": 0,
    "publicSafeEdgeCount": 0,
    "crossPartitionEdgeCount": 50698,
    "checksumSha256": "F3C874422F30778B549D40D3D60A30E1DA3F787E3535634991C03971B4869F98"
  },
  "vault": {
    "artifactCount": 158,
    "categoryCount": 9,
    "publicSafeArtifacts": 0,
    "graphNodesReferenced": 386
  },
  "indexCounts": {
    "byNodeId": 79657,
    "byEdgeId": 147689,
    "byCanonicalRef": 79656,
    "byAyahKey": 6236,
    "byHadithKey": 87,
    "byTopicKey": 3561,
    "publicBoundaryCategories": 5
  },
  "sourceProvenanceCoverage": {
    "missingSourceCoverage": 0,
    "missingProvenanceCoverage": 0,
    "missingReleaseCoverage": 0
  },
  "publicSafeBoundary": {
    "graphPublicSafeNodes": 0,
    "graphPublicSafeEdges": 0,
    "vaultPublicSafeArtifacts": 0,
    "publicReleaseApproved": false
  },
  "generatedArtifactSecretScan": {
    "scannedFileCount": 184,
    "secretMarkerCount": 0
  },
  "uiPayloadBoundary": {
    "route": "/knowledge-graphify",
    "apiRoute": "/api/private-content/knowledge-graphify/cp22",
    "payloadBoundary": "bounded_partition_samples_lookup_paths_vault_previews",
    "graphNodesExposedToUi": "sampled_only",
    "totalGraphNodesAvailable": 79657,
    "totalVaultArtifactsAvailable": 158
  }
}
```

## Graph Counts

| Metric | Count |
| --- | ---: |
| Nodes | 79,657 |
| Edges | 147,689 |
| Partitions | 11 |
| Indexes | 12 |
| Cross-partition edges | 50,698 |
| Public-safe nodes | 0 |
| Public-safe edges | 0 |

Partition counts:

| Partition | Nodes |
| --- | ---: |
| cp21c-reference | 46 |
| governance | 36 |
| hadith | 483 |
| hadith-grades | 120 |
| product-evidence | 303 |
| quality | 91 |
| quran | 25,061 |
| sources | 59 |
| tafsir | 18,711 |
| topics | 3,562 |
| translations | 31,185 |

## State Counts

Release states:

| State | Count |
| --- | ---: |
| private_available | 6,615 |
| private_blocked | 32 |
| public_blocked | 73,010 |

Review states:

| State | Count |
| --- | ---: |
| content_review | 123 |
| not_required | 6,350 |
| pending | 72,708 |
| rejected | 23 |
| scholar_review | 12 |
| technical_review | 441 |

Quality states:

| State | Count |
| --- | ---: |
| clean | 71,575 |
| unverified | 473 |
| warning | 7,581 |
| withheld | 28 |

## Verification Commands

Commands run:

```powershell
node -c scripts/check_cp22_combined_verification.mjs
node scripts/check_cp22_combined_verification.mjs
corepack pnpm build:shared
corepack pnpm build:api
corepack pnpm build:mobile:web
.\scripts\graphify.ps1 update .
```

All CP22-G09 commands passed.

Graphify refresh result:

```text
Rebuilt: 6681 nodes, 7983 edges, 806 communities.
graph.json and GRAPH_REPORT.md updated in graphify-out.
graph.html skipped because the graph is above the 5000-node HTML visualization limit.
```

## Governance Boundary

The combined verifier confirms:

- no `.env` files were read by the verifier;
- generated graph and vault artifacts scanned: `184`;
- generated artifact secret markers found: `0`;
- public-safe graph nodes: `0`;
- public-safe graph edges: `0`;
- public-safe vault artifacts: `0`;
- public release approved: `false`;
- internal UI payload remains bounded to summaries, samples, lookup paths, and
  vault previews;
- CP21C evidence remains prototype validation evidence inside the full private
  graph, not the full resource graph itself.

## Next Checkpoint

Recommended next checkpoint:

```text
CP22-G10 - Close-Out
```

The close-out should summarize final CP22 graph/vault/UI/verifier status, known
limitations, deferred live-database snapshot items, and the next scope decision.
