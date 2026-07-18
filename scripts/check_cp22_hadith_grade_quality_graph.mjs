import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = 'data/graphify/full-private';
const REQUIRED_PARTITIONS = ['sources', 'governance', 'quran', 'translations', 'tafsir', 'topics', 'hadith', 'hadith-grades', 'quality'];
const REQUIRED_INDEXES = ['by-node-id', 'by-edge-id', 'by-canonical-ref', 'by-source-id', 'by-snapshot-id', 'by-ayah-key', 'by-hadith-key', 'by-topic-key', 'by-release-state', 'by-review-state', 'by-quality-state', 'public-boundary'];

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
  for (const field of ['id', 'type', 'label', 'partition', 'sourceRefs', 'provenanceRefs', 'releaseStateRefs', 'releaseState', 'reviewState', 'qualityState', 'accessLevel', 'publicSafe', 'metadata']) {
    assert(Object.hasOwn(node, field), `Node ${node.id ?? '[missing id]'} missing ${field}`);
  }
  assert(node.accessLevel === 'developer_private', `Node ${node.id} accessLevel must be developer_private`);
  assert(node.publicSafe === false, `Node ${node.id} publicSafe must be false`);
}

function assertEdge(edge, nodeById) {
  for (const field of ['id', 'type', 'from', 'to', 'fromPartition', 'toPartition', 'status', 'releaseState', 'reviewState', 'accessLevel', 'publicSafe', 'metadata']) {
    assert(Object.hasOwn(edge, field), `Edge ${edge.id ?? '[missing id]'} missing ${field}`);
  }
  const from = nodeById.get(edge.from);
  const to = nodeById.get(edge.to);
  assert(from, `Edge ${edge.id} from node missing: ${edge.from}`);
  assert(to, `Edge ${edge.id} to node missing: ${edge.to}`);
  assert(from.partition === edge.fromPartition, `Edge ${edge.id} fromPartition mismatch`);
  assert(to.partition === edge.toPartition, `Edge ${edge.id} toPartition mismatch`);
  assert(edge.accessLevel === 'developer_private', `Edge ${edge.id} accessLevel must be developer_private`);
  assert(edge.publicSafe === false, `Edge ${edge.id} publicSafe must be false`);
}

function count(nodes, type) {
  return nodes.filter((node) => node.type === type).length;
}

