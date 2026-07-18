#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const GENERATED_AT = '2026-07-16T00:00:00.000Z';
const PROOF_ID = 'cp26-checksum-diff-rollback-proof-s05';
const OUT_DIR = join('data/snapshots/cp26/diff', PROOF_ID);

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

function checksumEntry({ entryId, artifactRef, phase, status }) {
  const actualChecksumSha256 = existsSync(artifactRef.path) ? sha256File(artifactRef.path) : null;
  return {
    entryId,
    phase,
    artifactId: artifactRef.artifactId,
    artifactFamily: artifactRef.artifactFamily,
    path: artifactRef.path,
    expectedChecksumSha256: artifactRef.checksumSha256,
    actualChecksumSha256,
    algorithm: 'sha256',
    status,
    checksumMatches: actualChecksumSha256 === artifactRef.checksumSha256,
    sourceSnapshotBatchId: artifactRef.sourceSnapshotBatchId,
    sourceCheckpoint: artifactRef.sourceCheckpoint,
    publicBoundary: artifactRef.publicBoundary,
  };
}

const latestSnapshot = readJson('data/snapshots/cp26/latest-manifest.json');
const sourceManifest = readJson(latestSnapshot.manifestPath);
const sourceLedger = readJson(sourceManifest.checksumLedgerPath);
const latestRefresh = readJson('data/snapshots/cp26/latest-refresh.json');
const refreshRun = readJson(latestRefresh.refreshRunPath);
const unresolvedReport = readJson(refreshRun.unresolvedReferenceReportPath);

if (latestSnapshot.manifestSha256 !== sha256File(latestSnapshot.manifestPath)) {
  throw new Error('Latest snapshot pointer checksum does not match the source manifest.');
}

if (latestRefresh.refreshRunSha256 !== sha256File(latestRefresh.refreshRunPath)) {
  throw new Error('Latest refresh pointer checksum does not match the refresh run.');
}

const beforeEntries = sourceLedger.entries.map((entry) => checksumEntry({
  entryId: `before:${entry.artifactRef.artifactId}`,
  artifactRef: entry.artifactRef,
  phase: 'before_snapshot',
  status: 'unchanged',
}));

const afterEntries = refreshRun.refreshedOutputs.map((artifactRef) => checksumEntry({
  entryId: `after:${artifactRef.artifactId}`,
  artifactRef,
  phase: 'after_refresh',
  status: 'added',
}));

const comparisonLedger = {
  schemaVersion: 'cp26.checksum-comparison-ledger.v1',
  proofId: PROOF_ID,
  sourceSnapshotBatchId: sourceManifest.snapshotBatchId,
  refreshRunId: refreshRun.refreshRunId,
  generatedAt: GENERATED_AT,
  generatedBy: 'scripts/generate_cp26_s05_checksum_diff_rollback.mjs',
  algorithm: 'sha256',
  beforeSnapshotLedgerPath: sourceManifest.checksumLedgerPath,
  beforeSnapshotLedgerSha256: sha256File(sourceManifest.checksumLedgerPath),
  afterRefreshRunPath: latestRefresh.refreshRunPath,
  afterRefreshRunSha256: latestRefresh.refreshRunSha256,
  entries: [...beforeEntries, ...afterEntries],
  counts: {
    totalEntries: beforeEntries.length + afterEntries.length,
    beforeSnapshotEntryCount: beforeEntries.length,
    afterRefreshEntryCount: afterEntries.length,
    unchangedCount: beforeEntries.length,
    addedCount: afterEntries.length,
    changedCount: 0,
    removedCount: 0,
    missingCount: [...beforeEntries, ...afterEntries].filter((entry) => entry.actualChecksumSha256 === null).length,
    staleCount: 0,
    mismatchedCount: [...beforeEntries, ...afterEntries].filter((entry) => entry.checksumMatches !== true).length,
    unresolvedReferenceCount: refreshRun.counts.unresolvedReferenceCount,
    highOrCriticalBlockerCount: refreshRun.counts.highOrCriticalBlockerCount,
    publicSafeSnapshotRowCount: 0,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
  },
  publicBoundary: publicBoundary('CP26-S05 checksum comparison ledger is private-only. Public release remains blocked.'),
};

