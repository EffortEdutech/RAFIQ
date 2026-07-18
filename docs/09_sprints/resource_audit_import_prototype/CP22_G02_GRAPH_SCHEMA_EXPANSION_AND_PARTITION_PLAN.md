# CP22-G02 - Graph Schema Expansion And Partition Plan

Date: 2026-07-12

Status: Complete for CP22-G02 planning

Scope: Full private RAFIQ resource graph schema, ID, partition, manifest, and governance metadata plan.

## 1. Purpose

CP22-G02 expands the RAFIQ Knowledge Graphify graph contract from a prototype-ready CP21C shape into a full private resource graph schema.

This plan defines:

- approved CP22 node types,
- approved CP22 edge types,
- required metadata fields,
- stable graph ID conventions,
- graph partition names and boundaries,
- cross-partition reference rules,
- manifest schema requirements,
- private/public boundary fields,
- version and checksum rules.

This checkpoint does not generate the graph. It locks the target contract for CP22-G03 and later exporters.

## 2. Governing Inputs

CP22-G02 is based on:

- `docs/04_knowledge/RAFIQ_KNOWLEDGE_GRAPHIFY_AND_VAULT_ARCHITECTURE_V1.md`
- `docs/04_knowledge/RAFIQ_KNOWLEDGE_GRAPHIFY_GRAPH_CONTRACT_V1.md`
- `docs/04_knowledge/RAFIQ_KNOWLEDGE_VAULT_ARTIFACT_CONTRACT_V1.md`
- `docs/09_sprints/resource_audit_import_prototype/CP22_G01_INVENTORY_AND_SOURCE_TABLE_MAP_REPORT.md`
- `docs/09_sprints/resource_audit_import_prototype/CP22_FULL_PRIVATE_RESOURCE_GRAPH_IMPLEMENTATION_SPRINT_PLAN.md`
- `docs/09_sprints/resource_audit_import_prototype/CP22_FULL_PRIVATE_RESOURCE_GRAPH_ACCEPTANCE_CHECKLIST.md`

Graphify was queried before manual source review:

```powershell
.\scripts\graphify.ps1 query "CP22 G02 graph schema expansion partition plan node types edge types ids public-safe metadata CP22 G01" --graph "graphify-out\graph.json"
```

No `.env` files were read.

## 3. Design Decision

CP22 will use a partitioned private graph export.

Canonical truth remains in Supabase/Postgres and source manifests. The CP22 graph is derived, rebuildable, private by default, and optimized for inspection, verification, and internal graph/vault workflows.

`content.entity_provenance` and `content.entity_release_states` are modeled as first-class graph nodes for CP22. This avoids hiding governance-critical data inside metadata blobs and lets verifiers check that every content-bearing node links to provenance and release-state nodes.

All CP22 nodes and edges default to:

```json
{
  "accessLevel": "developer_private",
  "publicSafe": false
}
```

Any future public-safe mode must be a separate release plan and verifier mode.

## 4. Graph Layout

Target artifact layout:

```text
data/graphify/full-private/
  manifest.json
  summary.json
  partitions/
    sources.json
    quran.json
    translations.json
    tafsir.json
    topics.json
    hadith.json
    hadith-grades.json
    governance.json
    quality.json
    product-evidence.json
    cp21c-reference.json
  indexes/
    by-node-id.json
    by-edge-id.json
    by-canonical-ref.json
    by-source-id.json
    by-snapshot-id.json
    by-ayah-key.json
    by-hadith-key.json
    by-topic-key.json
    by-release-state.json
    by-review-state.json
    by-quality-state.json
    public-boundary.json
```

Rules:

1. Every partition is a standalone JSON object with `partition`, `nodes`, `edges`, and `stats`.
2. Edges may cross partitions by stable node ID.
3. A node belongs to exactly one primary partition.
4. Index files may duplicate IDs and small metadata, but not full source text.
5. The `cp21c-reference.json` partition may link to CP21C prototype artifacts only as reference/evidence. It must not become the full resource graph.

