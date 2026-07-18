import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = 'data/graphify/full-private';
const REQUIRED_PARTITIONS = ['sources', 'governance', 'quran', 'translations', 'tafsir', 'topics'];
const REQUIRED_INDEXES = ['by-node-id', 'by-edge-id', 'by-canonical-ref', 'by-source-id', 'by-snapshot-id', 'by-ayah-key', 'by-topic-key', 'by-release-state', 'by-review-state', 'by-quality-state', 'public-boundary'];

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

function assertEdge(edge, nodeIds) {
  for (const field of ['id', 'type', 'from', 'to', 'fromPartition', 'toPartition', 'status', 'releaseState', 'reviewState', 'accessLevel', 'publicSafe', 'metadata']) {
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
    assert(partition.stats.nodeCount === partition.nodes.length, `${name} node count mismatch`);
    assert(partition.stats.edgeCount === partition.edges.length, `${name} edge count mismatch`);
    assert(partition.stats.publicSafeNodeCount === 0, `${name} publicSafeNodeCount must be 0`);
    assert(partition.stats.publicSafeEdgeCount === 0, `${name} publicSafeEdgeCount must be 0`);
    partitions.push(partition);
  }
  for (const descriptor of manifest.indexes) await assertChecksum(path.join(OUT_DIR, descriptor.path), descriptor.checksumSha256);

  const nodes = partitions.flatMap((partition) => partition.nodes);
  const edges = partitions.flatMap((partition) => partition.edges);
  const nodeIds = new Set(nodes.map((node) => node.id));
  assert(nodeIds.size === nodes.length, 'Duplicate node IDs found');
  assert(new Set(edges.map((edge) => edge.id)).size === edges.length, 'Duplicate edge IDs found');
  for (const node of nodes) assertNode(node);
  for (const edge of edges) assertEdge(edge, nodeIds);

  const count = (type) => nodes.filter((node) => node.type === type).length;
  assert(count('quran_surah') === 114, 'Expected 114 quran_surah nodes');
  assert(count('quran_ayah') === 6236, 'Expected 6236 quran_ayah nodes');
  assert(count('quran_text_edition') >= 1, 'Expected quran_text_edition nodes');
  assert(count('quran_ayah_text') >= 6236, 'Expected quran_ayah_text nodes');
  assert(count('translation_edition') >= 1, 'Expected translation_edition nodes');
  assert(count('translation_text') >= 6236, 'Expected translation_text nodes');
  assert(count('tafsir_edition') >= 1, 'Expected tafsir_edition nodes');
  assert(count('tafsir_passage') >= 6236, 'Expected tafsir_passage nodes');
  assert(count('source_taxonomy') >= 1, 'Expected source_taxonomy nodes');
  assert(count('source_topic') >= 1, 'Expected source_topic nodes');

  for (const node of nodes.filter((item) => ['quran_ayah_text', 'translation_text', 'tafsir_passage', 'source_topic', 'source_ayah_theme_group'].includes(item.type))) {
    assert(node.provenanceRefs.length > 0, `${node.id} missing provenance refs`);
    assert(node.releaseStateRefs.length > 0, `${node.id} missing release-state refs`);
  }

  const publicBoundary = await readJson(path.join(OUT_DIR, 'indexes/public-boundary.json'));
  assert(publicBoundary.publicSafeNodeCount === 0, 'public-boundary publicSafeNodeCount must be 0');
  assert(publicBoundary.publicSafeEdgeCount === 0, 'public-boundary publicSafeEdgeCount must be 0');
  assert(summary.counts.publicSafeNodes === 0, 'summary publicSafeNodes must be 0');
  assert(summary.counts.publicSafeEdges === 0, 'summary publicSafeEdges must be 0');

  console.log(JSON.stringify({
    status: 'pass',
    checkpoint: 'CP22-G04',
    nodeCount: nodes.length,
    edgeCount: edges.length,
    quranSurahCount: count('quran_surah'),
    quranAyahCount: count('quran_ayah'),
    quranTextCount: count('quran_ayah_text'),
    translationTextCount: count('translation_text'),
    tafsirPassageCount: count('tafsir_passage'),
    sourceTopicCount: count('source_topic'),
    publicSafeNodeCount: summary.counts.publicSafeNodes,
    publicSafeEdgeCount: summary.counts.publicSafeEdges,
  }, null, 2));
}

await main();
