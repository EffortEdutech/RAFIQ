#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const GENERATED_AT = '2026-07-16T00:00:00.000Z';
const OUT_DIR = path.join('data', 'graphify', 'cp27-refresh', 'mapper', 'cp27-g02-snapshot-graph-mapper');
const LATEST_POINTER_PATH = path.join('data', 'graphify', 'cp27-refresh', 'latest-mapper.json');
const SNAPSHOT_POINTER_PATH = path.join('data', 'snapshots', 'cp26', 'latest-manifest.json');
const BASELINE_GRAPH_MANIFEST_PATH = 'data/graphify/full-private/manifest.json';
const BASELINE_VAULT_MANIFEST_PATH = 'data/vault/full-private/manifest.json';

const INDEX_VOCABULARY = [
  'by-node-id',
  'by-edge-id',
  'by-canonical-ref',
  'by-source-id',
  'by-snapshot-id',
  'by-ayah-key',
  'by-hadith-key',
  'by-topic-key',
  'by-release-state',
  'by-review-state',
  'by-quality-state',
  'public-boundary',
];

const MAPPING_RULES = {
  source_registry: {
    targetPartitions: ['sources', 'governance'],
    nodeFamilies: ['source_manifest', 'source_registry_entry', 'source_snapshot', 'source_checksum', 'attribution_policy', 'licensing_boundary'],
    edgeFamilies: ['source_registry_entry_to_manifest', 'source_snapshot_to_checksum', 'source_snapshot_to_provenance', 'source_snapshot_to_release_state', 'source_to_licensing_boundary'],
    indexContributions: ['by-node-id', 'by-edge-id', 'by-canonical-ref', 'by-source-id', 'by-snapshot-id', 'by-release-state', 'public-boundary'],
    baselineComparisonMode: 'matched',
  },
  raw_lineage: {
    targetPartitions: ['quality', 'sources'],
    nodeFamilies: ['raw_lineage_summary', 'import_run', 'validation_finding', 'transformation_event', 'parser_assignment'],
    edgeFamilies: ['raw_lineage_summary_to_import_run', 'raw_lineage_summary_to_validation_finding', 'validation_finding_to_quality_state', 'parser_assignment_to_source_snapshot'],
    indexContributions: ['by-node-id', 'by-edge-id', 'by-canonical-ref', 'by-snapshot-id', 'by-quality-state', 'public-boundary'],
    baselineComparisonMode: 'deferred',
  },
  quran: {
    targetPartitions: ['quran'],
    nodeFamilies: ['quran_surah', 'quran_ayah', 'quran_text_edition', 'quran_ayah_text_reference', 'quran_partition_scheme', 'quran_partition'],
    edgeFamilies: ['quran_surah_to_ayah', 'quran_ayah_to_text_edition', 'quran_ayah_to_partition', 'quran_partition_scheme_to_partition'],
    indexContributions: ['by-node-id', 'by-edge-id', 'by-canonical-ref', 'by-ayah-key', 'by-release-state', 'public-boundary'],
    baselineComparisonMode: 'matched',
  },
  translations: {
    targetPartitions: ['translations'],
    nodeFamilies: ['translation_edition', 'translation_text_reference', 'translation_footnote_reference', 'translation_chunk'],
    edgeFamilies: ['translation_edition_to_text_reference', 'translation_text_reference_to_ayah', 'translation_text_reference_to_footnote', 'translation_chunk_to_translation_text_reference'],
    indexContributions: ['by-node-id', 'by-edge-id', 'by-canonical-ref', 'by-ayah-key', 'by-release-state', 'public-boundary'],
    baselineComparisonMode: 'matched',
  },
  tafsir: {
    targetPartitions: ['tafsir'],
    nodeFamilies: ['tafsir_edition', 'tafsir_passage_reference', 'tafsir_ayah_link'],
    edgeFamilies: ['tafsir_edition_to_passage_reference', 'tafsir_passage_reference_to_ayah', 'tafsir_passage_reference_to_source'],
    indexContributions: ['by-node-id', 'by-edge-id', 'by-canonical-ref', 'by-ayah-key', 'by-release-state', 'by-quality-state', 'public-boundary'],
    baselineComparisonMode: 'matched',
  },
  topics_themes: {
    targetPartitions: ['topics'],
    nodeFamilies: ['source_taxonomy', 'source_topic', 'theme', 'theme_label', 'source_ayah_theme_group'],
    edgeFamilies: ['source_topic_to_ayah', 'source_topic_to_theme', 'theme_to_label', 'theme_to_theme', 'source_ayah_theme_group_to_ayah'],
    indexContributions: ['by-node-id', 'by-edge-id', 'by-canonical-ref', 'by-topic-key', 'by-ayah-key', 'public-boundary'],
    baselineComparisonMode: 'matched',
  },
  hadith: {
    targetPartitions: ['hadith'],
    nodeFamilies: ['hadith_collection', 'hadith_edition', 'hadith_book', 'hadith_chapter', 'hadith_record', 'hadith_text_version_reference', 'hadith_reference'],
    edgeFamilies: ['hadith_collection_to_edition', 'hadith_edition_to_book', 'hadith_book_to_chapter', 'hadith_chapter_to_record', 'hadith_record_to_text_version_reference', 'hadith_record_to_reference'],
    indexContributions: ['by-node-id', 'by-edge-id', 'by-canonical-ref', 'by-hadith-key', 'by-release-state', 'public-boundary'],
    baselineComparisonMode: 'matched',
  },
  hadith_quality: {
    targetPartitions: ['hadith-grades', 'quality'],
    nodeFamilies: ['hadith_grade_assertion', 'hadith_grade_normalization', 'hadith_verification_claim', 'hadith_verification_reference', 'quality_finding'],
    edgeFamilies: ['hadith_record_to_grade_assertion', 'grade_assertion_to_normalization', 'hadith_record_to_verification_claim', 'verification_claim_to_reference', 'grade_assertion_to_quality_state'],
    indexContributions: ['by-node-id', 'by-edge-id', 'by-canonical-ref', 'by-hadith-key', 'by-quality-state', 'public-boundary'],
    baselineComparisonMode: 'matched',
  },
  cross_domain_links: {
    targetPartitions: ['quran', 'hadith', 'topics', 'product-evidence'],
    nodeFamilies: ['cross_domain_link', 'quran_hadith_link', 'related_ayah_link', 'related_hadith_link', 'theme_resource_link'],
    edgeFamilies: ['ayah_to_hadith', 'theme_to_hadith', 'theme_to_ayah', 'related_ayah_to_ayah', 'related_hadith_to_hadith'],
    indexContributions: ['by-node-id', 'by-edge-id', 'by-canonical-ref', 'by-ayah-key', 'by-hadith-key', 'by-topic-key', 'by-quality-state', 'public-boundary'],
    baselineComparisonMode: 'changed',
  },
  private_retrieval: {
    targetPartitions: ['product-evidence'],
    nodeFamilies: ['private_search_document', 'private_retrieval_trace', 'retrieval_candidate', 'evidence_route', 'validation_handoff'],
    edgeFamilies: ['search_document_to_graph_ref', 'retrieval_trace_to_candidate', 'candidate_to_evidence_route', 'evidence_route_to_validation_handoff', 'validation_handoff_to_validation_gate'],
    indexContributions: ['by-node-id', 'by-edge-id', 'by-canonical-ref', 'by-review-state', 'by-quality-state', 'public-boundary'],
    baselineComparisonMode: 'changed',
  },
  private_review: {
    targetPartitions: ['product-evidence', 'quality'],
    nodeFamilies: ['private_review_queue_item', 'review_assignment', 'review_blocker', 'remediation_state', 'review_decision_context'],
    edgeFamilies: ['review_queue_item_to_graph_ref', 'review_queue_item_to_assignment', 'review_queue_item_to_blocker', 'review_blocker_to_remediation_state', 'review_queue_item_to_review_state'],
    indexContributions: ['by-node-id', 'by-edge-id', 'by-canonical-ref', 'by-review-state', 'by-quality-state', 'public-boundary'],
    baselineComparisonMode: 'added',
  },
  private_audit: {
    targetPartitions: ['product-evidence', 'quality'],
    nodeFamilies: ['audit_event', 'decision_ledger_entry', 'remediation_transition', 'audit_actor_reference'],
    edgeFamilies: ['audit_event_to_decision_ledger_entry', 'decision_ledger_entry_to_remediation_transition', 'audit_event_to_review_queue_item', 'audit_event_to_graph_ref'],
    indexContributions: ['by-node-id', 'by-edge-id', 'by-canonical-ref', 'by-review-state', 'by-quality-state', 'public-boundary'],
    baselineComparisonMode: 'added',
  },
  graph_vault_baseline: {
    targetPartitions: ['governance', 'sources'],
    nodeFamilies: ['baseline_graph_manifest', 'baseline_vault_manifest', 'baseline_graph_partition', 'baseline_graph_index', 'baseline_vault_artifact'],
    edgeFamilies: ['baseline_graph_manifest_to_partition', 'baseline_graph_manifest_to_index', 'baseline_vault_manifest_to_artifact', 'baseline_to_snapshot_batch', 'baseline_to_refresh_mapper'],
    indexContributions: ['by-node-id', 'by-edge-id', 'by-canonical-ref', 'by-snapshot-id', 'public-boundary'],
    baselineComparisonMode: 'matched',
  },
};