## 5. Manifest Schema

`manifest.json` must include:

| Field | Required | Description |
| --- | --- | --- |
| `schemaVersion` | Yes | CP22 graph schema version. Initial value: `cp22.full-private.v1`. |
| `graphId` | Yes | Stable graph export ID. Recommended: `rafiq-full-private-resource-graph`. |
| `graphKind` | Yes | `resource_graph`. |
| `scope` | Yes | Human-readable scope summary. |
| `environment` | Yes | `private_local`, `private_staging`, `public_staging`, or `production`. CP22 uses `private_local` initially. |
| `deploymentMode` | Yes | RAFIQ deployment mode used by exporter. |
| `sourceDatabaseSnapshot` | Yes | Database snapshot, migration state, or export timestamp reference. |
| `exportedAt` | Yes | ISO timestamp. |
| `exportedBy` | Yes | System or role name. |
| `accessLevel` | Yes | Highest access level represented. Initial CP22 value: `developer_private`. |
| `publicSafe` | Yes | Must be `false` for CP22 full private graph. |
| `partitions` | Yes | Array of partition descriptors. |
| `indexes` | Yes | Array of index descriptors. |
| `sourceInputs` | Yes | Database tables, manifest folders, and scripts used. |
| `counts` | Yes | Total nodes, edges, partitions, indexes, public-safe nodes, public-safe edges. |
| `checksums` | Yes | Per-partition and overall checksums. |
| `warnings` | Yes | Rights, attribution, quality, blocked-source, and private-boundary warnings. |

Each partition descriptor must include:

```json
{
  "name": "sources",
  "path": "partitions/sources.json",
  "nodeCount": 0,
  "edgeCount": 0,
  "checksumSha256": "string",
  "publicSafeNodeCount": 0,
  "publicSafeEdgeCount": 0
}
```

## 6. Partition Contract

Each partition file must use this shape:

```json
{
  "schemaVersion": "cp22.full-private.v1",
  "graphId": "rafiq-full-private-resource-graph",
  "partition": "sources",
  "generatedAt": "ISO-8601",
  "nodes": [],
  "edges": [],
  "stats": {
    "nodeCount": 0,
    "edgeCount": 0,
    "publicSafeNodeCount": 0,
    "publicSafeEdgeCount": 0
  }
}
```

Partition names are lowercase kebab-case.

## 7. Node Base Contract

All CP22 nodes must use this base shape:

```json
{
  "id": "string",
  "type": "string",
  "label": "string",
  "partition": "string",
  "canonicalRef": {
    "schema": "string",
    "table": "string",
    "id": "string"
  },
  "sourceRefs": [],
  "provenanceRefs": [],
  "releaseStateRefs": [],
  "releaseState": "string",
  "reviewState": "string",
  "qualityState": "string",
  "accessLevel": "developer_private",
  "publicSafe": false,
  "metadata": {}
}
```

Rules:

1. `id`, `type`, `label`, `partition`, `releaseState`, `reviewState`, `qualityState`, `accessLevel`, `publicSafe`, and `metadata` are always required.
2. `canonicalRef` is required when a node maps to a database row.
3. `sourceRefs` is required and may be empty only for pure derived operational nodes.
4. Content-bearing nodes must have at least one `provenanceRefs` entry or an edge to an `entity_provenance` node.
5. Content-bearing nodes must have at least one `releaseStateRefs` entry or an edge to an `entity_release_state` node.
6. `publicSafe` must be false unless a future public release verifier approves the node.

## 8. Edge Base Contract

All CP22 edges must use this base shape:

```json
{
  "id": "string",
  "type": "string",
  "from": "string",
  "to": "string",
  "fromPartition": "string",
  "toPartition": "string",
  "status": "string",
  "confidence": null,
  "sourceRefs": [],
  "evidenceRefs": [],
  "releaseState": "string",
  "reviewState": "string",
  "accessLevel": "developer_private",
  "publicSafe": false,
  "metadata": {}
}
```

