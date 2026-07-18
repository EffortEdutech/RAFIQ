#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const PROOF_ID = 'cp27-g06-internal-ui-inspection-proof';
const OUT_DIR = `data/graphify/cp27-refresh/internal-ui/${PROOF_ID}`;
const STATUS_PROOF_PATH = `${OUT_DIR}/status-proof.json`;
const LATEST_POINTER_PATH = 'data/graphify/cp27-refresh/latest-internal-ui-proof.json';

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function sha256Text(text) {
  return createHash('sha256').update(text).digest('hex').toUpperCase();
}

function writeJson(filePath, value) {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
  return sha256Text(text);
}

const latestGraph = readJson('data/graphify/cp27-refresh/latest-graph.json');
const latestVault = readJson('data/vault/cp27-refresh/latest-vault.json');
const latestDiff = readJson('data/graphify/cp27-refresh/latest-diff.json');
const graphSummary = readJson(latestGraph.summaryPath);
const vaultSummary = readJson(latestVault.summaryPath);

const statusProof = {
  schemaVersion: 'cp27.internal-ui-inspection-proof.v1',
  proofId: PROOF_ID,
  checkpoint: 'CP27-G06',
  generatedAt: '2026-07-17T00:00:00.000Z',
  route: 'GET /api/private-content/knowledge-graphify/cp27',
  screen: 'apps/mobile/app/knowledge-graphify.tsx',
  sourceCheckpoints: {
    graph: latestGraph.checkpoint,
    vault: latestVault.checkpoint,
    diff: latestDiff.checkpoint,
  },
  graph: {
    graphId: latestGraph.graphId,
    nodeCount: latestGraph.counts.totalNodes,
    edgeCount: latestGraph.counts.totalEdges,
    partitionCount: latestGraph.counts.partitions,
    indexCount: latestGraph.counts.indexes,
    partitionRowsReturned: graphSummary.partitionSummary.length,
    indexRowsReturned: graphSummary.indexSummary.length,
    publicSafeNodeCount: latestGraph.counts.publicSafeNodes,
    publicSafeEdgeCount: latestGraph.counts.publicSafeEdges,
  },
  vault: {
    vaultId: latestVault.vaultId,
    artifactCount: latestVault.counts.artifacts,
    categoryCount: latestVault.counts.categories,
    graphNodesReferenced: latestVault.counts.graphNodesReferenced,
    categoryRowsReturned: Object.keys(vaultSummary.categoryCounts).length,
    publicSafeArtifactCount: latestVault.counts.publicSafeArtifacts,
  },
  diff: {
    proofId: latestDiff.proofId,
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
  },
  responseBoundary: {
    fullGraphDumpIncluded: false,
    fullVaultDumpIncluded: false,
    rawSourceTextIncluded: false,
    fullPartitionBodiesIncluded: false,
    fullIndexBodiesIncluded: false,
    vaultMarkdownBodiesIncluded: false,
  },
  publicBoundary: {
    privateOnly: true,
    publicReleaseApproved: false,
    publicRouteExposed: false,
    publicSafeSnapshotRowCount: 0,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
    message: 'CP27-G06 proves internal inspection only. Public release remains blocked.',
  },
  artifactPaths: {
    latestGraphPointer: 'data/graphify/cp27-refresh/latest-graph.json',
    latestVaultPointer: 'data/vault/cp27-refresh/latest-vault.json',
    latestDiffPointer: 'data/graphify/cp27-refresh/latest-diff.json',
    graphSummary: latestGraph.summaryPath,
    vaultSummary: latestVault.summaryPath,
  },
};

const statusProofSha256 = writeJson(STATUS_PROOF_PATH, statusProof);
writeJson(LATEST_POINTER_PATH, {
  schemaVersion: 'cp27.latest-internal-ui-proof-pointer.v1',
  proofId: PROOF_ID,
  checkpoint: 'CP27-G06',
  generatedAt: statusProof.generatedAt,
  statusProofPath: STATUS_PROOF_PATH,
  statusProofSha256,
});

console.log(`Generated ${STATUS_PROOF_PATH}`);