const DEFERRED_ITEMS = [
  {
    id: 'cp27:g02:deferred:raw-text-bodies',
    sourceGroups: ['quran', 'translations', 'tafsir', 'hadith'],
    status: 'deferred',
    reason: 'Raw Quran, translation, tafsir, and hadith text bodies are intentionally not exported by the CP26 prototype snapshot.',
    requiredBeforeExpansion: 'Approved private source snapshot with licensing, attribution, and validation coverage.',
  },
  {
    id: 'cp27:g02:deferred:record-level-raw-lineage',
    sourceGroups: ['raw_lineage', 'hadith'],
    status: 'deferred',
    reason: 'Raw object inventory is summarized by checked-in manifests and is not expanded to every raw object row.',
    requiredBeforeExpansion: 'Safe ingest schema snapshot or live export path that does not require secret access.',
  },
  {
    id: 'cp27:g02:deferred:live-provenance-release-rows',
    sourceGroups: ['source_registry', 'quran', 'translations', 'tafsir', 'hadith', 'hadith_quality'],
    status: 'deferred',
    reason: 'Live provenance and release-state database rows are not available in CP26-S03 checked-in snapshots.',
    requiredBeforeExpansion: 'Approved live snapshot export or checked-in safe database extract.',
  },
  {
    id: 'cp27:g02:blocked:public-safe-export',
    sourceGroups: Object.keys(MAPPING_RULES),
    status: 'blocked',
    reason: 'Public release remains blocked. Mapper outputs must keep all public-safe graph, edge, vault, and snapshot counts at zero.',
    requiredBeforeExpansion: 'Separate governance approval and release contract outside CP27.',
  },
];

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256Text(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
}

