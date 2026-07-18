#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const GENERATED_AT = '2026-07-17T00:00:00.000Z';
const GENERATED_BY = 'scripts/generate_cp27_g04_vault_packs.mjs';
const LATEST_GRAPH_PATH = 'data/graphify/cp27-refresh/latest-graph.json';
const BASELINE_VAULT_MANIFEST_PATH = 'data/vault/full-private/manifest.json';
const VAULT_DIR = path.join('data', 'vault', 'cp27-refresh', 'vault', 'cp27-g04-refresh-vault');
const PACK_DIR = path.join(VAULT_DIR, 'packs');
const LATEST_VAULT_PATH = path.join('data', 'vault', 'cp27-refresh', 'latest-vault.json');

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

function safeFileName(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || 'artifact';
}

function yamlString(value) {
  return JSON.stringify(String(value ?? ''));
}

function yamlArray(values) {
  const items = [...new Set((values ?? []).filter(Boolean).map(String))];
  if (items.length === 0) return '[]';
  return `[${items.map((value) => yamlString(value)).join(', ')}]`;
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

function table(rows, headers) {
  const lines = [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
  ];
  for (const row of rows) {
    lines.push(`| ${row.map((value) => String(value ?? '').replace(/\|/g, '\\|')).join(' | ')} |`);
  }
  return lines.join('\n');
}

function bulletList(values, empty = 'None recorded.') {
  const items = [...new Set((values ?? []).filter(Boolean).map(String))];
  if (items.length === 0) return empty;
  return items.map((value) => `- ${value}`).join('\n');
}

function countBy(items, key) {
  const counts = new Map();
  for (const item of items) {
    const value = typeof key === 'function' ? key(item) : item[key];
    counts.set(value ?? 'unknown', (counts.get(value ?? 'unknown') ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => String(a[0]).localeCompare(String(b[0])));
}

function loadGraph() {
  const latestGraph = readJson(LATEST_GRAPH_PATH);
  if (latestGraph.manifestSha256 !== sha256File(latestGraph.manifestPath)) {
    throw new Error('Latest graph manifest checksum mismatch.');
  }
  const manifest = readJson(latestGraph.manifestPath);
  const graphDir = latestGraph.graphDir;
  const partitions = Object.fromEntries(manifest.partitions.map((partition) => [
    partition.name,
    readJson(path.join(graphDir, partition.path)),
  ]));
  return { latestGraph, manifest, partitions };
}

function packMarkdown({ artifactId, artifactType, title, category, graphManifest, graphNodes, canonicalRefs = [], sourceRefs = [], summary, details, blockers = [] }) {
  const graphNodeIds = [...new Set(graphNodes.map((node) => node.id))];
  const refs = [...new Set([
    ...canonicalRefs,
    ...graphNodes.flatMap((node) => node.canonicalRefs ?? []),
  ].filter(Boolean))];
  const sources = [...new Set([
    `graph_manifest:${graphManifest.graphId}`,
    ...sourceRefs,
    ...graphNodes.flatMap((node) => node.sourceRefs ?? []),
  ].filter(Boolean))];
  const releaseStates = [...new Set(graphNodes.map((node) => node.releaseState).filter(Boolean))];
  const qualityStates = [...new Set(graphNodes.map((node) => node.qualityState).filter(Boolean))];

  const yaml = [
    '---',
    `artifact_id: ${yamlString(artifactId)}`,
    `artifact_type: ${yamlString(artifactType)}`,
    `title: ${yamlString(title)}`,
    `category: ${yamlString(category)}`,
    'status: "generated"',
    'environment: "private_local"',
    'access_level: "developer_private"',
    'public_safe: false',
    `generated_at: ${yamlString(GENERATED_AT)}`,
    `generated_by: ${yamlString(GENERATED_BY)}`,
    `source_graph_id: ${yamlString(graphManifest.graphId)}`,
    `source_graph_checkpoint: ${yamlString(graphManifest.checkpoint)}`,
    `canonical_refs: ${yamlArray(refs)}`,
    `source_refs: ${yamlArray(sources)}`,
    `graph_node_ids: ${yamlArray(graphNodeIds)}`,
    `release_states: ${yamlArray(releaseStates)}`,
    `quality_states: ${yamlArray(qualityStates)}`,
    'raw_text_bodies_exported: false',
    'public_release_approved: false',
    '---',
  ].join('\n');

  return `${yaml}

# ${title}

## Summary

${summary}

This is a generated private RAFIQ Knowledge Vault artifact for the CP27 refreshed graph. It is a review and navigation pack, not canonical source data, not source text, and not public release approval.

## Graph Links

${bulletList(graphNodeIds)}

## Canonical References

${bulletList(refs)}

## Source And Attribution

${bulletList(sources)}

## Details

${details}

## Release Boundary

- Public safe: \`false\`
- Public release approved: \`false\`
- Raw text bodies exported: \`false\`
- CP22 vault baseline overwritten: \`false\`

## Blockers

${bulletList([
    ...blockers,
    'Public release remains blocked.',
    'Vault packs are generated review/navigation artifacts only.',
  ])}
`;
}

function writePack(plan, graphManifest) {
  const content = packMarkdown({ ...plan, graphManifest });
  const filePath = path.join(PACK_DIR, plan.category, `${safeFileName(plan.fileStem)}.md`);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
  return {
    artifactId: plan.artifactId,
    artifactType: plan.artifactType,
    title: plan.title,
    category: plan.category,
    path: path.relative(VAULT_DIR, filePath).replaceAll(path.sep, '/'),
    checksumSha256: sha256Text(content),
    publicSafe: false,
    graphNodeIds: [...new Set(plan.graphNodes.map((node) => node.id))],
    canonicalRefs: [...new Set([
      ...(plan.canonicalRefs ?? []),
      ...plan.graphNodes.flatMap((node) => node.canonicalRefs ?? []),
    ].filter(Boolean))],
    sourceRefs: [...new Set([
      `graph_manifest:${graphManifest.graphId}`,
      ...(plan.sourceRefs ?? []),
      ...plan.graphNodes.flatMap((node) => node.sourceRefs ?? []),
    ].filter(Boolean))],
  };
}

function buildPackPlans(graph) {
  const { manifest, partitions } = graph;
  const plans = [];
  const allNodes = Object.values(partitions).flatMap((partition) => partition.nodes ?? []);
  const sourceGroupNodes = [
    ...new Map(
      allNodes
        .filter((node) => node.type === 'snapshot_group')
        .sort((a, b) => a.sourceGroupKey.localeCompare(b.sourceGroupKey) || a.partition.localeCompare(b.partition))
        .map((node) => [node.sourceGroupKey, node]),
    ).values(),
  ];
  const reviewRequiredNodes = allNodes.filter((node) => node.qualityState === 'review_required');

  plans.push({
    category: 'release-gates',
    fileStem: 'cp27-refresh-vault-boundary',
    artifactId: 'vault:cp27:release-boundary',
    artifactType: 'release_gate_pack',
    title: 'CP27 Refresh Vault Release Boundary',
    graphNodes: allNodes.slice(0, 30),
    canonicalRefs: [manifest.sourceSnapshotManifestPath, manifest.baselineVaultManifestPath],
    sourceRefs: ['docs/04_knowledge/RAFIQ_KNOWLEDGE_VAULT_ARTIFACT_CONTRACT_V1.md'],
    summary: `Boundary pack for refreshed graph \`${manifest.graphId}\` with ${manifest.counts.totalNodes} nodes and ${manifest.counts.totalEdges} edges.`,
    details: table([
      ['publicSafeNodes', manifest.counts.publicSafeNodes],
      ['publicSafeEdges', manifest.counts.publicSafeEdges],
      ['publicSafeVaultArtifacts', 0],
      ['rawTextBodiesExported', manifest.rawTextBodiesExported],
      ['unresolvedReferences', manifest.counts.unresolvedReferenceCount],
      ['highOrCriticalBlockers', manifest.counts.highOrCriticalBlockerCount],
    ], ['Signal', 'Value']),
    blockers: manifest.warnings,
  });

  plans.push({
    category: 'release-gates',
    fileStem: 'cp27-refresh-manifest-index',
    artifactId: 'vault:cp27:manifest-index',
    artifactType: 'manifest_index_pack',
    title: 'CP27 Refresh Manifest Partition Index',
    graphNodes: allNodes.slice(0, 30),
    canonicalRefs: [graph.latestGraph.manifestPath, graph.latestGraph.summaryPath],
    summary: `Index pack for ${manifest.partitions.length} refreshed graph partitions and ${manifest.indexes.length} indexes.`,
    details: [
      table(manifest.partitions.map((item) => [item.name, item.nodeCount, item.edgeCount, item.checksumSha256]), ['Partition', 'Nodes', 'Edges', 'Checksum']),
      table(manifest.indexes.map((item) => [item.name, item.entryCount, item.checksumSha256]), ['Index', 'Entries', 'Checksum']),
    ].join('\n\n'),
    blockers: ['This index pack summarizes CP27 refreshed graph artifacts only.'],
  });

  for (const partitionRef of manifest.partitions) {
    const partition = partitions[partitionRef.name];
    const graphNodes = partition.nodes ?? [];
    plans.push({
      category: 'partitions',
      fileStem: `partition-${partitionRef.name}`,
      artifactId: `vault:cp27:partition:${partitionRef.name}`,
      artifactType: 'graph_partition_review_pack',
      title: `CP27 Partition Pack - ${partitionRef.name}`,
      graphNodes,
      canonicalRefs: [`${graph.latestGraph.graphDir}/${partitionRef.path}`],
      summary: `Review pack for refreshed graph partition \`${partitionRef.name}\` with ${partitionRef.nodeCount} nodes and ${partitionRef.edgeCount} edges.`,
      details: table(countBy(graphNodes, 'type'), ['Node Type', 'Count']),
      blockers: partition.publicSafeNodeCount === 0 && partition.publicSafeEdgeCount === 0
        ? ['Partition remains private-only and public-safe counts are zero.']
        : ['Partition public-safe boundary requires review.'],
    });
  }

  for (const sourceGroupNode of sourceGroupNodes.sort((a, b) => a.sourceGroupKey.localeCompare(b.sourceGroupKey))) {
    const linkedNodes = allNodes.filter((node) => node.sourceGroupKey === sourceGroupNode.sourceGroupKey);
    plans.push({
      category: 'source-groups',
      fileStem: `source-group-${sourceGroupNode.sourceGroupKey}`,
      artifactId: `vault:cp27:source-group:${sourceGroupNode.sourceGroupKey}`,
      artifactType: 'source_group_review_pack',
      title: `CP27 Source Group Pack - ${sourceGroupNode.sourceGroupKey}`,
      graphNodes: linkedNodes,
      canonicalRefs: [`snapshot_group:${sourceGroupNode.sourceGroupKey}`],
      summary: `Review pack for CP26 snapshot source group \`${sourceGroupNode.sourceGroupKey}\` mapped into the CP27 refreshed graph.`,
      details: table([
        ['linkedNodes', linkedNodes.length],
        ['qualityWarnings', sourceGroupNode.metadata?.qualityWarningCount ?? 0],
        ['unresolvedReferences', sourceGroupNode.metadata?.unresolvedReferenceCount ?? 0],
        ['baselineComparisonMode', sourceGroupNode.metadata?.baselineComparisonMode ?? 'unknown'],
      ], ['Signal', 'Value']),
      blockers: [
        sourceGroupNode.metadata?.rawTextBodiesExported === false ? 'Raw text bodies are not exported.' : 'Raw text export state requires review.',
        sourceGroupNode.qualityState === 'review_required' ? 'Source group requires review.' : 'Source group remains private even when reviewed.',
      ],
    });
  }

  plans.push({
    category: 'quality',
    fileStem: 'cp27-refresh-quality-blockers',
    artifactId: 'vault:cp27:quality:blockers',
    artifactType: 'quality_blocker_pack',
    title: 'CP27 Refresh Quality And Blocker Summary',
    graphNodes: reviewRequiredNodes,
    canonicalRefs: [graph.latestGraph.manifestPath],
    summary: `Quality pack for ${reviewRequiredNodes.length} refreshed graph nodes that remain in review-required state.`,
    details: table([
      ['unresolvedReferences', manifest.counts.unresolvedReferenceCount],
      ['highOrCriticalBlockers', manifest.counts.highOrCriticalBlockerCount],
      ['reviewRequiredNodes', reviewRequiredNodes.length],
      ['deferredItems', manifest.counts.deferredItemCount],
      ['blockedItems', manifest.counts.blockedItemCount],
    ], ['Signal', 'Value']),
    blockers: ['Unresolved references and high/critical blockers remain visible and unresolved in CP27-G04.'],
  });

  return plans;
}

function writeJson(filePath, value) {
  const text = stableJson(value);
  writeFileSync(filePath, text, 'utf8');
  return {
    path: filePath.replaceAll(path.sep, '/'),
    checksumSha256: sha256Text(text),
    byteCount: Buffer.byteLength(text),
  };
}

function main() {
  const graph = loadGraph();
  const baselineVaultManifest = readJson(BASELINE_VAULT_MANIFEST_PATH);

  rmSync(VAULT_DIR, { recursive: true, force: true });
  mkdirSync(PACK_DIR, { recursive: true });
  mkdirSync(path.dirname(LATEST_VAULT_PATH), { recursive: true });

  const packPlans = buildPackPlans(graph);
  const artifacts = packPlans.map((plan) => writePack(plan, graph.manifest));
  const categoryCounts = Object.fromEntries(countBy(artifacts, 'category'));
  const graphNodesReferenced = new Set(artifacts.flatMap((artifact) => artifact.graphNodeIds)).size;

  const manifest = {
    schemaVersion: 'cp27.refresh-vault-manifest.v1',
    checkpoint: 'CP27-G04',
    vaultId: 'rafiq-cp27-refresh-private-knowledge-vault',
    vaultKind: 'snapshot_backed_private_review_vault',
    scope: 'Generated private vault packs from the CP27-G03 refreshed graph. This is not the CP22 full-private vault baseline and does not export raw text bodies.',
    generatedAt: GENERATED_AT,
    generatedBy: GENERATED_BY,
    outputDir: VAULT_DIR.replaceAll(path.sep, '/'),
    accessLevel: 'developer_private',
    publicSafe: false,
    sourceGraphId: graph.manifest.graphId,
    sourceGraphCheckpoint: graph.manifest.checkpoint,
    sourceGraphManifestPath: graph.latestGraph.manifestPath,
    sourceGraphManifestSha256: graph.latestGraph.manifestSha256,
    sourceGraphChecksumSha256: graph.manifest.checksums.graphChecksumSha256,
    baselineVaultManifestPath: BASELINE_VAULT_MANIFEST_PATH,
    baselineVaultArtifactCount: baselineVaultManifest.counts.artifacts,
    baselineVaultSourceGraphChecksumSha256: baselineVaultManifest.sourceGraphChecksumSha256,
    counts: {
      artifacts: artifacts.length,
      categories: Object.keys(categoryCounts).length,
      graphNodesReferenced,
      sourceGraphNodes: graph.manifest.counts.totalNodes,
      sourceGraphEdges: graph.manifest.counts.totalEdges,
      publicSafeArtifacts: 0,
      publicSafeGraphNodes: graph.manifest.counts.publicSafeNodes,
      publicSafeGraphEdges: graph.manifest.counts.publicSafeEdges,
      publicSafeSnapshotRowCount: graph.manifest.counts.publicSafeSnapshotRowCount,
      unresolvedReferenceCount: graph.manifest.counts.unresolvedReferenceCount,
      highOrCriticalBlockerCount: graph.manifest.counts.highOrCriticalBlockerCount,
    },
    categoryCounts,
    requiredBoundary: {
      vaultArtifactsAreCanonicalSourceData: false,
      rawTextBodiesExported: false,
      publicReleaseApproved: false,
      publicSafeArtifactsAllowed: false,
      cp22VaultBaselineOverwritten: false,
    },
    artifacts,
    publicBoundary: publicBoundary('CP27-G04 refreshed vault packs are private-only. Public release remains blocked.'),
    warnings: [
      'CP27-G04 vault packs are review and navigation artifacts, not canonical source data.',
      'Vault packs do not copy raw Quran, tafsir, translation, or hadith text bodies.',
      'All CP27-G04 vault artifacts are private and publicSafe=false.',
      'CP27-G04 does not overwrite data/vault/full-private.',
      'CP27-G04 reflects the CP27-G03 summary refreshed graph and does not claim CP22 vault parity.',
    ],
  };
  const manifestArtifact = writeJson(path.join(VAULT_DIR, 'manifest.json'), manifest);

  const summary = {
    schemaVersion: 'cp27.refresh-vault-summary.v1',
    checkpoint: 'CP27-G04',
    generatedAt: GENERATED_AT,
    vaultId: manifest.vaultId,
    sourceGraphId: manifest.sourceGraphId,
    counts: manifest.counts,
    categoryCounts,
    publicBoundary: manifest.publicBoundary,
  };
  const summaryArtifact = writeJson(path.join(VAULT_DIR, 'summary.json'), summary);

  const packArtifacts = artifacts.map((artifact) => ({
    path: path.join(VAULT_DIR, artifact.path).replaceAll(path.sep, '/'),
    checksumSha256: artifact.checksumSha256,
  }));
  const checksumLedger = {
    schemaVersion: 'cp27.refresh-vault-checksum-ledger.v1',
    checkpoint: 'CP27-G04',
    generatedAt: GENERATED_AT,
    vaultId: manifest.vaultId,
    artifacts: [manifestArtifact, summaryArtifact, ...packArtifacts],
    publicBoundary: manifest.publicBoundary,
  };
  const ledgerArtifact = writeJson(path.join(VAULT_DIR, 'checksum-ledger.json'), checksumLedger);

  const latestVault = {
    schemaVersion: 'cp27.latest-refresh-vault-pointer.v1',
    checkpoint: 'CP27-G04',
    generatedAt: GENERATED_AT,
    vaultId: manifest.vaultId,
    vaultDir: VAULT_DIR.replaceAll(path.sep, '/'),
    manifestPath: manifestArtifact.path,
    manifestSha256: manifestArtifact.checksumSha256,
    summaryPath: summaryArtifact.path,
    checksumLedgerPath: ledgerArtifact.path,
    checksumLedgerSha256: ledgerArtifact.checksumSha256,
    sourceGraphId: manifest.sourceGraphId,
    sourceGraphManifestPath: manifest.sourceGraphManifestPath,
    sourceGraphManifestSha256: manifest.sourceGraphManifestSha256,
    counts: manifest.counts,
    publicBoundary: manifest.publicBoundary,
  };
  writeJson(LATEST_VAULT_PATH, latestVault);

  console.log(`CP27-G04 vault generated at ${VAULT_DIR.replaceAll(path.sep, '/')}`);
  console.log(`Artifacts=${manifest.counts.artifacts}; categories=${manifest.counts.categories}; graphNodesReferenced=${manifest.counts.graphNodesReferenced}; public-safe artifacts=${manifest.counts.publicSafeArtifacts}.`);
}

main();