Rules:

1. `from` and `to` must resolve to node IDs in the same graph export.
2. Cross-partition edges are allowed only when `fromPartition` and `toPartition` are provided.
3. `confidence` must be null unless a source or reviewed method supplies it.
4. Derived candidate edges must use status `derived_candidate`.
5. No edge may upgrade a source, candidate, or imported relationship into religious guidance.

## 9. Stable ID Rules

All IDs are lowercase namespace-prefixed strings.

General format:

```text
<namespace>:<stable-key>
```

Composite stable keys use colon separators and source-qualified values.

| Node type | ID format |
| --- | --- |
| `source` | `source:{source_id}` |
| `source_snapshot` | `snapshot:{snapshot_id}` |
| `raw_object` | `raw_object:{raw_object_id}` |
| `source_manifest` | `manifest:{source_id}` |
| `checksum_manifest` | `checksum_manifest:{checksum_file_id}` |
| `import_run` | `import_run:{import_run_id}` |
| `validation_finding` | `quality_finding:{finding_id}` |
| `transformation_event` | `transformation:{transformation_event_id}` |
| `record_lineage_event` | `lineage:{lineage_id}` |
| `entity_provenance` | `provenance:{entity_type}:{entity_id}:{provenance_id}` |
| `entity_release_state` | `release_state:{entity_type}:{entity_id}:{release_state_id}` |
| `quran_surah` | `surah:{surah_number}` |
| `quran_ayah` | `ayah:{surah_number}:{ayah_number}` |
| `quran_text_edition` | `quran_text_edition:{edition_id}` |
| `quran_ayah_text` | `quran_text:{ayah_id}:{edition_id}` |
| `quran_partition_scheme` | `quran_partition_scheme:{scheme_id}` |
| `quran_partition` | `quran_partition:{partition_id}` |
| `translation_edition` | `translation_edition:{edition_id}` |
| `translation_text` | `translation_text:{translation_text_id}` |
| `translation_footnote` | `translation_footnote:{footnote_id}` |
| `translation_chunk` | `translation_chunk:{chunk_id}` |
| `tafsir_edition` | `tafsir_edition:{edition_id}` |
| `tafsir_passage` | `tafsir_passage:{passage_id}` |
| `source_taxonomy` | `source_taxonomy:{taxonomy_id}` |
| `source_topic` | `source_topic:{taxonomy_id}:{source_topic_key}` |
| `rafiq_theme` | `rafiq_theme:{theme_id}` |
| `theme_label` | `theme_label:{theme_label_id}` |
| `source_ayah_theme_group` | `source_ayah_theme_group:{group_id}` |
| `hadith_collection` | `hadith_collection:{collection_id}` |
| `hadith_edition` | `hadith_edition:{edition_id}` |
| `hadith_book` | `hadith_book:{book_id}` |
| `hadith_chapter` | `hadith_chapter:{chapter_id}` |
| `hadith_record` | `hadith_record:{hadith_record_id}` |
| `hadith_text_version` | `hadith_text:{text_version_id}` |
| `hadith_reference` | `hadith_reference:{reference_id}` |
| `hadith_grade_assertion` | `grade_assertion:{assertion_id}` |
| `hadith_grade_normalization` | `grade_normalization:{normalization_id}` |
| `hadith_verification_claim` | `verification_claim:{claim_id}` |
| `hadith_verification_reference` | `verification_reference:{reference_id}` |
| `private_search_document` | `search_document:{document_id}` |
| `private_retrieval_trace` | `retrieval_trace:{trace_id}` |
| `private_review_queue_item` | `review_item:{queue_item_id}` |
| `private_answer_draft` | `answer_draft:{draft_id}` |
| `private_guided_answer_run` | `guided_answer_run:{run_id}` |
| `private_model_adapter_run` | `model_adapter_run:{run_id}` |
| `private_answer_validation_run` | `answer_validation_run:{run_id}` |
| `cp21c_case` | `cp21c_case:{case_id}` |
| `vault_note` | `vault_note:{artifact_type}:{artifact_id}` |