function sha256File(filePath) {
  return sha256Text(readFileSync(filePath, 'utf8'));
}

function mapperNodeId(partition, sourceGroupKey, entityFamily, stableKey) {
  return `cp27:${partition}:${sourceGroupKey}:${entityFamily}:${stableKey}`;
}

function mapperEdgeId(relationshipFamily, fromId, toId) {
  const digest = sha256Text(`${relationshipFamily}\n${fromId}\n${toId}`).slice(0, 16).toLowerCase();
  return `cp27:edge:${relationshipFamily}:${digest}`;
}

function artifactForGroup(manifest, sourceGroupKey) {
  return (manifest.artifactRefs || []).find((artifact) => artifact.artifactId === `cp26:s03:snapshot:${sourceGroupKey}`);
}

function writeJsonWithChecksum(filePath, value) {
  const text = stableJson(value);
  writeFileSync(filePath, text);
  return {
    path: filePath.replaceAll(path.sep, '/'),
    checksumSha256: sha256Text(text),
    byteCount: Buffer.byteLength(text),
  };
}

function publicBoundary(message) {
  return {
    privateOnly: true,
    publicReleaseApproved: false,
    publicRouteExposed: false,
    publicSafeChangeRequested: false,
    publicSafeSnapshotRowCount: 0,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
    publicSafeRetrievalCandidateCount: 0,
    publicSafeRouteItemCount: 0,
    publicSafeReviewItemCount: 0,
    publicSafeAuditEventCount: 0,
    message,
  };
}