async function main() {
  const manifest = await readJson(path.join(OUT_DIR, 'manifest.json'));
  const summary = await readJson(path.join(OUT_DIR, 'summary.json'));
  assert(manifest.schemaVersion === 'cp22.full-private.v1', 'schemaVersion mismatch');
  assert(manifest.graphId === 'rafiq-full-private-resource-graph', 'graphId mismatch');
  assert(['CP22-G05', 'CP22-G06'].includes(manifest.checkpoint), 'manifest checkpoint mismatch');
  assert(manifest.publicSafe === false, 'manifest publicSafe must be false');

  const partitionByName = new Map(manifest.partitions.map((item) => [item.name, item]));
  const indexByName = new Map(manifest.indexes.map((item) => [item.name, item]));
  for (const name of REQUIRED_PARTITIONS) assert(partitionByName.has(name), `Missing partition ${name}`);
  for (const name of REQUIRED_INDEXES) assert(indexByName.has(name), `Missing index ${name}`);

  const partitions = [];
  for (const name of REQUIRED_PARTITIONS) {
    const descriptor = partitionByName.get(name);
    await assertChecksum(path.join(OUT_DIR, descriptor.path), descriptor.checksumSha256);
    const partition = await readJson(path.join(OUT_DIR, descriptor.path));
    assert(partition.partition === name, `${name} partition name mismatch`);
    assert(partition.stats.nodeCount === partition.nodes.length, `${name} node count mismatch`);
    assert(partition.stats.edgeCount === partition.edges.length, `${name} edge count mismatch`);
    assert(partition.stats.publicSafeNodeCount === 0, `${name} publicSafeNodeCount must be 0`);
    assert(partition.stats.publicSafeEdgeCount === 0, `${name} publicSafeEdgeCount must be 0`);
    partitions.push(partition);
  }
  for (const descriptor of manifest.indexes) await assertChecksum(path.join(OUT_DIR, descriptor.path), descriptor.checksumSha256);

  const nodes = partitions.flatMap((partition) => partition.nodes);
  const edges = partitions.flatMap((partition) => partition.edges);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  assert(nodeById.size === nodes.length, 'Duplicate node IDs found');
  assert(new Set(edges.map((edge) => edge.id)).size === edges.length, 'Duplicate edge IDs found');
  for (const node of nodes) assertNode(node);
  for (const edge of edges) assertEdge(edge, nodeById);

  assert(count(nodes, 'hadith_collection') >= 20, 'Expected hadith_collection aggregate nodes');
  assert(count(nodes, 'hadith_edition') >= 20, 'Expected hadith_edition aggregate nodes');
  assert(count(nodes, 'hadith_record') >= 50, 'Expected hadith_record aggregate nodes');
  assert(count(nodes, 'hadith_text_version') >= 50, 'Expected hadith_text_version aggregate nodes');
  assert(count(nodes, 'hadith_reference') >= 50, 'Expected hadith_reference aggregate nodes');
  assert(count(nodes, 'hadith_grade_assertion') >= 1, 'Expected hadith_grade_assertion nodes');
  assert(count(nodes, 'hadith_grade_normalization') >= 1, 'Expected hadith_grade_normalization nodes');
  assert(count(nodes, 'hadith_verification_claim') >= 1, 'Expected hadith_verification_claim nodes');
  assert(count(nodes, 'hadith_verification_reference') >= 1, 'Expected hadith_verification_reference nodes');
  assert(count(nodes, 'validation_finding') >= 1, 'Expected validation_finding nodes');
  assert(count(nodes, 'transformation_event') >= 1, 'Expected transformation_event nodes');

  for (const node of nodes.filter((item) => ['hadith_collection', 'hadith_edition', 'hadith_book', 'hadith_chapter', 'hadith_record', 'hadith_text_version', 'hadith_reference', 'hadith_grade_assertion', 'hadith_grade_normalization', 'hadith_verification_claim', 'hadith_verification_reference', 'validation_finding'].includes(item.type))) {
    assert(node.provenanceRefs.length > 0, `${node.id} missing provenance refs`);
    assert(node.releaseStateRefs.length > 0, `${node.id} missing release-state refs`);
  }

  const byHadithKey = await readJson(path.join(OUT_DIR, 'indexes/by-hadith-key.json'));
  assert(Object.keys(byHadithKey).length === count(nodes, 'hadith_record'), 'by-hadith-key count mismatch');
  assert(Object.values(byHadithKey).some((entry) => entry.textVersions.length > 0), 'by-hadith-key missing text version links');
  assert(Object.values(byHadithKey).some((entry) => entry.gradeAssertions.length > 0), 'by-hadith-key missing grade assertion links');

  const publicBoundary = await readJson(path.join(OUT_DIR, 'indexes/public-boundary.json'));
  assert(publicBoundary.publicSafeNodeCount === 0, 'public-boundary publicSafeNodeCount must be 0');
  assert(publicBoundary.publicSafeEdgeCount === 0, 'public-boundary publicSafeEdgeCount must be 0');
  assert(summary.counts.publicSafeNodes === 0, 'summary publicSafeNodes must be 0');
  assert(summary.counts.publicSafeEdges === 0, 'summary publicSafeEdges must be 0');

  console.log(JSON.stringify({
    status: 'pass',
    checkpoint: 'CP22-G05',
    nodeCount: nodes.length,
    edgeCount: edges.length,
    hadithCollectionCount: count(nodes, 'hadith_collection'),
    hadithEditionCount: count(nodes, 'hadith_edition'),
    hadithRecordAggregateCount: count(nodes, 'hadith_record'),
    hadithTextVersionAggregateCount: count(nodes, 'hadith_text_version'),
    gradeAssertionCount: count(nodes, 'hadith_grade_assertion'),
    gradeNormalizationCount: count(nodes, 'hadith_grade_normalization'),
    verificationClaimCount: count(nodes, 'hadith_verification_claim'),
    validationFindingCount: count(nodes, 'validation_finding'),
    byHadithKeyCount: Object.keys(byHadithKey).length,
    publicSafeNodeCount: summary.counts.publicSafeNodes,
    publicSafeEdgeCount: summary.counts.publicSafeEdges,
  }, null, 2));
}

await main();