Edge ID format:

```text
edge:{edge_type}:{from_node_id}:{to_node_id}:{stable_discriminator}
```

The `stable_discriminator` is required when multiple edges can connect the same nodes.

## 10. Approved Partitions

| Partition | Primary node types | Primary edge categories |
| --- | --- | --- |
| `sources` | `source`, `source_snapshot`, `raw_object`, `source_manifest`, `checksum_manifest`, `import_run`, `parser_assignment` | source, snapshot, raw-object, import-run, checksum, parser-assignment edges |
| `quran` | `quran_surah`, `quran_ayah`, `quran_text_edition`, `quran_ayah_text`, `quran_partition_scheme`, `quran_partition` | surah, ayah, text edition, partition edges |
| `translations` | `translation_edition`, `translation_text`, `translation_footnote`, `translation_chunk` | translation, footnote, chunk edges |
| `tafsir` | `tafsir_edition`, `tafsir_passage` | tafsir passage and ayah coverage edges |
| `topics` | `source_taxonomy`, `source_topic`, `rafiq_theme`, `theme_label`, `source_ayah_theme_group` | source topic, theme, mapping, ayah-theme edges |
| `hadith` | `hadith_collection`, `hadith_edition`, `hadith_book`, `hadith_chapter`, `hadith_record`, `hadith_text_version`, `hadith_reference` | collection, edition, book, chapter, record, text, reference, mapping edges |
| `hadith-grades` | `hadith_grade_assertion`, `hadith_grade_normalization`, `hadith_verification_claim`, `hadith_verification_reference` | grade, normalization, verification, verifier reference edges |
| `governance` | `entity_provenance`, `entity_release_state`, `private_review_queue_item` | provenance, release-state, review-target edges |
| `quality` | `validation_finding`, `transformation_event`, `record_lineage_event` | quality, remediation, transformation, lineage edges |
| `product-evidence` | `private_search_document`, `private_retrieval_trace`, `private_answer_draft`, `private_guided_answer_run`, `private_model_adapter_run`, `private_answer_validation_run` | retrieval, evidence, validation, answer-review edges |
| `cp21c-reference` | `cp21c_case`, `vault_note` | CP21C reference, ranking-pack, prototype lineage edges |

## 11. Approved Node Types

