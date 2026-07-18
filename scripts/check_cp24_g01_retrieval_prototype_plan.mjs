#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const checks = [];

function pass(name, evidence) {
  checks.push({ name, status: 'PASS', evidence });
}

function fail(name, evidence) {
  checks.push({ name, status: 'FAIL', evidence });
}

function expect(name, condition, evidence) {
  if (condition) pass(name, evidence);
  else fail(name, evidence);
}

function readText(path) {
  if (!existsSync(path)) {
    fail(`File exists: ${path}`, 'Missing.');
    return '';
  }
  pass(`File exists: ${path}`, 'Found.');
  return readFileSync(path, 'utf8');
}

function readJson(path) {
  const text = readText(path);
  if (!text) return {};
  try {
    const value = JSON.parse(text);
    pass(`Parse JSON: ${path}`, 'Valid JSON.');
    return value;
  } catch (error) {
    fail(`Parse JSON: ${path}`, error.message);
    return {};
  }
}

function runNodeScript(scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status === 0) {
    pass(`Run ${scriptPath}`, result.stdout.trim().split(/\r?\n/).at(-1) || 'ok');
  } else {
    fail(`Run ${scriptPath}`, `${result.stdout}${result.stderr}`);
  }
}

runNodeScript('scripts/check_cp24_graph_aware_retrieval_plan.mjs');

const g01Doc = readText('docs/09_sprints/resource_audit_import_prototype/CP24_G01_RETRIEVAL_PROTOTYPE_ARCHITECTURE_AND_FIXTURE_PLAN.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_ACCEPTANCE_CHECKLIST.md');
const graphManifest = readJson('data/graphify/full-private/manifest.json');
const vaultManifest = readJson('data/vault/full-private/manifest.json');

const requiredDocTerms = [
  '# CP24-G01 - Retrieval Prototype Architecture And Fixture Plan',
  'Status: Complete',
  'POST /api/private-content/graph-aware-retrieval/cp24',
  'no public route is created',
  'Fixture Matrix',
  'Source Graph And Vault Artifact Map',
  'Bounded Output Policy',
  'Stop Conditions',
  'Rollback Plan',
  'Verifier Plan',
  'Status: complete',
];

for (const term of requiredDocTerms) {
  expect(`G01 document includes: ${term}`, g01Doc.includes(term), term);
}

const requiredFixtures = [
  'cp24-fixture-quran-anchor-001',
  'cp24-fixture-translation-context-001',
  'cp24-fixture-tafsir-context-001',
  'cp24-fixture-hadith-support-001',
  'cp24-fixture-hadith-grade-escalation-001',
  'cp24-fixture-topic-001',
  'cp24-fixture-validation-history-001',
  'cp24-fixture-source-gap-001',
  'cp24-fixture-public-boundary-001',
  'cp24-fixture-safety-escalation-001',
];

for (const fixtureId of requiredFixtures) {
  expect(`Fixture documented: ${fixtureId}`, g01Doc.includes(fixtureId), fixtureId);
}

const requiredIndexes = [
  'by-node-id',
  'by-edge-id',
  'by-canonical-ref',
  'by-ayah-key',
  'by-hadith-key',
  'by-topic-key',
  'by-source-id',
  'by-quality-state',
  'by-review-state',
  'by-release-state',
  'by-snapshot-id',
  'public-boundary',
];

for (const indexName of requiredIndexes) {
  expect(`Graph index documented: ${indexName}`, g01Doc.includes(indexName), indexName);
}