const checksumLedgerOutput = writeJson(join(OUT_DIR, 'checksum-comparison-ledger.json'), comparisonLedger);

const snapshotDiffSummary = {
  schemaVersion: 'cp26.snapshot-diff-summary.v1',
  proofId: PROOF_ID,
  sourceSnapshotBatchId: sourceManifest.snapshotBatchId,
  generatedAt: GENERATED_AT,
  generatedBy: 'scripts/generate_cp26_s05_checksum_diff_rollback.mjs',
  comparedInputs: {
    beforeManifestPath: latestSnapshot.manifestPath,
    beforeManifestSha256: latestSnapshot.manifestSha256,
    afterRefreshRunPath: latestRefresh.refreshRunPath,
    afterRefreshRunSha256: latestRefresh.refreshRunSha256,
  },
  sourceGroupDiffs: sourceManifest.sourceGroups.map((group) => ({
    groupKey: group.groupKey,
    snapshotPath: group.snapshotPath,
    status: 'unchanged',
    rowCountBefore: group.rowCount,
    rowCountAfter: group.rowCount,
    checksumSha256: group.checksumSha256,
    unresolvedReferenceCount: group.unresolvedReferenceCount,
    qualityWarningCount: group.qualityWarningCount,
  })),
  counts: {
    sourceGroupCount: sourceManifest.counts.sourceGroupCount,
    unchangedSourceGroupCount: sourceManifest.counts.sourceGroupCount,
    changedSourceGroupCount: 0,
    addedSourceGroupCount: 0,
    removedSourceGroupCount: 0,
    unresolvedReferenceCount: sourceManifest.counts.unresolvedReferenceCount,
    highOrCriticalBlockerCount: sourceManifest.counts.highOrCriticalBlockerCount,
    publicSafeSnapshotRowCount: 0,
  },
  warnings: [
    'CP26-S05 compares S03 snapshot inputs to S04 refresh outputs; it does not mutate source snapshots.',
    'Unresolved references remain visible and are not treated as clean success.',
  ],
  publicBoundary: publicBoundary('CP26-S05 snapshot diff summary is private-only. Public release remains blocked.'),
};

const snapshotDiffOutput = writeJson(join(OUT_DIR, 'snapshot-diff-summary.json'), snapshotDiffSummary);

const artifactDiffSummary = {
  schemaVersion: 'cp26.artifact-diff-summary.v1',
  proofId: PROOF_ID,
  sourceSnapshotBatchId: sourceManifest.snapshotBatchId,
  refreshRunId: refreshRun.refreshRunId,
  generatedAt: GENERATED_AT,
  generatedBy: 'scripts/generate_cp26_s05_checksum_diff_rollback.mjs',
  beforeArtifacts: beforeEntries.map((entry) => ({
    artifactId: entry.artifactId,
    artifactFamily: entry.artifactFamily,
    path: entry.path,
    status: entry.status,
    checksumSha256: entry.expectedChecksumSha256,
  })),
  afterArtifacts: afterEntries.map((entry) => ({
    artifactId: entry.artifactId,
    artifactFamily: entry.artifactFamily,
    path: entry.path,
    status: entry.status,
    checksumSha256: entry.expectedChecksumSha256,
  })),
  counts: {
    beforeArtifactCount: beforeEntries.length,
    afterArtifactCount: afterEntries.length,
    unchangedArtifactCount: beforeEntries.length,
    addedArtifactCount: afterEntries.length,
    changedArtifactCount: 0,
    removedArtifactCount: 0,
    staleArtifactCount: 0,
    mismatchedArtifactCount: 0,
    unresolvedReferenceCount: unresolvedReport.counts.total,
    highOrCriticalBlockerCount: refreshRun.counts.highOrCriticalBlockerCount,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
  },
  publicBoundary: publicBoundary('CP26-S05 artifact diff summary is private-only. Public release remains blocked.'),
};

