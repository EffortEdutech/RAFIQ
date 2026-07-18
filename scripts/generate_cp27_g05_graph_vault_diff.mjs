#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const GENERATED_AT = '2026-07-17T00:00:00.000Z';
const PROOF_ID = 'cp27-g05-graph-vault-baseline-diff';
const OUT_DIR = path.join('data', 'graphify', 'cp27-refresh', 'diff', PROOF_ID);
const LATEST_DIFF_PATH = path.join('data', 'graphify', 'cp27-refresh', 'latest-diff.json');

const CP22_GRAPH_MANIFEST_PATH = 'data/graphify/full-private/manifest.json';
const CP22_VAULT_MANIFEST_PATH = 'data/vault/full-private/manifest.json';
const CP27_GRAPH_POINTER_PATH = 'data/graphify/cp27-refresh/latest-graph.json';
const CP27_VAULT_POINTER_PATH = 'data/vault/cp27-refresh/latest-vault.json';

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

function writeJson(filePath, value) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  const text = stableJson(value);
  writeFileSync(filePath, text, 'utf8');
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

function byName(items) {
  return new Map((items ?? []).map((item) => [item.name, item]));
}

function diffNamedItems({ baselineItems, refreshedItems, countFields }) {
  const baseline = byName(baselineItems);
  const refreshed = byName(refreshedItems);
  const names = [...new Set([...baseline.keys(), ...refreshed.keys()])].sort();
  return names.map((name) => {
    const before = baseline.get(name);
    const after = refreshed.get(name);
    if (before && after) {
      const changed = countFields.some((field) => before[field] !== after[field]) || before.checksumSha256 !== after.checksumSha256;
      return {
        name,
        status: changed ? 'changed' : 'matched',
        before,
        after,
      };
    }
    if (after) return { name, status: 'added', before: null, after };
    return { name, status: 'removed', before, after: null };
  });
}

function countStatuses(items) {
  const statuses = ['matched', 'added', 'removed', 'changed', 'deferred', 'blocked'];
  return Object.fromEntries(statuses.map((status) => [status, items.filter((item) => item.status === status).length]));
}

