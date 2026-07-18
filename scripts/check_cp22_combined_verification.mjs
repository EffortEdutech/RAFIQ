import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const GRAPH_DIR = 'data/graphify/full-private';
const VAULT_DIR = 'data/vault/full-private';

const REQUIRED_GRAPH_PARTITIONS = [
  'sources',
  'governance',
  'quran',
  'translations',
  'tafsir',
  'topics',
  'hadith',
  'hadith-grades',
  'quality',
  'product-evidence',
  'cp21c-reference',
];

const REQUIRED_INDEXES = [
  'by-node-id',
  'by-edge-id',
  'by-canonical-ref',
  'by-source-id',
  'by-snapshot-id',
  'by-ayah-key',
  'by-hadith-key',
  'by-topic-key',
  'by-release-state',
  'by-review-state',
  'by-quality-state',
  'public-boundary',
];

const PROVENANCE_REQUIRED_NODE_TYPES = new Set([
  'quran_ayah_text',
  'translation_text',
  'tafsir_passage',
  'source_ayah_theme_group',
  'source_topic',
  'hadith_record',
  'hadith_text_version',
  'hadith_grade_assertion',
  'hadith_verification_claim',
  'private_search_document',
  'private_retrieval_trace',
  'private_answer_draft',
  'private_guided_answer_run',
  'private_answer_validation_run',
  'cp21c_case',
  'vault_note',
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function assertExists(filePath) {
  await access(filePath);
}

async function assertChecksum(filePath, expected) {
  const raw = await readFile(filePath, 'utf8');
  assert(sha256(raw) === expected, `Checksum mismatch for ${filePath}`);
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = key(item) ?? 'unknown';
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function sortRecord(record) {
  return Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));
}

function flattenIndexIds(value) {
  if (!value) return [];
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(flattenIndexIds);
  if (typeof value !== 'object') return [];
  const item = value;
  const ownIds = [
    item.id,
    item.nodeId,
    item.ayahNodeId,
    item.hadithNodeId,
    item.hadithRecordNodeId,
  ].filter((entry) => typeof entry === 'string');
  const nestedIds = Object.values(item).flatMap((entry) =>
    Array.isArray(entry) ? entry.filter((child) => typeof child === 'string') : [],
  );
  return [...ownIds, ...nestedIds];
}

function canonicalKey(ref) {
  if (!ref) return null;
  if (typeof ref === 'string') return ref;
  if (typeof ref !== 'object') return String(ref);
  if (ref.schema && ref.table && ref.id) return `${ref.schema}.${ref.table}:${ref.id}`;
  if (ref.type && ref.id) return `${ref.type}:${ref.id}`;
  return null;
}

async function listFilesRecursive(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) files.push(...await listFilesRecursive(entryPath));
    if (entry.isFile()) files.push(entryPath);
  }
  return files;
}

async function runVerifier(scriptPath) {
  const started = performance.now();
  const { stdout } = await execFileAsync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    maxBuffer: 1024 * 1024 * 16,
  });
  const durationMs = Math.round(performance.now() - started);
  const parsed = JSON.parse(stdout);
  assert(parsed.status === 'pass', `${scriptPath} did not pass`);
  return { scriptPath, durationMs, ...parsed };
}

async function loadGraph() {
  const manifest = await readJson(path.join(GRAPH_DIR, 'manifest.json'));
  const summary = await readJson(path.join(GRAPH_DIR, 'summary.json'));
  const partitionDescriptors = new Map(manifest.partitions.map((item) => [item.name, item]));
  const indexDescriptors = new Map(manifest.indexes.map((item) => [item.name, item]));

  for (const name of REQUIRED_GRAPH_PARTITIONS) assert(partitionDescriptors.has(name), `Missing graph partition ${name}`);
  for (const name of REQUIRED_INDEXES) assert(indexDescriptors.has(name), `Missing graph index ${name}`);

  const partitions = [];
  for (const name of REQUIRED_GRAPH_PARTITIONS) {
    const descriptor = partitionDescriptors.get(name);
    const filePath = path.join(GRAPH_DIR, descriptor.path);
    await assertChecksum(filePath, descriptor.checksumSha256);
    const partition = await readJson(filePath);
    assert(partition.partition === name, `${name} partition identity mismatch`);
    assert(partition.stats.nodeCount === descriptor.nodeCount, `${name} manifest node count mismatch`);
    assert(partition.stats.edgeCount === descriptor.edgeCount, `${name} manifest edge count mismatch`);
    partitions.push(partition);
  }
  for (const descriptor of manifest.indexes) {
    await assertChecksum(path.join(GRAPH_DIR, descriptor.path), descriptor.checksumSha256);
  }

  const nodes = partitions.flatMap((partition) => partition.nodes ?? []);
  const edges = partitions.flatMap((partition) => partition.edges ?? []);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const edgeById = new Map(edges.map((edge) => [edge.id, edge]));
  assert(nodeById.size === nodes.length, 'Duplicate graph node IDs found');
  assert(edgeById.size === edges.length, 'Duplicate graph edge IDs found');
  assert(nodes.length === manifest.counts.totalNodes, 'Graph manifest totalNodes mismatch');
  assert(edges.length === manifest.counts.totalEdges, 'Graph manifest totalEdges mismatch');
  assert(summary.counts.totalNodes === nodes.length, 'Graph summary totalNodes mismatch');
  assert(summary.counts.totalEdges === edges.length, 'Graph summary totalEdges mismatch');

  return { manifest, summary, partitions, nodes, edges, nodeById, edgeById };
}