| Node type | Partition | Required metadata |
| --- | --- | --- |
| `source` | `sources` | `sourceKey`, `name`, `provider`, `domain`, `authorityClassification`, `activeState` |
| `source_snapshot` | `sources` | `sourceId`, `snapshotKey`, `versionLabel`, `acquiredAt`, `rightsStatus`, `attributionStatus`, `technicalStatus`, `publicationStatus` |
| `raw_object` | `sources` | `snapshotId`, `objectRole`, `logicalName`, `pathOrObjectKey`, `checksumSha256`, `byteLength`, `mediaType`, `parseEligibility` |
| `source_manifest` | `sources` | `sourceId`, `manifestPath`, `status`, `recordCountExpected`, `recordCountActual`, `checksumSha256` |
| `checksum_manifest` | `sources` | `path`, `checksumCount`, `generatedAt` |
| `import_run` | `sources` | `parserName`, `parserVersion`, `status`, `startedAt`, `completedAt`, `parsedRecordCount`, `stagedRecordCount` |
| `parser_assignment` | `sources` | `rawObjectId`, `parserName`, `assignmentStatus` |
| `quran_surah` | `quran` | `surahNumber`, `name`, `ayahCount` |
| `quran_ayah` | `quran` | `surahNumber`, `ayahNumber`, `verseKey`, `globalAyahNumber` |
| `quran_text_edition` | `quran` | `editionKey`, `sourceSnapshotId`, `script`, `orthography`, `language` |
| `quran_ayah_text` | `quran` | `ayahId`, `editionId`, `scriptLabel`, `bismillahBehavior`, `endMarkerBehavior` |
| `quran_partition_scheme` | `quran` | `schemeKey`, `sourceSnapshotId`, `partitionType` |
| `quran_partition` | `quran` | `schemeId`, `partitionType`, `partitionNumber`, `startAyahId`, `endAyahId` |
| `translation_edition` | `translations` | `editionKey`, `languageCode`, `translatorName`, `publisherName`, `sourceSnapshotId` |
| `translation_text` | `translations` | `editionId`, `ayahId`, `languageCode`, `variantType`, `hasFootnotes` |
| `translation_footnote` | `translations` | `translationTextId`, `marker`, `languageCode`, `sourceOrder` |
| `translation_chunk` | `translations` | `translationTextId`, `chunkType`, `sourceOrder`, `footnoteId` |
| `tafsir_edition` | `tafsir` | `editionKey`, `sourceSnapshotId`, `languageCode`, `authorName`, `translatorName` |
| `tafsir_passage` | `tafsir` | `editionId`, `fromAyahId`, `toAyahId`, `languageCode`, `blankTextFlag` |
| `source_taxonomy` | `topics` | `taxonomyKey`, `sourceSnapshotId`, `namespace`, `languageCode` |
| `source_topic` | `topics` | `taxonomyId`, `sourceTopicKey`, `label`, `namespace`, `languageCode` |
| `rafiq_theme` | `topics` | `themeId`, `slug`, `themeType`, `governanceState` |
| `theme_label` | `topics` | `themeId`, `languageCode`, `label`, `labelType` |
| `source_ayah_theme_group` | `topics` | `sourceSnapshotId`, `sourceRange`, `themeText`, `totalAyahs`, `duplicateGroupState` |
| `hadith_collection` | `hadith` | `collectionKey`, `displayName`, `sourceId`, `languageScope` |
| `hadith_edition` | `hadith` | `editionKey`, `collectionId`, `sourceSnapshotId`, `languageCode` |
| `hadith_book` | `hadith` | `editionId`, `sourceBookKey`, `bookNumber`, `title` |
| `hadith_chapter` | `hadith` | `bookId`, `sourceChapterKey`, `chapterNumber`, `title` |
| `hadith_record` | `hadith` | `editionId`, `sourceHadithKey`, `sourceHadithNumber`, `printedReference` |
| `hadith_text_version` | `hadith` | `hadithRecordId`, `languageCode`, `textType`, `translatorName`, `qualityState` |
| `hadith_reference` | `hadith` | `hadithRecordId`, `referenceType`, `referenceValue`, `sourceQualified` |
| `hadith_grade_assertion` | `hadith-grades` | `hadithRecordId`, `sourceSnapshotId`, `graderNameRaw`, `rawGrade`, `claimScope` |
| `hadith_grade_normalization` | `hadith-grades` | `assertionId`, `normalizedGrade`, `normalizationVersion`, `reviewStatus` |
| `hadith_verification_claim` | `hadith-grades` | `hadithRecordId`, `sourceSnapshotId`, `claimText`, `rawConclusion`, `claimScope`, `reviewStatus` |
| `hadith_verification_reference` | `hadith-grades` | `claimId`, `referenceText`, `referenceUrl`, `sourceLabel` |
| `entity_provenance` | `governance` | `entityType`, `entityId`, `stagingTable`, `stagingId`, `sourceSnapshotId`, `mappingMethod` |
| `entity_release_state` | `governance` | `entityType`, `entityId`, `technicalStatus`, `rightsStatus`, `attributionStatus`, `editorialStatus`, `scholarContentStatus`, `publicationStatus` |
| `private_review_queue_item` | `governance` | `queueType`, `subjectType`, `subjectId`, `severity`, `reviewStatus`, `priority` |
| `validation_finding` | `quality` | `targetType`, `targetId`, `findingCode`, `severity`, `resolutionStatus` |
| `transformation_event` | `quality` | `eventType`, `importRunId`, `method`, `version`, `scope` |
| `record_lineage_event` | `quality` | `parentTable`, `parentId`, `childTable`, `childId`, `lineageType` |
| `private_search_document` | `product-evidence` | `documentType`, `entityType`, `entityId`, `searchLanguage`, `reviewStatus` |
| `private_retrieval_trace` | `product-evidence` | `queryTextHash`, `queryMode`, `totalResults`, `reviewStatus`, `createdAt` |
| `private_answer_draft` | `product-evidence` | `retrievalTraceId`, `draftStatus`, `validationGateSummary`, `reviewStatus` |
| `private_guided_answer_run` | `product-evidence` | `answerDraftId`, `promptClass`, `riskState`, `reviewStatus` |
| `private_model_adapter_run` | `product-evidence` | `guidedAnswerRunId`, `providerClass`, `modelClass`, `status` |
| `private_answer_validation_run` | `product-evidence` | `guidedAnswerRunId`, `validationStatus`, `reviewerActionStatus` |
| `cp21c_case` | `cp21c-reference` | `caseId`, `caseType`, `status`, `score`, `riskCategory` |
| `vault_note` | `cp21c-reference` | `artifactType`, `artifactId`, `sourceGraphId`, `status`, `publicSafe` |

