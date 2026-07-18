#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join('data', 'retrieval', 'cp28');
const LATEST_GRAPH_PATH = path.join('data', 'graphify', 'cp27-refresh', 'latest-graph.json');
const LATEST_VAULT_PATH = path.join('data', 'vault', 'cp27-refresh', 'latest-vault.json');
const CP24_MANIFEST_PATH = path.join('data', 'retrieval', 'cp24', 'manifest.json');
const GENERATED_AT = '2026-07-18T00:00:00.000Z';
const MAX_INITIAL_CANDIDATES = 8;
const MAX_EXPANDED_CANDIDATES = 12;
const MAX_GRAPH_DEPTH = 2;
const MAX_VAULT_PACK_REFS = 8;

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
  writeFileSync(filePath, text, 'utf8');
  return {
    path: filePath.replaceAll(path.sep, '/'),
    checksumSha256: sha256Text(text),
    byteCount: Buffer.byteLength(text),
  };
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
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

function loadIndex(graphDir, indexName) {
  return readJson(path.join(graphDir, 'indexes', `${indexName}.json`));
}

function loadGraph(latestGraph) {
  const graphManifest = readJson(latestGraph.manifestPath);
  const indexes = Object.fromEntries(
    graphManifest.indexes.map((item) => [item.name, loadIndex(latestGraph.graphDir, item.name)]),
  );
  const nodes = new Map();
  const edges = new Map();
  const adjacency = new Map();
  for (const partitionRef of graphManifest.partitions) {
    const partition = readJson(path.join(latestGraph.graphDir, partitionRef.path));
    for (const node of partition.nodes ?? []) nodes.set(node.id, node);
    for (const edge of partition.edges ?? []) {
      edges.set(edge.id, edge);
      adjacency.set(edge.from, [...(adjacency.get(edge.from) ?? []), edge]);
      adjacency.set(edge.to, [...(adjacency.get(edge.to) ?? []), edge]);
    }
  }
  return { graphManifest, indexes, nodes, edges, adjacency };
}

function loadVault(latestVault) {
  const vaultManifest = readJson(latestVault.manifestPath);
  const vaultPacksByNode = new Map();
  for (const artifact of vaultManifest.artifacts ?? []) {
    for (const graphNodeId of artifact.graphNodeIds ?? []) {
      vaultPacksByNode.set(graphNodeId, [...(vaultPacksByNode.get(graphNodeId) ?? []), artifact.artifactId]);
    }
  }
  return { vaultManifest, vaultPacksByNode };
}

