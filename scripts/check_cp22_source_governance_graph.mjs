import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = 'data/graphify/full-private';
const REQUIRED_PARTITIONS = ['sources', 'governance'];
const REQUIRED_INDEXES = [
  'by-node-id',
  'by-edge-id',
  'by-canonical-ref',
  'by-source-id',
  'by-snapshot-id',
  'by-release-state',
  'by-review-state',
  'by-quality-state',
  'public-boundary',
];

function sha256(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function assertChecksum(filePath, expected) {
  const raw = await readFile(filePath, 'utf8');
  assert(sha256(raw) === expected, `Checksum mismatch for ${filePath}`);
}

function assertNode(node) {
  for (const field of ['id', 'type', 'label', 'partition', 'releaseState', 'reviewState', 'qualityState', 'accessLevel', 'metadata']) {
    assert(Object.hasOwn(node, field), `Node ${node.id ?? '[missing id]'} missing ${field}`);
  }
  assert(node.accessLevel === 'developer_private', `Node ${node.id} accessLevel must be developer_private`);
  assert(node.publicSafe === false, `Node ${node.id} publicSafe must be false`);
  assert(Array.isArray(node.sourceRefs), `Node ${node.id} sourceRefs must be an array`);
  assert(Array.isArray(node.provenanceRefs), `Node ${node.id} provenanceRefs must be an array`);
  assert(Array.isArray(node.releaseStateRefs), `Node ${node.id} releaseStateRefs must be an array`);
}

function assertEdge(edge, nodeIds) {
  for (const field of ['id', 'type', 'from', 'to', 'fromPartition', 'toPartition', 'status', 'sourceRefs', 'evidenceRefs', 'releaseState', 'reviewState', 'accessLevel', 'metadata']) {
    assert(Object.hasOwn(edge, field), `Edge ${edge.id ?? '[missing id]'} missing ${field}`);
  }
  assert(nodeIds.has(edge.from), `Edge ${edge.id} from node missing: ${edge.from}`);
  assert(nodeIds.has(edge.to), `Edge ${edge.id} to node missing: ${edge.to}`);
  assert(edge.accessLevel === 'developer_private', `Edge ${edge.id} accessLevel must be developer_private`);
  assert(edge.publicSafe === false, `Edge ${edge.id} publicSafe must be false`);
}

async function main() {
  const manifest = await readJson(path.join(OUT_DIR, 'manifest.json'));
  const summary = await readJson(path.join(OUT_DIR, 'summary.json'));

  assert(manifest.schemaVersion === 'cp22.full-private.v1', 'schemaVersion mismatch');
  assert(manifest.graphId === 'rafiq-full-private-resource-graph', 'graphId mismatch');
  assert(manifest.graphKind === 'resource_graph', 'graphKind mismatch');
  assert(manifest.environment === 'private_local', 'environment must be private_local');
  assert(manifest.accessLevel === 'developer_private', 'accessLevel must be developer_private');
  assert(manifest.publicSafe === false, 'manifest publicSafe must be false');

  const partitionByName = new Map(manifest.partitions.map((item) => [item.name, item]));
  const indexByName = new Map(manifest.indexes.map((item) => [item.name, item]));
  for (const name of REQUIRED_PARTITIONS) assert(partitionByName.has(name), `Missing partition ${name}`);
  for (const name of REQUIRED_INDEXES) assert(indexByName.has(name), `Missing index ${name}`);

  const partitions = [];
  for (const name of REQUIRED_PARTITIONS) {
    const descriptor = partitionByName.get(name);
    const filePath = path.join(OUT_DIR, descriptor.path);
    await assertChecksum(filePath, descriptor.checksumSha256);
    const partition = await readJson(filePath);
    assert(partition.partition === name, `${name} partition name mismatch`);
    assert(partition.stats.nodeCount === partition.nodes.length, `${name} node count mismatch`);
    assert(partition.stats.edgeCount === partition.edges.length, `${name} edge count mismatch`);
    assert(partition.stats.publicSafeNodeCount === 0, `${name} publicSafeNodeCount must be 0`);
    assert(partition.stats.publicSafeEdgeCount === 0, `${name} publicSafeEdgeCount must be 0`);
    partitions.push(partition);
  }

  for (const descriptor of manifest.indexes) {
    await assertChecksum(path.join(OUT_DIR, descriptor.path), descriptor.checksumSha256);
  }

  const nodes = partitions.flatMap((partition) => partition.nodes);
  const edges = partitions.flatMap((partition) => partition.edges);
  const nodeIds = new Set(nodes.map((node) => node.id));
  assert(nodeIds.size === nodes.length, 'Duplicate node IDs found');
  assert(new Set(edges.map((edge) => edge.id)).size === edges.length, 'Duplicate edge IDs found');

  for (const node of nodes) assertNode(node);
  for (const edge of edges) assertEdge(edge, nodeIds);

  const sourceNodes = nodes.filter((node) => node.type === 'source');
  const snapshotNodes = nodes.filter((node) => node.type === 'source_snapshot');
  const releaseNodes = nodes.filter((node) => node.type === 'entity_release_state');
  const provenanceNodes = nodes.filter((node) => node.type === 'entity_provenance');
  assert(sourceNodes.length > 0, 'Expected source nodes');
  assert(snapshotNodes.length > 0, 'Expected source snapshot nodes');
  assert(releaseNodes.length > 0, 'Expected release state nodes');
  assert(provenanceNodes.length > 0, 'Expected provenance nodes');

  const publicBoundary = await readJson(path.join(OUT_DIR, 'indexes/public-boundary.json'));
  assert(publicBoundary.publicSafeNodeCount === 0, 'public-boundary publicSafeNodeCount must be 0');
  assert(publicBoundary.publicSafeEdgeCount === 0, 'public-boundary publicSafeEdgeCount must be 0');
  assert(summary.counts.publicSafeNodes === 0, 'summary publicSafeNodes must be 0');
  assert(summary.counts.publicSafeEdges === 0, 'summary publicSafeEdges must be 0');

  console.log(JSON.stringify({
    status: 'pass',
    checkpoint: 'CP22-G03',
    sourceNodeCount: sourceNodes.length,
    snapshotNodeCount: snapshotNodes.length,
    releaseNodeCount: releaseNodes.length,
    provenanceNodeCount: provenanceNodes.length,
    nodeCount: nodes.length,
    edgeCount: edges.length,
    publicSafeNodeCount: summary.counts.publicSafeNodes,
    publicSafeEdgeCount: summary.counts.publicSafeEdges,
  }, null, 2));
}

await main();
