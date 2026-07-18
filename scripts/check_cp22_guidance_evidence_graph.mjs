import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = 'data/graphify/full-private';
const REQUIRED_PARTITIONS = ['sources', 'governance', 'quran', 'translations', 'tafsir', 'topics', 'hadith', 'hadith-grades', 'quality', 'product-evidence', 'cp21c-reference'];
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
  assert(manifest.checkpoint === 'CP22-G06', 'manifest checkpoint mismatch');
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

  assert(count(nodes, 'cp21c_case') === 23, 'Expected 23 cp21c_case nodes');
  assert(count(nodes, 'vault_note') === 23, 'Expected 23 vault_note nodes');
  assert(count(nodes, 'private_retrieval_trace') >= 18, 'Expected private_retrieval_trace nodes');
  assert(count(nodes, 'private_search_document') >= 90, 'Expected private_search_document nodes');
  assert(count(nodes, 'private_answer_draft') === 23, 'Expected 23 private_answer_draft nodes');
  assert(count(nodes, 'private_guided_answer_run') === 23, 'Expected 23 private_guided_answer_run nodes');
  assert(count(nodes, 'private_answer_validation_run') === 23, 'Expected 23 private_answer_validation_run nodes');

  const validationRuns = nodes.filter((node) => node.type === 'private_answer_validation_run');
  const validationStatuses = new Set(validationRuns.map((node) => node.metadata.validationStatus));
  assert(validationStatuses.has('approved_with_disclaimer'), 'Missing approved_with_disclaimer validation outcomes');
  assert(validationStatuses.has('source_unavailable'), 'Missing source_unavailable validation outcomes');
  assert(validationStatuses.has('scholar_escalation'), 'Missing scholar_escalation validation outcomes');
  assert(validationStatuses.has('safety_escalation'), 'Missing safety_escalation validation outcomes');

  const authorityEdges = edges.filter((edge) => ['search_document_represents_entity', 'retrieval_trace_cites_entity'].includes(edge.type));
  assert(authorityEdges.length > 0, 'Expected evidence-to-resource edges');
  for (const edge of authorityEdges) {
    assert(edge.status === 'derived_candidate', `${edge.id} must remain derived_candidate`);
    assert(edge.metadata.authorityBoundary === 'retrieval_evidence_not_religious_authority', `${edge.id} missing authority boundary`);
  }

  const caseEvidenceEdges = edges.filter((edge) => edge.type === 'cp21c_case_uses_evidence');
  assert(caseEvidenceEdges.length >= 100, 'Expected CP21C case evidence links');
  const vaultEdges = edges.filter((edge) => edge.type === 'vault_note_describes');
  assert(vaultEdges.length === 23, 'Expected vault note links');

  for (const node of nodes.filter((item) => ['private_search_document', 'private_retrieval_trace', 'private_answer_draft', 'private_guided_answer_run', 'private_answer_validation_run', 'cp21c_case', 'vault_note'].includes(item.type))) {
    assert(node.provenanceRefs.length > 0, `${node.id} missing provenance refs`);
    assert(node.releaseStateRefs.length > 0, `${node.id} missing release-state refs`);
  }

  const byAyahKey = await readJson(path.join(OUT_DIR, 'indexes/by-ayah-key.json'));
  assert(Object.values(byAyahKey).some((entry) => (entry.retrievalEvidence ?? []).length > 0), 'by-ayah-key missing retrieval evidence links');
  const publicBoundary = await readJson(path.join(OUT_DIR, 'indexes/public-boundary.json'));
  assert(publicBoundary.publicSafeNodeCount === 0, 'public-boundary publicSafeNodeCount must be 0');
  assert(publicBoundary.publicSafeEdgeCount === 0, 'public-boundary publicSafeEdgeCount must be 0');
  assert(summary.counts.publicSafeNodes === 0, 'summary publicSafeNodes must be 0');
  assert(summary.counts.publicSafeEdges === 0, 'summary publicSafeEdges must be 0');

  console.log(JSON.stringify({
    status: 'pass',
    checkpoint: 'CP22-G06',
    nodeCount: nodes.length,
    edgeCount: edges.length,
    cp21cCaseCount: count(nodes, 'cp21c_case'),
    vaultNoteCount: count(nodes, 'vault_note'),
    retrievalTraceCount: count(nodes, 'private_retrieval_trace'),
    searchDocumentCount: count(nodes, 'private_search_document'),
    answerDraftCount: count(nodes, 'private_answer_draft'),
    guidedAnswerRunCount: count(nodes, 'private_guided_answer_run'),
    answerValidationRunCount: count(nodes, 'private_answer_validation_run'),
    evidenceToResourceEdgeCount: authorityEdges.length,
    cp21cCaseEvidenceEdgeCount: caseEvidenceEdges.length,
    validationStatuses: Object.fromEntries([...validationStatuses].sort().map((status) => [status, validationRuns.filter((node) => node.metadata.validationStatus === status).length])),
    publicSafeNodeCount: summary.counts.publicSafeNodes,
    publicSafeEdgeCount: summary.counts.publicSafeEdges,
  }, null, 2));
}

await main();
