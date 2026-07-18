#!/usr/bin/env node
import { readFileSync } from 'node:fs';
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

function readText(filePath) {
  try {
    return readFileSync(filePath, 'utf8');
  } catch (error) {
    fail(`Read ${filePath}`, error.message);
    return '';
  }
}

function runNodeScript(scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], { encoding: 'utf8' });
  if (result.status === 0) {
    pass(`Run ${scriptPath}`, result.stdout.trim().split(/\r?\n/).at(-1) || 'ok');
  } else {
    fail(`Run ${scriptPath}`, `${result.stdout}${result.stderr}`);
  }
}

runNodeScript('scripts/check_cp24_g06_private_api_prototype.mjs');

const screen = readText('apps/mobile/app/graph-aware-retrieval.tsx');
const nav = readText('apps/mobile/src/components/RafiqNavigationBar.tsx');
const api = readText('apps/mobile/src/services/privateContentApi.ts');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_ACCEPTANCE_CHECKLIST.md');
const g07Doc = readText('docs/09_sprints/resource_audit_import_prototype/CP24_G07_INTERNAL_UI_PROTOTYPE.md');

expect('G07 internal route exists', screen.includes('GraphAwareRetrievalScreen') && screen.includes('Graph-aware retrieval'), 'screen route');
expect('G07 uses private workspace shell and ribbon', screen.includes('PrivateWorkspaceShell') && screen.includes('PrivateModeRibbon'), 'private shell/ribbon');
expect('G07 calls private CP24 API helper', screen.includes('createGraphAwareRetrievalCp24') && api.includes('/api/private-content/graph-aware-retrieval/cp24'), 'private API helper');
expect('G07 has fixture selector', screen.includes('FIXTURES') && screen.includes('Fixture Selector') && screen.includes('cp24-fixture-quran-anchor-001'), 'fixture selector');
expect('G07 shows candidate ranking and explanations', screen.includes('Candidate Ranking') && screen.includes('rankingExplanations') && screen.includes('selectionReason'), 'candidate ranking');
expect('G07 shows evidence route items', screen.includes('Evidence Route') && screen.includes('RouteItemCard') && screen.includes('validationImpact'), 'evidence route');
expect('G07 shows validation handoff gates', screen.includes('Validation Handoff') && screen.includes('validationGateResults') && screen.includes('missingCitationIds'), 'validation handoff');
expect('G07 shows reviewer handoff remediation', screen.includes('Reviewer Handoff') && screen.includes('RemediationCard') && screen.includes('openBlockingRemediationCount'), 'reviewer handoff');
expect('G07 shows bounded graph/vault IDs', screen.includes('resolvedGraphNodeCount') && screen.includes('resolvedGraphEdgeCount') && screen.includes('resolvedVaultPackCount'), 'bounded graph proof');
expect('G07 shows public blocked state', screen.includes('Public release blocked') && screen.includes('publicBoundary.publicRouteExposed') && screen.includes('publicSafeCandidateCount'), 'public boundary');
expect('G07 uses responsive flex layouts', screen.includes('flexWrap') && screen.includes('flexBasis') && screen.includes('minWidth: 0'), 'responsive layout');
expect('Internal nav links CP24 screen', nav.includes("['CP24', '/graph-aware-retrieval']"), 'nav link');
expect('No public route is introduced by G07', !screen.includes('/api/public') && !nav.includes('/public/graph-aware-retrieval'), 'no public route');
expect('No env file path access introduced', !/['"]\.env/.test(`${screen}\n${nav}\n${api}`), 'no .env file access');

for (const term of [
  '# CP24-G07 - Internal UI Prototype',
  'Status: Complete',
  'Internal Route',
  'Visible Panels',
  'Private Boundary',
  'Layout Proof',
  'Verification',
  'Status: complete',
]) {
  expect(`G07 doc includes: ${term}`, g07Doc.includes(term), term);
}

const sprintHasG07Complete = sprintPlan.includes('Status: CP24-G07 complete; CP24-G08 pending');
const sprintHasG08Complete = sprintPlan.includes('Status: CP24-G08 complete; CP24-G09 pending');
const sprintHasCp24Complete = sprintPlan.includes('Status: CP24 complete; recommended next scope CP25');
expect('Sprint plan is at or beyond G07 complete', sprintHasG07Complete || sprintHasG08Complete || sprintHasCp24Complete, sprintHasCp24Complete ? 'CP24 complete' : sprintHasG08Complete ? 'G08 complete' : 'G07 complete');
expect('Sprint plan points to G07 report', sprintPlan.includes('CP24_G07_INTERNAL_UI_PROTOTYPE.md'), 'G07 report linked');
const checklistHasG07Complete = checklist.includes('Status: CP24-G07 complete; CP24-G08 pending');
const checklistHasG08Complete = checklist.includes('Status: CP24-G08 complete; CP24-G09 pending');
const checklistHasCp24Complete = checklist.includes('Status: CP24 complete; recommended next scope CP25');
expect('Checklist is at or beyond G07 complete', checklistHasG07Complete || checklistHasG08Complete || checklistHasCp24Complete, checklistHasCp24Complete ? 'CP24 complete' : checklistHasG08Complete ? 'G08 complete' : 'G07 complete');
expect('Checklist G07 rows pass', ['CP24-G07-01', 'CP24-G07-02', 'CP24-G07-03', 'CP24-G07-04', 'CP24-G07-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'G07 rows pass');
expect('Checklist includes a valid post-G07 next action', checklist.includes('Start `CP24-G08 - Combined Verification`') || checklist.includes('Start `CP24-G09 - Close-Out And Next Scope Decision`') || checklist.includes('Start `CP25 - Reviewer Workbench Action Workflow`'), checklistHasCp24Complete ? 'CP25 next' : checklistHasG08Complete ? 'G09 next' : 'G08 next');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP24-G07 internal UI prototype verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP24-G07 internal UI prototype verification passed.');
