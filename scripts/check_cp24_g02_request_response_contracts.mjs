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

runNodeScript('scripts/check_cp24_g01_retrieval_prototype_plan.mjs');

const shared = readText('packages/shared/src/private-content.ts');
const g02Doc = readText('docs/09_sprints/resource_audit_import_prototype/CP24_G02_REQUEST_AND_RESPONSE_CONTRACTS.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_ACCEPTANCE_CHECKLIST.md');

const requiredTypes = [
  'PrivateCp24GraphAwareRetrievalRequest',
  'PrivateCp24GraphExpansionRequest',
  'PrivateCp24ReleaseBoundaryRequest',
  'PrivateCp24QualityBoundaryRequest',
  'PrivateCp24OutputCaps',
  'PrivateCp24EvidenceCandidate',
  'PrivateCp24RankingSignal',
  'PrivateCp24RankingExplanation',
  'PrivateCp24EvidenceRoute',
  'PrivateCp24EvidenceRouteItem',
  'PrivateCp24ValidationGateResult',
  'PrivateCp24ValidationHandoff',
  'PrivateCp24ReviewerHandoff',
  'PrivateCp24GraphProof',
  'PrivateCp24PublicBoundary',
  'PrivateCp24GraphAwareRetrievalResponse',
];

for (const typeName of requiredTypes) {
  expect(`Shared type exported: ${typeName}`, shared.includes(`export type ${typeName}`), typeName);
  expect(`G02 doc names type: ${typeName}`, g02Doc.includes(typeName), typeName);
}

const requiredSharedTerms = [
  "requireSourceRefs: true",
  "requireProvenanceRefs: true",
  "requireReleaseRefs: true",
  "includeVaultPackRefs: true",
  "mode: 'private_internal'",
  "allowRejected: false",
  "publicSafeOnly: false",
  "allowWithheld: false",
  "publicSafe: false",
  "ordinaryScore: number | null",
  "escalationOutcome: PrivateCp24EscalationOutcome | null",
  "authorityBoundary: 'operational_relevance_only'",
  "publicReleaseApproved: false",
  "publicRouteExposed: false",
  "'POST /api/private-content/graph-aware-retrieval/cp24'",
  "'rafiq-full-private-resource-graph'",
  "'rafiq-full-private-knowledge-vault'",
  "'CP22-G10'",
];

for (const term of requiredSharedTerms) {
  expect(`Shared contract locks: ${term}`, shared.includes(term), term);
}

const requiredDocTerms = [
  '# CP24-G02 - Request And Response Contracts',
  'Status: Complete',
  'Shared TypeScript contracts',
  'Request Contract',
  'Candidate And Ranking Contract',
  'Evidence Route And Validation Handoff',
  'Reviewer Handoff Contract',
  'Graph Proof And Public Boundary',
  'Status: complete',
];

for (const term of requiredDocTerms) {
  expect(`G02 doc includes: ${term}`, g02Doc.includes(term), term);
}

expect('G02 doc forbids authority drift', g02Doc.includes('operational_relevance_only') && g02Doc.includes('religious approval'), 'operational boundary');
expect('G02 doc records private route', g02Doc.includes('POST /api/private-content/graph-aware-retrieval/cp24'), 'private route');
expect('G02 doc records public-safe zero contract', g02Doc.includes('publicSafeCandidateCount: 0') && g02Doc.includes('publicRouteExposed: false'), 'public boundary');
expect('G02 doc records build check', g02Doc.includes('corepack pnpm -C packages/shared build'), 'build check');