async function checkGraphSchemaAndRefs(graph) {
  let missingSourceCoverage = 0;
  let missingProvenanceCoverage = 0;
  let missingReleaseCoverage = 0;
  let crossPartitionEdgeCount = 0;

  for (const node of graph.nodes) {
    for (const field of ['id', 'type', 'label', 'partition', 'releaseState', 'reviewState', 'qualityState', 'accessLevel', 'publicSafe', 'metadata']) {
      assert(Object.hasOwn(node, field), `Node ${node.id ?? '[missing id]'} missing ${field}`);
    }
    assert(node.accessLevel === 'developer_private', `Node ${node.id} accessLevel must be developer_private`);
    assert(node.publicSafe === false, `Node ${node.id} publicSafe must be false`);
    if (PROVENANCE_REQUIRED_NODE_TYPES.has(node.type)) {
      if (!node.sourceRefs?.length) missingSourceCoverage += 1;
      if (!node.provenanceRefs?.length) missingProvenanceCoverage += 1;
      if (!node.releaseStateRefs?.length) missingReleaseCoverage += 1;
    }
  }

  for (const edge of graph.edges) {
    for (const field of ['id', 'type', 'from', 'to', 'fromPartition', 'toPartition', 'releaseState', 'reviewState', 'accessLevel', 'publicSafe', 'metadata']) {
      assert(Object.hasOwn(edge, field), `Edge ${edge.id ?? '[missing id]'} missing ${field}`);
    }
    const from = graph.nodeById.get(edge.from);
    const to = graph.nodeById.get(edge.to);
    assert(from, `Edge ${edge.id} missing from node ${edge.from}`);
    assert(to, `Edge ${edge.id} missing to node ${edge.to}`);
    assert(from.partition === edge.fromPartition, `Edge ${edge.id} fromPartition mismatch`);
    assert(to.partition === edge.toPartition, `Edge ${edge.id} toPartition mismatch`);
    assert(edge.accessLevel === 'developer_private', `Edge ${edge.id} accessLevel must be developer_private`);
    assert(edge.publicSafe === false, `Edge ${edge.id} publicSafe must be false`);
    if (edge.fromPartition !== edge.toPartition) crossPartitionEdgeCount += 1;
  }

  assert(missingSourceCoverage === 0, `${missingSourceCoverage} provenance-required nodes missing source refs`);
  assert(missingProvenanceCoverage === 0, `${missingProvenanceCoverage} provenance-required nodes missing provenance refs`);
  assert(missingReleaseCoverage === 0, `${missingReleaseCoverage} provenance-required nodes missing release-state refs`);

  return { crossPartitionEdgeCount, missingSourceCoverage, missingProvenanceCoverage, missingReleaseCoverage };
}