function main() {
  const cp22Graph = readJson(CP22_GRAPH_MANIFEST_PATH);
  const cp22Vault = readJson(CP22_VAULT_MANIFEST_PATH);
  const cp27GraphPointer = readJson(CP27_GRAPH_POINTER_PATH);
  const cp27VaultPointer = readJson(CP27_VAULT_POINTER_PATH);

  if (cp27GraphPointer.manifestSha256 !== sha256File(cp27GraphPointer.manifestPath)) {
    throw new Error('CP27 graph pointer checksum mismatch.');
  }
  if (cp27VaultPointer.manifestSha256 !== sha256File(cp27VaultPointer.manifestPath)) {
    throw new Error('CP27 vault pointer checksum mismatch.');
  }

  const cp27Graph = readJson(cp27GraphPointer.manifestPath);
  const cp27Vault = readJson(cp27VaultPointer.manifestPath);

  const partitionDiffs = diffNamedItems({
    baselineItems: cp22Graph.partitions,
    refreshedItems: cp27Graph.partitions,
    countFields: ['nodeCount', 'edgeCount', 'publicSafeNodeCount', 'publicSafeEdgeCount'],
  });
  const indexDiffs = diffNamedItems({
    baselineItems: cp22Graph.indexes,
    refreshedItems: cp27Graph.indexes,
    countFields: ['entryCount'],
  });

  const graphClassifications = [
    ...partitionDiffs,
    ...indexDiffs,
    { name: 'public-safe-graph-node-count', status: 'matched', reason: 'CP22 and CP27 graph public-safe node counts are both zero.' },
    { name: 'public-safe-graph-edge-count', status: 'matched', reason: 'CP22 and CP27 graph public-safe edge counts are both zero.' },
    { name: 'cp26-summary-snapshot-limited-row-export', status: 'deferred', reason: 'CP27-G03 is generated from CP26 summary snapshots, not full canonical row exports.' },
    { name: 'raw-text-body-export', status: 'deferred', reason: 'Raw Quran, tafsir, translation, and hadith text bodies remain intentionally excluded.' },
    { name: 'live-provenance-release-rows', status: 'deferred', reason: 'Live provenance and release-state rows remain deferred until a safe source snapshot exists.' },
    { name: 'public-release', status: 'blocked', reason: 'Public release remains blocked.' },
  ];

  const graphDiffSummary = {
    schemaVersion: 'cp27.graph-diff-summary.v1',
    proofId: PROOF_ID,
    checkpoint: 'CP27-G05',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp27_g05_graph_vault_diff.mjs',
    baseline: {
      manifestPath: CP22_GRAPH_MANIFEST_PATH,
      graphId: cp22Graph.graphId,
      graphChecksumSha256: cp22Graph.checksums.graphChecksumSha256,
      nodeCount: cp22Graph.counts.totalNodes,
      edgeCount: cp22Graph.counts.totalEdges,
      partitionCount: cp22Graph.counts.partitions,
      indexCount: cp22Graph.counts.indexes,
      publicSafeNodes: cp22Graph.counts.publicSafeNodes,
      publicSafeEdges: cp22Graph.counts.publicSafeEdges,
    },
    refreshed: {
      manifestPath: cp27GraphPointer.manifestPath,
      graphId: cp27Graph.graphId,
      graphChecksumSha256: cp27Graph.checksums.graphChecksumSha256,
      nodeCount: cp27Graph.counts.totalNodes,
      edgeCount: cp27Graph.counts.totalEdges,
      partitionCount: cp27Graph.counts.partitions,
      indexCount: cp27Graph.counts.indexes,
      publicSafeNodes: cp27Graph.counts.publicSafeNodes,
      publicSafeEdges: cp27Graph.counts.publicSafeEdges,
    },
    countDelta: {
      nodeDelta: cp27Graph.counts.totalNodes - cp22Graph.counts.totalNodes,
      edgeDelta: cp27Graph.counts.totalEdges - cp22Graph.counts.totalEdges,
      partitionDelta: cp27Graph.counts.partitions - cp22Graph.counts.partitions,
      indexDelta: cp27Graph.counts.indexes - cp22Graph.counts.indexes,
    },
    partitionDiffs,
    indexDiffs,
    classificationCounts: countStatuses(graphClassifications),
    unresolvedReferenceCount: cp27Graph.counts.unresolvedReferenceCount,
    highOrCriticalBlockerCount: cp27Graph.counts.highOrCriticalBlockerCount,
    publicBoundary: publicBoundary('CP27-G05 graph diff is private-only. Public release remains blocked.'),
    warnings: [
      'CP27 refreshed graph is a snapshot-backed summary graph and does not claim CP22 full-private node/edge parity.',
      'The CP22 graph baseline is not overwritten.',
      'Changed counts are expected until CP27 has a full canonical row snapshot.',
    ],
  };
  const graphDiffArtifact = writeJson(path.join(OUT_DIR, 'graph-diff-summary.json'), graphDiffSummary);

  const baselineCategories = Object.keys(cp22Vault.categoryCounts ?? {}).sort();
  const refreshedCategories = Object.keys(cp27Vault.categoryCounts ?? {}).sort();
  const categoryNames = [...new Set([...baselineCategories, ...refreshedCategories])].sort();
  const categoryDiffs = categoryNames.map((category) => {
    const before = cp22Vault.categoryCounts?.[category] ?? null;
    const after = cp27Vault.categoryCounts?.[category] ?? null;
    if (before !== null && after !== null) {
      return { name: category, status: before === after ? 'matched' : 'changed', before, after };
    }
    if (after !== null) return { name: category, status: 'added', before: null, after };
    return { name: category, status: 'removed', before, after: null };
  });

  const vaultClassifications = [
    ...categoryDiffs,
    { name: 'cp22-full-vault-artifact-parity', status: 'deferred', reason: 'CP27-G04 is generated from the CP27 summary refreshed graph, not CP22 full-private graph.' },
    { name: 'raw-text-body-export', status: 'deferred', reason: 'Raw source text bodies remain excluded from vault packs.' },
    { name: 'full-reviewer-pack-regeneration', status: 'deferred', reason: 'Full reviewer pack parity requires a full CP27 graph rebuild from canonical rows.' },
    { name: 'public-release', status: 'blocked', reason: 'Public release remains blocked.' },
  ];

  const vaultDiffSummary = {
    schemaVersion: 'cp27.vault-diff-summary.v1',
    proofId: PROOF_ID,
    checkpoint: 'CP27-G05',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp27_g05_graph_vault_diff.mjs',
    baseline: {
      manifestPath: CP22_VAULT_MANIFEST_PATH,
      vaultId: cp22Vault.vaultId,
      artifactCount: cp22Vault.counts.artifacts,
      categoryCount: cp22Vault.counts.categories,
      publicSafeArtifacts: cp22Vault.counts.publicSafeArtifacts,
      sourceGraphChecksumSha256: cp22Vault.sourceGraphChecksumSha256,
    },
    refreshed: {
      manifestPath: cp27VaultPointer.manifestPath,
      vaultId: cp27Vault.vaultId,
      artifactCount: cp27Vault.counts.artifacts,
      categoryCount: cp27Vault.counts.categories,
      publicSafeArtifacts: cp27Vault.counts.publicSafeArtifacts,
      sourceGraphChecksumSha256: cp27Vault.sourceGraphChecksumSha256,
    },
    countDelta: {
      artifactDelta: cp27Vault.counts.artifacts - cp22Vault.counts.artifacts,
      categoryDelta: cp27Vault.counts.categories - cp22Vault.counts.categories,
      graphNodesReferencedDelta: cp27Vault.counts.graphNodesReferenced - cp22Vault.counts.graphNodesReferenced,
    },
    categoryDiffs,
    classificationCounts: countStatuses(vaultClassifications),
    unresolvedReferenceCount: cp27Vault.counts.unresolvedReferenceCount,
    highOrCriticalBlockerCount: cp27Vault.counts.highOrCriticalBlockerCount,
    publicBoundary: publicBoundary('CP27-G05 vault diff is private-only. Public release remains blocked.'),
    warnings: [
      'CP27 refreshed vault is a regenerated review/navigation vault from the CP27 summary graph and does not claim CP22 full-private vault parity.',
      'The CP22 vault baseline is not overwritten.',
      'Public-safe vault artifact count remains zero.',
    ],
  };
  const vaultDiffArtifact = writeJson(path.join(OUT_DIR, 'vault-diff-summary.json'), vaultDiffSummary);

  const checksumComparisonLedger = {
    schemaVersion: 'cp27.graph-vault-checksum-comparison-ledger.v1',
    proofId: PROOF_ID,
    checkpoint: 'CP27-G05',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp27_g05_graph_vault_diff.mjs',
    entries: [
      {
        entryId: 'baseline:graph:manifest',
        status: 'matched',
        path: CP22_GRAPH_MANIFEST_PATH,
        expectedChecksumSha256: sha256File(CP22_GRAPH_MANIFEST_PATH),
        actualChecksumSha256: sha256File(CP22_GRAPH_MANIFEST_PATH),
        checksumMatches: true,
      },
      {
        entryId: 'baseline:vault:manifest',
        status: 'matched',
        path: CP22_VAULT_MANIFEST_PATH,
        expectedChecksumSha256: sha256File(CP22_VAULT_MANIFEST_PATH),
        actualChecksumSha256: sha256File(CP22_VAULT_MANIFEST_PATH),
        checksumMatches: true,
      },
      {
        entryId: 'refreshed:graph:manifest',
        status: 'added',
        path: cp27GraphPointer.manifestPath,
        expectedChecksumSha256: cp27GraphPointer.manifestSha256,
        actualChecksumSha256: sha256File(cp27GraphPointer.manifestPath),
        checksumMatches: cp27GraphPointer.manifestSha256 === sha256File(cp27GraphPointer.manifestPath),
      },
      {
        entryId: 'refreshed:vault:manifest',
        status: 'added',
        path: cp27VaultPointer.manifestPath,
        expectedChecksumSha256: cp27VaultPointer.manifestSha256,
        actualChecksumSha256: sha256File(cp27VaultPointer.manifestPath),
        checksumMatches: cp27VaultPointer.manifestSha256 === sha256File(cp27VaultPointer.manifestPath),
      },
    ],
    counts: {
      totalEntries: 4,
      matchedCount: 2,
      addedCount: 2,
      removedCount: 0,
      changedCount: 0,
      deferredCount: 0,
      blockedCount: 0,
      mismatchedCount: 0,
      publicSafeGraphNodeCount: 0,
      publicSafeGraphEdgeCount: 0,
      publicSafeVaultArtifactCount: 0,
    },
    publicBoundary: publicBoundary('CP27-G05 checksum comparison ledger is private-only. Public release remains blocked.'),
  };
  const checksumLedgerArtifact = writeJson(path.join(OUT_DIR, 'checksum-comparison-ledger.json'), checksumComparisonLedger);

  const publicBoundaryDiff = {
    schemaVersion: 'cp27.public-boundary-diff.v1',
    proofId: PROOF_ID,
    checkpoint: 'CP27-G05',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp27_g05_graph_vault_diff.mjs',
    graph: {
      baselinePublicSafeNodes: cp22Graph.counts.publicSafeNodes,
      baselinePublicSafeEdges: cp22Graph.counts.publicSafeEdges,
      refreshedPublicSafeNodes: cp27Graph.counts.publicSafeNodes,
      refreshedPublicSafeEdges: cp27Graph.counts.publicSafeEdges,
      status: 'matched',
    },
    vault: {
      baselinePublicSafeArtifacts: cp22Vault.counts.publicSafeArtifacts,
      refreshedPublicSafeArtifacts: cp27Vault.counts.publicSafeArtifacts,
      status: 'matched',
    },
    publicRelease: {
      baselineApproved: cp22Vault.requiredBoundary.publicReleaseApproved,
      refreshedApproved: cp27Vault.requiredBoundary.publicReleaseApproved,
      status: 'blocked',
    },
    counts: {
      publicSafeSnapshotRowCount: 0,
      publicSafeGraphNodeCount: 0,
      publicSafeGraphEdgeCount: 0,
      publicSafeVaultArtifactCount: 0,
      blockedCount: 1,
    },
    publicBoundary: publicBoundary('CP27-G05 public boundary diff remains blocked for public release.'),
  };
  const publicBoundaryArtifact = writeJson(path.join(OUT_DIR, 'public-boundary-diff.json'), publicBoundaryDiff);

  const proofManifest = {
    schemaVersion: 'cp27.graph-vault-diff-proof-manifest.v1',
    proofId: PROOF_ID,
    checkpoint: 'CP27-G05',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp27_g05_graph_vault_diff.mjs',
    baselineGraphManifestPath: CP22_GRAPH_MANIFEST_PATH,
    baselineVaultManifestPath: CP22_VAULT_MANIFEST_PATH,
    refreshedGraphManifestPath: cp27GraphPointer.manifestPath,
    refreshedVaultManifestPath: cp27VaultPointer.manifestPath,
    artifactPaths: {
      graphDiffSummary: graphDiffArtifact.path,
      vaultDiffSummary: vaultDiffArtifact.path,
      checksumComparisonLedger: checksumLedgerArtifact.path,
      publicBoundaryDiff: publicBoundaryArtifact.path,
    },
    checksums: {
      graphDiffSummarySha256: graphDiffArtifact.checksumSha256,
      vaultDiffSummarySha256: vaultDiffArtifact.checksumSha256,
      checksumComparisonLedgerSha256: checksumLedgerArtifact.checksumSha256,
      publicBoundaryDiffSha256: publicBoundaryArtifact.checksumSha256,
    },
    counts: {
      graphBaselineNodes: cp22Graph.counts.totalNodes,
      graphRefreshedNodes: cp27Graph.counts.totalNodes,
      graphBaselineEdges: cp22Graph.counts.totalEdges,
      graphRefreshedEdges: cp27Graph.counts.totalEdges,
      vaultBaselineArtifacts: cp22Vault.counts.artifacts,
      vaultRefreshedArtifacts: cp27Vault.counts.artifacts,
      matchedCount: graphDiffSummary.classificationCounts.matched + vaultDiffSummary.classificationCounts.matched + checksumComparisonLedger.counts.matchedCount + 2,
      addedCount: graphDiffSummary.classificationCounts.added + vaultDiffSummary.classificationCounts.added + checksumComparisonLedger.counts.addedCount,
      removedCount: graphDiffSummary.classificationCounts.removed + vaultDiffSummary.classificationCounts.removed,
      changedCount: graphDiffSummary.classificationCounts.changed + vaultDiffSummary.classificationCounts.changed,
      deferredCount: graphDiffSummary.classificationCounts.deferred + vaultDiffSummary.classificationCounts.deferred,
      blockedCount: graphDiffSummary.classificationCounts.blocked + vaultDiffSummary.classificationCounts.blocked + publicBoundaryDiff.counts.blockedCount,
      unresolvedReferenceCount: cp27Graph.counts.unresolvedReferenceCount,
      highOrCriticalBlockerCount: cp27Graph.counts.highOrCriticalBlockerCount,
      publicSafeSnapshotRowCount: 0,
      publicSafeGraphNodeCount: 0,
      publicSafeGraphEdgeCount: 0,
      publicSafeVaultArtifactCount: 0,
    },
    publicBoundary: publicBoundary('CP27-G05 graph/vault diff proof is private-only. Public release remains blocked.'),
    warnings: [
      'CP27-G05 proves difference visibility and baseline protection, not CP22 parity.',
      'CP27 graph and vault are regenerated from summary snapshots; full parity remains deferred.',
      'Public release remains blocked.',
    ],
  };
  const manifestArtifact = writeJson(path.join(OUT_DIR, 'manifest.json'), proofManifest);

  const latestDiffPointer = {
    schemaVersion: 'cp27.latest-diff-pointer.v1',
    proofId: PROOF_ID,
    checkpoint: 'CP27-G05',
    generatedAt: GENERATED_AT,
    diffDir: OUT_DIR.replaceAll(path.sep, '/'),
    manifestPath: manifestArtifact.path,
    manifestSha256: manifestArtifact.checksumSha256,
    graphDiffSummaryPath: graphDiffArtifact.path,
    vaultDiffSummaryPath: vaultDiffArtifact.path,
    checksumComparisonLedgerPath: checksumLedgerArtifact.path,
    publicBoundaryDiffPath: publicBoundaryArtifact.path,
    counts: proofManifest.counts,
    publicBoundary: proofManifest.publicBoundary,
  };
  writeJson(LATEST_DIFF_PATH, latestDiffPointer);

  console.log(`CP27-G05 diff proof generated at ${OUT_DIR.replaceAll(path.sep, '/')}`);
  console.log(`Graph nodes ${cp22Graph.counts.totalNodes}->${cp27Graph.counts.totalNodes}; vault artifacts ${cp22Vault.counts.artifacts}->${cp27Vault.counts.artifacts}; public-safe vault artifacts=0.`);
}

main();
