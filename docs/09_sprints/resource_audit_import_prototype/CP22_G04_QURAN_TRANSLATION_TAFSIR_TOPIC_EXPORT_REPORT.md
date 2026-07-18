# CP22-G04 - Quran, Translation, Tafsir, And Topic Export Report

Date: 2026-07-12

Status: Complete for CP22-G04 manifest-backed export

Scope: Quran identity graph, Quran text-edition projection, translation edition projection, tafsir passage projection, topic/theme identity projection, indexes, checksums, and private/public boundary verification for the full private RAFIQ resource graph.

## 1. Purpose

CP22-G04 expands the CP22-G03 source/governance backbone into the first content-shaped private RAFIQ resource graph.

This checkpoint exports:

- canonical Quran surah and ayah identity nodes;
- Quran text-edition nodes and ayah text-version placeholder nodes;
- translation edition nodes and ayah translation placeholder nodes;
- tafsir edition nodes and tafsir passage placeholder nodes;
- source taxonomy, topic, and ayah-theme placeholder nodes;
- ayah, topic, source, release, review, quality, node, edge, and public-boundary indexes;
- partition and index checksums.

It intentionally does not export raw Quran, translation, or tafsir text bodies yet.

## 2. Implementation

Added:

- `scripts/generate_cp22_quran_translation_tafsir_topics_graph.mjs`
- `scripts/check_cp22_quran_translation_tafsir_topics_graph.mjs`

Generated or refreshed:

- `data/graphify/full-private/manifest.json`
- `data/graphify/full-private/summary.json`
- `data/graphify/full-private/partitions/quran.json`
- `data/graphify/full-private/partitions/translations.json`
- `data/graphify/full-private/partitions/tafsir.json`
- `data/graphify/full-private/partitions/topics.json`
- `data/graphify/full-private/indexes/by-ayah-key.json`
- `data/graphify/full-private/indexes/by-topic-key.json`
- all CP22-G03 source/governance indexes refreshed over the expanded graph.

## 3. Input Sources

The CP22-G04 exporter uses checked-in, non-secret evidence only:

- `data/manifests/*.json`
- existing CP22-G03 `sources` and `governance` partitions
- built-in Quran surah metadata and ayah counts
- `docs/09_sprints/resource_audit_import_prototype/CP22_G02_GRAPH_SCHEMA_EXPANSION_AND_PARTITION_PLAN.md`

No `.env` files were read.

No database credentials were used.

No live database connection was used.

## 4. Boundary Decision

CP22-G04 is a manifest-backed private graph projection, not a raw corpus export.

Therefore:

- raw Quran text bodies are not written to graph files;
- raw translation text bodies are not written to graph files;
- raw tafsir text bodies are not written to graph files;
- topic labels and ayah-topic links are placeholder identities where manifests provide counts but not canonical reviewed graph rows;
- live `content.*` rows remain deferred until a safe database snapshot/export input is provided;
- every generated node and edge remains `accessLevel=developer_private`;
- every generated node and edge remains `publicSafe=false`.

This keeps the graph large enough to test RAFIQ product graph behavior while preserving source, licensing, review, and release boundaries.

## 5. Export Result

Generator command:

```powershell
node scripts/generate_cp22_quran_translation_tafsir_topics_graph.mjs
```

Result:

```json
{
  "status": "pass",
  "checkpoint": "CP22-G04",
  "outputDir": "data/graphify/full-private",
  "counts": {
    "totalNodes": 78614,
    "totalEdges": 146102,
    "partitions": 6,
    "indexes": 11,
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
    }
  }
}
```

## 6. Verification Result

Verifier command:

```powershell
node scripts/check_cp22_quran_translation_tafsir_topics_graph.mjs
```

Result:

```json
{
  "status": "pass",
  "checkpoint": "CP22-G04",
  "nodeCount": 78614,
  "edgeCount": 146102,
  "quranSurahCount": 114,
  "quranAyahCount": 6236,
  "quranTextCount": 18708,
  "translationTextCount": 31180,
  "tafsirPassageCount": 18708,
  "sourceTopicCount": 2512,
  "publicSafeNodeCount": 0,
  "publicSafeEdgeCount": 0
}
```

## 7. Verifier Coverage

The verifier checks:

- manifest schema and private boundary fields;
- required `sources`, `governance`, `quran`, `translations`, `tafsir`, and `topics` partitions;
- required indexes, including `by-ayah-key` and `by-topic-key`;
- partition checksums;
- index checksums;
- duplicate node and edge IDs;
- node base fields;
- edge base fields;
- cross-partition edge endpoint resolution;
- 114 Quran surahs;
- 6,236 Quran ayahs;
- Quran text-version projection;
- translation text projection;
- tafsir passage projection;
- source topic projection;
- provenance and release-state refs on content-bearing projection nodes;
- zero public-safe nodes;
- zero public-safe edges.

## 8. Generated Graph Shape

| Artifact | Count |
| --- | ---: |
| Partitions | 6 |
| Indexes | 11 |
| Nodes | 78,614 |
| Edges | 146,102 |
| Quran surah nodes | 114 |
| Quran ayah nodes | 6,236 |
| Quran ayah text-version nodes | 18,708 |
| Translation text nodes | 31,180 |
| Tafsir passage nodes | 18,708 |
| Source topic nodes | 2,512 |
| Public-safe nodes | 0 |
| Public-safe edges | 0 |

## 9. Important Limitations

CP22-G04 is not yet the final full private RAFIQ resource graph.

It does not yet include:

- raw Quran, translation, or tafsir text bodies;
- reviewed topic labels from a canonical graph table;
- reviewed ayah-topic edges from a canonical graph table;
- hadith content nodes;
- hadith grade assertions;
- validation case evidence links;
- quality issue and remediation nodes beyond manifest-derived quality states;
- private retrieval evidence;
- answer validation runs;
- vault packs.

Those remain later CP22 checkpoints.

## 10. Governance Confirmation

The CP22-G04 export preserves the private resource boundary:

- `publicSafeNodes = 0`
- `publicSafeEdges = 0`
- manifest `publicSafe = false`
- access level is `developer_private`
- public release is not approved
- raw text is not exported
- source, provenance, license, release, review, and quality metadata are retained through manifest-backed refs

## 11. Next Checkpoint

Next checkpoint:

```text
CP22-G05 - Hadith, Grade, Verification, And Quality Export
```

Before CP22-G05 begins, the CP22-G04 verifier should continue to pass.