async function checkIndexes(graph) {
  const byNodeId = await readJson(path.join(GRAPH_DIR, 'indexes/by-node-id.json'));
  const byEdgeId = await readJson(path.join(GRAPH_DIR, 'indexes/by-edge-id.json'));
  const byCanonicalRef = await readJson(path.join(GRAPH_DIR, 'indexes/by-canonical-ref.json'));
  const bySourceId = await readJson(path.join(GRAPH_DIR, 'indexes/by-source-id.json'));
  const bySnapshotId = await readJson(path.join(GRAPH_DIR, 'indexes/by-snapshot-id.json'));
  const byAyahKey = await readJson(path.join(GRAPH_DIR, 'indexes/by-ayah-key.json'));
  const byHadithKey = await readJson(path.join(GRAPH_DIR, 'indexes/by-hadith-key.json'));
  const byTopicKey = await readJson(path.join(GRAPH_DIR, 'indexes/by-topic-key.json'));
  const byReleaseState = await readJson(path.join(GRAPH_DIR, 'indexes/by-release-state.json'));
  const byReviewState = await readJson(path.join(GRAPH_DIR, 'indexes/by-review-state.json'));
  const byQualityState = await readJson(path.join(GRAPH_DIR, 'indexes/by-quality-state.json'));
  const publicBoundary = await readJson(path.join(GRAPH_DIR, 'indexes/public-boundary.json'));

  assert(Object.keys(byNodeId).length === graph.nodes.length, 'by-node-id entry count mismatch');
  assert(Object.keys(byEdgeId).length === graph.edges.length, 'by-edge-id entry count mismatch');
  for (const node of graph.nodes) assert(byNodeId[node.id], `by-node-id missing ${node.id}`);
  for (const edge of graph.edges) assert(byEdgeId[edge.id], `by-edge-id missing ${edge.id}`);

  for (const [state, ids] of Object.entries(byReleaseState)) {
    for (const id of ids) assert(graph.nodeById.get(id)?.releaseState === state, `by-release-state mismatch for ${id}`);
  }
  for (const [state, ids] of Object.entries(byReviewState)) {
    for (const id of ids) assert(graph.nodeById.get(id)?.reviewState === state, `by-review-state mismatch for ${id}`);
  }
  for (const [state, ids] of Object.entries(byQualityState)) {
    for (const id of ids) assert(graph.nodeById.get(id)?.qualityState === state, `by-quality-state mismatch for ${id}`);
  }

  for (const [key, ids] of Object.entries(byCanonicalRef)) {
    assert(Array.isArray(ids), `by-canonical-ref ${key} must be an array`);
    for (const id of ids) assert(graph.nodeById.has(id), `by-canonical-ref ${key} points to missing node ${id}`);
  }
  for (const node of graph.nodes) {
    const key = canonicalKey(node.canonicalRef);
    if (key) assert(byCanonicalRef[key]?.includes(node.id), `by-canonical-ref missing ${node.id}`);
  }

  for (const [key, value] of Object.entries(bySourceId)) {
    for (const id of flattenIndexIds(value)) assert(graph.nodeById.has(id), `by-source-id ${key} points to missing node ${id}`);
  }
  for (const [key, value] of Object.entries(bySnapshotId)) {
    for (const id of flattenIndexIds(value)) assert(graph.nodeById.has(id), `by-snapshot-id ${key} points to missing node ${id}`);
  }
  for (const [key, value] of Object.entries(byAyahKey)) {
    for (const id of flattenIndexIds(value)) assert(graph.nodeById.has(id), `by-ayah-key ${key} points to missing node ${id}`);
  }
  for (const [key, value] of Object.entries(byHadithKey)) {
    for (const id of flattenIndexIds(value)) assert(graph.nodeById.has(id), `by-hadith-key ${key} points to missing node ${id}`);
  }
  for (const [key, value] of Object.entries(byTopicKey)) {
    for (const id of flattenIndexIds(value)) assert(graph.nodeById.has(id), `by-topic-key ${key} points to missing node ${id}`);
  }

  assert(Object.keys(byAyahKey).length === 6236, 'by-ayah-key must contain 6236 ayah entries');
  assert(Object.keys(byHadithKey).length >= 80, 'by-hadith-key must contain aggregate hadith entries');
  assert(publicBoundary.publicSafeNodeCount === 0, 'public-boundary publicSafeNodeCount must be 0');
  assert(publicBoundary.publicSafeEdgeCount === 0, 'public-boundary publicSafeEdgeCount must be 0');
  assert(
    (publicBoundary.blockerCategories?.escalationBoundary ?? 0) >= 1,
    'public-boundary must preserve escalation boundary records',
  );

  return {
    byNodeId: Object.keys(byNodeId).length,
    byEdgeId: Object.keys(byEdgeId).length,
    byCanonicalRef: Object.keys(byCanonicalRef).length,
    byAyahKey: Object.keys(byAyahKey).length,
    byHadithKey: Object.keys(byHadithKey).length,
    byTopicKey: Object.keys(byTopicKey).length,
    publicBoundaryCategories: Object.keys(publicBoundary).length,
  };
}

