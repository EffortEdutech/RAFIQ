# CP22-G03 - Source, Provenance, And Release Export Report

Date: 2026-07-12

Status: Complete for CP22-G03 backbone export

Scope: Source, provenance, release-state, manifest, checksum, and public-boundary backbone for the full private RAFIQ resource graph.

## 1. Purpose

CP22-G03 implements the first executable backbone of the full private RAFIQ resource graph.

This checkpoint exports only:

- `sources` partition,
- `governance` partition,
- source/provenance/release indexes,
- manifest and partition checksums,
- public-boundary index with zero public-safe artifacts.

It intentionally does not export Quran, translation, tafsir, hadith, topic, quality, or product-evidence content partitions yet.

## 2. Implementation

Added:

- `scripts/generate_cp22_source_governance_graph.mjs`
- `scripts/check_cp22_source_governance_graph.mjs`

Generated:

- `data/graphify/full-private/manifest.json`
- `data/graphify/full-private/summary.json`
- `data/graphify/full-private/partitions/sources.json`
- `data/graphify/full-private/partitions/governance.json`
- `data/graphify/full-private/indexes/by-node-id.json`
- `data/graphify/full-private/indexes/by-edge-id.json`
- `data/graphify/full-private/indexes/by-canonical-ref.json`
- `data/graphify/full-private/indexes/by-source-id.json`
- `data/graphify/full-private/indexes/by-snapshot-id.json`
- `data/graphify/full-private/indexes/by-release-state.json`
- `data/graphify/full-private/indexes/by-review-state.json`
- `data/graphify/full-private/indexes/by-quality-state.json`
- `data/graphify/full-private/indexes/public-boundary.json`

## 3. Input Sources

The CP22-G03 exporter uses checked-in, non-secret source evidence only:

- `data/manifests/*.json`
- `data/manifests/hadith-acquisition-category-summary-2026-06-14.csv`
- `data/manifests/hadith-raw-subtrees-2026-06-14.csv`
- `data/checksums/*`
- `docs/09_sprints/resource_audit_import_prototype/CP22_G02_GRAPH_SCHEMA_EXPANSION_AND_PARTITION_PLAN.md`

No `.env` files were read.

No database credentials were used.

## 4. Boundary Decision

CP22-G03 does not connect to the live database because RAFIQ security rules prohibit reading or printing secrets and no safe database snapshot/export input was provided for this checkpoint.

Therefore:

- live `content.entity_provenance` rows are not exported yet;
- live `content.entity_release_states` rows are not exported yet;
- source/governance nodes are generated from manifests and inventory files;
- all generated artifacts remain private and `publicSafe=false`;
- CP22-G04 and later content exporters must attach canonical content nodes back to this backbone or to a future safe DB snapshot export.

This keeps the checkpoint useful without inventing database state.

## 5. Export Result

Generator command:

```powershell
node scripts/generate_cp22_source_governance_graph.mjs
```

Result:

```json
{
  "status": "pass",
  "checkpoint": "CP22-G03",
  "outputDir": "data/graphify/full-private",
  "counts": {
    "totalNodes": 95,
    "totalEdges": 162,
    "partitions": 2,
    "indexes": 9,
    "publicSafeNodes": 0,
    "publicSafeEdges": 0
  }
}
```

## 6. Verification Result

Verifier command:

```powershell
node scripts/check_cp22_source_governance_graph.mjs
```

Result:

```json
{
  "status": "pass",
  "checkpoint": "CP22-G03",
  "sourceNodeCount": 3,
  "snapshotNodeCount": 18,
  "releaseNodeCount": 18,
  "provenanceNodeCount": 18,
  "nodeCount": 95,
  "edgeCount": 162,
  "publicSafeNodeCount": 0,
  "publicSafeEdgeCount": 0
}
```

## 7. Verifier Coverage

The verifier checks:

- graph manifest schema and private boundary fields;
- required `sources` and `governance` partitions;
- required source/governance indexes;
- partition checksums;
- index checksums;
- node base fields;
- edge base fields;
- cross-partition edge endpoint resolution;
- source nodes exist;
- source snapshot nodes exist;
- release-state nodes exist;
- provenance nodes exist;
- public-safe node count is zero;
- public-safe edge count is zero.

## 8. Generated Graph Shape

Current backbone:

| Artifact | Count |
| --- | ---: |
| Partitions | 2 |
| Indexes | 9 |
| Nodes | 95 |
| Edges | 162 |
| Source nodes | 3 |
| Source snapshot nodes | 18 |
| Release-state nodes | 18 |
| Provenance nodes | 18 |
| Public-safe nodes | 0 |
| Public-safe edges | 0 |

## 9. Important Limitations

CP22-G03 is not the full private RAFIQ resource graph.

It does not yet include:

- Quran content nodes,
- translation content nodes,
- tafsir content nodes,
- topic/theme content nodes,
- hadith content nodes,
- grade assertion content nodes,
- verification claim content nodes,
- live canonical entity provenance rows,
- live canonical entity release-state rows,
- private retrieval evidence,
- private answer validation runs,
- vault packs.

Those remain later CP22 checkpoints.

## 10. Governance Confirmation

The CP22-G03 export preserves the key governance boundary:

- `publicSafeNodes = 0`
- `publicSafeEdges = 0`
- manifest `publicSafe = false`
- access level is `developer_private`
- public release is not approved
- rights, attribution, quality, and publication warning metadata are preserved from manifests where available

## 11. Next Checkpoint

Next checkpoint:

```text
CP22-G04 - Quran, Translation, Tafsir, And Topic Export
```

Before CP22-G04 begins, the source/governance backbone verifier should continue to pass.