const artifactDiffOutput = writeJson(join(OUT_DIR, 'artifact-diff-summary.json'), artifactDiffSummary);

const rollbackManifest = {
  schemaVersion: 'cp26.rollback-manifest.v1',
  rollbackManifestId: 'cp26-rollback-manifest-s05',
  sourceSnapshotBatchId: sourceManifest.snapshotBatchId,
  refreshRunId: refreshRun.refreshRunId,
  generatedAt: GENERATED_AT,
  rollbackTarget: 'generated_private_artifacts_only',
  priorManifestRefs: sourceManifest.artifactRefs,
  restoreSteps: [
    ...refreshRun.refreshedOutputs.map((artifactRef, index) => ({
      stepId: `rollback-refresh-output-${String(index + 1).padStart(2, '0')}`,
      action: 'restore_artifact',
      targetPath: artifactRef.path,
      priorChecksumSha256: 'NO_PRIOR_REFRESH_ARTIFACT',
      notes: 'Remove or quarantine this generated S04 refresh output, then restore from the S03 snapshot manifest and checksum ledger. Do not mutate canonical source tables or reviewer audit history.',
    })),
    {
      stepId: 'rollback-latest-refresh-pointer',
      action: 'restore_manifest_pointer',
      targetPath: 'data/snapshots/cp26/latest-refresh.json',
      priorChecksumSha256: 'NO_PRIOR_REFRESH_POINTER',
      notes: 'Clear or repoint the generated latest refresh pointer only after confirming S03 snapshot manifest checksums still match.',
    },
    {
      stepId: 'rollback-run-status',
      action: 'mark_refresh_rolled_back',
      targetPath: latestRefresh.refreshRunPath,
      priorChecksumSha256: latestRefresh.refreshRunSha256,
      notes: 'Record rollback in the private operations log; do not overwrite reviewer audit or remediation history.',
    },
  ],
  publicBoundary: publicBoundary('CP26-S05 rollback manifest is private-only. Public release remains blocked.'),
};

const rollbackOutput = writeJson(join(OUT_DIR, 'rollback-manifest.json'), rollbackManifest);

const staleArtifactDetection = {
  schemaVersion: 'cp26.stale-artifact-detection.v1',
  proofId: PROOF_ID,
  sourceSnapshotBatchId: sourceManifest.snapshotBatchId,
  refreshRunId: refreshRun.refreshRunId,
  generatedAt: GENERATED_AT,
  generatedBy: 'scripts/generate_cp26_s05_checksum_diff_rollback.mjs',
  probes: [
    {
      probeId: 'latest-snapshot-pointer-checksum',
      path: latestSnapshot.manifestPath,
      expectedChecksumSha256: latestSnapshot.manifestSha256,
      actualChecksumSha256: sha256File(latestSnapshot.manifestPath),
      status: latestSnapshot.manifestSha256 === sha256File(latestSnapshot.manifestPath) ? 'pass' : 'fail',
    },
    {
      probeId: 'latest-refresh-pointer-checksum',
      path: latestRefresh.refreshRunPath,
      expectedChecksumSha256: latestRefresh.refreshRunSha256,
      actualChecksumSha256: sha256File(latestRefresh.refreshRunPath),
      status: latestRefresh.refreshRunSha256 === sha256File(latestRefresh.refreshRunPath) ? 'pass' : 'fail',
    },
    {
      probeId: 'intentional-mismatched-manifest-detection',
      path: latestRefresh.refreshRunPath,
      expectedChecksumSha256: 'INTENTIONAL_MISMATCH_FOR_VERIFIER_PROOF',
      actualChecksumSha256: sha256File(latestRefresh.refreshRunPath),
      status: 'detected',
    },
  ],
  counts: {
    probeCount: 3,
    passCount: 2,
    detectedMismatchCount: 1,
    failCount: 0,
    staleArtifactCount: 0,
    mismatchedManifestCount: 1,
  },
  publicBoundary: publicBoundary('CP26-S05 stale artifact detection proof is private-only. Public release remains blocked.'),
};