## 12. Approved Edge Types

| Edge type | From | To | Status source |
| --- | --- | --- | --- |
| `snapshot_of_source` | `source_snapshot` | `source` | source registry |
| `snapshot_contains_raw_object` | `source_snapshot` | `raw_object` | ingest |
| `raw_object_has_parser_assignment` | `raw_object` | `parser_assignment` | ingest |
| `import_run_uses_snapshot` | `import_run` | `source_snapshot` | ingest |
| `import_run_outputs_record` | `import_run` | any staging/canonical-derived node | ingest/staging |
| `entity_has_provenance` | any content node | `entity_provenance` | content |
| `entity_has_release_state` | any node | `entity_release_state` | content |
| `entity_has_quality_finding` | any node | `validation_finding` | ingest/content |
| `entity_transformed_by` | any node | `transformation_event` | ingest |
| `entity_derived_from` | any node | `record_lineage_event` | ingest |
| `surah_contains_ayah` | `quran_surah` | `quran_ayah` | content |
| `ayah_has_text_version` | `quran_ayah` | `quran_ayah_text` | content |
| `quran_text_uses_edition` | `quran_ayah_text` | `quran_text_edition` | content |
| `partition_scheme_contains_partition` | `quran_partition_scheme` | `quran_partition` | content |
| `quran_partition_spans_ayah` | `quran_partition` | `quran_ayah` | content |
| `ayah_has_translation` | `quran_ayah` | `translation_text` | content |
| `translation_uses_edition` | `translation_text` | `translation_edition` | content |
| `translation_has_footnote` | `translation_text` | `translation_footnote` | content |
| `translation_has_chunk` | `translation_text` | `translation_chunk` | content |
| `tafsir_passage_uses_edition` | `tafsir_passage` | `tafsir_edition` | content |
| `tafsir_explains_ayah` | `tafsir_passage` | `quran_ayah` | content |
| `taxonomy_contains_topic` | `source_taxonomy` | `source_topic` | content |
| `source_topic_related_to` | `source_topic` | `source_topic` | content |
| `source_topic_tags_ayah` | `source_topic` | `quran_ayah` | content |
| `theme_has_label` | `rafiq_theme` | `theme_label` | content |
| `theme_related_to_theme` | `rafiq_theme` | `rafiq_theme` | content |
| `source_topic_maps_to_theme` | `source_topic` | `rafiq_theme` | content |
| `source_ayah_theme_group_contains_ayah` | `source_ayah_theme_group` | `quran_ayah` | content |
| `theme_has_quran_anchor` | `rafiq_theme` | `quran_ayah` | content/reviewed mapping |
| `theme_has_hadith_support` | `rafiq_theme` | `hadith_record` | content/reviewed mapping |
| `hadith_collection_has_edition` | `hadith_collection` | `hadith_edition` | content |
| `hadith_edition_has_book` | `hadith_edition` | `hadith_book` | content |
| `hadith_book_has_chapter` | `hadith_book` | `hadith_chapter` | content |
| `hadith_edition_has_record` | `hadith_edition` | `hadith_record` | content |
| `hadith_book_has_record` | `hadith_book` | `hadith_record` | content |
| `hadith_chapter_has_record` | `hadith_chapter` | `hadith_record` | content |
| `hadith_has_text_version` | `hadith_record` | `hadith_text_version` | content |
| `hadith_has_reference` | `hadith_record` | `hadith_reference` | content |
| `hadith_mapped_to_hadith` | `hadith_record` | `hadith_record` | content |
| `hadith_has_grade_assertion` | `hadith_record` | `hadith_grade_assertion` | content |
| `grade_assertion_has_normalization` | `hadith_grade_assertion` | `hadith_grade_normalization` | content |
| `hadith_has_verification_claim` | `hadith_record` | `hadith_verification_claim` | content |
| `verification_claim_has_reference` | `hadith_verification_claim` | `hadith_verification_reference` | content |
| `ayah_linked_to_hadith` | `quran_ayah` | `hadith_record` | content/reviewed mapping |
| `ayah_related_to_ayah` | `quran_ayah` | `quran_ayah` | content/reviewed mapping |
| `hadith_related_to_hadith` | `hadith_record` | `hadith_record` | content/reviewed mapping |
| `search_document_represents_entity` | `private_search_document` | any content node | product evidence |
| `retrieval_trace_uses_document` | `private_retrieval_trace` | `private_search_document` | product evidence |
| `retrieval_trace_cites_entity` | `private_retrieval_trace` | any content node | product evidence |
| `review_item_targets` | `private_review_queue_item` | any graph node | governance |
| `answer_draft_uses_retrieval_trace` | `private_answer_draft` | `private_retrieval_trace` | product evidence |
| `guided_answer_uses_draft` | `private_guided_answer_run` | `private_answer_draft` | product evidence |
| `model_adapter_run_for_guided_answer` | `private_model_adapter_run` | `private_guided_answer_run` | product evidence |
| `answer_validation_checks_guided_answer` | `private_answer_validation_run` | `private_guided_answer_run` | product evidence |
| `cp21c_case_uses_evidence` | `cp21c_case` | any content/product evidence node | CP21C reference |
| `vault_note_describes` | `vault_note` | any graph node | vault |

