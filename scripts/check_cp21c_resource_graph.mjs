import { readFile } from 'node:fs/promises';

const GRAPH_PATH = 'data/graphify/cp21c/resource-graph.json';

const REQUIRED_NODE_FIELDS = [
  'id',
  'type',
  'label',
  'canonicalRef',
  'sourceRefs',
  'releaseState',
  'reviewState',
  'qualityState',
  'accessLevel',
  'publicSafe',
  'metadata',
];

const REQUIRED_EDGE_FIELDS = [
  'id',
  'type',
  'from',
  'to',
  'status',
  'confidence',
  'sourceRefs',
  'evidenceRefs',
  'releaseState',
  'reviewState',
  'accessLevel',
  'publicSafe',
  'metadata',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hasAllFields(object, fields) {
  return fields.every((field) => Object.prototype.hasOwnProperty.call(object, field));
}

const graph = JSON.parse(await readFile(GRAPH_PATH, 'utf8'));

assert(graph.manifest?.graphId === 'cp21c-resource-graph-v1', 'manifest graphId mismatch');
assert(graph.manifest?.graphKind === 'ranking_graph', 'manifest graphKind mismatch');
assert(graph.manifest?.environment === 'private_local', 'manifest environment must be private_local');
assert(graph.manifest?.accessLevel === 'developer_private', 'manifest accessLevel must be developer_private');
assert(graph.manifest?.publicSafe === false, 'manifest must not be publicSafe');
assert(Array.isArray(graph.nodes) && graph.nodes.length > 0, 'graph must contain nodes');
assert(Array.isArray(graph.edges) && graph.edges.length > 0, 'graph must contain edges');

const nodeIds = new Set();
for (const node of graph.nodes) {
  assert(hasAllFields(node, REQUIRED_NODE_FIELDS), `node ${node.id ?? '<missing>'} is missing required fields`);
  assert(!nodeIds.has(node.id), `duplicate node id ${node.id}`);
  nodeIds.add(node.id);
  assert(node.accessLevel === 'developer_private', `node ${node.id} accessLevel must be developer_private`);
  assert(node.publicSafe === false, `node ${node.id} must not be publicSafe`);
  assert(node.releaseState, `node ${node.id} missing releaseState`);
  assert(node.reviewState, `node ${node.id} missing reviewState`);
  assert(node.qualityState, `node ${node.id} missing qualityState`);
}

const edgeIds = new Set();
for (const edge of graph.edges) {
  assert(hasAllFields(edge, REQUIRED_EDGE_FIELDS), `edge ${edge.id ?? '<missing>'} is missing required fields`);
  assert(!edgeIds.has(edge.id), `duplicate edge id ${edge.id}`);
  edgeIds.add(edge.id);
  assert(nodeIds.has(edge.from), `edge ${edge.id} has unknown from node ${edge.from}`);
  assert(nodeIds.has(edge.to), `edge ${edge.id} has unknown to node ${edge.to}`);
  assert(edge.accessLevel === 'developer_private', `edge ${edge.id} accessLevel must be developer_private`);
  assert(edge.publicSafe === false, `edge ${edge.id} must not be publicSafe`);
  assert(edge.releaseState, `edge ${edge.id} missing releaseState`);
  assert(edge.reviewState, `edge ${edge.id} missing reviewState`);
}

const nodeTypes = new Set(graph.nodes.map((node) => node.type));
for (const requiredType of ['RankingCase', 'GuidanceSession', 'QuranAyah', 'TafsirPassage', 'ValidationGateResult', 'ReleaseState']) {
  assert(nodeTypes.has(requiredType), `graph missing required node type ${requiredType}`);
}
assert(nodeTypes.has('HadithRecord'), 'graph missing HadithRecord nodes');
assert(nodeTypes.has('QualityFinding'), 'graph missing QualityFinding nodes');

const edgeTypes = new Set(graph.edges.map((edge) => edge.type));
for (const requiredType of ['case_has_guidance_session', 'guidance_cites', 'guidance_has_validation_gate', 'entity_has_release_state']) {
  assert(edgeTypes.has(requiredType), `graph missing required edge type ${requiredType}`);
}

assert(graph.summary.nodeCount === graph.nodes.length, 'summary node count mismatch');
assert(graph.summary.edgeCount === graph.edges.length, 'summary edge count mismatch');
assert(graph.summary.publicSafeNodeCount === 0, 'publicSafe node count must be 0');
assert(graph.summary.publicSafeEdgeCount === 0, 'publicSafe edge count must be 0');

console.log(JSON.stringify({
  status: 'pass',
  graphPath: GRAPH_PATH,
  nodeCount: graph.nodes.length,
  edgeCount: graph.edges.length,
  nodeTypes: Array.from(nodeTypes).sort(),
  edgeTypes: Array.from(edgeTypes).sort(),
}, null, 2));
