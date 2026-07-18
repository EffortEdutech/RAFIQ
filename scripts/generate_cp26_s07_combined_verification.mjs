#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const PROOF_ID = 'cp26-combined-verification-s07';
const OUT_DIR = `data/snapshots/cp26/verification/${PROOF_ID}`;
const SUMMARY_PATH = `${OUT_DIR}/combined-verification-summary.json`;
const LATEST_PATH = 'data/snapshots/cp26/latest-verification.json';

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256Text(text) {
  return createHash('sha256').update(text).digest('hex').toUpperCase();
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, stableJson(value), 'utf8');
}

function fileRef(path) {
  const text = readFileSync(path, 'utf8');
  return {
    path,
    sha256: sha256Text(text),
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
const latestRefresh = readJson('data/snapshots/cp26/latest-refresh.json');
const latestDiff = readJson('data/snapshots/cp26/latest-diff.json');
const latestStatus = readJson('data/snapshots/cp26/latest-status.json');
const snapshotManifest = readJson(latestSnapshot.manifestPath);
const diffManifest = readJson(latestDiff.manifestPath);
const statusProof = readJson(latestStatus.statusProofPath);
const refreshRun = readJson(latestRefresh.refreshRunPath);
const cp22GraphManifest = readJson('data/graphify/full-private/manifest.json');
const cp22VaultManifest = readJson('data/vault/full-private/manifest.json');
const cp23ReviewerManifest = readJson('data/review/cp23/manifest.json');
const cp24RetrievalManifest = readJson('data/retrieval/cp24/manifest.json');
const cp25ReviewManifest = readJson('data/review/cp25/a07-export-manifest.json');

const inheritedVerifierScripts = [];

const inheritedBoundaryChecks = [
  {
    checkpoint: 'CP22-G10',
    mode: 'persisted_manifest_and_closeout_boundary_check',
    graphManifestPath: 'data/graphify/full-private/manifest.json',
    vaultManifestPath: 'data/vault/full-private/manifest.json',
    closeOutPath: 'docs/09_sprints/resource_audit_import_prototype/CP22_G10_CLOSE_OUT_REPORT.md',
  },
  {
    checkpoint: 'CP23-A10',
    mode: 'persisted_reviewer_export_and_closeout_boundary_check',
    manifestPath: 'data/review/cp23/manifest.json',
    closeOutPath: 'docs/09_sprints/resource_audit_import_prototype/CP23_A10_CLOSE_OUT_AND_NEXT_SCOPE_DECISION_REPORT.md',
  },
  {
    checkpoint: 'CP24-G09',
    mode: 'persisted_retrieval_manifest_and_closeout_boundary_check',
    manifestPath: 'data/retrieval/cp24/manifest.json',
    closeOutPath: 'docs/09_sprints/resource_audit_import_prototype/CP24_G09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md',
  },
  {
    checkpoint: 'CP25-A09',
    mode: 'persisted_review_action_export_and_closeout_boundary_check',
    manifestPath: 'data/review/cp25/a07-export-manifest.json',
    closeOutPath: 'docs/09_sprints/resource_audit_import_prototype/CP25_A09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md',
  },
];

const cp26VerifierScripts = [
  'scripts/check_cp26_s01_snapshot_architecture_source_map.mjs',
  'scripts/check_cp26_s02_snapshot_contracts.mjs',
  'scripts/check_cp26_s03_private_snapshot_export.mjs',
  'scripts/check_cp26_s04_refresh_pipeline.mjs',
  'scripts/check_cp26_s05_checksum_diff_rollback.mjs',
  'scripts/check_cp26_s06_private_status_proof.mjs',
  'scripts/check_cp26_s07_combined_verification.mjs',
];

const requiredDocs = [
  'docs/09_sprints/resource_audit_import_prototype/CP26_S01_SNAPSHOT_ARCHITECTURE_AND_SOURCE_MAP.md',
  'docs/09_sprints/resource_audit_import_prototype/CP26_S02_SNAPSHOT_CONTRACTS_AND_MANIFEST_SCHEMA.md',
  'docs/09_sprints/resource_audit_import_prototype/CP26_S03_PRIVATE_SNAPSHOT_EXPORT_PROTOTYPE.md',
  'docs/09_sprints/resource_audit_import_prototype/CP26_S04_REFRESH_PIPELINE_PROTOTYPE.md',
  'docs/09_sprints/resource_audit_import_prototype/CP26_S05_CHECKSUM_DIFF_AND_ROLLBACK_PROOF.md',
  'docs/09_sprints/resource_audit_import_prototype/CP26_S06_PRIVATE_API_AND_INTERNAL_UI_STATUS_PROOF.md',
  'docs/09_sprints/resource_audit_import_prototype/CP26_S07_COMBINED_VERIFICATION.md',
  'docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_SPRINT_PLAN.md',
  'docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_ACCEPTANCE_CHECKLIST.md',
];

const missingRequiredFiles = [
  ...inheritedVerifierScripts,
  ...cp26VerifierScripts,
  ...requiredDocs,
  ...inheritedBoundaryChecks.flatMap((check) => [
    check.graphManifestPath,
    check.vaultManifestPath,
    check.manifestPath,
    check.closeOutPath,
  ].filter(Boolean)),
].filter((path) => !existsSync(path));

const summary = {
  schemaVersion: 'cp26.combined-verification-summary.v1',
  checkpoint: 'CP26-S07',
  proofId: PROOF_ID,
  generatedAt: '2026-07-16T00:00:00.000Z',
  privateOnly: true,
  publicReleaseApproved: false,
  inheritedVerifierScripts,
  inheritedBoundaryChecks,
  cp26VerifierScripts,
  sourcePointers: {
    snapshot: {
      snapshotBatchId: latestSnapshot.snapshotBatchId,
      manifestPath: latestSnapshot.manifestPath,
      manifestSha256: latestSnapshot.manifestSha256,
    },
    refresh: {
      refreshRunId: latestRefresh.refreshRunId,
      refreshRunPath: latestRefresh.refreshRunPath,
      refreshRunSha256: latestRefresh.refreshRunSha256,
    },
    diff: {
      proofId: latestDiff.proofId,
      manifestPath: latestDiff.manifestPath,
      manifestSha256: latestDiff.manifestSha256,
    },
    status: {
      proofId: latestStatus.proofId,
      statusProofPath: latestStatus.statusProofPath,
      statusProofSha256: latestStatus.statusProofSha256,
    },
  },
  counts: {
    inheritedVerifierCount: inheritedVerifierScripts.length,
    inheritedBoundaryCheckCount: inheritedBoundaryChecks.length,
    inheritedGateCount: inheritedVerifierScripts.length + inheritedBoundaryChecks.length,
    cp26VerifierCount: cp26VerifierScripts.length,
    missingRequiredFileCount: missingRequiredFiles.length,
    cp22GraphNodeCount: cp22GraphManifest.counts?.totalNodes ?? 0,
    cp22GraphEdgeCount: cp22GraphManifest.counts?.totalEdges ?? 0,
    cp22VaultArtifactCount: cp22VaultManifest.counts?.artifacts ?? 0,
    cp22PublicSafeGraphNodeCount: cp22GraphManifest.counts?.publicSafeNodes ?? 0,
    cp22PublicSafeGraphEdgeCount: cp22GraphManifest.counts?.publicSafeEdges ?? 0,
    cp22PublicSafeVaultArtifactCount: cp22VaultManifest.counts?.publicSafeArtifacts ?? 0,
    cp23AuditEventCount: cp23ReviewerManifest.counts?.auditEvents ?? 0,
    cp23RemediationItemCount: cp23ReviewerManifest.counts?.remediationItems ?? 0,
    cp23OpenBlockingRemediationItems: cp23ReviewerManifest.counts?.openBlockingRemediationItems ?? 0,
    cp24FixtureCount: cp24RetrievalManifest.counts?.fixtureCount ?? 0,
    cp24SelectedCandidateCount: cp24RetrievalManifest.counts?.rankingSelection?.selectedCandidateCount ?? 0,
    cp24RemediationCount: cp24RetrievalManifest.counts?.validationHandoff?.remediationCount ?? 0,
    cp24PublicSafeCandidateCount: cp24RetrievalManifest.counts?.rankingSelection?.publicSafeCandidateCount ?? 0,
    cp25AuditExportEventCount: cp25ReviewManifest.counts?.auditExportEventCount ?? 0,
    cp25RemediationTransitionCount: cp25ReviewManifest.counts?.remediationTransitionCount ?? 0,
    cp25UnresolvedActionCount: cp25ReviewManifest.counts?.unresolvedActionCount ?? 0,
    cp25OpenBlockingCount: cp25ReviewManifest.counts?.openBlockingCount ?? 0,
    cp25PublicSafeCandidateCount: cp25ReviewManifest.counts?.publicSafeCandidateCount ?? 0,
    cp25PublicSafeRouteItemCount: cp25ReviewManifest.counts?.publicSafeRouteItemCount ?? 0,
    sourceGroupCount: snapshotManifest.sourceGroups?.length ?? 0,
    snapshotArtifactCount: snapshotManifest.counts?.snapshotArtifactCount ?? snapshotManifest.artifactRefs?.length ?? 0,
    refreshOutputCount: refreshRun.refreshedOutputs?.length ?? 0,
    totalChecksumEntryCount: diffManifest.counts?.totalChecksumEntryCount ?? 0,
    unchangedCount: diffManifest.counts?.unchangedCount ?? 0,
    addedCount: diffManifest.counts?.addedCount ?? 0,
    changedCount: diffManifest.counts?.changedCount ?? 0,
    removedCount: diffManifest.counts?.removedCount ?? 0,
    staleArtifactCount: diffManifest.counts?.staleArtifactCount ?? 0,
    mismatchedArtifactCount: diffManifest.counts?.mismatchedArtifactCount ?? 0,
    unresolvedReferenceCount: statusProof.unresolved?.total ?? 0,
    highOrCriticalBlockerCount: statusProof.refresh?.highOrCriticalBlockerCount ?? 0,
    publicSafeSnapshotRowCount: statusProof.snapshot?.publicSafeSnapshotRowCount ?? 0,
    publicSafeGraphNodeCount: statusProof.snapshot?.publicSafeGraphNodeCount ?? 0,
    publicSafeGraphEdgeCount: statusProof.snapshot?.publicSafeGraphEdgeCount ?? 0,
    publicSafeVaultArtifactCount: statusProof.snapshot?.publicSafeVaultArtifactCount ?? 0,
  },
  routeBoundary: {
    privateStatusRoute: 'GET /api/private-content/snapshots/cp26',
    publicSnapshotRouteExists: false,
    internalUiRoute: '/review-workbench',
    boundedClientPayload: true,
  },
  cp22Boundary: {
    graphId: cp22GraphManifest.graphId,
    graphCheckpoint: cp22GraphManifest.checkpoint,
    graphNodeCount: cp22GraphManifest.counts?.totalNodes ?? 0,
    graphEdgeCount: cp22GraphManifest.counts?.totalEdges ?? 0,
    vaultId: cp22VaultManifest.vaultId,
    vaultCheckpoint: cp22VaultManifest.checkpoint,
    vaultArtifactCount: cp22VaultManifest.counts?.artifacts ?? 0,
    publicSafeGraphNodeCount: cp22GraphManifest.counts?.publicSafeNodes ?? 0,
    publicSafeGraphEdgeCount: cp22GraphManifest.counts?.publicSafeEdges ?? 0,
    publicSafeVaultArtifactCount: cp22VaultManifest.counts?.publicSafeArtifacts ?? 0,
    publicReleaseApproved: false,
  },
  cp23Boundary: {
    exportId: cp23ReviewerManifest.exportId,
    checkpoint: cp23ReviewerManifest.checkpoint,
    auditEvents: cp23ReviewerManifest.counts?.auditEvents ?? 0,
    remediationItems: cp23ReviewerManifest.counts?.remediationItems ?? 0,
    openBlockingRemediationItems: cp23ReviewerManifest.counts?.openBlockingRemediationItems ?? 0,
    privateOnly: cp23ReviewerManifest.privateOnly === true,
    publicReleaseApproved: cp23ReviewerManifest.publicReleaseApproved === true,
  },
  cp24Boundary: {
    checkpoint: cp24RetrievalManifest.checkpoint,
    fixtureCount: cp24RetrievalManifest.counts?.fixtureCount ?? 0,
    selectedCandidateCount: cp24RetrievalManifest.counts?.rankingSelection?.selectedCandidateCount ?? 0,
    remediationCount: cp24RetrievalManifest.counts?.validationHandoff?.remediationCount ?? 0,
    publicSafeCandidateCount: cp24RetrievalManifest.counts?.rankingSelection?.publicSafeCandidateCount ?? 0,
    privateOnly: cp24RetrievalManifest.privateOnly === true,
    publicReleaseApproved: cp24RetrievalManifest.publicReleaseApproved === true,
  },
  cp25Boundary: {
    checkpoint: cp25ReviewManifest.checkpoint,
    auditExportEventCount: cp25ReviewManifest.counts?.auditExportEventCount ?? 0,
    remediationTransitionCount: cp25ReviewManifest.counts?.remediationTransitionCount ?? 0,
    unresolvedActionCount: cp25ReviewManifest.counts?.unresolvedActionCount ?? 0,
    openBlockingCount: cp25ReviewManifest.counts?.openBlockingCount ?? 0,
    publicSafeCandidateCount: cp25ReviewManifest.counts?.publicSafeCandidateCount ?? 0,
    publicSafeRouteItemCount: cp25ReviewManifest.counts?.publicSafeRouteItemCount ?? 0,
    privateOnly: cp25ReviewManifest.privateOnly === true,
    publicReleaseApproved: cp25ReviewManifest.publicReleaseApproved === true,
  },
  requiredDocs,
  missingRequiredFiles,
  publicBoundary: publicBoundary(
    'CP26-S07 combines inherited CP22-CP25 and CP26 S01-S06 private verification gates. Public release remains blocked and no public snapshot route is approved.',
  ),
};

writeJson(SUMMARY_PATH, summary);

const summaryText = readFileSync(SUMMARY_PATH, 'utf8');
writeJson(LATEST_PATH, {
  schemaVersion: 'cp26.latest-verification-pointer.v1',
  proofId: PROOF_ID,
  summaryPath: SUMMARY_PATH,
  summarySha256: sha256Text(summaryText),
  generatedAt: summary.generatedAt,
  privateOnly: true,
  publicReleaseApproved: false,
  publicBoundary: summary.publicBoundary,
  refs: {
    summary: fileRef(SUMMARY_PATH),
    latestSnapshot: fileRef('data/snapshots/cp26/latest-manifest.json'),
    latestRefresh: fileRef('data/snapshots/cp26/latest-refresh.json'),
    latestDiff: fileRef('data/snapshots/cp26/latest-diff.json'),
    latestStatus: fileRef('data/snapshots/cp26/latest-status.json'),
  },
});

  console.log(JSON.stringify({
  proofId: PROOF_ID,
  summaryPath: SUMMARY_PATH,
  inheritedBoundaryCheckCount: summary.counts.inheritedBoundaryCheckCount,
  inheritedVerifierCount: summary.counts.inheritedVerifierCount,
  inheritedGateCount: summary.counts.inheritedGateCount,
  cp26VerifierCount: summary.counts.cp26VerifierCount,
  cp22GraphNodeCount: summary.counts.cp22GraphNodeCount,
  unresolvedReferenceCount: summary.counts.unresolvedReferenceCount,
  highOrCriticalBlockerCount: summary.counts.highOrCriticalBlockerCount,
  publicSafeSnapshotRowCount: summary.counts.publicSafeSnapshotRowCount,
  publicSnapshotRouteExists: summary.routeBoundary.publicSnapshotRouteExists,
}, null, 2));
