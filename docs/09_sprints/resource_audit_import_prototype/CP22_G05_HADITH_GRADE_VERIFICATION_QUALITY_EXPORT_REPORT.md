# CP22-G05 - Hadith, Grade, Verification, And Quality Export Report

Date: 2026-07-12

Status: Complete for CP22-G05 aggregate manifest-backed export

Scope: Hadith acquisition resource graph, aggregate hadith structure placeholders, source-qualified grade assertion placeholders, verification source claims, quality findings, hadith indexes, checksums, and private/public boundary verification for the full private RAFIQ resource graph.

## 1. Purpose

CP22-G05 expands the CP22-G04 private resource graph with the first hadith-shaped partitions.

This checkpoint exports:

- hadith collection and edition nodes from the acquisition resource inventory;
- aggregate book, chapter, hadith record, text-version, and reference nodes from principal subtree groups;
- source-qualified grade assertion and grade-normalization placeholders for grade-capable hadith inventory sources;
- verification claim and reference nodes for verification source inventories;
- quality findings for quarantined, research, verification, official-review, and payload-unselected boundaries;
- `by-hadith-key` index;
- refreshed node, edge, source, ayah, topic, release, review, quality, and public-boundary indexes.

It intentionally does not export raw hadith text bodies or claim live canonical row coverage.

## 2. Implementation

Added:

- `scripts/generate_cp22_hadith_grade_quality_graph.mjs`
- `scripts/check_cp22_hadith_grade_quality_graph.mjs`

Generated or refreshed:

- `data/graphify/full-private/manifest.json`
- `data/graphify/full-private/summary.json`
- `data/graphify/full-private/partitions/hadith.json`
- `data/graphify/full-private/partitions/hadith-grades.json`
- `data/graphify/full-private/partitions/quality.json`
- `data/graphify/full-private/indexes/by-hadith-key.json`
- all existing full-private graph indexes over the expanded graph.

## 3. Input Sources

The CP22-G05 exporter uses checked-in, non-secret evidence only:

- `data/manifests/hadith-acquisition-category-summary-2026-06-14.csv`
- `data/manifests/hadith-raw-subtrees-2026-06-14.csv`
- existing CP22-G04 partitions
- `docs/09_sprints/resource_audit_import_prototype/CP22_G01_INVENTORY_AND_SOURCE_TABLE_MAP_REPORT.md`
- `docs/09_sprints/resource_audit_import_prototype/CP22_G02_GRAPH_SCHEMA_EXPANSION_AND_PARTITION_PLAN.md`

No `.env` files were read.

No database credentials were used.

No live database connection was used.

The exporter does not read the large raw-object CSV or raw hadith source files.

## 4. Boundary Decision

CP22-G05 is an aggregate manifest-backed hadith graph projection.

Therefore:

- raw hadith text bodies are not written to graph files;
- aggregate hadith record nodes represent source subtrees, not individual canonical hadith rows;
- grade assertions remain source-qualified placeholders unless record-level grade rows are available;
- verification claims represent verification source inventories, not final religious rulings;
- quality findings preserve private review/remediation boundaries;
- live `content.hadith_*`, `content.hadith_grade_*`, `content.hadith_verification_*`, `content.entity_provenance`, and `content.entity_release_states` rows remain deferred until a safe database snapshot/export input is provided;
- every generated node and edge remains `accessLevel=developer_private`;
- every generated node and edge remains `publicSafe=false`.

This keeps RAFIQ able to inspect hadith source coverage, risk, and quality while avoiding false precision.

## 5. Export Result

Generator command:

```powershell
node scripts/generate_cp22_hadith_grade_quality_graph.mjs
```

Result:

