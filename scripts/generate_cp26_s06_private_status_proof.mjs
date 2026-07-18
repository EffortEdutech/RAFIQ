#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const GENERATED_AT = '2026-07-16T00:00:00.000Z';
const PROOF_ID = 'cp26-private-status-proof-s06';
const OUT_DIR = join('data/snapshots/cp26/status', PROOF_ID);

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

const latestSnapshot = readJson('data/snapshots/cp26/latest-manifest.json');
const snapshotManifest = readJson(latestSnapshot.manifestPath);
const checksumLedger = readJson(snapshotManifest.checksumLedgerPath);
const latestRefresh = readJson('data/snapshots/cp26/latest-refresh.json');
const refreshRun = readJson(latestRefresh.refreshRunPath);
const unresolvedReport = readJson(refreshRun.unresolvedReferenceReportPath);
const latestDiff = readJson('data/snapshots/cp26/latest-diff.json');
const diffProof = readJson(latestDiff.manifestPath);
const rollbackManifest = readJson(diffProof.artifactPaths.rollbackManifest);

const statusProof = {
  schemaVersion: 'cp26.private-status-proof.v1',
  proofId: PROOF_ID,
  generatedAt: GENERATED_AT,
  generatedBy: 'scripts/generate_cp26_s06_private_status_proof.mjs',
  apiRoute: 'GET /api/private-content/snapshots/cp26',
  uiRoute: '/review-workbench',
  checkpoint: 'CP26-S06',
  sourceCheckpoint: 'CP26-S05',
  notice: {
    label: 'UNAPPROVED CONTENT - NOT FOR PUBLICATION',
    message:
      'Private RAFIQ development and testing only. Do not expose through public API, public app, exports, or AI answers until approval gates pass.',
    publicationStatus: 'private_only',
  },
  snapshot: {
    snapshotBatchId: snapshotManifest.snapshotBatchId,
    checkpoint: snapshotManifest.checkpoint,
    generatedAt: snapshotManifest.generatedAt,
    manifestPath: latestSnapshot.manifestPath,
    manifestSha256: latestSnapshot.manifestSha256,
    checksumLedgerPath: snapshotManifest.checksumLedgerPath,
    checksumLedgerSha256: snapshotManifest.checksumLedgerSha256,
    sourceGroupCount: snapshotManifest.counts.sourceGroupCount,
    snapshotArtifactCount: snapshotManifest.counts.snapshotArtifactCount,
    unresolvedReferenceCount: snapshotManifest.counts.unresolvedReferenceCount,
    highOrCriticalBlockerCount: snapshotManifest.counts.highOrCriticalBlockerCount,
    publicSafeSnapshotRowCount: 0,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
  },
  checksum: {
    totalEntries: checksumLedger.counts.totalEntries,
    newCount: checksumLedger.counts.newCount,
    unchangedCount: checksumLedger.counts.unchangedCount,
    changedCount: checksumLedger.counts.changedCount,
    removedCount: checksumLedger.counts.removedCount,
    missingCount: checksumLedger.counts.missingCount,
    staleCount: checksumLedger.counts.staleCount,
  },
  refresh: {
    refreshRunId: refreshRun.refreshRunId,
    status: refreshRun.status,
    refreshRunPath: latestRefresh.refreshRunPath,
    refreshRunSha256: latestRefresh.refreshRunSha256,
    refreshedOutputCount: refreshRun.counts.refreshedOutputCount,
    unresolvedReferenceCount: refreshRun.counts.unresolvedReferenceCount,
    highOrCriticalBlockerCount: refreshRun.counts.highOrCriticalBlockerCount,
  },
  diff: {
    proofId: diffProof.proofId,
    manifestPath: latestDiff.manifestPath,
    manifestSha256: latestDiff.manifestSha256,
    totalChecksumEntryCount: diffProof.counts.totalChecksumEntryCount,
    unchangedCount: diffProof.counts.unchangedCount,
    addedCount: diffProof.counts.addedCount,
    changedCount: diffProof.counts.changedCount,
    removedCount: diffProof.counts.removedCount,
    staleArtifactCount: diffProof.counts.staleArtifactCount,
    mismatchedArtifactCount: diffProof.counts.mismatchedArtifactCount,
    detectedMismatchProbeCount: diffProof.counts.detectedMismatchProbeCount,
  },
  unresolved: {
    reportPath: refreshRun.unresolvedReferenceReportPath,
    total: unresolvedReport.counts.total,
    blocking: unresolvedReport.counts.blocking,
    reviewRequired: unresolvedReport.counts.reviewRequired,
    highOrCritical: unresolvedReport.counts.highOrCritical,
    sampleCount: unresolvedReport.references.slice(0, 4).length,
    samples: unresolvedReport.references.slice(0, 4),
  },
  rollback: {
    manifestPath: diffProof.artifactPaths.rollbackManifest,
    rollbackManifestId: rollbackManifest.rollbackManifestId,
    rollbackTarget: rollbackManifest.rollbackTarget,
    restoreStepCount: rollbackManifest.restoreSteps.length,
  },
  payloadBoundary: {
    sendsFullSourceRows: false,
    sendsFullGraphDump: false,
    sendsFullVaultDump: false,
    sendsFullAuditDump: false,
    sendsSnapshotRowBodies: false,
    boundedUnresolvedSamples: 4,
  },
  publicBoundary: publicBoundary(
    'CP26-S06 exposes bounded private snapshot status only. Public release remains blocked and full source, graph, vault, review, and audit dumps are not sent to the client.',
  ),
};

const proofOutput = writeJson(join(OUT_DIR, 'status-proof.json'), statusProof);
const latestStatusPointer = {
  schemaVersion: 'cp26.latest-status-pointer.v1',
  proofId: PROOF_ID,
  statusProofPath: proofOutput.path,
  statusProofSha256: proofOutput.checksumSha256,
  generatedAt: GENERATED_AT,
  privateOnly: true,
  publicReleaseApproved: false,
  publicBoundary: statusProof.publicBoundary,
};
writeJson('data/snapshots/cp26/latest-status.json', latestStatusPointer);

console.log(JSON.stringify({
  proofId: PROOF_ID,
  apiRoute: statusProof.apiRoute,
  uiRoute: statusProof.uiRoute,
  sourceGroupCount: statusProof.snapshot.sourceGroupCount,
  refreshOutputCount: statusProof.refresh.refreshedOutputCount,
  totalChecksumEntryCount: statusProof.diff.totalChecksumEntryCount,
  unresolvedReferenceCount: statusProof.unresolved.total,
  highOrCriticalBlockerCount: statusProof.refresh.highOrCriticalBlockerCount,
  publicSafeSnapshotRowCount: 0,
}, null, 2));
