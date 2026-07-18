import { execFile } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const CASES_PATH = 'data/graphify/cp21c/cases.json';
const EVIDENCE_PATH = 'data/graphify/cp21c/evidence.json';
const GRAPH_PATH = 'data/graphify/cp21c/resource-graph.json';
const SUMMARY_PATH = 'data/graphify/cp21c/ranking-summary.json';
const PACK_DIR = 'data/vault/cp21c/ranking-cases';

const REQUIRED_GROUPS = {
  quran_first_needs: 6,
  worship_prayer_needs: 3,
  emotional_spiritual_reflection: 3,
  direct_ayah_references: 3,
  hadith_record_anchored_guidance: 2,
  source_search_research_queries: 2,
  blocked_no_evidence_prompts: 1,
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function countBy(values, keyFn) {
  const counts = new Map();
  for (const value of values) {
    const key = keyFn(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

async function runScript(scriptPath) {
  const { stdout } = await execFileAsync(process.execPath, [scriptPath], {
    windowsHide: true,
    maxBuffer: 1024 * 1024 * 10,
  });
  const parsed = JSON.parse(stdout);
  assert(parsed.status === 'pass', `${scriptPath} did not pass`);
  return parsed;
}

async function verifyMatrix() {
  const matrix = JSON.parse(await readFile(CASES_PATH, 'utf8'));
  assert(matrix.matrixId === 'cp21c-resource-graphify-ranking-matrix-v1', 'matrixId mismatch');
  assert(matrix.productBoundary?.usesDeveloperGraphify === false, 'matrix must not use developer Graphify');
  assert(matrix.productBoundary?.usesCentralObsidianVault === false, 'matrix must not use central Obsidian vault');
  assert(matrix.productBoundary?.environment === 'private_local', 'matrix environment must be private_local');
  assert(matrix.productBoundary?.accessLevel === 'developer_private', 'matrix accessLevel must be developer_private');
  assert(matrix.productBoundary?.publicSafe === false, 'matrix must not be public safe');
  assert(matrix.productBoundary?.publicReleaseApproved === false, 'matrix must not approve public release');
  assert(Array.isArray(matrix.cases), 'matrix cases must be an array');

  const ordinaryCases = matrix.cases.filter((item) => item.scoringMode !== 'separate_escalation');
  const escalationCases = matrix.cases.filter((item) => item.scoringMode === 'separate_escalation');
  assert(ordinaryCases.length >= matrix.passRules.minimumOrdinaryRankingCases, 'ordinary case minimum not met');
  assert(escalationCases.length >= 3, 'expected at least three escalation cases');
  assert(matrix.coverage?.requiredGroupsSatisfied === true, 'required groups coverage flag must be true');

  const groupCounts = countBy(ordinaryCases, (item) => item.caseGroup);
  for (const [group, minimum] of Object.entries(REQUIRED_GROUPS)) {
    assert((groupCounts.get(group) ?? 0) >= minimum, `${group} has fewer than ${minimum} cases`);
  }

  for (const item of escalationCases) {
    assert(item.caseGroup === 'escalation_boundary_cases', `${item.caseId} must be an escalation boundary case`);
    assert(item.expectedBehavior?.mustNotRankOrdinaryGuidance === true, `${item.caseId} must not rank ordinary guidance`);
  }

  return {
    status: 'pass',
    caseCount: matrix.cases.length,
    ordinaryCaseCount: ordinaryCases.length,
    escalationCaseCount: escalationCases.length,
    requiredGroups: Object.fromEntries(groupCounts),
  };
}

async function verifyEvidence() {
  const evidence = JSON.parse(await readFile(EVIDENCE_PATH, 'utf8'));
  assert(evidence.evidenceId === 'cp21c-resource-graphify-evidence-v1', 'evidenceId mismatch');
  assert(evidence.productBoundary?.usesDeveloperGraphify === false, 'evidence must not use developer Graphify');
  assert(evidence.productBoundary?.usesCentralObsidianVault === false, 'evidence must not use central Obsidian vault');
  assert(evidence.productBoundary?.environment === 'private_local', 'evidence environment must be private_local');
  assert(evidence.productBoundary?.accessLevel === 'developer_private', 'evidence accessLevel must be developer_private');
  assert(evidence.productBoundary?.publicSafe === false, 'evidence must not be public safe');
  assert(evidence.productBoundary?.publicReleaseApproved === false, 'evidence must not approve public release');
  assert(evidence.summary?.errorCount === 0, 'evidence collector must have zero errors');
  assert(Array.isArray(evidence.errors) && evidence.errors.length === 0, 'evidence errors array must be empty');
  assert(Array.isArray(evidence.cases) && evidence.cases.length === evidence.summary?.totalCases, 'evidence case count mismatch');

  for (const item of evidence.cases) {
    assert(item.notice?.publicationStatus === 'private_only', `${item.caseId} must be private only`);
    assert(item.notice?.rightsStatus === 'pending', `${item.caseId} rights status must be pending`);
  }

  return {
    status: 'pass',
    caseCount: evidence.cases.length,
    errorCount: evidence.summary.errorCount,
  };
}

async function verifyCrossArtifactCounts() {
  const matrix = JSON.parse(await readFile(CASES_PATH, 'utf8'));
  const evidence = JSON.parse(await readFile(EVIDENCE_PATH, 'utf8'));
  const graph = JSON.parse(await readFile(GRAPH_PATH, 'utf8'));
  const summary = JSON.parse(await readFile(SUMMARY_PATH, 'utf8'));
  const packFiles = (await readdir(PACK_DIR)).filter((file) => file.endsWith('.md'));

  const matrixCaseIds = new Set(matrix.cases.map((item) => item.caseId));
  const evidenceCaseIds = new Set(evidence.cases.map((item) => item.caseId));
  const summaryCaseIds = new Set(summary.caseResults.map((item) => item.caseId));
  const graphCaseIds = new Set(graph.nodes
    .filter((node) => node.type === 'RankingCase')
    .map((node) => node.metadata?.caseId));

  assert(packFiles.length === matrix.cases.length, 'vault pack count must match matrix case count');
  assert(evidence.cases.length === matrix.cases.length, 'evidence case count must match matrix case count');
  assert(summary.caseResults.length === matrix.cases.length, 'summary case count must match matrix case count');
  assert(graphCaseIds.size === matrix.cases.length, 'graph RankingCase count must match matrix case count');

  for (const caseId of matrixCaseIds) {
    assert(evidenceCaseIds.has(caseId), `evidence missing ${caseId}`);
    assert(summaryCaseIds.has(caseId), `summary missing ${caseId}`);
    assert(graphCaseIds.has(caseId), `graph missing ${caseId}`);
  }

  assert(graph.manifest?.notes?.some((note) => note.includes('Not the developer graphify-out code graph.')), 'graph must state it is not developer graphify-out');
  assert(summary.scaleBoundary?.isFullRafiqResourceGraph === false, 'summary must state it is not full RAFIQ resource graph');

  return {
    status: 'pass',
    caseCount: matrix.cases.length,
    packCount: packFiles.length,
    graphRankingCaseCount: graphCaseIds.size,
  };
}

async function verifyPublicSafeBoundary() {
  const graph = JSON.parse(await readFile(GRAPH_PATH, 'utf8'));
  const summary = JSON.parse(await readFile(SUMMARY_PATH, 'utf8'));

  assert(graph.manifest?.publicSafe === false, 'graph manifest must not be public safe');
  assert(graph.summary?.publicSafeNodeCount === 0, 'graph publicSafeNodeCount must be 0');
  assert(graph.summary?.publicSafeEdgeCount === 0, 'graph publicSafeEdgeCount must be 0');
  assert(summary.access?.publicSafe === false, 'summary must not be public safe');
  assert(summary.access?.publicReleaseApproved === false, 'summary must not approve public release');
  assert(summary.gates?.publicReleaseClaimPass === true, 'summary public release claim gate must pass');

  return {
    status: 'pass',
    graphPublicSafeNodeCount: graph.summary.publicSafeNodeCount,
    graphPublicSafeEdgeCount: graph.summary.publicSafeEdgeCount,
    summaryPublicSafe: summary.access.publicSafe,
    publicReleaseApproved: summary.access.publicReleaseApproved,
  };
}

const matrixResult = await verifyMatrix();
const evidenceResult = await verifyEvidence();
const graphResult = await runScript('scripts/check_cp21c_resource_graph.mjs');
const vaultResult = await runScript('scripts/check_cp21c_vault_packs.mjs');
const summaryResult = await runScript('scripts/check_cp21c_ranking_summary.mjs');
const crossArtifactResult = await verifyCrossArtifactCounts();
const publicSafeResult = await verifyPublicSafeBoundary();

console.log(JSON.stringify({
  status: 'pass',
  verifier: 'scripts/check_cp21c_resource_graphify.mjs',
  checkpoint: 'CP21C-G06',
  matrix: matrixResult,
  evidence: evidenceResult,
  graph: {
    status: graphResult.status,
    nodeCount: graphResult.nodeCount,
    edgeCount: graphResult.edgeCount,
  },
  vault: {
    status: vaultResult.status,
    packCount: vaultResult.packCount,
    publicSafeCount: vaultResult.publicSafeCount,
  },
  rankingSummary: {
    status: summaryResult.status,
    ordinaryAverageScore: summaryResult.ordinaryAverageScore,
    ordinaryCaseCount: summaryResult.ordinaryCaseCount,
    escalationCaseCount: summaryResult.escalationCaseCount,
    lowScoringCaseCount: summaryResult.lowScoringCaseCount,
    remediationCount: summaryResult.remediationCount,
  },
  crossArtifact: crossArtifactResult,
  publicSafeBoundary: publicSafeResult,
}, null, 2));
