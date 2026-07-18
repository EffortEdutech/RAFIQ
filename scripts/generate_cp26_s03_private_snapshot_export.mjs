#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';

const GENERATED_AT = '2026-07-16T00:00:00.000Z';
const BATCH_ID = 'cp26-snapshot-prototype-s03';
const OUT_ROOT = 'data/snapshots/cp26';
const BATCH_DIR = join(OUT_ROOT, 'batches', BATCH_ID);

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256Text(text) {
  return createHash('sha256').update(text).digest('hex').toUpperCase();
}

function sha256File(path) {
  return sha256Text(readFileSync(path, 'utf8'));
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  const text = stableJson(value);
  writeFileSync(path, text, 'utf8');
  return {
    path: path.replaceAll('\\', '/'),
    checksumSha256: sha256Text(text),
    byteCount: Buffer.byteLength(text, 'utf8'),
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

function artifactRef({ artifactId, artifactFamily, path, checksumSha256, rowCount, byteCount, canonicalRefs = [], graphNodeIds = [], graphEdgeIds = [], vaultPackIds = [] }) {
  return {
    artifactId,
    artifactFamily,
    path: path.replaceAll('\\', '/'),
    checksumSha256,
    rowCount,
    byteCount,
    sourceSnapshotBatchId: BATCH_ID,
    sourceCheckpoint: 'CP26-S03',
    canonicalRefs,
    graphNodeIds,
    graphEdgeIds,
    vaultPackIds,
    publicBoundary: publicBoundary('CP26-S03 prototype snapshot artifact is private-only. Public release remains blocked.'),
  };
}

function sourceGroup({ groupKey, label, sourceTables, sourceFiles, rows, canonicalRefCount = 0, provenanceRefCount = 0, releaseStateRefCount = 0, unresolvedReferenceCount = 0, qualityWarningCount = 0, warnings = [] }) {
  return {
    groupKey,
    label,
    sourceTables,
    sourceFiles,
    rows,
    canonicalRefCount,
    provenanceRefCount,
    releaseStateRefCount,
    unresolvedReferenceCount,
    qualityWarningCount,
    warnings,
  };
}

function compactSourceFiles(paths) {
  return [...new Set(paths.filter(Boolean))].slice(0, 24);
}

const graphManifest = readJson('data/graphify/full-private/manifest.json');
const vaultManifest = readJson('data/vault/full-private/manifest.json');
const retrievalManifest = readJson('data/retrieval/cp24/manifest.json');
const reviewManifest = readJson('data/review/cp25/manifest.json');
const auditManifest = readJson('data/review/cp25/audit-decision-ledger-manifest.json');
const reviewExportManifest = readJson('data/review/cp25/a07-export-manifest.json');

const sourceInputs = graphManifest.sourceInputs ?? [];
const partitionByName = Object.fromEntries((graphManifest.partitions ?? []).map((partition) => [partition.name, partition]));

const groups = [
  sourceGroup({
    groupKey: 'source_registry',
    label: 'Source Registry, Manifest, Licensing, Attribution, And Checksum Backbone',
    sourceTables: ['ingest.source_registry', 'ingest.source_snapshots'],
    sourceFiles: compactSourceFiles(sourceInputs.filter((path) => path.includes('data/manifests') || path.includes('data/checksums'))),
    rows: [
      {
        rowType: 'graph_manifest_source_backbone',
        graphId: graphManifest.graphId,
        sourceInputCount: sourceInputs.length,
        sourcePartitionNodeCount: partitionByName.sources?.nodeCount ?? 0,
        sourcePartitionEdgeCount: partitionByName.sources?.edgeCount ?? 0,
        graphChecksumSha256: graphManifest.checksums?.graphChecksumSha256,
      },
      {
        rowType: 'vault_source_pack_summary',
        vaultId: vaultManifest.vaultId,
        sourcePackCount: vaultManifest.categoryCounts?.sources ?? 0,
        vaultChecksumSourceGraphSha256: vaultManifest.sourceGraphChecksumSha256,
      },
    ],
    canonicalRefCount: graphManifest.indexes?.find((index) => index.name === 'by-source-id')?.entryCount ?? 0,
    provenanceRefCount: graphManifest.indexes?.find((index) => index.name === 'by-snapshot-id')?.entryCount ?? 0,
    releaseStateRefCount: graphManifest.indexes?.find((index) => index.name === 'by-release-state')?.entryCount ?? 0,
    warnings: [
      'Prototype snapshot uses checked-in manifests and generated private artifacts, not a live database export.',
      'Source licensing and attribution remain private review metadata.',
    ],
  }),
  sourceGroup({
    groupKey: 'raw_lineage',
    label: 'Raw Object, Import, Validation, Transformation, And Lineage Summary',
    sourceTables: [
      'ingest.raw_objects',
      'ingest.import_runs',
      'ingest.validation_findings',
      'ingest.transformation_events',
      'ingest.record_lineage',
      'ingest.raw_object_parser_assignments',
    ],
    sourceFiles: compactSourceFiles(sourceInputs.filter((path) => path.includes('hadith') || path.includes('checksums'))),
    rows: [
      {
        rowType: 'lineage_backbone_summary',
        graphWarnings: graphManifest.warnings?.filter((warning) => warning.toLowerCase().includes('raw') || warning.toLowerCase().includes('live')) ?? [],
        qualityPartitionNodeCount: partitionByName.quality?.nodeCount ?? 0,
        qualityPartitionEdgeCount: partitionByName.quality?.edgeCount ?? 0,
      },
    ],
    qualityWarningCount: partitionByName.quality?.nodeCount ?? 0,
    warnings: ['Raw bodies are intentionally omitted from CP26-S03 prototype snapshots.'],
  }),
  sourceGroup({
    groupKey: 'quran',
    label: 'Quran Identity, Text Edition, Ayah, And Partition Snapshot Summary',
    sourceTables: [
      'content.quran_surahs',
      'content.quran_ayahs',
      'content.quran_text_editions',
      'content.quran_ayah_texts',
      'content.quran_partition_schemes',
      'content.quran_partitions',
    ],
    sourceFiles: compactSourceFiles(sourceInputs.filter((path) => path.toLowerCase().includes('quran'))),
    rows: [
      {
        rowType: 'quran_graph_partition_summary',
        partition: 'quran',
        nodeCount: partitionByName.quran?.nodeCount ?? 0,
        edgeCount: partitionByName.quran?.edgeCount ?? 0,
        ayahIndexEntryCount: graphManifest.indexes?.find((index) => index.name === 'by-ayah-key')?.entryCount ?? 0,
      },
    ],
    canonicalRefCount: partitionByName.quran?.nodeCount ?? 0,
    provenanceRefCount: partitionByName.quran?.nodeCount ?? 0,
    releaseStateRefCount: partitionByName.quran?.nodeCount ?? 0,
    warnings: ['Quran text bodies are not copied into this prototype snapshot.'],
  }),
  sourceGroup({
    groupKey: 'translations',
    label: 'Translation Edition, Text, Footnote, And Chunk Snapshot Summary',
    sourceTables: ['content.translation_editions', 'content.translation_texts', 'content.translation_footnotes', 'content.translation_chunks'],
    sourceFiles: compactSourceFiles(sourceInputs.filter((path) => path.toLowerCase().includes('translation'))),
    rows: [
      {
        rowType: 'translation_graph_partition_summary',
        partition: 'translations',
        nodeCount: partitionByName.translations?.nodeCount ?? 0,
        edgeCount: partitionByName.translations?.edgeCount ?? 0,
      },
    ],
    canonicalRefCount: partitionByName.translations?.nodeCount ?? 0,
    provenanceRefCount: partitionByName.translations?.nodeCount ?? 0,
    releaseStateRefCount: partitionByName.translations?.nodeCount ?? 0,
    warnings: ['Translation rights and attribution remain private review blockers unless separately approved.'],
  }),
  sourceGroup({
    groupKey: 'tafsir',
    label: 'Tafsir Edition, Passage, And Ayah Link Snapshot Summary',
    sourceTables: ['content.tafsir_editions', 'content.tafsir_passages', 'content.tafsir_passage_ayahs'],
    sourceFiles: compactSourceFiles(sourceInputs.filter((path) => path.toLowerCase().includes('tafsir'))),
    rows: [
      {
        rowType: 'tafsir_graph_partition_summary',
        partition: 'tafsir',
        nodeCount: partitionByName.tafsir?.nodeCount ?? 0,
        edgeCount: partitionByName.tafsir?.edgeCount ?? 0,
      },
    ],
    canonicalRefCount: partitionByName.tafsir?.nodeCount ?? 0,
    provenanceRefCount: partitionByName.tafsir?.nodeCount ?? 0,
    releaseStateRefCount: partitionByName.tafsir?.nodeCount ?? 0,
    qualityWarningCount: graphManifest.warnings?.filter((warning) => warning.toLowerCase().includes('tafsir')).length ?? 0,
    warnings: ['Tafsir quality warnings remain visible; text bodies are not copied into this prototype snapshot.'],
  }),
  sourceGroup({
    groupKey: 'topics_themes',
    label: 'Source Topic, Theme, Mapping, And Ayah Group Snapshot Summary',
    sourceTables: [
      'content.source_taxonomies',
      'content.source_topics',
      'content.source_topic_relations',
      'content.source_topic_ayahs',
      'content.themes',
      'content.theme_labels',
      'content.theme_relations',
      'content.source_topic_theme_mappings',
      'content.source_ayah_theme_groups',
      'content.source_ayah_theme_group_ayahs',
    ],
    sourceFiles: compactSourceFiles(sourceInputs.filter((path) => path.toLowerCase().includes('topic') || path.toLowerCase().includes('theme'))),
    rows: [
      {
        rowType: 'topics_graph_partition_summary',
        partition: 'topics',
        nodeCount: partitionByName.topics?.nodeCount ?? 0,
        edgeCount: partitionByName.topics?.edgeCount ?? 0,
        topicIndexEntryCount: graphManifest.indexes?.find((index) => index.name === 'by-topic-key')?.entryCount ?? 0,
      },
    ],
    canonicalRefCount: partitionByName.topics?.nodeCount ?? 0,
    provenanceRefCount: partitionByName.topics?.nodeCount ?? 0,
    releaseStateRefCount: partitionByName.topics?.nodeCount ?? 0,
    warnings: ['Topic and theme rows are metadata/mapping aids, not religious authority.'],
  }),
  sourceGroup({
    groupKey: 'hadith',
    label: 'Hadith Collection, Edition, Book, Chapter, Record, Text Version, And Reference Snapshot Summary',
    sourceTables: [
      'content.hadith_collections',
      'content.hadith_editions',
      'content.hadith_books',
      'content.hadith_chapters',
      'content.hadith_records',
      'content.hadith_text_versions',
      'content.hadith_references',
      'content.hadith_record_mappings',
    ],
    sourceFiles: compactSourceFiles(sourceInputs.filter((path) => path.toLowerCase().includes('hadith'))),
    rows: [
      {
        rowType: 'hadith_graph_partition_summary',
        partition: 'hadith',
        nodeCount: partitionByName.hadith?.nodeCount ?? 0,
        edgeCount: partitionByName.hadith?.edgeCount ?? 0,
        hadithIndexEntryCount: graphManifest.indexes?.find((index) => index.name === 'by-hadith-key')?.entryCount ?? 0,
      },
    ],
    canonicalRefCount: partitionByName.hadith?.nodeCount ?? 0,
    provenanceRefCount: partitionByName.hadith?.nodeCount ?? 0,
    releaseStateRefCount: partitionByName.hadith?.nodeCount ?? 0,
    warnings: ['Hadith raw text bodies are not exported in CP26-S03. Public rights remain blocked.'],
  }),
  sourceGroup({
    groupKey: 'hadith_quality',
    label: 'Hadith Grade, Normalization, Verification, And Quality Snapshot Summary',
    sourceTables: [
      'content.hadith_grade_assertions',
      'content.hadith_grade_normalizations',
      'content.hadith_verification_claims',
      'content.hadith_verification_references',
    ],
    sourceFiles: compactSourceFiles(sourceInputs.filter((path) => path.toLowerCase().includes('hadith'))),
    rows: [
      {
        rowType: 'hadith_quality_graph_partition_summary',
        partitions: ['hadith-grades', 'quality'],
        gradeNodeCount: partitionByName['hadith-grades']?.nodeCount ?? 0,
        qualityNodeCount: partitionByName.quality?.nodeCount ?? 0,
      },
    ],
    canonicalRefCount: (partitionByName['hadith-grades']?.nodeCount ?? 0) + (partitionByName.quality?.nodeCount ?? 0),
    provenanceRefCount: partitionByName['hadith-grades']?.nodeCount ?? 0,
    releaseStateRefCount: partitionByName['hadith-grades']?.nodeCount ?? 0,
    qualityWarningCount: partitionByName.quality?.nodeCount ?? 0,
    warnings: ['Grade and verification claims remain source-qualified; conflicts must coexist.'],
  }),
  sourceGroup({
    groupKey: 'cross_domain_links',
    label: 'Quran, Hadith, Topic, Theme, And Related Resource Link Snapshot Summary',
    sourceTables: ['content.theme_ayah_links', 'content.theme_hadith_links', 'content.quran_hadith_links', 'content.related_ayahs', 'content.related_hadiths'],
    sourceFiles: ['data/graphify/full-private/indexes/by-canonical-ref.json', 'data/graphify/full-private/indexes/by-edge-id.json'],
    rows: [
      {
        rowType: 'cross_domain_edge_summary',
        graphEdgeCount: graphManifest.counts?.totalEdges ?? 0,
        canonicalIndexEntryCount: graphManifest.indexes?.find((index) => index.name === 'by-canonical-ref')?.entryCount ?? 0,
      },
    ],
    canonicalRefCount: graphManifest.indexes?.find((index) => index.name === 'by-canonical-ref')?.entryCount ?? 0,
    unresolvedReferenceCount: retrievalManifest.counts?.validationHandoff?.unresolvedReferenceCount ?? 0,
    warnings: ['Cross-domain links require origin/method/review state before public use.'],
  }),
  sourceGroup({
    groupKey: 'private_retrieval',
    label: 'Private Retrieval Candidate, Ranking, Evidence Route, And Validation Handoff Snapshot Summary',
    sourceTables: ['content.private_search_documents', 'content.private_retrieval_traces'],
    sourceFiles: Object.values(retrievalManifest.artifactPaths ?? {}),
    rows: [
      {
        rowType: 'cp24_retrieval_summary',
        checkpoint: retrievalManifest.checkpoint,
        fixtureCount: retrievalManifest.counts?.fixtureCount ?? 0,
        candidateCount: retrievalManifest.counts?.candidateCount ?? 0,
        selectedCandidateCount: retrievalManifest.counts?.rankingSelection?.selectedCandidateCount ?? 0,
        remediationCount: retrievalManifest.counts?.validationHandoff?.remediationCount ?? 0,
      },
    ],
    canonicalRefCount: retrievalManifest.counts?.candidateCount ?? 0,
    unresolvedReferenceCount: retrievalManifest.counts?.validationHandoff?.unresolvedReferenceCount ?? 0,
    qualityWarningCount: retrievalManifest.counts?.validationHandoff?.missingCitationCount ?? 0,
    warnings: ['Retrieval snapshot rows express operational relevance only, not religious authority.'],
  }),
  sourceGroup({
    groupKey: 'private_review',
    label: 'Private Review Queue, Assignment, Blocker, And Remediation State Snapshot Summary',
    sourceTables: ['content.private_review_queue_items'],
    sourceFiles: Object.values(reviewManifest.artifactPaths ?? {}),
    rows: [
      {
        rowType: 'cp25_review_summary',
        checkpoint: reviewManifest.checkpoint,
        queueItemCount: reviewManifest.counts?.queueItemCount ?? 0,
        remediationStateCount: reviewManifest.counts?.remediationStateCount ?? 0,
        highOrCriticalQueueItemCount: reviewManifest.counts?.highOrCriticalQueueItemCount ?? 0,
        openBlockingCount: reviewManifest.counts?.openBlockingCount ?? 0,
      },
    ],
    canonicalRefCount: reviewManifest.counts?.queueItemCount ?? 0,
    unresolvedReferenceCount: reviewManifest.counts?.unresolvedReferenceCount ?? 0,
    qualityWarningCount: reviewManifest.counts?.highOrCriticalQueueItemCount ?? 0,
    warnings: ['Reviewer queue snapshots are private workflow records, not publication decisions.'],
  }),
  sourceGroup({
    groupKey: 'private_audit',
    label: 'Private Reviewer Action, Decision Ledger, Audit Export, And Remediation Transition Snapshot Summary',
    sourceTables: [],
    sourceFiles: [...Object.values(auditManifest.artifactPaths ?? {}), ...Object.values(reviewExportManifest.artifactPaths ?? {})],
    rows: [
      {
        rowType: 'cp25_audit_summary',
        auditEventCount: auditManifest.counts?.auditEventCount ?? 0,
        decisionLedgerEntryCount: auditManifest.counts?.decisionLedgerEntryCount ?? 0,
        auditExportEventCount: reviewExportManifest.counts?.auditExportEventCount ?? 0,
        remediationTransitionCount: reviewExportManifest.counts?.remediationTransitionCount ?? 0,
        unresolvedActionCount: reviewExportManifest.counts?.unresolvedActionCount ?? 0,
      },
    ],
    canonicalRefCount: reviewExportManifest.counts?.auditExportEventCount ?? 0,
    unresolvedReferenceCount: reviewExportManifest.counts?.unresolvedActionCount ?? 0,
    qualityWarningCount: reviewExportManifest.counts?.highOrCriticalUnresolvedActionCount ?? 0,
    warnings: ['Audit snapshot rows are append-aware proof artifacts and must not be overwritten silently.'],
  }),
  sourceGroup({
    groupKey: 'graph_vault_baseline',
    label: 'Existing CP22 Graph And Vault Baseline Snapshot Summary',
    sourceTables: [],
    sourceFiles: ['data/graphify/full-private/manifest.json', 'data/vault/full-private/manifest.json'],
    rows: [
      {
        rowType: 'graph_vault_baseline_summary',
        graphId: graphManifest.graphId,
        graphNodeCount: graphManifest.counts?.totalNodes ?? 0,
        graphEdgeCount: graphManifest.counts?.totalEdges ?? 0,
        graphChecksumSha256: graphManifest.checksums?.graphChecksumSha256,
        vaultId: vaultManifest.vaultId,
        vaultArtifactCount: vaultManifest.counts?.artifacts ?? 0,
        vaultSourceGraphChecksumSha256: vaultManifest.sourceGraphChecksumSha256,
      },
    ],
    canonicalRefCount: graphManifest.counts?.totalNodes ?? 0,
    provenanceRefCount: graphManifest.indexes?.find((index) => index.name === 'by-snapshot-id')?.entryCount ?? 0,
    releaseStateRefCount: graphManifest.indexes?.find((index) => index.name === 'by-release-state')?.entryCount ?? 0,
    warnings: ['Graph and vault snapshots are derived metadata, not canonical source data.'],
  }),
];

const sourceGroups = [];
const artifactRefs = [];

for (const group of groups) {
  const snapshot = {
    schemaVersion: `cp26.${group.groupKey}.snapshot.v1`,
    snapshotBatchId: BATCH_ID,
    checkpoint: 'CP26-S03',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp26_s03_private_snapshot_export.mjs',
    groupKey: group.groupKey,
    label: group.label,
    sourceTables: group.sourceTables,
    sourceFiles: group.sourceFiles,
    privateOnly: true,
    publicReleaseApproved: false,
    rows: group.rows,
    publicBoundary: publicBoundary(`CP26-S03 ${group.groupKey} snapshot is private-only. Public release remains blocked.`),
    warnings: group.warnings,
  };
  const fileName = `${group.groupKey.replaceAll('_', '-')}.snapshot.json`;
  const output = writeJson(join(BATCH_DIR, fileName), snapshot);
  const rowCount = group.rows.length;
  const sourceGroupEntry = {
    groupKey: group.groupKey,
    label: group.label,
    sourceTables: group.sourceTables,
    sourceFiles: group.sourceFiles,
    snapshotPath: output.path,
    schemaVersion: snapshot.schemaVersion,
    rowCount,
    checksumSha256: output.checksumSha256,
    canonicalRefCount: group.canonicalRefCount,
    provenanceRefCount: group.provenanceRefCount,
    releaseStateRefCount: group.releaseStateRefCount,
    unresolvedReferenceCount: group.unresolvedReferenceCount,
    qualityWarningCount: group.qualityWarningCount,
    privateOnly: true,
    publicReleaseApproved: false,
    publicBoundary: snapshot.publicBoundary,
    warnings: group.warnings,
  };
  sourceGroups.push(sourceGroupEntry);
  artifactRefs.push(artifactRef({
    artifactId: `cp26:s03:snapshot:${group.groupKey}`,
    artifactFamily: 'snapshot_input',
    path: output.path,
    checksumSha256: output.checksumSha256,
    rowCount,
    byteCount: output.byteCount,
    canonicalRefs: [`snapshot_group:${group.groupKey}`],
  }));
}

const ledgerEntries = artifactRefs.map((ref) => ({
  entryId: `checksum:${ref.artifactId}`,
  artifactRef: ref,
  algorithm: 'sha256',
  checksumSha256: ref.checksumSha256,
  computedAt: GENERATED_AT,
  sourceSnapshotBatchId: BATCH_ID,
  status: 'new',
}));

const checksumLedger = {
  schemaVersion: 'cp26.checksum-ledger.v1',
  sourceSnapshotBatchId: BATCH_ID,
  generatedAt: GENERATED_AT,
  generatedBy: 'scripts/generate_cp26_s03_private_snapshot_export.mjs',
  algorithm: 'sha256',
  entries: ledgerEntries,
  counts: {
    totalEntries: ledgerEntries.length,
    newCount: ledgerEntries.length,
    unchangedCount: 0,
    changedCount: 0,
    removedCount: 0,
    missingCount: 0,
    staleCount: 0,
  },
  publicBoundary: publicBoundary('CP26-S03 checksum ledger is private-only. Public release remains blocked.'),
};
const ledgerOutput = writeJson(join(BATCH_DIR, 'checksum-ledger.json'), checksumLedger);

const unresolvedReferenceCount = sourceGroups.reduce((sum, group) => sum + group.unresolvedReferenceCount, 0);
const highOrCriticalBlockerCount =
  (reviewManifest.counts?.highOrCriticalQueueItemCount ?? 0) +
  (reviewExportManifest.counts?.highOrCriticalUnresolvedActionCount ?? 0);

const manifest = {
  schemaVersion: 'cp26.snapshot-batch-manifest.v1',
  snapshotBatchId: BATCH_ID,
  checkpoint: 'CP26-S03',
  generatedAt: GENERATED_AT,
  generatedBy: 'scripts/generate_cp26_s03_private_snapshot_export.mjs',
  sourceCheckpoint: 'CP26-S01',
  sourceScope: 'Bounded private prototype snapshot export from checked-in CP22, CP24, and CP25 artifacts; no live database or secret-backed export.',
  privateOnly: true,
  publicReleaseApproved: false,
  sourceGroups,
  artifactRefs,
  checksumLedgerPath: ledgerOutput.path,
  checksumLedgerSha256: ledgerOutput.checksumSha256,
  derivedOutputs: [],
  counts: {
    sourceGroupCount: sourceGroups.length,
    snapshotArtifactCount: artifactRefs.length,
    derivedOutputCount: 0,
    unresolvedReferenceCount,
    highOrCriticalBlockerCount,
    publicSafeSnapshotRowCount: 0,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
  },
  publicBoundary: publicBoundary('CP26-S03 snapshot batch is private-only. Public release remains blocked.'),
  warnings: [
    'CP26-S03 uses checked-in generated private artifacts and manifests, not live database rows.',
    'No .env files, secrets, service-role keys, private tokens, or credentials are required or read.',
    'Snapshot rows are bounded summaries for refresh prototyping; they are not canonical source replacements.',
    'Public-safe counts remain zero.',
  ],
};

const manifestOutput = writeJson(join(BATCH_DIR, 'manifest.json'), manifest);
const latestManifest = {
  schemaVersion: 'cp26.latest-snapshot-pointer.v1',
  snapshotBatchId: BATCH_ID,
  manifestPath: manifestOutput.path,
  manifestSha256: manifestOutput.checksumSha256,
  generatedAt: GENERATED_AT,
  privateOnly: true,
  publicReleaseApproved: false,
  publicBoundary: publicBoundary('CP26 latest snapshot pointer is private-only. Public release remains blocked.'),
};
writeJson(join(OUT_ROOT, 'latest-manifest.json'), latestManifest);

if (!existsSync(join(OUT_ROOT, 'rollback'))) mkdirSync(join(OUT_ROOT, 'rollback'), { recursive: true });
if (!existsSync(join(OUT_ROOT, 'diff'))) mkdirSync(join(OUT_ROOT, 'diff'), { recursive: true });

const verification = {
  batchId: BATCH_ID,
  manifestPath: manifestOutput.path,
  manifestSha256: sha256File(manifestOutput.path),
  checksumLedgerPath: ledgerOutput.path,
  checksumLedgerSha256: sha256File(ledgerOutput.path),
  sourceGroupCount: sourceGroups.length,
  snapshotArtifactCount: artifactRefs.length,
  publicSafeSnapshotRowCount: 0,
  generatedAt: GENERATED_AT,
};

console.log(JSON.stringify(verification, null, 2));