## 13. Status Vocabularies

CP22 uses the existing graph contract vocabularies:

- release states: `private_available`, `private_blocked`, `public_blocked`, `public_candidate`, `approved_public`, `published_public`, `retired_public`
- quality states: `clean`, `warning`, `withheld`, `damaged`, `blank`, `unverified`, `replaced`
- review states: `not_required`, `pending`, `technical_review`, `content_review`, `scholar_review`, `approved_private`, `approved_public`, `rejected`, `retired`
- access levels: `system`, `admin`, `knowledge_editor`, `scholar_reviewer`, `developer_private`, `authenticated_user`, `public_user`
- edge statuses: `source_declared`, `imported`, `derived_candidate`, `technical_verified`, `content_review`, `scholar_review`, `approved_private`, `approved_public`, `rejected`, `retired`

Exporter rule:

When database values do not map exactly to graph vocabulary, the exporter must preserve the raw database value in `metadata.rawStatus` and map the graph-facing value conservatively.

## 14. Private/Public Boundary Fields

Every node and edge must include:

```json
{
  "accessLevel": "developer_private",
  "publicSafe": false,
  "releaseState": "private_available",
  "reviewState": "pending",
  "qualityState": "unverified"
}
```

The exact values may differ per entity, but the fields are mandatory.

Public-safe verifier rule:

For CP22 full private graph, the expected count is:

```text
publicSafeNodeCount = 0
publicSafeEdgeCount = 0
```

