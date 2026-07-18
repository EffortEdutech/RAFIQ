#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const PROOF_ID = 'cp27-combined-verification-g07';
const OUT_DIR = `data/graphify/cp27-refresh/verification/${PROOF_ID}`;
const SUMMARY_PATH = `${OUT_DIR}/combined-verification-summary.json`;
const LATEST_PATH = 'data/graphify/cp27-refresh/latest-verification.json';

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

const latestMapper = readJson('data/graphify/cp27-refresh/latest-mapper.json');
const latestGraph = readJson('data/graphify/cp27-refresh/latest-graph.json');
const latestVault = readJson('data/vault/cp27-refresh/latest-vault.json');
const latestDiff = readJson('data/graphify/cp27-refresh/latest-diff.json');
const latestUiProof = readJson('data/graphify/cp27-refresh/latest-internal-ui-proof.json');
const cp26Verification = readJson('data/snapshots/cp26/latest-verification.json');
const graphManifest = readJson(latestGraph.manifestPath);
const vaultManifest = readJson(latestVault.manifestPath);
const diffManifest = readJson(latestDiff.manifestPath);
const uiProof = readJson(latestUiProof.statusProofPath);
const cp22GraphManifest = readJson('data/graphify/full-private/manifest.json');
const cp22VaultManifest = readJson('data/vault/full-private/manifest.json');

const cp27VerifierScripts = [
  'scripts/check_cp27_g01_refresh_backed_graph_architecture.mjs',
  'scripts/check_cp27_g02_snapshot_graph_mapper.mjs',
  'scripts/check_cp27_g03_partition_index_graph.mjs',
  'scripts/check_cp27_g04_vault_packs.mjs',
  'scripts/check_cp27_g05_graph_vault_diff.mjs',
  'scripts/check_cp27_g06_internal_ui_proof.mjs',
  'scripts/check_cp27_g07_combined_verification.mjs',
];

const requiredDocs = [
  'docs/09_sprints/resource_audit_import_prototype/CP27_G01_REFRESH_BACKED_GRAPH_REBUILD_ARCHITECTURE.md',
  'docs/09_sprints/resource_audit_import_prototype/CP27_G02_SNAPSHOT_TO_NODE_EDGE_MAPPER.md',
  'docs/09_sprints/resource_audit_import_prototype/CP27_G03_PARTITION_AND_INDEX_REGENERATION.md',
  'docs/09_sprints/resource_audit_import_prototype/CP27_G04_VAULT_PACK_REGENERATION.md',
  'docs/09_sprints/resource_audit_import_prototype/CP27_G05_GRAPH_VAULT_DIFF_PROOF.md',
  'docs/09_sprints/resource_audit_import_prototype/CP27_G06_INTERNAL_UI_INSPECTION_PROOF.md',
  'docs/09_sprints/resource_audit_import_prototype/CP27_G07_COMBINED_VERIFICATION_AND_CLOSE_OUT.md',
  'docs/09_sprints/resource_audit_import_prototype/CP27_REFRESH_BACKED_GRAPH_AND_VAULT_REBUILD_SPRINT_PLAN.md',
  'docs/09_sprints/resource_audit_import_prototype/CP27_REFRESH_BACKED_GRAPH_AND_VAULT_REBUILD_ACCEPTANCE_CHECKLIST.md',
];

const requiredArtifacts = [
  'data/graphify/cp27-refresh/latest-mapper.json',
  'data/graphify/cp27-refresh/latest-graph.json',
  'data/vault/cp27-refresh/latest-vault.json',
  'data/graphify/cp27-refresh/latest-diff.json',
  'data/graphify/cp27-refresh/latest-internal-ui-proof.json',
  latestMapper.contractPath,
  latestGraph.manifestPath,
  latestGraph.summaryPath,
  latestGraph.checksumLedgerPath,
  latestVault.manifestPath,
  latestVault.summaryPath,
  latestVault.checksumLedgerPath,
  latestDiff.manifestPath,
  latestDiff.graphDiffSummaryPath,
  latestDiff.vaultDiffSummaryPath,
  latestDiff.checksumComparisonLedgerPath,
  latestDiff.publicBoundaryDiffPath,
  latestUiProof.statusProofPath,
];

const missingRequiredFiles = [
  ...cp27VerifierScripts,
  ...requiredDocs,
  ...requiredArtifacts,
].filter((path) => path && !existsSync(path));