expect('G01 records CP22 graph node count', g01Doc.includes('79,657'), '79,657 nodes');
expect('G01 records CP22 graph edge count', g01Doc.includes('147,689'), '147,689 edges');
expect('G01 records CP22 vault artifact count', g01Doc.includes('158'), '158 artifacts');
expect('G01 records public-safe zero state', g01Doc.includes('Public-safe graph nodes | 0') && g01Doc.includes('Public-safe vault artifacts | 0'), 'public-safe zero');
expect('G01 separates graph/vault from canonical content', g01Doc.includes('must not treat Graphify output as canonical Islamic source content'), 'non-canonical boundary');
expect('G01 forbids raw source bodies in response', g01Doc.includes('raw Quran, translation, tafsir, or hadith text bodies'), 'raw body boundary');
expect('G01 includes escalation separation', g01Doc.includes('Escalation-sensitive intent') && g01Doc.includes('Separate escalation outcome from ordinary scoring'), 'escalation boundary');

expect('Graph manifest ID matches CP24 baseline', graphManifest.graphId === 'rafiq-full-private-resource-graph', graphManifest.graphId);
expect('Graph manifest is private', graphManifest.accessLevel === 'developer_private' && graphManifest.publicSafe === false, 'developer_private/publicSafe false');
expect('Graph manifest count: nodes', graphManifest.counts?.totalNodes === 79657, String(graphManifest.counts?.totalNodes));
expect('Graph manifest count: edges', graphManifest.counts?.totalEdges === 147689, String(graphManifest.counts?.totalEdges));
expect('Graph manifest count: partitions', graphManifest.counts?.partitions === 11, String(graphManifest.counts?.partitions));
expect('Graph manifest count: indexes', graphManifest.counts?.indexes === 12, String(graphManifest.counts?.indexes));
expect('Graph manifest public-safe counts are zero', graphManifest.counts?.publicSafeNodes === 0 && graphManifest.counts?.publicSafeEdges === 0, '0/0');

expect('Vault manifest ID matches CP24 baseline', vaultManifest.vaultId === 'rafiq-full-private-knowledge-vault', vaultManifest.vaultId);
expect('Vault manifest is private', vaultManifest.accessLevel === 'developer_private' && vaultManifest.publicSafe === false, 'developer_private/publicSafe false');
expect('Vault manifest artifact count', vaultManifest.counts?.artifacts === 158, String(vaultManifest.counts?.artifacts));
expect('Vault manifest public-safe count is zero', vaultManifest.counts?.publicSafeArtifacts === 0, String(vaultManifest.counts?.publicSafeArtifacts));
expect(
  'Vault manifest links to graph checksum',
  String(vaultManifest.sourceGraphChecksumSha256 || '').trim().toLowerCase() ===
    String(graphManifest.checksums?.graphChecksumSha256 || '').trim().toLowerCase(),
  'checksum match',
);