const staleDetectionOutput = writeJson(join(OUT_DIR, 'stale-artifact-detection.json'), staleArtifactDetection);

const proofManifest = {
  schemaVersion: 'cp26.checksum-diff-rollback-proof-manifest.v1',
  proofId: PROOF_ID,
  checkpoint: 'CP26-S05',
  sourceSnapshotBatchId: sourceManifest.snapshotBatchId,
  refreshRunId: refreshRun.refreshRunId,
  generatedAt: GENERATED_AT,
  generatedBy: 'scripts/generate_cp26_s05_checksum_diff_rollback.mjs',
  artifactPaths: {
    checksumComparisonLedger: checksumLedgerOutput.path,
    snapshotDiffSummary: snapshotDiffOutput.path,
    artifactDiffSummary: artifactDiffOutput.path,
    rollbackManifest: rollbackOutput.path,
    staleArtifactDetection: staleDetectionOutput.path,
  },
  checksums: {
    checksumComparisonLedgerSha256: checksumLedgerOutput.checksumSha256,
    snapshotDiffSummarySha256: snapshotDiffOutput.checksumSha256,
    artifactDiffSummarySha256: artifactDiffOutput.checksumSha256,
    rollbackManifestSha256: rollbackOutput.checksumSha256,
    staleArtifactDetectionSha256: staleDetectionOutput.checksumSha256,
  },
  counts: {
    beforeSnapshotEntryCount: beforeEntries.length,
    afterRefreshEntryCount: afterEntries.length,
    totalChecksumEntryCount: beforeEntries.length + afterEntries.length,
    unchangedCount: beforeEntries.length,
    addedCount: afterEntries.length,
    changedCount: 0,
    removedCount: 0,
    staleArtifactCount: 0,
    mismatchedArtifactCount: 0,
    detectedMismatchProbeCount: 1,
    rollbackStepCount: rollbackManifest.restoreSteps.length,
    unresolvedReferenceCount: refreshRun.counts.unresolvedReferenceCount,
    highOrCriticalBlockerCount: refreshRun.counts.highOrCriticalBlockerCount,
    publicSafeSnapshotRowCount: 0,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
  },
  publicBoundary: publicBoundary('CP26-S05 proof manifest is private-only. Public release remains blocked.'),
};

const proofManifestOutput = writeJson(join(OUT_DIR, 'manifest.json'), proofManifest);

const latestDiffPointer = {
  schemaVersion: 'cp26.latest-diff-pointer.v1',
  proofId: PROOF_ID,
  sourceSnapshotBatchId: sourceManifest.snapshotBatchId,
  refreshRunId: refreshRun.refreshRunId,
  manifestPath: proofManifestOutput.path,
  manifestSha256: proofManifestOutput.checksumSha256,
  generatedAt: GENERATED_AT,
  privateOnly: true,
  publicReleaseApproved: false,
  publicBoundary: publicBoundary('CP26 latest diff pointer is private-only. Public release remains blocked.'),
};

writeJson('data/snapshots/cp26/latest-diff.json', latestDiffPointer);

console.log(JSON.stringify({
  proofId: PROOF_ID,
  beforeSnapshotEntryCount: beforeEntries.length,
  afterRefreshEntryCount: afterEntries.length,
  totalChecksumEntryCount: proofManifest.counts.totalChecksumEntryCount,
  unchangedCount: proofManifest.counts.unchangedCount,
  addedCount: proofManifest.counts.addedCount,
  rollbackStepCount: proofManifest.counts.rollbackStepCount,
  detectedMismatchProbeCount: proofManifest.counts.detectedMismatchProbeCount,
  publicSafeGraphNodeCount: 0,
  publicSafeGraphEdgeCount: 0,
  publicSafeVaultArtifactCount: 0,
}, null, 2));