Any nonzero public-safe count must fail CP22-G09 unless a separate public release plan is linked in the manifest.

## 15. Required Provenance Metadata

Content-bearing nodes are:

- Quran nodes except `quran_surah` and canonical `quran_ayah` identity nodes;
- translation nodes;
- tafsir nodes;
- topic/source theme nodes;
- hadith nodes;
- grade and verification nodes;
- relationship nodes or relationship edges used for guidance or retrieval;
- product evidence nodes that cite Islamic content.

Each content-bearing node must have at least one of:

- `provenanceRefs` pointing to `entity_provenance` node IDs;
- an `entity_has_provenance` edge;
- source-layer refs to `source`, `source_snapshot`, or `raw_object` nodes for manifest-only records.

Each content-bearing node must also have at least one of:

- `releaseStateRefs` pointing to `entity_release_state` node IDs;
- an `entity_has_release_state` edge;
- explicit source-level release metadata if the row is source-layer only.

## 16. Index Contract

Indexes are generated convenience files, not canonical data.

Required indexes:

| Index | Purpose |
| --- | --- |
| `by-node-id.json` | Resolve any node ID to partition and small metadata. |
| `by-edge-id.json` | Resolve any edge ID to partition and endpoint IDs. |
| `by-canonical-ref.json` | Resolve database row references to graph nodes. |
| `by-source-id.json` | Resolve source and snapshot IDs to source graph nodes. |
| `by-snapshot-id.json` | Resolve source snapshots. |
| `by-ayah-key.json` | Resolve `surah:ayah` keys to Quran, translation, tafsir, topic, and relationship nodes. |
| `by-hadith-key.json` | Resolve collection/edition/source hadith keys to hadith nodes. |
| `by-topic-key.json` | Resolve source topic and RAFIQ theme keys. |
| `by-release-state.json` | Support release and public-boundary verification. |
| `by-review-state.json` | Support review queues and internal UI filters. |
| `by-quality-state.json` | Support quality filters and remediation workflows. |
| `public-boundary.json` | Report every public-safe node/edge and every blocker category. |

Index entries must include `id`, `type`, `partition`, `label`, `accessLevel`, and `publicSafe`.

## 17. Checksum And Version Rules

Every generated partition and index must have a SHA-256 checksum in `manifest.json`.

The overall graph checksum is computed from:

1. sorted partition descriptors,
2. sorted index descriptors,
3. manifest source input summary,
4. schema version,
5. graph ID.

The graph checksum must not depend on non-deterministic object key order inside JSON. Exporters must write stable sorted keys where practical.

Version fields:

| Field | Initial value |
| --- | --- |
| `schemaVersion` | `cp22.full-private.v1` |
| `contractVersion` | `RAFIQ_KNOWLEDGE_GRAPHIFY_GRAPH_CONTRACT_V1+CP22-G02` |
| `partitionVersion` | `1` |
| `indexVersion` | `1` |

## 18. Forbidden CP22-G02 Behavior

The schema must not permit exporters to:

- expose private graph artifacts through public APIs;
- mark nodes or edges public-safe by default;
- collapse tafsir into translation;
- collapse hadith grade assertions into one unsourced grade;
- merge hadith records across sources by number or text hash alone;
- invent confidence values;
- store secrets or raw credentials in graph metadata;
- treat CP21C prototype nodes as the full resource graph;
- use the central developer Obsidian vault as a product dependency.

## 19. CP22-G03 Readiness

CP22-G03 may start after this checkpoint.

CP22-G03 should implement only the governance backbone first:

- `sources` partition,
- `governance` partition,
- source/provenance/release indexes,
- manifest checksums,
- public-boundary index with zero public-safe artifacts.

Do not begin Quran, tafsir, translation, or hadith content export before the source/provenance/release backbone verifies.

## 20. CP22-G02 Completion Statement

CP22-G02 is complete as a schema and partition planning checkpoint.

The next checkpoint is CP22-G03 - Source, Provenance, And Release Export.