const FIXTURES = [
  {
    fixtureId: 'cp28-fixture-quran-anchor-001',
    regressionFixtureId: 'cp24-fixture-quran-anchor-001',
    domain: 'quran',
    intent: 'guidance',
    sourceIndexes: [{ indexName: 'by-ayah-key', entryKey: 'quran' }],
    requiredSourceGroups: ['quran', 'source_registry'],
    expectedBoundary: 'quran_candidate_requires_source_provenance_release_visibility',
  },
  {
    fixtureId: 'cp28-fixture-translation-context-001',
    regressionFixtureId: 'cp24-fixture-translation-context-001',
    domain: 'translation',
    intent: 'learning',
    sourceIndexes: [{ indexName: 'by-source-id', entryKey: 'translations' }],
    requiredSourceGroups: ['translations', 'source_registry'],
    expectedBoundary: 'translation_candidate_is_context_not_quran_text',
  },
  {
    fixtureId: 'cp28-fixture-tafsir-context-001',
    regressionFixtureId: 'cp24-fixture-tafsir-context-001',
    domain: 'tafsir',
    intent: 'learning',
    sourceIndexes: [{ indexName: 'by-source-id', entryKey: 'tafsir' }],
    requiredSourceGroups: ['tafsir', 'source_registry'],
    expectedBoundary: 'tafsir_candidate_is_explanatory_context_not_ruling',
  },
  {
    fixtureId: 'cp28-fixture-hadith-support-001',
    regressionFixtureId: 'cp24-fixture-hadith-support-001',
    domain: 'hadith',
    intent: 'guidance',
    sourceIndexes: [{ indexName: 'by-hadith-key', entryKey: 'hadith' }],
    requiredSourceGroups: ['hadith', 'hadith_quality', 'source_registry'],
    expectedBoundary: 'hadith_candidate_requires_grade_verification_review_context',
  },
  {
    fixtureId: 'cp28-fixture-hadith-grade-escalation-001',
    regressionFixtureId: 'cp24-fixture-hadith-grade-escalation-001',
    domain: 'hadith',
    intent: 'search',
    sourceIndexes: [{ indexName: 'by-hadith-key', entryKey: 'hadith_quality' }],
    requiredSourceGroups: ['hadith_quality', 'private_review'],
    expectedBoundary: 'grade_uncertainty_routes_to_escalation_not_ordinary_score',
  },
  {
    fixtureId: 'cp28-fixture-topic-001',
    regressionFixtureId: 'cp24-fixture-topic-001',
    domain: 'topic',
    intent: 'search',
    sourceIndexes: [{ indexName: 'by-topic-key', entryKey: 'topics_themes' }],
    requiredSourceGroups: ['topics_themes', 'cross_domain_links'],
    expectedBoundary: 'topic_relation_can_expand_candidates_but_not_create_authority',
  },
  {
    fixtureId: 'cp28-fixture-validation-history-001',
    regressionFixtureId: 'cp24-fixture-validation-history-001',
    domain: 'validation',
    intent: 'search',
    sourceIndexes: [{ indexName: 'by-source-id', entryKey: 'private_audit' }],
    requiredSourceGroups: ['private_audit', 'private_review'],
    expectedBoundary: 'validation_history_is_operational_not_public_approval',
  },
  {
    fixtureId: 'cp28-fixture-source-gap-001',
    regressionFixtureId: 'cp24-fixture-source-gap-001',
    domain: 'source',
    intent: 'search',
    sourceIndexes: [{ indexName: 'by-quality-state', entryKey: 'review_required' }],
    requiredSourceGroups: ['source_registry', 'raw_lineage'],
    expectedBoundary: 'unresolved_refs_and_blockers_remain_visible',
  },
  {
    fixtureId: 'cp28-fixture-public-boundary-001',
    regressionFixtureId: 'cp24-fixture-public-boundary-001',
    domain: 'public_boundary',
    intent: 'search',
    sourceIndexes: [{ indexName: 'public-boundary', entryKey: 'publicReleaseApproved' }],
    requiredSourceGroups: ['source_registry'],
    expectedBoundary: 'public_safe_candidates_and_route_items_remain_zero',
  },
  {
    fixtureId: 'cp28-fixture-safety-escalation-001',
    regressionFixtureId: 'cp24-fixture-safety-escalation-001',
    domain: 'safety',
    intent: 'crisis',
    sourceIndexes: [{ indexName: 'by-source-id', entryKey: 'private_review' }],
    requiredSourceGroups: ['private_review', 'private_audit'],
    expectedBoundary: 'safety_escalation_remains_separate_from_ordinary_ranking',
  },
];

function indexValues(index, entryKey) {
  const value = index?.entries?.[entryKey];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return [value];
  if (value === false || value === 0 || value === null) return [];
  if (value === true) return [`public-boundary:${entryKey}:true`];
  return [];
}

function expandGraph(seedNodeIds, graph) {
  const resolvedSeeds = seedNodeIds.filter((nodeId) => graph.nodes.has(nodeId));
  const unresolvedSeeds = seedNodeIds.filter((nodeId) => !graph.nodes.has(nodeId));
  const queue = resolvedSeeds.map((nodeId) => ({ nodeId, depth: 0 }));
  const visited = new Map(resolvedSeeds.map((nodeId) => [nodeId, 0]));
  const edgeIds = new Set();
  const stopConditions = unresolvedSeeds.map((nodeId) => ({ nodeId, reason: 'unresolved_seed_from_index', depth: 0 }));

  while (queue.length > 0 && visited.size < MAX_INITIAL_CANDIDATES + MAX_EXPANDED_CANDIDATES) {
    const current = queue.shift();
    if (!current) break;
    if (current.depth >= MAX_GRAPH_DEPTH) {
      stopConditions.push({ nodeId: current.nodeId, reason: 'max_depth_reached', depth: current.depth });
      continue;
    }
    for (const edge of graph.adjacency.get(current.nodeId) ?? []) {
      edgeIds.add(edge.id);
      const nextNodeId = edge.from === current.nodeId ? edge.to : edge.from;
      if (!visited.has(nextNodeId) && visited.size < MAX_INITIAL_CANDIDATES + MAX_EXPANDED_CANDIDATES) {
        visited.set(nextNodeId, current.depth + 1);
        queue.push({ nodeId: nextNodeId, depth: current.depth + 1 });
      }
    }
  }

  return {
    resolvedSeedNodeIds: resolvedSeeds,
    unresolvedSeedNodeIds: unresolvedSeeds,
    expandedNodeIds: Array.from(visited.keys()),
    expandedEdgeIds: Array.from(edgeIds),
    maxDepthReached: Math.max(0, ...Array.from(visited.values())),
    stopConditions,
  };
}