async function checkVault(graph) {
  const vaultManifest = await readJson(path.join(VAULT_DIR, 'manifest.json'));
  assert(vaultManifest.checkpoint === 'CP22-G07', 'Vault checkpoint must remain CP22-G07');
  assert(vaultManifest.sourceGraphId === graph.manifest.graphId, 'Vault source graph ID mismatch');
  assert(vaultManifest.sourceGraphChecksumSha256 === graph.manifest.checksums.graphChecksumSha256, 'Vault source graph checksum mismatch');
  assert(vaultManifest.publicSafe === false, 'Vault manifest publicSafe must be false');
  assert(vaultManifest.counts.publicSafeArtifacts === 0, 'Vault public-safe artifacts must be 0');
  assert(vaultManifest.counts.artifacts === vaultManifest.artifacts.length, 'Vault artifact count mismatch');
  assert(vaultManifest.requiredBoundary.vaultArtifactsAreCanonicalSourceData === false, 'Vault must not be canonical source data');
  assert(vaultManifest.requiredBoundary.publicReleaseApproved === false, 'Vault must not approve public release');

  let artifactsWithMissingNodes = 0;
  for (const artifact of vaultManifest.artifacts) {
    assert(artifact.publicSafe === false, `${artifact.path} publicSafe must be false`);
    assert(artifact.canonicalRefs.length > 0, `${artifact.path} missing canonical refs`);
    assert(artifact.sourceRefs.length > 0, `${artifact.path} missing source refs`);
    for (const id of artifact.graphNodeIds) {
      if (!graph.nodeById.has(id)) artifactsWithMissingNodes += 1;
    }
    await assertExists(path.join(VAULT_DIR, artifact.path));
  }
  assert(artifactsWithMissingNodes === 0, `${artifactsWithMissingNodes} vault graph node references are unresolved`);

  return {
    artifactCount: vaultManifest.counts.artifacts,
    categoryCount: vaultManifest.counts.categories,
    publicSafeArtifacts: vaultManifest.counts.publicSafeArtifacts,
    graphNodesReferenced: vaultManifest.counts.graphNodesReferenced,
    categoryCounts: sortRecord(vaultManifest.categoryCounts),
  };
}

async function checkUiPayloadBoundary(graph, vault) {
  const servicePath = 'apps/api/src/modules/private-content/private-content.service.ts';
  const controllerPath = 'apps/api/src/modules/private-content/private-content.controller.ts';
  const mobileRoutePath = 'apps/mobile/app/knowledge-graphify.tsx';
  const mobileApiPath = 'apps/mobile/src/services/privateContentApi.ts';
  const sharedPath = 'packages/shared/src/private-content.ts';
  const service = await readFile(servicePath, 'utf8');
  const controller = await readFile(controllerPath, 'utf8');
  const mobileRoute = await readFile(mobileRoutePath, 'utf8');
  const mobileApi = await readFile(mobileApiPath, 'utf8');
  const shared = await readFile(sharedPath, 'utf8');

  assert(controller.includes("@Get('knowledge-graphify/cp22')"), 'CP22 API route missing from controller');
  assert(service.includes('getKnowledgeGraphifyCp22'), 'CP22 service method missing');
  assert(service.includes('slice(0, 18)') && service.includes('slice(0, 48)'), 'CP22 service payload must remain bounded');
  assert(mobileApi.includes('/api/private-content/knowledge-graphify/cp22'), 'Mobile client missing CP22 API call');
  assert(mobileRoute.includes('getKnowledgeGraphifyCp22'), 'Mobile route must call CP22 API');
  assert(mobileRoute.includes('Partition Selector'), 'Mobile route missing partition selector UI');
  assert(mobileRoute.includes('Node Detail'), 'Mobile route missing node detail UI');
  assert(mobileRoute.includes('Edge Detail'), 'Mobile route missing edge detail UI');
  assert(mobileRoute.includes('Vault Packs'), 'Mobile route missing vault pack preview UI');
  assert(mobileRoute.includes('Public-safe count zero'), 'Mobile route missing public-safe boundary copy');
  assert(shared.includes('PrivateKnowledgeGraphifyCp22Response'), 'Shared CP22 response contract missing');

  return {
    route: '/knowledge-graphify',
    apiRoute: '/api/private-content/knowledge-graphify/cp22',
    payloadBoundary: 'bounded_partition_samples_lookup_paths_vault_previews',
    graphNodesExposedToUi: 'sampled_only',
    totalGraphNodesAvailable: graph.nodes.length,
    totalVaultArtifactsAvailable: vault.artifactCount,
  };
}

