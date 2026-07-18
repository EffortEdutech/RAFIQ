#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const GENERATED_AT = '2026-07-16T00:00:00.000Z';
const REFRESH_RUN_ID = 'cp26-refresh-prototype-s04';
const OUT_DIR = join('data/snapshots/cp26/refresh', REFRESH_RUN_ID);

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256Text(text) {
  return createHash('sha256').update(text).digest('hex').toUpperCase();
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

function artifactRef({ artifactId, artifactFamily, path, checksumSha256, rowCount, byteCount, canonicalRefs = [] }) {
  return {
    artifactId,
    artifactFamily,
    path,
    checksumSha256,
    rowCount,
    byteCount,
    sourceSnapshotBatchId: sourceManifest.snapshotBatchId,
    sourceCheckpoint: 'CP26-S04',
    canonicalRefs,
    graphNodeIds: [],
    graphEdgeIds: [],
    vaultPackIds: [],
    publicBoundary: publicBoundary('CP26-S04 refreshed artifact is private-only. Public release remains blocked.'),
  };
}

function byGroup(groupKey) {
  const group = sourceManifest.sourceGroups.find((entry) => entry.groupKey === groupKey);
  if (!group) throw new Error(`Missing CP26 snapshot group: ${groupKey}`);
  return group;
}

function sumGroups(groupKeys, field) {
  return groupKeys.reduce((sum, groupKey) => sum + (byGroup(groupKey)[field] ?? 0), 0);
}

function blockerSeverity(group) {
  if (group.groupKey === 'private_audit') return 'critical';
  if (group.groupKey === 'private_review') return 'high';
  if (group.groupKey === 'private_retrieval') return 'medium';
  if (group.groupKey === 'cross_domain_links') return 'medium';
  return 'low';
}

function blockingStatus(group) {
  if (group.groupKey === 'private_audit') return 'blocking';
  if (group.groupKey === 'private_review') return 'blocking';
  return 'review_required';
}

function referenceType(groupKey) {
  if (groupKey === 'private_audit') return 'audit_event';
  if (groupKey === 'private_review') return 'review_queue_item';
  if (groupKey === 'private_retrieval') return 'retrieval_candidate';
  if (groupKey === 'cross_domain_links') return 'canonical_ref';
  return 'source';
}

const latestPointer = readJson('data/snapshots/cp26/latest-manifest.json');
const sourceManifest = readJson(latestPointer.manifestPath);
const sourceManifestText = readFileSync(latestPointer.manifestPath, 'utf8');

if (latestPointer.manifestSha256 !== sha256Text(sourceManifestText)) {
  throw new Error('Latest CP26 snapshot pointer checksum does not match manifest file.');
}

const graphVault = byGroup('graph_vault_baseline');
const retrieval = byGroup('private_retrieval');
const review = byGroup('private_review');
const audit = byGroup('private_audit');
const crossDomain = byGroup('cross_domain_links');

const graphInputSummary = {
  schemaVersion: 'cp26.refreshed-graph-input-summary.v1',
  refreshRunId: REFRESH_RUN_ID,
  sourceSnapshotBatchId: sourceManifest.snapshotBatchId,
  generatedAt: GENERATED_AT,
  generatedBy: 'scripts/generate_cp26_s04_refresh_pipeline.mjs',
  privateOnly: true,
  publicReleaseApproved: false,
  graphId: 'rafiq-full-private-resource-graph',
  deterministicIdPolicy: {
    mode: 'preserve_existing_ids_when_snapshot_group_identity_matches',
    replacementMappingRequired: false,
    replacementMappingPath: null,
  },
  sourceGroups: sourceManifest.sourceGroups.map((group) => ({
    groupKey: group.groupKey,
    snapshotPath: group.snapshotPath,
    checksumSha256: group.checksumSha256,
    rowCount: group.rowCount,
    canonicalRefCount: group.canonicalRefCount,
    provenanceRefCount: group.provenanceRefCount,
    releaseStateRefCount: group.releaseStateRefCount,
    unresolvedReferenceCount: group.unresolvedReferenceCount,
    qualityWarningCount: group.qualityWarningCount,
  })),
  counts: {
    sourceGroupCount: sourceManifest.counts.sourceGroupCount,
    snapshotArtifactCount: sourceManifest.counts.snapshotArtifactCount,
    canonicalRefCount: sumGroups(sourceManifest.sourceGroups.map((group) => group.groupKey), 'canonicalRefCount'),
    provenanceRefCount: sumGroups(sourceManifest.sourceGroups.map((group) => group.groupKey), 'provenanceRefCount'),
    releaseStateRefCount: sumGroups(sourceManifest.sourceGroups.map((group) => group.groupKey), 'releaseStateRefCount'),
    unresolvedReferenceCount: sourceManifest.counts.unresolvedReferenceCount,
    highOrCriticalBlockerCount: sourceManifest.counts.highOrCriticalBlockerCount,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
  },
  baseline: {
    graphNodeCount: graphVault.canonicalRefCount,
    graphUnresolvedReferenceCount: crossDomain.unresolvedReferenceCount,
  },
  warnings: [
    'CP26-S04 rebuilds a graph input summary from CP26 snapshot groups; it does not regenerate canonical source tables.',
    'Graph and vault IDs are preserved because the source snapshot identity matches the CP22 baseline.',
  ],
  publicBoundary: publicBoundary('CP26-S04 graph input summary is private-only. Public release remains blocked.'),
};

const retrievalHandoffSummary = {
  schemaVersion: 'cp26.refreshed-retrieval-handoff-summary.v1',
  refreshRunId: REFRESH_RUN_ID,
  sourceSnapshotBatchId: sourceManifest.snapshotBatchId,
  generatedAt: GENERATED_AT,
  generatedBy: 'scripts/generate_cp26_s04_refresh_pipeline.mjs',
  privateOnly: true,
  publicReleaseApproved: false,
  sourceGroupKey: retrieval.groupKey,
  deterministicIdPolicy: {
    mode: 'preserve_cp24_candidate_and_route_ids',
    replacementMappingRequired: false,
  },
  counts: {
    candidateRefCount: retrieval.canonicalRefCount,
    unresolvedReferenceCount: retrieval.unresolvedReferenceCount,
    missingCitationOrQualityWarningCount: retrieval.qualityWarningCount,
    publicSafeRetrievalCandidateCount: 0,
    publicSafeRouteItemCount: 0,
  },
  sourceFiles: retrieval.sourceFiles,
  warnings: [
    'Retrieval refresh summary is derived from CP26 snapshot inputs and remains operational metadata only.',
    'Unresolved retrieval references are carried forward for reviewer visibility.',
  ],
  publicBoundary: publicBoundary('CP26-S04 retrieval handoff summary is private-only. Public release remains blocked.'),
};

const reviewerRemediationSummary = {
  schemaVersion: 'cp26.refreshed-reviewer-remediation-summary.v1',
  refreshRunId: REFRESH_RUN_ID,
  sourceSnapshotBatchId: sourceManifest.snapshotBatchId,
  generatedAt: GENERATED_AT,
  generatedBy: 'scripts/generate_cp26_s04_refresh_pipeline.mjs',
  privateOnly: true,
  publicReleaseApproved: false,
  deterministicIdPolicy: {
    mode: 'preserve_cp25_queue_remediation_audit_ids',
    replacementMappingRequired: false,
    auditHistoryOverwriteAllowed: false,
  },
  counts: {
    reviewCanonicalRefCount: review.canonicalRefCount,
    auditCanonicalRefCount: audit.canonicalRefCount,
    reviewerUnresolvedReferenceCount: review.unresolvedReferenceCount,
    auditUnresolvedReferenceCount: audit.unresolvedReferenceCount,
    highOrCriticalReviewerBlockerCount: review.qualityWarningCount,
    highOrCriticalAuditBlockerCount: audit.qualityWarningCount,
    totalUnresolvedReferenceCount: review.unresolvedReferenceCount + audit.unresolvedReferenceCount,
    highOrCriticalBlockerCount: review.qualityWarningCount + audit.qualityWarningCount,
    publicSafeReviewItemCount: 0,
    publicSafeAuditEventCount: 0,
  },
  sourceFiles: [...review.sourceFiles, ...audit.sourceFiles],
  warnings: [
    'Reviewer and audit refresh summaries are append-aware proof artifacts.',
    'Open blockers and unresolved actions remain visible and are not silently resolved.',
  ],
  publicBoundary: publicBoundary('CP26-S04 reviewer remediation summary is private-only. Public release remains blocked.'),
};

const unresolvedGroups = sourceManifest.sourceGroups.filter((group) => (group.unresolvedReferenceCount ?? 0) > 0);
const references = unresolvedGroups.map((group) => ({
  referenceId: `cp26:s04:unresolved:${group.groupKey}`,
  referenceType: referenceType(group.groupKey),
  sourceGroupKey: group.groupKey,
  severity: blockerSeverity(group),
  blockingStatus: blockingStatus(group),
  message: `${group.label} has ${group.unresolvedReferenceCount} unresolved reference(s) carried forward from CP26-S03 snapshot input.`,
  affectedArtifactIds: [`cp26:s04:refresh:${group.groupKey}`],
}));

const unresolvedReferenceReport = {
  schemaVersion: 'cp26.unresolved-reference-report.v1',
  sourceSnapshotBatchId: sourceManifest.snapshotBatchId,
  generatedAt: GENERATED_AT,
  references,
  counts: {
    total: sourceManifest.counts.unresolvedReferenceCount,
    blocking: references.filter((reference) => reference.blockingStatus === 'blocking').length,
    reviewRequired: references.filter((reference) => reference.blockingStatus === 'review_required').length,
    highOrCritical: references.filter((reference) => ['high', 'critical'].includes(reference.severity)).length,
  },
  publicBoundary: publicBoundary('CP26-S04 unresolved reference report is private-only. Public release remains blocked.'),
};

const outputs = [];
const graphOutput = writeJson(join(OUT_DIR, 'refreshed-graph-input-summary.json'), graphInputSummary);
outputs.push(artifactRef({
  artifactId: 'cp26:s04:refreshed:graph-input-summary',
  artifactFamily: 'refresh_output',
  path: graphOutput.path,
  checksumSha256: graphOutput.checksumSha256,
  rowCount: graphInputSummary.sourceGroups.length,
  byteCount: graphOutput.byteCount,
  canonicalRefs: ['snapshot_group:graph_vault_baseline'],
}));

const retrievalOutput = writeJson(join(OUT_DIR, 'refreshed-retrieval-handoff-summary.json'), retrievalHandoffSummary);
outputs.push(artifactRef({
  artifactId: 'cp26:s04:refreshed:retrieval-handoff-summary',
  artifactFamily: 'refresh_output',
  path: retrievalOutput.path,
  checksumSha256: retrievalOutput.checksumSha256,
  rowCount: 1,
  byteCount: retrievalOutput.byteCount,
  canonicalRefs: ['snapshot_group:private_retrieval'],
}));

const reviewerOutput = writeJson(join(OUT_DIR, 'refreshed-reviewer-remediation-summary.json'), reviewerRemediationSummary);
outputs.push(artifactRef({
  artifactId: 'cp26:s04:refreshed:reviewer-remediation-summary',
  artifactFamily: 'refresh_output',
  path: reviewerOutput.path,
  checksumSha256: reviewerOutput.checksumSha256,
  rowCount: 1,
  byteCount: reviewerOutput.byteCount,
  canonicalRefs: ['snapshot_group:private_review', 'snapshot_group:private_audit'],
}));

const unresolvedOutput = writeJson(join(OUT_DIR, 'unresolved-reference-report.json'), unresolvedReferenceReport);
outputs.push(artifactRef({
  artifactId: 'cp26:s04:refreshed:unresolved-reference-report',
  artifactFamily: 'refresh_output',
  path: unresolvedOutput.path,
  checksumSha256: unresolvedOutput.checksumSha256,
  rowCount: references.length,
  byteCount: unresolvedOutput.byteCount,
  canonicalRefs: unresolvedGroups.map((group) => `snapshot_group:${group.groupKey}`),
}));

const refreshRun = {
  schemaVersion: 'cp26.refresh-run.v1',
  refreshRunId: REFRESH_RUN_ID,
  sourceSnapshotBatchId: sourceManifest.snapshotBatchId,
  sourceSnapshotManifestPath: latestPointer.manifestPath,
  sourceSnapshotManifestSha256: latestPointer.manifestSha256,
  checkpoint: 'CP26-S04',
  startedAt: GENERATED_AT,
  completedAt: GENERATED_AT,
  generatedBy: 'scripts/generate_cp26_s04_refresh_pipeline.mjs',
  status: 'completed_with_unresolved_references',
  refreshedOutputs: outputs,
  unresolvedReferenceReportPath: unresolvedOutput.path,
  rollbackManifestPath: null,
  counts: {
    refreshedOutputCount: outputs.length,
    unresolvedReferenceCount: sourceManifest.counts.unresolvedReferenceCount,
    highOrCriticalBlockerCount: sourceManifest.counts.highOrCriticalBlockerCount,
    publicSafeSnapshotRowCount: 0,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
  },
  publicBoundary: publicBoundary('CP26-S04 refresh run is private-only. Public release remains blocked.'),
};

const refreshRunOutput = writeJson(join(OUT_DIR, 'refresh-run.json'), refreshRun);

const latestRefreshPointer = {
  schemaVersion: 'cp26.latest-refresh-pointer.v1',
  refreshRunId: REFRESH_RUN_ID,
  sourceSnapshotBatchId: sourceManifest.snapshotBatchId,
  refreshRunPath: refreshRunOutput.path,
  refreshRunSha256: refreshRunOutput.checksumSha256,
  generatedAt: GENERATED_AT,
  privateOnly: true,
  publicReleaseApproved: false,
  publicBoundary: publicBoundary('CP26 latest refresh pointer is private-only. Public release remains blocked.'),
};

writeJson('data/snapshots/cp26/latest-refresh.json', latestRefreshPointer);

console.log(JSON.stringify({
  refreshRunId: REFRESH_RUN_ID,
  sourceSnapshotBatchId: sourceManifest.snapshotBatchId,
  refreshedOutputCount: outputs.length,
  unresolvedReferenceCount: refreshRun.counts.unresolvedReferenceCount,
  highOrCriticalBlockerCount: refreshRun.counts.highOrCriticalBlockerCount,
  publicSafeGraphNodeCount: 0,
  publicSafeGraphEdgeCount: 0,
  publicSafeVaultArtifactCount: 0,
  publicSafeReviewItemCount: 0,
}, null, 2));
