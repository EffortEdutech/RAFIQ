#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const GENERATED_AT = '2026-07-16T00:00:00.000Z';
const GRAPH_DIR = path.join('data', 'graphify', 'cp27-refresh', 'graph', 'cp27-g03-refresh-graph');
const LATEST_GRAPH_PATH = path.join('data', 'graphify', 'cp27-refresh', 'latest-graph.json');
const LATEST_MAPPER_PATH = path.join('data', 'graphify', 'cp27-refresh', 'latest-mapper.json');
const BASELINE_GRAPH_MANIFEST_PATH = 'data/graphify/full-private/manifest.json';
const BASELINE_VAULT_MANIFEST_PATH = 'data/vault/full-private/manifest.json';

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

function safeKey(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9:_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function nodeId(partition, sourceGroupKey, entityFamily, stableKey) {
  return `cp27:${partition}:${sourceGroupKey}:${entityFamily}:${safeKey(stableKey)}`;
}

function edgeId(relationshipFamily, fromNodeId, toNodeId) {
  const digest = sha256Text(`${relationshipFamily}\n${fromNodeId}\n${toNodeId}`).slice(0, 16).toLowerCase();
  return `cp27:edge:${relationshipFamily}:${digest}`;
}

function partitionForFamily(mapping, family, index) {
  return mapping.targetPartitions[index % mapping.targetPartitions.length];
}

function makeNode({ id, partition, type, label, sourceGroupKey, canonicalRefs, sourceRefs, releaseState = 'private_blocked', qualityState = 'review_required', metadata = {} }) {
  return {
    id,
    type,
    label,
    partition,
    sourceGroupKey,
    canonicalRefs,
    sourceRefs,
    releaseState,
    qualityState,
    accessLevel: 'developer_private',
    publicSafe: false,
    publicBoundary: publicBoundary(`CP27-G03 node ${id} is private-only.`),
    metadata,
  };
}

function makeEdge({ id, type, from, to, partition, sourceGroupKey, canonicalRefs, sourceRefs, metadata = {} }) {
  return {
    id,
    type,
    from,
    to,
    partition,
    sourceGroupKey,
    canonicalRefs,
    sourceRefs,
    accessLevel: 'developer_private',
    publicSafe: false,
    publicBoundary: publicBoundary(`CP27-G03 edge ${id} is private-only.`),
    metadata,
  };
}

function addIndexValue(indexBucket, key, value) {
  if (!indexBucket[key]) indexBucket[key] = [];
  indexBucket[key].push(value);
}

function sortedObject(value) {
  return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
}

function main() {
  const latestMapper = readJson(LATEST_MAPPER_PATH);
  if (latestMapper.mapperContractSha256 !== sha256File(latestMapper.mapperContractPath)) {
    throw new Error('Latest mapper contract checksum mismatch.');
  }

  const mapperContract = readJson(latestMapper.mapperContractPath);
  const sourceGroupMapping = readJson(latestMapper.sourceGroupMappingPath);
  const nodeEdgePlan = readJson(latestMapper.nodeEdgePlanPath);
  const deferredBlockedReport = readJson(latestMapper.deferredBlockedReportPath);
  const baselineGraphManifest = readJson(BASELINE_GRAPH_MANIFEST_PATH);
  const baselineVaultManifest = readJson(BASELINE_VAULT_MANIFEST_PATH);

  const partitionsDir = path.join(GRAPH_DIR, 'partitions');
  const indexesDir = path.join(GRAPH_DIR, 'indexes');
  mkdirSync(partitionsDir, { recursive: true });
  mkdirSync(indexesDir, { recursive: true });
  mkdirSync(path.dirname(LATEST_GRAPH_PATH), { recursive: true });

  const partitions = Object.fromEntries(nodeEdgePlan.targetPartitions.map((partition) => [partition, { nodes: [], edges: [] }]));
  const indexes = Object.fromEntries(mapperContract.indexVocabulary.map((indexName) => [indexName, {}]));
  const allNodes = [];
  const allEdges = [];

  for (const mapping of sourceGroupMapping.mappings) {
    const sourceCanonicalRef = `snapshot_group:${mapping.sourceGroupKey}`;
    const sourceRefs = [
      mapping.snapshotPath,
      mapping.snapshotArtifactId,
      latestMapper.sourceSnapshotManifestPath,
    ].filter(Boolean);

    const groupNodesByPartition = new Map();
    for (const partition of mapping.targetPartitions) {
      const groupNode = makeNode({
        id: nodeId(partition, mapping.sourceGroupKey, 'snapshot_group', mapping.sourceGroupKey),
        partition,
        type: 'snapshot_group',
        label: mapping.label,
        sourceGroupKey: mapping.sourceGroupKey,
        canonicalRefs: [sourceCanonicalRef],
        sourceRefs,
        qualityState: mapping.qualityWarningCount > 0 || mapping.unresolvedReferenceCount > 0 ? 'review_required' : 'private_reviewed',
        metadata: {
          checkpoint: 'CP27-G03',
          rowCount: mapping.rowCount,
          canonicalRefCount: mapping.canonicalRefCount,
          provenanceRefCount: mapping.provenanceRefCount,
          releaseStateRefCount: mapping.releaseStateRefCount,
          unresolvedReferenceCount: mapping.unresolvedReferenceCount,
          qualityWarningCount: mapping.qualityWarningCount,
          baselineComparisonMode: mapping.baselineComparisonMode,
          rawTextBodiesExported: false,
        },
      });
      groupNodesByPartition.set(partition, groupNode);
      partitions[partition].nodes.push(groupNode);
      allNodes.push(groupNode);
    }

    mapping.nodeFamilies.forEach((family, index) => {
      const partition = partitionForFamily(mapping, family, index);
      const parentNode = groupNodesByPartition.get(partition) || groupNodesByPartition.values().next().value;
      const familyNode = makeNode({
        id: nodeId(partition, mapping.sourceGroupKey, family, family),
        partition,
        type: family,
        label: `${mapping.sourceGroupKey} ${family}`,
        sourceGroupKey: mapping.sourceGroupKey,
        canonicalRefs: [`${sourceCanonicalRef}:${family}`],
        sourceRefs,
        qualityState: mapping.qualityWarningCount > 0 || mapping.unresolvedReferenceCount > 0 ? 'review_required' : 'private_reviewed',
        metadata: {
          checkpoint: 'CP27-G03',
          sourceSnapshotChecksumSha256: mapping.snapshotChecksumSha256,
          baselineComparisonMode: mapping.baselineComparisonMode,
          rawTextBodiesExported: false,
        },
      });
      const parentEdge = makeEdge({
        id: edgeId('snapshot_group_to_node_family', parentNode.id, familyNode.id),
        type: 'snapshot_group_to_node_family',
        from: parentNode.id,
        to: familyNode.id,
        partition,
        sourceGroupKey: mapping.sourceGroupKey,
        canonicalRefs: [`${sourceCanonicalRef}:node_family:${family}`],
        sourceRefs,
        metadata: {
          checkpoint: 'CP27-G03',
          baselineComparisonMode: mapping.baselineComparisonMode,
        },
      });
      partitions[partition].nodes.push(familyNode);
      partitions[partition].edges.push(parentEdge);
      allNodes.push(familyNode);
      allEdges.push(parentEdge);
    });

    mapping.edgeFamilies.forEach((family, index) => {
      const partition = partitionForFamily(mapping, family, index);
      const parentNode = groupNodesByPartition.get(partition) || groupNodesByPartition.values().next().value;
      const relationNode = makeNode({
        id: nodeId(partition, mapping.sourceGroupKey, 'edge_family', family),
        partition,
        type: 'edge_family',
        label: `${mapping.sourceGroupKey} ${family}`,
        sourceGroupKey: mapping.sourceGroupKey,
        canonicalRefs: [`${sourceCanonicalRef}:edge_family:${family}`],
        sourceRefs,
        qualityState: mapping.qualityWarningCount > 0 || mapping.unresolvedReferenceCount > 0 ? 'review_required' : 'private_reviewed',
        metadata: {
          checkpoint: 'CP27-G03',
          relationshipFamily: family,
          baselineComparisonMode: mapping.baselineComparisonMode,
          rawTextBodiesExported: false,
        },
      });
      const relationEdge = makeEdge({
        id: edgeId(family, parentNode.id, relationNode.id),
        type: family,
        from: parentNode.id,
        to: relationNode.id,
        partition,
        sourceGroupKey: mapping.sourceGroupKey,
        canonicalRefs: [`${sourceCanonicalRef}:edge:${family}`],
        sourceRefs,
        metadata: {
          checkpoint: 'CP27-G03',
          relationshipFamily: family,
          baselineComparisonMode: mapping.baselineComparisonMode,
        },
      });
      partitions[partition].nodes.push(relationNode);
      partitions[partition].edges.push(relationEdge);
      allNodes.push(relationNode);
      allEdges.push(relationEdge);
    });
  }

  for (const node of allNodes) {
    indexes['by-node-id'][node.id] = node.partition;
    for (const canonicalRef of node.canonicalRefs) addIndexValue(indexes['by-canonical-ref'], canonicalRef, node.id);
    addIndexValue(indexes['by-source-id'], node.sourceGroupKey, node.id);
    addIndexValue(indexes['by-snapshot-id'], latestMapper.sourceSnapshotBatchId, node.id);
    addIndexValue(indexes['by-release-state'], node.releaseState, node.id);
    addIndexValue(indexes['by-quality-state'], node.qualityState, node.id);
    if (node.partition === 'quran') addIndexValue(indexes['by-ayah-key'], node.sourceGroupKey, node.id);
    if (node.partition === 'hadith' || node.partition === 'hadith-grades') addIndexValue(indexes['by-hadith-key'], node.sourceGroupKey, node.id);
    if (node.partition === 'topics') addIndexValue(indexes['by-topic-key'], node.sourceGroupKey, node.id);
  }

  for (const edge of allEdges) {
    indexes['by-edge-id'][edge.id] = edge.partition;
    for (const canonicalRef of edge.canonicalRefs) addIndexValue(indexes['by-canonical-ref'], canonicalRef, edge.id);
  }

  indexes['public-boundary'] = {
    publicReleaseApproved: false,
    publicRouteExposed: false,
    publicSafeSnapshotRowCount: 0,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
    rawTextBodiesExported: false,
    message: 'CP27-G03 refreshed graph partitions and indexes are private-only. Public release remains blocked.',
  };

  const partitionArtifacts = [];
  for (const [partitionName, partition] of Object.entries(partitions).sort(([a], [b]) => a.localeCompare(b))) {
    partition.nodes.sort((a, b) => a.id.localeCompare(b.id));
    partition.edges.sort((a, b) => a.id.localeCompare(b.id));
    const artifact = {
      schemaVersion: 'cp27.graph-partition.v1',
      checkpoint: 'CP27-G03',
      partition: partitionName,
      generatedAt: GENERATED_AT,
      sourceMapperId: latestMapper.mapperId,
      sourceSnapshotBatchId: latestMapper.sourceSnapshotBatchId,
      nodeCount: partition.nodes.length,
      edgeCount: partition.edges.length,
      publicSafeNodeCount: 0,
      publicSafeEdgeCount: 0,
      rawTextBodiesExported: false,
      nodes: partition.nodes,
      edges: partition.edges,
      publicBoundary: publicBoundary(`CP27-G03 ${partitionName} partition is private-only.`),
    };
    partitionArtifacts.push(writeJson(path.join(partitionsDir, `${partitionName}.json`), artifact));
  }

  const indexArtifacts = [];
  for (const [indexName, indexValue] of Object.entries(indexes).sort(([a], [b]) => a.localeCompare(b))) {
    const sortedIndex = Array.isArray(indexValue) ? indexValue : sortedObject(indexValue);
    const artifact = {
      schemaVersion: 'cp27.graph-index.v1',
      checkpoint: 'CP27-G03',
      index: indexName,
      generatedAt: GENERATED_AT,
      sourceMapperId: latestMapper.mapperId,
      entryCount: Object.keys(sortedIndex).length,
      entries: sortedIndex,
      publicBoundary: publicBoundary(`CP27-G03 ${indexName} index is private-only.`),
    };
    indexArtifacts.push(writeJson(path.join(indexesDir, `${indexName}.json`), artifact));
  }

  const partitionSummary = partitionArtifacts.map((artifact) => {
    const partitionName = path.basename(artifact.path, '.json');
    const partition = partitions[partitionName];
    return {
      name: partitionName,
      path: artifact.path.replace(`${GRAPH_DIR.replaceAll(path.sep, '/')}/`, ''),
      nodeCount: partition.nodes.length,
      edgeCount: partition.edges.length,
      checksumSha256: artifact.checksumSha256,
      publicSafeNodeCount: 0,
      publicSafeEdgeCount: 0,
    };
  });

  const indexSummary = indexArtifacts.map((artifact) => {
    const indexName = path.basename(artifact.path, '.json');
    return {
      name: indexName,
      path: artifact.path.replace(`${GRAPH_DIR.replaceAll(path.sep, '/')}/`, ''),
      checksumSha256: artifact.checksumSha256,
      entryCount: Object.keys(indexes[indexName]).length,
    };
  });

  const counts = {
    totalNodes: allNodes.length,
    totalEdges: allEdges.length,
    partitions: partitionSummary.length,
    indexes: indexSummary.length,
    sourceGroupCount: sourceGroupMapping.counts.sourceGroupCount,
    mappedSourceGroupCount: sourceGroupMapping.counts.mappedSourceGroupCount,
    deferredItemCount: deferredBlockedReport.counts.deferredItemCount,
    blockedItemCount: deferredBlockedReport.counts.blockedItemCount,
    unresolvedReferenceCount: sourceGroupMapping.counts.unresolvedReferenceCount,
    highOrCriticalBlockerCount: sourceGroupMapping.counts.highOrCriticalBlockerCount,
    publicSafeNodes: 0,
    publicSafeEdges: 0,
    publicSafeSnapshotRowCount: 0,
    publicSafeVaultArtifactCount: 0,
  };

  const manifestDraft = {
    schemaVersion: 'cp27.refresh-graph-manifest.v1',
    checkpoint: 'CP27-G03',
    graphId: 'rafiq-cp27-refresh-private-resource-graph',
    graphKind: 'snapshot_backed_refresh_graph',
    scope: 'Private refreshed graph partitions and indexes generated from CP26 snapshot metadata through the CP27-G02 mapper. This is not the CP22 full-private baseline and does not export raw text bodies.',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp27_g03_partition_index_graph.mjs',
    sourceMapperId: latestMapper.mapperId,
    sourceMapperContractPath: latestMapper.mapperContractPath,
    sourceMapperContractSha256: latestMapper.mapperContractSha256,
    sourceSnapshotBatchId: latestMapper.sourceSnapshotBatchId,
    sourceSnapshotManifestPath: latestMapper.sourceSnapshotManifestPath,
    sourceSnapshotManifestSha256: latestMapper.sourceSnapshotManifestSha256,
    baselineGraphManifestPath: BASELINE_GRAPH_MANIFEST_PATH,
    baselineGraphChecksumSha256: baselineGraphManifest.checksums.graphChecksumSha256,
    baselineVaultManifestPath: BASELINE_VAULT_MANIFEST_PATH,
    baselineVaultSourceGraphChecksumSha256: baselineVaultManifest.sourceGraphChecksumSha256,
    accessLevel: 'developer_private',
    publicSafe: false,
    rawTextBodiesExported: false,
    partitions: partitionSummary,
    indexes: indexSummary,
    counts,
    publicBoundary: publicBoundary('CP27-G03 refreshed graph is private-only. Public release remains blocked.'),
    warnings: [
      'CP27-G03 regenerates graph structure from CP26 summary snapshots; it does not claim full CP22 node/edge parity.',
      'CP22 full-private graph and vault directories are comparison baselines only and are not overwritten.',
      'Raw Quran, tafsir, translation, and hadith text bodies are not exported.',
      'All public-safe counts remain zero.',
    ],
  };

  const manifestText = stableJson(manifestDraft);
  const graphChecksumSha256 = sha256Text(manifestText);
  const manifest = {
    ...manifestDraft,
    checksums: {
      graphChecksumSha256,
      partitionChecksums: Object.fromEntries(partitionSummary.map((partition) => [partition.name, partition.checksumSha256])),
      indexChecksums: Object.fromEntries(indexSummary.map((index) => [index.name, index.checksumSha256])),
    },
  };
  const manifestArtifact = writeJson(path.join(GRAPH_DIR, 'manifest.json'), manifest);

  const summary = {
    schemaVersion: 'cp27.refresh-graph-summary.v1',
    checkpoint: 'CP27-G03',
    generatedAt: GENERATED_AT,
    graphId: manifest.graphId,
    counts,
    partitionSummary,
    indexSummary,
    publicBoundary: manifest.publicBoundary,
  };
  const summaryArtifact = writeJson(path.join(GRAPH_DIR, 'summary.json'), summary);

  const checksumLedger = {
    schemaVersion: 'cp27.refresh-graph-checksum-ledger.v1',
    checkpoint: 'CP27-G03',
    generatedAt: GENERATED_AT,
    graphId: manifest.graphId,
    artifacts: [manifestArtifact, summaryArtifact, ...partitionArtifacts, ...indexArtifacts],
    publicBoundary: manifest.publicBoundary,
  };
  const ledgerArtifact = writeJson(path.join(GRAPH_DIR, 'checksum-ledger.json'), checksumLedger);

  const latestGraph = {
    schemaVersion: 'cp27.latest-refresh-graph-pointer.v1',
    checkpoint: 'CP27-G03',
    generatedAt: GENERATED_AT,
    graphId: manifest.graphId,
    graphDir: GRAPH_DIR.replaceAll(path.sep, '/'),
    manifestPath: manifestArtifact.path,
    manifestSha256: manifestArtifact.checksumSha256,
    summaryPath: summaryArtifact.path,
    checksumLedgerPath: ledgerArtifact.path,
    checksumLedgerSha256: ledgerArtifact.checksumSha256,
    sourceMapperId: latestMapper.mapperId,
    sourceMapperContractPath: latestMapper.mapperContractPath,
    sourceSnapshotBatchId: latestMapper.sourceSnapshotBatchId,
    counts,
    publicBoundary: manifest.publicBoundary,
  };
  writeJson(LATEST_GRAPH_PATH, latestGraph);

  console.log(`CP27-G03 graph generated at ${GRAPH_DIR.replaceAll(path.sep, '/')}`);
  console.log(`Partitions=${counts.partitions}; indexes=${counts.indexes}; nodes=${counts.totalNodes}; edges=${counts.totalEdges}; public-safe nodes=${counts.publicSafeNodes}; public-safe edges=${counts.publicSafeEdges}.`);
}

main();