const sprintHasG01Complete = sprintPlan.includes('Status: CP24-G01 complete; CP24-G02 pending');
const sprintHasG02Complete = sprintPlan.includes('Status: CP24-G02 complete; CP24-G03 pending');
const sprintHasG03Complete = sprintPlan.includes('Status: CP24-G03 complete; CP24-G04 pending');
const sprintHasG04Complete = sprintPlan.includes('Status: CP24-G04 complete; CP24-G05 pending');
const sprintHasG05Complete = sprintPlan.includes('Status: CP24-G05 complete; CP24-G06 pending');
const sprintHasG06Complete = sprintPlan.includes('Status: CP24-G06 complete; CP24-G07 pending');
const sprintHasG07Complete = sprintPlan.includes('Status: CP24-G07 complete; CP24-G08 pending');
const sprintHasG08Complete = sprintPlan.includes('Status: CP24-G08 complete; CP24-G09 pending');
const sprintHasCp24Complete = sprintPlan.includes('Status: CP24 complete; recommended next scope CP25');
expect('Sprint plan is at or beyond G01 complete', sprintHasG01Complete || sprintHasG02Complete || sprintHasG03Complete || sprintHasG04Complete || sprintHasG05Complete || sprintHasG06Complete || sprintHasG07Complete || sprintHasG08Complete || sprintHasCp24Complete, sprintHasCp24Complete ? 'CP24 complete' : sprintHasG08Complete ? 'G08 complete' : sprintHasG07Complete ? 'G07 complete' : sprintHasG06Complete ? 'G06 complete' : sprintHasG05Complete ? 'G05 complete' : sprintHasG04Complete ? 'G04 complete' : sprintHasG03Complete ? 'G03 complete' : sprintHasG02Complete ? 'G02 complete' : 'G01 complete');
expect('Sprint plan points to G01 report', sprintPlan.includes('CP24_G01_RETRIEVAL_PROTOTYPE_ARCHITECTURE_AND_FIXTURE_PLAN.md'), 'G01 report linked');
expect('Sprint plan includes G02 checkpoint', sprintPlan.includes('CP24-G02 - Request And Response Contracts'), 'G02 checkpoint');
const checklistHasG01Complete = checklist.includes('Status: CP24-G01 complete; CP24-G02 pending');
const checklistHasG02Complete = checklist.includes('Status: CP24-G02 complete; CP24-G03 pending');
const checklistHasG03Complete = checklist.includes('Status: CP24-G03 complete; CP24-G04 pending');
const checklistHasG04Complete = checklist.includes('Status: CP24-G04 complete; CP24-G05 pending');
const checklistHasG05Complete = checklist.includes('Status: CP24-G05 complete; CP24-G06 pending');
const checklistHasG06Complete = checklist.includes('Status: CP24-G06 complete; CP24-G07 pending');
const checklistHasG07Complete = checklist.includes('Status: CP24-G07 complete; CP24-G08 pending');
const checklistHasG08Complete = checklist.includes('Status: CP24-G08 complete; CP24-G09 pending');
const checklistHasCp24Complete = checklist.includes('Status: CP24 complete; recommended next scope CP25');
expect('Checklist is at or beyond G01 complete', checklistHasG01Complete || checklistHasG02Complete || checklistHasG03Complete || checklistHasG04Complete || checklistHasG05Complete || checklistHasG06Complete || checklistHasG07Complete || checklistHasG08Complete || checklistHasCp24Complete, checklistHasCp24Complete ? 'CP24 complete' : checklistHasG08Complete ? 'G08 complete' : checklistHasG07Complete ? 'G07 complete' : checklistHasG06Complete ? 'G06 complete' : checklistHasG05Complete ? 'G05 complete' : checklistHasG04Complete ? 'G04 complete' : checklistHasG03Complete ? 'G03 complete' : checklistHasG02Complete ? 'G02 complete' : 'G01 complete');
expect('Checklist G01 rows pass', ['CP24-G01-01', 'CP24-G01-02', 'CP24-G01-03', 'CP24-G01-04', 'CP24-G01-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'G01 rows pass');
expect(
  'Checklist includes a valid post-G01 next action',
  checklist.includes('Start `CP24-G02 - Request And Response Contracts`') ||
    checklist.includes('Start `CP24-G03 - Candidate Retrieval And Graph Expansion`') ||
    checklist.includes('Start `CP24-G04 - Ranking, Explanation, And Selection`') ||
    checklist.includes('Start `CP24-G05 - Evidence Route And Validation Handoff`') ||
    checklist.includes('Start `CP24-G06 - Private API Prototype`') ||
    checklist.includes('Start `CP24-G07 - Internal UI Prototype`') ||
    checklist.includes('Start `CP24-G08 - Combined Verification`') ||
    checklist.includes('Start `CP24-G09 - Close-Out And Next Scope Decision`') ||
    checklist.includes('Start `CP25 - Reviewer Workbench Action Workflow`'),
  checklistHasCp24Complete ? 'CP25 next' : checklistHasG08Complete ? 'G09 next' : checklistHasG07Complete ? 'G08 next' : checklistHasG06Complete ? 'G07 next' : checklistHasG05Complete ? 'G06 next' : checklistHasG04Complete ? 'G05 next' : checklistHasG03Complete ? 'G04 next' : checklistHasG02Complete ? 'G03 next' : 'G02 next',
);

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP24-G01 retrieval prototype planning verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP24-G01 retrieval prototype planning verification passed.');