function vaultRefsFor(nodeIds, vault) {
  return unique(nodeIds.flatMap((nodeId) => vault.vaultPacksByNode.get(nodeId) ?? [])).slice(0, MAX_VAULT_PACK_REFS);
}

function candidateState(node, fixture, graph) {
  if (!node) return 'requires_review';
  if (fixture.intent === 'crisis') return 'requires_escalation';
  if (fixture.fixtureId.includes('hadith-grade-escalation')) return 'requires_escalation';
  if (fixture.fixtureId.includes('source-gap')) return 'requires_review';
  if (node.qualityState === 'review_required') return 'requires_review';
  if (graph.graphManifest.counts.unresolvedReferenceCount > 0) return 'requires_review';
  return 'collected';
}

function remediationReasons(node, fixture, graph) {
  const reasons = [];
  if (!node) reasons.push('candidate_seed_unresolved_from_cp27_index');
  if (node?.qualityState === 'review_required') reasons.push('cp27_quality_state_review_required');
  if (graph.graphManifest.counts.unresolvedReferenceCount > 0) reasons.push('cp27_unresolved_references_present');
  if (fixture.fixtureId.includes('public-boundary')) reasons.push('public_release_blocked');
  if (fixture.fixtureId.includes('source-gap')) reasons.push('source_or_provenance_gap_fixture');
  if (fixture.fixtureId.includes('hadith-grade-escalation')) reasons.push('grade_uncertainty_requires_escalation_review');
  if (fixture.intent === 'crisis') reasons.push('safety_escalation_required');
  return unique(reasons);
}

function candidateFromNode(nodeId, fixture, graph, vault, collectionMethod, indexName, entryKey) {
  const node = graph.nodes.get(nodeId);
  const state = candidateState(node, fixture, graph);
  const localEdgeIds = unique((graph.adjacency.get(nodeId) ?? []).map((edge) => edge.id));
  const vaultPackIds = vaultRefsFor([nodeId], vault);
  return {
    candidateId: `cp28:candidate:${fixture.fixtureId}:${nodeId.replace(/[^a-zA-Z0-9:_-]/g, '-')}`,
    fixtureId: fixture.fixtureId,
    regressionFixtureId: fixture.regressionFixtureId,
    collectionMethod,
    sourceIndex: {
      indexName,
      entryKey,
      snapshotBacked: true,
    },
    graphNodeId: nodeId,
    graphNodeType: node?.type ?? 'unresolved_index_marker',
    graphPartition: node?.partition ?? null,
    sourceGroupKey: node?.sourceGroupKey ?? null,
    canonicalRefs: node?.canonicalRefs ?? [],
    sourceRefs: node?.sourceRefs ?? [],
    releaseState: node?.releaseState ?? 'private_blocked',
    qualityState: node?.qualityState ?? 'review_required',
    accessLevel: node?.accessLevel ?? 'developer_private',
    publicSafe: false,
    graphEdgeIds: localEdgeIds,
    vaultPackIds,
    selectionState: state,
    remediationReasons: remediationReasons(node, fixture, graph),
    authorityBoundary: 'operational_metadata_only',
    rawTextBodiesExported: false,
  };
}