const sprintHasG02Complete = sprintPlan.includes('Status: CP24-G02 complete; CP24-G03 pending');
const sprintHasG03Complete = sprintPlan.includes('Status: CP24-G03 complete; CP24-G04 pending');
const sprintHasG04Complete = sprintPlan.includes('Status: CP24-G04 complete; CP24-G05 pending');
const sprintHasG05Complete = sprintPlan.includes('Status: CP24-G05 complete; CP24-G06 pending');
const sprintHasG06Complete = sprintPlan.includes('Status: CP24-G06 complete; CP24-G07 pending');
const sprintHasG07Complete = sprintPlan.includes('Status: CP24-G07 complete; CP24-G08 pending');
const sprintHasG08Complete = sprintPlan.includes('Status: CP24-G08 complete; CP24-G09 pending');
const sprintHasCp24Complete = sprintPlan.includes('Status: CP24 complete; recommended next scope CP25');
expect('Sprint plan is at or beyond G02 complete', sprintHasG02Complete || sprintHasG03Complete || sprintHasG04Complete || sprintHasG05Complete || sprintHasG06Complete || sprintHasG07Complete || sprintHasG08Complete || sprintHasCp24Complete, sprintHasCp24Complete ? 'CP24 complete' : sprintHasG08Complete ? 'G08 complete' : sprintHasG07Complete ? 'G07 complete' : sprintHasG06Complete ? 'G06 complete' : sprintHasG05Complete ? 'G05 complete' : sprintHasG04Complete ? 'G04 complete' : sprintHasG03Complete ? 'G03 complete' : 'G02 complete');
expect('Sprint plan points to G02 report', sprintPlan.includes('CP24_G02_REQUEST_AND_RESPONSE_CONTRACTS.md'), 'G02 report linked');
expect('Sprint plan includes G03 checkpoint', sprintPlan.includes('CP24-G03 - Candidate Retrieval And Graph Expansion'), 'G03 checkpoint');
const checklistHasG02Complete = checklist.includes('Status: CP24-G02 complete; CP24-G03 pending');
const checklistHasG03Complete = checklist.includes('Status: CP24-G03 complete; CP24-G04 pending');
const checklistHasG04Complete = checklist.includes('Status: CP24-G04 complete; CP24-G05 pending');
const checklistHasG05Complete = checklist.includes('Status: CP24-G05 complete; CP24-G06 pending');
const checklistHasG06Complete = checklist.includes('Status: CP24-G06 complete; CP24-G07 pending');
const checklistHasG07Complete = checklist.includes('Status: CP24-G07 complete; CP24-G08 pending');
const checklistHasG08Complete = checklist.includes('Status: CP24-G08 complete; CP24-G09 pending');
const checklistHasCp24Complete = checklist.includes('Status: CP24 complete; recommended next scope CP25');
expect('Checklist is at or beyond G02 complete', checklistHasG02Complete || checklistHasG03Complete || checklistHasG04Complete || checklistHasG05Complete || checklistHasG06Complete || checklistHasG07Complete || checklistHasG08Complete || checklistHasCp24Complete, checklistHasCp24Complete ? 'CP24 complete' : checklistHasG08Complete ? 'G08 complete' : checklistHasG07Complete ? 'G07 complete' : checklistHasG06Complete ? 'G06 complete' : checklistHasG05Complete ? 'G05 complete' : checklistHasG04Complete ? 'G04 complete' : checklistHasG03Complete ? 'G03 complete' : 'G02 complete');
expect('Checklist G02 rows pass', ['CP24-G02-01', 'CP24-G02-02', 'CP24-G02-03', 'CP24-G02-04', 'CP24-G02-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'G02 rows pass');
expect(
  'Checklist includes a valid post-G02 next action',
  checklist.includes('Start `CP24-G03 - Candidate Retrieval And Graph Expansion`') ||
    checklist.includes('Start `CP24-G04 - Ranking, Explanation, And Selection`') ||
    checklist.includes('Start `CP24-G05 - Evidence Route And Validation Handoff`') ||
    checklist.includes('Start `CP24-G06 - Private API Prototype`') ||
    checklist.includes('Start `CP24-G07 - Internal UI Prototype`') ||
    checklist.includes('Start `CP24-G08 - Combined Verification`') ||
    checklist.includes('Start `CP24-G09 - Close-Out And Next Scope Decision`') ||
    checklist.includes('Start `CP25 - Reviewer Workbench Action Workflow`'),
  checklistHasCp24Complete ? 'CP25 next' : checklistHasG08Complete ? 'G09 next' : checklistHasG07Complete ? 'G08 next' : checklistHasG06Complete ? 'G07 next' : checklistHasG05Complete ? 'G06 next' : checklistHasG04Complete ? 'G05 next' : checklistHasG03Complete ? 'G04 next' : 'G03 next',
);

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP24-G02 request/response contract verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP24-G02 request/response contract verification passed.');