const summary = {
  schemaVersion: 'cp27.combined-verification-summary.v1',
  checkpoint: 'CP27-G07',
  proofId: PROOF_ID,
  generatedAt: '2026-07-17T00:00:00.000Z',
  privateOnly: true,
  publicReleaseApproved: false,
  sourceBaseline: {
    cp26VerificationProofId: cp26Verification.proofId,
    cp26SummaryPath: cp26Verification.summaryPath,
    cp22GraphManifestPath: 'data/graphify/full-private/manifest.json',
    cp22VaultManifestPath: 'data/vault/full-private/manifest.json',
  },
  cp27VerifierScripts,
  requiredDocs,
  requiredArtifacts,
  missingRequiredFiles,
  counts: {
    cp27VerifierCount: cp27VerifierScripts.length,
    missingRequiredFileCount: missingRequiredFiles.length,
    sourceGroupCount: latestMapper.counts.sourceGroupCount,
    mappedSourceGroupCount: latestMapper.counts.mappedSourceGroupCount,
    graphNodeCount: latestGraph.counts.totalNodes,
    graphEdgeCount: latestGraph.counts.totalEdges,
    graphPartitionCount: latestGraph.counts.partitions,
    graphIndexCount: latestGraph.counts.indexes,
    vaultArtifactCount: latestVault.counts.artifacts,
    vaultCategoryCount: latestVault.counts.categories,
    vaultGraphNodesReferenced: latestVault.counts.graphNodesReferenced,
    graphBaselineNodes: latestDiff.counts.graphBaselineNodes,
    graphRefreshedNodes: latestDiff.counts.graphRefreshedNodes,
    graphBaselineEdges: latestDiff.counts.graphBaselineEdges,
    graphRefreshedEdges: latestDiff.counts.graphRefreshedEdges,
    vaultBaselineArtifacts: latestDiff.counts.vaultBaselineArtifacts,
    vaultRefreshedArtifacts: latestDiff.counts.vaultRefreshedArtifacts,
    matchedCount: latestDiff.counts.matchedCount,
    addedCount: latestDiff.counts.addedCount,
    removedCount: latestDiff.counts.removedCount,
    changedCount: latestDiff.counts.changedCount,
    deferredCount: latestDiff.counts.deferredCount,
    blockedCount: latestDiff.counts.blockedCount,
    unresolvedReferenceCount: latestDiff.counts.unresolvedReferenceCount,
    highOrCriticalBlockerCount: latestDiff.counts.highOrCriticalBlockerCount,
    cp22GraphNodeCount: cp22GraphManifest.counts?.totalNodes ?? 0,
    cp22GraphEdgeCount: cp22GraphManifest.counts?.totalEdges ?? 0,
    cp22VaultArtifactCount: cp22VaultManifest.counts?.artifacts ?? 0,
    publicSafeSnapshotRowCount: 0,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
  },
  routeBoundary: {
    privateInspectionRoute: 'GET /api/private-content/knowledge-graphify/cp27',
    internalUiRoute: '/knowledge-graphify',
    publicGraphRouteExists: false,
    publicVaultRouteExists: false,
    boundedClientPayload: true,
    fullGraphDumpIncluded: uiProof.responseBoundary.fullGraphDumpIncluded,
    fullVaultDumpIncluded: uiProof.responseBoundary.fullVaultDumpIncluded,
    rawSourceTextIncluded: uiProof.responseBoundary.rawSourceTextIncluded,
  },
  graphBoundary: {
    graphId: graphManifest.graphId,
    checkpoint: graphManifest.checkpoint,
    canonicalRefsRemainAuthoritative: true,
    graphIdsAreDerived: true,
    rawTextBodiesExported: false,
    publicSafeNodes: graphManifest.counts.publicSafeNodes,
    publicSafeEdges: graphManifest.counts.publicSafeEdges,
  },
  vaultBoundary: {
    vaultId: vaultManifest.vaultId,
    checkpoint: vaultManifest.checkpoint,
    rawTextBodiesExported: false,
    publicSafeArtifacts: vaultManifest.counts.publicSafeArtifacts,
  },
  diffBoundary: {
    proofId: diffManifest.proofId,
    checkpoint: diffManifest.checkpoint,
    cp22BaselinePreservedAsComparisonInput: true,
    doesNotClaimCp22Parity: true,
    classificationCounts: {
      matched: latestDiff.counts.matchedCount,
      added: latestDiff.counts.addedCount,
      removed: latestDiff.counts.removedCount,
      changed: latestDiff.counts.changedCount,
      deferred: latestDiff.counts.deferredCount,
      blocked: latestDiff.counts.blockedCount,
    },
  },
  publicBoundary: publicBoundary(
    'CP27-G07 combines CP27 graph/vault rebuild, diff, internal UI proof, and public-boundary checks. Public release remains blocked and public-safe counts remain zero.',
  ),
};

writeJson(SUMMARY_PATH, summary);

const summaryText = readFileSync(SUMMARY_PATH, 'utf8');
writeJson(LATEST_PATH, {
  schemaVersion: 'cp27.latest-verification-pointer.v1',
  proofId: PROOF_ID,
  checkpoint: 'CP27-G07',
  summaryPath: SUMMARY_PATH,
  summarySha256: sha256Text(summaryText),
  generatedAt: summary.generatedAt,
  privateOnly: true,
  publicReleaseApproved: false,
  publicBoundary: summary.publicBoundary,
  refs: {
    summary: fileRef(SUMMARY_PATH),
    latestMapper: fileRef('data/graphify/cp27-refresh/latest-mapper.json'),
    latestGraph: fileRef('data/graphify/cp27-refresh/latest-graph.json'),
    latestVault: fileRef('data/vault/cp27-refresh/latest-vault.json'),
    latestDiff: fileRef('data/graphify/cp27-refresh/latest-diff.json'),
    latestInternalUiProof: fileRef('data/graphify/cp27-refresh/latest-internal-ui-proof.json'),
  },
});

console.log(JSON.stringify({
  proofId: PROOF_ID,
  summaryPath: SUMMARY_PATH,
  graphNodeCount: summary.counts.graphNodeCount,
  graphEdgeCount: summary.counts.graphEdgeCount,
  vaultArtifactCount: summary.counts.vaultArtifactCount,
  unresolvedReferenceCount: summary.counts.unresolvedReferenceCount,
  highOrCriticalBlockerCount: summary.counts.highOrCriticalBlockerCount,
  publicSafeGraphNodeCount: summary.counts.publicSafeGraphNodeCount,
}, null, 2));