```json
{
  "status": "pass",
  "checkpoint": "CP22-G05",
  "outputDir": "data/graphify/full-private",
  "counts": {
    "totalNodes": 79308,
    "totalEdges": 146781,
    "partitions": 9,
    "indexes": 12,
    "publicSafeNodes": 0,
    "publicSafeEdges": 0
  },
  "partitionCounts": {
    "sources": {
      "nodes": 59,
      "edges": 54
    },
    "governance": {
      "nodes": 36,
      "edges": 108
    },
    "quran": {
      "nodes": 25061,
      "edges": 43652
    },
    "translations": {
      "nodes": 31185,
      "edges": 62360
    },
    "tafsir": {
      "nodes": 18711,
      "edges": 37416
    },
    "topics": {
      "nodes": 3562,
      "edges": 2512
    },
    "hadith": {
      "nodes": 483,
      "edges": 546
    },
    "hadith-grades": {
      "nodes": 120,
      "edges": 118
    },
    "quality": {
      "nodes": 91,
      "edges": 15
    }
  }
}
```

## 6. Verification Result

Verifier command:

```powershell
node scripts/check_cp22_hadith_grade_quality_graph.mjs
```

Result:

```json
{
  "status": "pass",
  "checkpoint": "CP22-G05",
  "nodeCount": 79308,
  "edgeCount": 146781,
  "hadithCollectionCount": 24,
  "hadithEditionCount": 24,
  "hadithRecordAggregateCount": 87,
  "hadithTextVersionAggregateCount": 87,
  "gradeAssertionCount": 58,
  "gradeNormalizationCount": 58,
  "verificationClaimCount": 2,
  "validationFindingCount": 90,
  "byHadithKeyCount": 87,
  "publicSafeNodeCount": 0,
  "publicSafeEdgeCount": 0
}
```

## 7. Verifier Coverage

The verifier checks:

- manifest schema and `CP22-G05` checkpoint value;
- required `hadith`, `hadith-grades`, and `quality` partitions;
- required `by-hadith-key` index;
- all inherited CP22-G04 partitions and indexes;
- partition checksums;
- index checksums;
- duplicate node and edge IDs;
- node base fields;
- edge base fields;
- edge endpoint resolution;
- edge partition consistency;
- aggregate hadith collection, edition, record, text-version, and reference presence;
- grade assertion and normalization presence;
- verification claim and reference presence;
- validation finding and transformation event presence;
- provenance and release-state refs on hadith, grade, verification, and quality nodes;
- hadith-key index consistency;
- zero public-safe nodes;
- zero public-safe edges.

## 8. Generated Graph Shape

| Artifact | Count |
| --- | ---: |
| Partitions | 9 |
| Indexes | 12 |
| Nodes | 79,308 |
| Edges | 146,781 |
| Hadith collection nodes | 24 |
| Hadith edition nodes | 24 |
| Hadith aggregate record nodes | 87 |
| Hadith aggregate text-version nodes | 87 |
| Grade assertion nodes | 58 |
| Grade normalization nodes | 58 |
| Verification claim nodes | 2 |
| Validation finding nodes | 90 |
| Public-safe nodes | 0 |
| Public-safe edges | 0 |

## 9. Important Limitations

CP22-G05 is not yet the full canonical hadith graph.

It does not yet include:

- 324,866 canonical hadith record rows;
- 684,348 canonical hadith text-version rows;
- 67,711 canonical grade assertion rows;
- 67,711 canonical grade normalization rows;
- raw Arabic or translated hadith text bodies;
- per-record SemakHadis claims from a live/exported permitted snapshot;
- Dorar API or bulk data;
- full canonical entity provenance and release-state rows;
- private retrieval evidence;
- answer validation runs;
- vault packs.

Those remain later CP22 checkpoints or require a safe canonical database/export input.

## 10. Governance Confirmation

The CP22-G05 export preserves the private hadith boundary:

- `publicSafeNodes = 0`
- `publicSafeEdges = 0`
- manifest `publicSafe = false`
- access level is `developer_private`
- public release is not approved
- raw hadith text is not exported
- weak, disputed, verification, quarantined, and research boundaries remain source-qualified
- quality findings are inspectable without deleting private development resources

## 11. Next Checkpoint

Next checkpoint:

```text
CP22-G06 - Guidance Evidence And Validation Links
```

Before CP22-G06 begins, the CP22-G05 verifier should continue to pass.