function main() {
  const latestSnapshotPointer = readJson(SNAPSHOT_POINTER_PATH);
  const snapshotManifestPath = latestSnapshotPointer.manifestPath;
  const snapshotManifest = readJson(snapshotManifestPath);
  const baselineGraphManifest = readJson(BASELINE_GRAPH_MANIFEST_PATH);
  const baselineVaultManifest = readJson(BASELINE_VAULT_MANIFEST_PATH);
  const actualSnapshotManifestSha256 = sha256File(snapshotManifestPath);

  if (actualSnapshotManifestSha256 !== latestSnapshotPointer.manifestSha256) {
    throw new Error(`Latest snapshot manifest checksum mismatch: ${actualSnapshotManifestSha256}`);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(path.dirname(LATEST_POINTER_PATH), { recursive: true });

  const sourceGroupMappings = snapshotManifest.sourceGroups.map((sourceGroup) => {
    const rule = MAPPING_RULES[sourceGroup.groupKey];
    if (!rule) {
      return {
        sourceGroupKey: sourceGroup.groupKey,
        status: 'unmapped',
        reason: 'No CP27-G02 mapping rule exists for this source group.',
      };
    }

    const artifactRef = artifactForGroup(snapshotManifest, sourceGroup.groupKey);
    const primaryPartition = rule.targetPartitions[0];
    const groupNodeId = mapperNodeId(primaryPartition, sourceGroup.groupKey, 'snapshot_group', sourceGroup.groupKey);
    const artifactNodeId = mapperNodeId(primaryPartition, sourceGroup.groupKey, 'snapshot_artifact', artifactRef?.artifactId || sourceGroup.snapshotPath);

    return {
      sourceGroupKey: sourceGroup.groupKey,
      label: sourceGroup.label,
      status: 'mapped',
      snapshotPath: sourceGroup.snapshotPath,
      snapshotChecksumSha256: sourceGroup.checksumSha256,
      snapshotArtifactId: artifactRef?.artifactId || null,
      rowCount: sourceGroup.rowCount,
      canonicalRefCount: sourceGroup.canonicalRefCount,
      provenanceRefCount: sourceGroup.provenanceRefCount,
      releaseStateRefCount: sourceGroup.releaseStateRefCount,
      unresolvedReferenceCount: sourceGroup.unresolvedReferenceCount,
      qualityWarningCount: sourceGroup.qualityWarningCount,
      targetPartitions: rule.targetPartitions,
      nodeFamilies: rule.nodeFamilies,
      edgeFamilies: rule.edgeFamilies,
      indexContributions: rule.indexContributions,
      baselineComparisonMode: rule.baselineComparisonMode,
      exampleNodeIds: {
        snapshotGroup: groupNodeId,
        snapshotArtifact: artifactNodeId,
      },
      exampleEdgeIds: {
        snapshotGroupToArtifact: mapperEdgeId('snapshot_group_to_artifact', groupNodeId, artifactNodeId),
      },
      publicBoundary: publicBoundary(`CP27-G02 mapper for ${sourceGroup.groupKey} remains private-only. Public release remains blocked.`),
    };
  });

  const unmappedSourceGroups = sourceGroupMappings.filter((mapping) => mapping.status !== 'mapped');
  const nodeFamilies = [...new Set(sourceGroupMappings.flatMap((mapping) => mapping.nodeFamilies || []))].sort();
  const edgeFamilies = [...new Set(sourceGroupMappings.flatMap((mapping) => mapping.edgeFamilies || []))].sort();
  const targetPartitions = [...new Set(sourceGroupMappings.flatMap((mapping) => mapping.targetPartitions || []))].sort();
  const indexContributions = [...new Set(sourceGroupMappings.flatMap((mapping) => mapping.indexContributions || []))].sort();

  const counts = {
    sourceGroupCount: snapshotManifest.counts.sourceGroupCount,
    snapshotArtifactCount: snapshotManifest.counts.snapshotArtifactCount,
    mappedSourceGroupCount: sourceGroupMappings.length - unmappedSourceGroups.length,
    unmappedSourceGroupCount: unmappedSourceGroups.length,
    targetPartitionCount: targetPartitions.length,
    nodeFamilyCount: nodeFamilies.length,
    edgeFamilyCount: edgeFamilies.length,
    indexContributionCount: indexContributions.length,
    deferredItemCount: DEFERRED_ITEMS.filter((item) => item.status === 'deferred').length,
    blockedItemCount: DEFERRED_ITEMS.filter((item) => item.status === 'blocked').length,
    unresolvedReferenceCount: snapshotManifest.counts.unresolvedReferenceCount,
    highOrCriticalBlockerCount: snapshotManifest.counts.highOrCriticalBlockerCount,
    publicSafeSnapshotRowCount: 0,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
  };

  const contract = {
    schemaVersion: 'cp27.snapshot-graph-mapper-contract.v1',
    checkpoint: 'CP27-G02',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp27_g02_snapshot_graph_mapper.mjs',
    mapperId: 'cp27-g02-snapshot-graph-mapper',
    mapperKind: 'snapshot_to_node_edge_contract',
    scope: 'Deterministic mapping from CP26 snapshot source groups to CP27 private graph node and edge families. This checkpoint does not generate refreshed graph partitions.',
    sourceSnapshotBatchId: snapshotManifest.snapshotBatchId,
    sourceSnapshotManifestPath: snapshotManifestPath,
    sourceSnapshotManifestSha256: actualSnapshotManifestSha256,
    baselineGraphManifestPath: BASELINE_GRAPH_MANIFEST_PATH,
    baselineGraphChecksumSha256: baselineGraphManifest.checksums.graphChecksumSha256,
    baselineVaultManifestPath: BASELINE_VAULT_MANIFEST_PATH,
    baselineVaultSourceGraphChecksumSha256: baselineVaultManifest.sourceGraphChecksumSha256,
    outputDir: OUT_DIR.replaceAll(path.sep, '/'),
    idPolicy: {
      canonicalRefsRemainAuthoritative: true,
      graphIdsAreDerived: true,
      nodeIdTemplate: 'cp27:{partition}:{sourceGroupKey}:{entityFamily}:{stableKey}',
      edgeIdTemplate: 'cp27:edge:{relationshipFamily}:{sha256(fromId + toId).slice(0,16)}',
      snapshotGroupNodeExample: mapperNodeId('quran', 'quran', 'snapshot_group', 'quran'),
      relationshipEdgeExample: mapperEdgeId('snapshot_group_to_artifact', mapperNodeId('quran', 'quran', 'snapshot_group', 'quran'), mapperNodeId('quran', 'quran', 'snapshot_artifact', 'cp26:s03:snapshot:quran')),
      cp22CompatibilityRule: 'Preserve canonical refs and partition vocabulary for comparison. CP27 mapper IDs are namespaced and may be superseded by CP27-G03 when exact CP22-compatible graph IDs can be rebuilt safely.',
    },
    partitionVocabulary: targetPartitions,
    indexVocabulary: INDEX_VOCABULARY,
    counts,
    publicBoundary: publicBoundary('CP27-G02 mapper outputs are private-only. Public release remains blocked.'),
    warnings: [
      'CP27-G02 is a mapper proof only; it does not write refreshed partitions or indexes.',
      'CP22 full-private graph and vault directories are comparison baselines only and are not overwritten.',
      'Raw Quran, tafsir, translation, and hadith text bodies remain deferred.',
      'All public-safe counts remain zero.',
    ],
  };

  const sourceGroupMapping = {
    schemaVersion: 'cp27.source-group-node-edge-map.v1',
    checkpoint: 'CP27-G02',
    generatedAt: GENERATED_AT,
    mapperId: contract.mapperId,
    sourceSnapshotBatchId: snapshotManifest.snapshotBatchId,
    mappings: sourceGroupMappings,
    counts,
    publicBoundary: contract.publicBoundary,
  };

  const nodeEdgePlan = {
    schemaVersion: 'cp27.node-edge-family-plan.v1',
    checkpoint: 'CP27-G02',
    generatedAt: GENERATED_AT,
    mapperId: contract.mapperId,
    targetPartitions,
    nodeFamilies,
    edgeFamilies,
    indexContributions,
    baselineComparisonModes: [...new Set(sourceGroupMappings.map((mapping) => mapping.baselineComparisonMode))].sort(),
    groupPlan: sourceGroupMappings.map((mapping) => ({
      sourceGroupKey: mapping.sourceGroupKey,
      targetPartitions: mapping.targetPartitions,
      nodeFamilies: mapping.nodeFamilies,
      edgeFamilies: mapping.edgeFamilies,
      indexContributions: mapping.indexContributions,
      baselineComparisonMode: mapping.baselineComparisonMode,
    })),
    counts,
    publicBoundary: contract.publicBoundary,
  };

  const deferredBlockedReport = {
    schemaVersion: 'cp27.mapper-deferred-blocked-report.v1',
    checkpoint: 'CP27-G02',
    generatedAt: GENERATED_AT,
    mapperId: contract.mapperId,
    unmappedSourceGroups,
    deferredOrBlockedItems: DEFERRED_ITEMS,
    unresolvedReferenceCount: snapshotManifest.counts.unresolvedReferenceCount,
    highOrCriticalBlockerCount: snapshotManifest.counts.highOrCriticalBlockerCount,
    counts,
    publicBoundary: contract.publicBoundary,
  };

  const artifacts = [
    writeJsonWithChecksum(path.join(OUT_DIR, 'mapper-contract.json'), contract),
    writeJsonWithChecksum(path.join(OUT_DIR, 'source-group-mapping.json'), sourceGroupMapping),
    writeJsonWithChecksum(path.join(OUT_DIR, 'node-edge-plan.json'), nodeEdgePlan),
    writeJsonWithChecksum(path.join(OUT_DIR, 'deferred-blocked-report.json'), deferredBlockedReport),
  ];

  const checksumLedger = {
    schemaVersion: 'cp27.mapper-checksum-ledger.v1',
    checkpoint: 'CP27-G02',
    generatedAt: GENERATED_AT,
    mapperId: contract.mapperId,
    artifacts,
    publicBoundary: contract.publicBoundary,
  };
  const checksumLedgerArtifact = writeJsonWithChecksum(path.join(OUT_DIR, 'checksum-ledger.json'), checksumLedger);

  const latestPointer = {
    schemaVersion: 'cp27.latest-mapper-pointer.v1',
    checkpoint: 'CP27-G02',
    generatedAt: GENERATED_AT,
    mapperId: contract.mapperId,
    mapperDir: OUT_DIR.replaceAll(path.sep, '/'),
    mapperContractPath: artifacts[0].path,
    mapperContractSha256: artifacts[0].checksumSha256,
    sourceGroupMappingPath: artifacts[1].path,
    nodeEdgePlanPath: artifacts[2].path,
    deferredBlockedReportPath: artifacts[3].path,
    checksumLedgerPath: checksumLedgerArtifact.path,
    checksumLedgerSha256: checksumLedgerArtifact.checksumSha256,
    sourceSnapshotBatchId: snapshotManifest.snapshotBatchId,
    sourceSnapshotManifestPath: snapshotManifestPath,
    sourceSnapshotManifestSha256: actualSnapshotManifestSha256,
    counts,
    publicBoundary: contract.publicBoundary,
  };
  writeJsonWithChecksum(LATEST_POINTER_PATH, latestPointer);

  console.log(`CP27-G02 mapper generated at ${OUT_DIR.replaceAll(path.sep, '/')}`);
  console.log(`Mapped ${counts.mappedSourceGroupCount}/${counts.sourceGroupCount} source groups; deferred=${counts.deferredItemCount}; blocked=${counts.blockedItemCount}; public-safe graph nodes=${counts.publicSafeGraphNodeCount}; public-safe graph edges=${counts.publicSafeGraphEdgeCount}.`);
}

main();