function collectFixture(fixture, graph, vault) {
  const seedNodeIds = unique(
    fixture.sourceIndexes.flatMap(({ indexName, entryKey }) => indexValues(graph.indexes[indexName], entryKey)),
  );
  const expansion = expandGraph(seedNodeIds, graph);
  const directSeedCandidates = seedNodeIds
    .slice(0, MAX_INITIAL_CANDIDATES)
    .map((nodeId) => candidateFromNode(nodeId, fixture, graph, vault, 'direct_index_seed', fixture.sourceIndexes[0].indexName, fixture.sourceIndexes[0].entryKey));
  const expandedCandidates = expansion.expandedNodeIds
    .filter((nodeId) => !seedNodeIds.includes(nodeId))
    .slice(0, MAX_EXPANDED_CANDIDATES)
    .map((nodeId) => candidateFromNode(nodeId, fixture, graph, vault, 'depth_limited_graph_expansion', 'by-node-id', graph.indexes['by-node-id'].entries[nodeId]));
  const candidates = [...directSeedCandidates, ...expandedCandidates];
  const requiredSourceGroupsPresent = fixture.requiredSourceGroups.filter((sourceGroupKey) => graph.indexes['by-source-id'].entries[sourceGroupKey]);
  const missingRequiredSourceGroups = fixture.requiredSourceGroups.filter((sourceGroupKey) => !requiredSourceGroupsPresent.includes(sourceGroupKey));
  return {
    fixtureId: fixture.fixtureId,
    regressionFixtureId: fixture.regressionFixtureId,
    domain: fixture.domain,
    intent: fixture.intent,
    expectedBoundary: fixture.expectedBoundary,
    sourceIndexes: fixture.sourceIndexes,
    requiredSourceGroups: fixture.requiredSourceGroups,
    requiredSourceGroupsPresent,
    missingRequiredSourceGroups,
    seed: {
      seedNodeIds,
      resolvedSeedNodeIds: expansion.resolvedSeedNodeIds,
      unresolvedSeedNodeIds: expansion.unresolvedSeedNodeIds,
    },
    graphExpansion: {
      maxDepth: MAX_GRAPH_DEPTH,
      maxDepthReached: expansion.maxDepthReached,
      expandedNodeIds: expansion.expandedNodeIds,
      expandedEdgeIds: expansion.expandedEdgeIds,
      stopConditions: expansion.stopConditions,
    },
    candidates,
    counts: {
      seedCount: seedNodeIds.length,
      candidateCount: candidates.length,
      collectedCount: candidates.filter((candidate) => candidate.selectionState === 'collected').length,
      requiresReviewCount: candidates.filter((candidate) => candidate.selectionState === 'requires_review').length,
      requiresEscalationCount: candidates.filter((candidate) => candidate.selectionState === 'requires_escalation').length,
      publicSafeCandidateCount: 0,
      remediationReasonCount: unique(candidates.flatMap((candidate) => candidate.remediationReasons)).length,
    },
    publicBoundary: publicBoundary(`CP28-R02 fixture ${fixture.fixtureId} is private-only and collected from CP27 snapshot-backed indexes.`),
  };
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const latestGraph = readJson(LATEST_GRAPH_PATH);
  const latestVault = readJson(LATEST_VAULT_PATH);
  const cp24Manifest = readJson(CP24_MANIFEST_PATH);
  const graph = loadGraph(latestGraph);
  const vault = loadVault(latestVault);

  if (latestGraph.manifestSha256 !== sha256File(latestGraph.manifestPath)) {
    throw new Error('CP27 latest graph manifest checksum mismatch.');
  }
  if (latestVault.manifestSha256 !== sha256File(latestVault.manifestPath)) {
    throw new Error('CP27 latest vault manifest checksum mismatch.');
  }

  const fixtures = FIXTURES.map((fixture) => collectFixture(fixture, graph, vault));
  const candidates = fixtures.flatMap((fixture) => fixture.candidates);
  const collection = {
    schemaVersion: 'cp28.candidate-collection.v1',
    checkpoint: 'CP28-R02',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp28_r02_candidate_collection.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactKind: 'snapshot_backed_graph_index_candidate_collection',
    sourceGraph: {
      graphId: latestGraph.graphId,
      graphPointerPath: LATEST_GRAPH_PATH.replaceAll(path.sep, '/'),
      graphManifestPath: latestGraph.manifestPath,
      graphManifestSha256: latestGraph.manifestSha256,
      graphChecksumSha256: graph.graphManifest.checksums.graphChecksumSha256,
      nodeCount: graph.graphManifest.counts.totalNodes,
      edgeCount: graph.graphManifest.counts.totalEdges,
      indexCount: graph.graphManifest.counts.indexes,
      publicSafeNodeCount: graph.graphManifest.counts.publicSafeNodes,
      publicSafeEdgeCount: graph.graphManifest.counts.publicSafeEdges,
    },
    sourceVault: {
      vaultId: latestVault.vaultId,
      vaultPointerPath: LATEST_VAULT_PATH.replaceAll(path.sep, '/'),
      vaultManifestPath: latestVault.manifestPath,
      vaultManifestSha256: latestVault.manifestSha256,
      artifactCount: vault.vaultManifest.counts.artifacts,
      publicSafeArtifactCount: vault.vaultManifest.counts.publicSafeArtifacts,
    },
    regressionBaseline: {
      cp24ManifestPath: CP24_MANIFEST_PATH.replaceAll(path.sep, '/'),
      cp24CandidateCount: cp24Manifest.counts.candidateCount,
      cp24SelectedCandidateCount: cp24Manifest.counts.rankingSelection.selectedCandidateCount,
      cp24PublicSafeCandidateCount: cp24Manifest.counts.publicSafeCandidateCount,
      note: 'CP24 fixtures are regression labels only. CP28-R02 collects candidates from CP27 snapshot-backed graph indexes.',
    },
    outputCaps: {
      maxInitialCandidates: MAX_INITIAL_CANDIDATES,
      maxExpandedCandidates: MAX_EXPANDED_CANDIDATES,
      maxGraphDepth: MAX_GRAPH_DEPTH,
      maxVaultPackRefs: MAX_VAULT_PACK_REFS,
      rawTextBodies: 0,
      publicSafeCandidates: 0,
    },
    fixtures,
    summary: {
      fixtureCount: fixtures.length,
      candidateCount: candidates.length,
      collectedCount: candidates.filter((candidate) => candidate.selectionState === 'collected').length,
      requiresReviewCandidateCount: candidates.filter((candidate) => candidate.selectionState === 'requires_review').length,
      requiresEscalationCandidateCount: candidates.filter((candidate) => candidate.selectionState === 'requires_escalation').length,
      unresolvedSeedCount: fixtures.reduce((sum, fixture) => sum + fixture.seed.unresolvedSeedNodeIds.length, 0),
      remediationReasonCount: unique(candidates.flatMap((candidate) => candidate.remediationReasons)).length,
      sourceIndexCount: unique(fixtures.flatMap((fixture) => fixture.sourceIndexes.map((index) => index.indexName))).length,
      cp27UnresolvedReferenceCount: graph.graphManifest.counts.unresolvedReferenceCount,
      cp27HighOrCriticalBlockerCount: graph.graphManifest.counts.highOrCriticalBlockerCount,
      publicSafeCandidateCount: 0,
    },
    publicBoundary: publicBoundary('CP28-R02 candidate collection is private-only. Public release remains blocked and public-safe candidate count is zero.'),
    warnings: [
      'CP28-R02 collects snapshot-backed graph metadata candidates; it does not export raw Quran, translation, tafsir, or hadith text bodies.',
      'CP28-R02 does not perform ranking, selection, evidence route rebuild, validation handoff, API exposure, or UI exposure.',
      'CP24 fixture IDs are retained as regression labels only.',
      'CP27 refreshed graph/vault artifacts are derived private metadata and are not canonical source data.',
    ],
  };

  const collectionArtifact = writeJson(path.join(OUT_DIR, 'candidate-collection.json'), collection);
  const manifest = {
    schemaVersion: 'cp28.retrieval-artifact-manifest.v1',
    checkpoint: 'CP28-R02',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp28_r02_candidate_collection.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactPaths: {
      candidateCollection: collectionArtifact.path,
    },
    checksums: {
      candidateCollectionSha256: collectionArtifact.checksumSha256,
      cp27GraphManifestSha256: latestGraph.manifestSha256,
      cp27VaultManifestSha256: latestVault.manifestSha256,
      cp24ManifestSha256: sha256File(CP24_MANIFEST_PATH),
    },
    counts: collection.summary,
    sourceGraph: collection.sourceGraph,
    sourceVault: collection.sourceVault,
    regressionBaseline: collection.regressionBaseline,
    verifier: {
      command: 'node scripts/check_cp28_r02_candidate_collection.mjs',
      status: 'pending',
    },
    publicBoundary: collection.publicBoundary,
  };
  const manifestArtifact = writeJson(path.join(OUT_DIR, 'manifest.json'), manifest);
  const latestPointer = {
    schemaVersion: 'cp28.latest-retrieval-pointer.v1',
    checkpoint: 'CP28-R02',
    generatedAt: GENERATED_AT,
    retrievalDir: OUT_DIR.replaceAll(path.sep, '/'),
    manifestPath: manifestArtifact.path,
    manifestSha256: manifestArtifact.checksumSha256,
    candidateCollectionPath: collectionArtifact.path,
    candidateCollectionSha256: collectionArtifact.checksumSha256,
    counts: collection.summary,
    publicBoundary: collection.publicBoundary,
  };
  writeJson(path.join(OUT_DIR, 'latest-retrieval.json'), latestPointer);

  console.log(JSON.stringify({ status: 'pass', checkpoint: 'CP28-R02', outputDir: OUT_DIR.replaceAll(path.sep, '/'), counts: collection.summary }, null, 2));
}

main();