async function checkGeneratedArtifactsForSecretMarkers() {
  const secretPatterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----/i,
    /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/,
    /\bSUPABASE_SERVICE_ROLE_KEY\b/i,
    /\bRAFIQ_DATABASE_URL\b/i,
    /\bpostgres(?:ql)?:\/\/[^ \r\n"']+/i,
  ];
  const files = [
    ...await listFilesRecursive(GRAPH_DIR),
    ...await listFilesRecursive(VAULT_DIR),
  ];
  const scannedExtensions = new Set(['.json', '.md']);
  let scannedFileCount = 0;
  for (const filePath of files) {
    if (!scannedExtensions.has(path.extname(filePath).toLowerCase())) continue;
    scannedFileCount += 1;
    const content = await readFile(filePath, 'utf8');
    for (const pattern of secretPatterns) {
      assert(!pattern.test(content), `Generated artifact contains secret-like marker: ${filePath}`);
    }
  }
  return {
    scannedFileCount,
    secretMarkerCount: 0,
  };
}

async function main() {
  const started = performance.now();
  const [graphVerifier, vaultVerifier] = await Promise.all([
    runVerifier('scripts/check_cp22_guidance_evidence_graph.mjs'),
    runVerifier('scripts/check_cp22_vault_packs.mjs'),
  ]);
  const graph = await loadGraph();
  const schemaAndRefs = await checkGraphSchemaAndRefs(graph);
  const indexCounts = await checkIndexes(graph);
  const vault = await checkVault(graph);
  const uiPayloadBoundary = await checkUiPayloadBoundary(graph, vault);
  const generatedArtifactSecretScan = await checkGeneratedArtifactsForSecretMarkers();

  const nodeTypeCounts = sortRecord(countBy(graph.nodes, (node) => node.type));
  const edgeTypeCounts = sortRecord(countBy(graph.edges, (edge) => edge.type));
  const releaseStateCounts = sortRecord(countBy(graph.nodes, (node) => node.releaseState));
  const reviewStateCounts = sortRecord(countBy(graph.nodes, (node) => node.reviewState));
  const qualityStateCounts = sortRecord(countBy(graph.nodes, (node) => node.qualityState));
  const partitionCounts = sortRecord(Object.fromEntries(graph.manifest.partitions.map((item) => [item.name, item.nodeCount])));
  const durationMs = Math.round(performance.now() - started);

  console.log(JSON.stringify({
    status: 'pass',
    checkpoint: 'CP22-G09',
    durationMs,
    graph: {
      graphId: graph.manifest.graphId,
      sourceCheckpoint: graph.manifest.checkpoint,
      nodeCount: graph.nodes.length,
      edgeCount: graph.edges.length,
      partitionCount: graph.manifest.partitions.length,
      indexCount: graph.manifest.indexes.length,
      publicSafeNodeCount: graph.manifest.counts.publicSafeNodes,
      publicSafeEdgeCount: graph.manifest.counts.publicSafeEdges,
      crossPartitionEdgeCount: schemaAndRefs.crossPartitionEdgeCount,
      checksumSha256: graph.manifest.checksums.graphChecksumSha256,
    },
    vault,
    indexCounts,
    nodeTypeCounts,
    edgeTypeCounts,
    partitionCounts,
    releaseStateCounts,
    reviewStateCounts,
    qualityStateCounts,
    sourceProvenanceCoverage: {
      checkedNodeTypes: [...PROVENANCE_REQUIRED_NODE_TYPES].sort(),
      missingSourceCoverage: schemaAndRefs.missingSourceCoverage,
      missingProvenanceCoverage: schemaAndRefs.missingProvenanceCoverage,
      missingReleaseCoverage: schemaAndRefs.missingReleaseCoverage,
    },
    publicSafeBoundary: {
      graphPublicSafeNodes: graph.manifest.counts.publicSafeNodes,
      graphPublicSafeEdges: graph.manifest.counts.publicSafeEdges,
      vaultPublicSafeArtifacts: vault.publicSafeArtifacts,
      publicReleaseApproved: false,
    },
    generatedArtifactSecretScan,
    uiPayloadBoundary,
    inheritedChecks: {
      graphVerifier: {
        checkpoint: graphVerifier.checkpoint,
        durationMs: graphVerifier.durationMs,
        nodeCount: graphVerifier.nodeCount,
        edgeCount: graphVerifier.edgeCount,
      },
      vaultVerifier: {
        checkpoint: vaultVerifier.checkpoint,
        durationMs: vaultVerifier.durationMs,
        artifactCount: vaultVerifier.artifactCount,
      },
    },
  }, null, 2));
}

await main();
