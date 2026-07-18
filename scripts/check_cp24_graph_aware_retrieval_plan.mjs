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
    fail(`Run ${scriptPath}`, result.stdout + result.stderr);
  }
}

runNodeScript('scripts/check_cp23_close_out.mjs');

const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_ACCEPTANCE_CHECKLIST.md');
const cp23CloseOut = readText('docs/09_sprints/resource_audit_import_prototype/CP23_A10_CLOSE_OUT_AND_NEXT_SCOPE_DECISION_REPORT.md');
const cp23RetrievalContract = readText('docs/09_sprints/resource_audit_import_prototype/CP23_A02_GRAPH_AWARE_RETRIEVAL_CONTRACT.md');
const cp23EvidenceContract = readText('docs/09_sprints/resource_audit_import_prototype/CP23_A03_EVIDENCE_ROUTE_AND_VALIDATION_CONTRACT.md');
const cp23ReviewerContract = readText('docs/09_sprints/resource_audit_import_prototype/CP23_A04_REVIEWER_WORKFLOW_CONTRACT.md');

expect('CP24 sprint plan title exists', sprintPlan.includes('# CP24 - Graph-Aware Retrieval Prototype Sprint Plan'), 'CP24 sprint plan');
expect('CP24 checklist title exists', checklist.includes('# CP24 - Graph-Aware Retrieval Prototype Acceptance Checklist'), 'CP24 checklist');
expect('CP23 close-out selects CP24', cp23CloseOut.includes('Recommended next scope: CP24 - Graph-Aware Retrieval Prototype'), 'CP24 selected');
expect('CP24 inherits CP23 close-out gate', sprintPlan.includes('node scripts\\check_cp23_close_out.mjs') && checklist.includes('node scripts\\check_cp23_close_out.mjs'), 'CP23 close-out inherited');
expect('CP24 preserves private boundary', sprintPlan.includes('CP24 does not approve public release') && sprintPlan.includes('Public answer surfaces must not use CP24 private graph evidence'), 'private boundary');
expect('CP24 records CP22 counts', sprintPlan.includes('79,657') && sprintPlan.includes('147,689') && sprintPlan.includes('158'), 'CP22 counts');
expect('CP24 records public-safe zero state', sprintPlan.includes('CP22 public-safe graph nodes: 0') && sprintPlan.includes('CP22 public-safe vault artifacts: 0'), 'public-safe zero');
expect('CP24 has nine checkpoints', ['CP24-G01', 'CP24-G02', 'CP24-G03', 'CP24-G04', 'CP24-G05', 'CP24-G06', 'CP24-G07', 'CP24-G08', 'CP24-G09'].every((id) => sprintPlan.includes(id) && checklist.includes(id)), 'G01-G09');
const hasInitialPlanningStatus = checklist.includes('Status: CP24 planned; CP24-G01 pending');
const hasG01CompleteStatus = checklist.includes('Status: CP24-G01 complete; CP24-G02 pending');
const hasG02CompleteStatus = checklist.includes('Status: CP24-G02 complete; CP24-G03 pending');
const hasG03CompleteStatus = checklist.includes('Status: CP24-G03 complete; CP24-G04 pending');
const hasG04CompleteStatus = checklist.includes('Status: CP24-G04 complete; CP24-G05 pending');
const hasG05CompleteStatus = checklist.includes('Status: CP24-G05 complete; CP24-G06 pending');
const hasG06CompleteStatus = checklist.includes('Status: CP24-G06 complete; CP24-G07 pending');
const hasG07CompleteStatus = checklist.includes('Status: CP24-G07 complete; CP24-G08 pending');
const hasG08CompleteStatus = checklist.includes('Status: CP24-G08 complete; CP24-G09 pending');
const hasCp24CompleteStatus = checklist.includes('Status: CP24 complete; recommended next scope CP25');
expect(
  'CP24 checklist has valid planning status',
  hasInitialPlanningStatus || hasG01CompleteStatus || hasG02CompleteStatus || hasG03CompleteStatus || hasG04CompleteStatus || hasG05CompleteStatus || hasG06CompleteStatus || hasG07CompleteStatus || hasG08CompleteStatus || hasCp24CompleteStatus,
  hasCp24CompleteStatus ? 'CP24 complete' : hasG08CompleteStatus ? 'G08 complete' : hasG07CompleteStatus ? 'G07 complete' : hasG06CompleteStatus ? 'G06 complete' : hasG05CompleteStatus ? 'G05 complete' : hasG04CompleteStatus ? 'G04 complete' : hasG03CompleteStatus ? 'G03 complete' : hasG02CompleteStatus ? 'G02 complete' : hasG01CompleteStatus ? 'G01 complete' : 'G01 pending',
);
expect(
  'CP24 recommends the correct next checkpoint',
  sprintPlan.includes('CP24-G01 - Retrieval Prototype Architecture And Fixture Plan') &&
    (checklist.includes('Start `CP24-G01 - Retrieval Prototype Architecture And Fixture Plan`') ||
      checklist.includes('Start `CP24-G02 - Request And Response Contracts`') ||
      checklist.includes('Start `CP24-G03 - Candidate Retrieval And Graph Expansion`') ||
      checklist.includes('Start `CP24-G04 - Ranking, Explanation, And Selection`') ||
      checklist.includes('Start `CP24-G05 - Evidence Route And Validation Handoff`') ||
      checklist.includes('Start `CP24-G06 - Private API Prototype`') ||
      checklist.includes('Start `CP24-G07 - Internal UI Prototype`') ||
      checklist.includes('Start `CP24-G08 - Combined Verification`') ||
      checklist.includes('Start `CP24-G09 - Close-Out And Next Scope Decision`') ||
      checklist.includes('Start `CP25 - Reviewer Workbench Action Workflow`')),
  hasCp24CompleteStatus ? 'CP25 next' : hasG08CompleteStatus ? 'G09 next' : hasG07CompleteStatus ? 'G08 next' : hasG06CompleteStatus ? 'G07 next' : hasG05CompleteStatus ? 'G06 next' : hasG04CompleteStatus ? 'G05 next' : hasG03CompleteStatus ? 'G04 next' : hasG02CompleteStatus ? 'G03 next' : hasG01CompleteStatus ? 'G02 next' : 'G01 first',
);
expect('CP24 covers implementation surfaces', sprintPlan.includes('packages/shared/src/private-content.ts') && sprintPlan.includes('apps/api/src/modules/private-content/private-content.service.ts') && sprintPlan.includes('apps/mobile/src/services/privateContentApi.ts'), 'implementation surfaces');
expect('CP24 covers ranking and prohibited inference gate', sprintPlan.toLowerCase().includes('prohibited inference verifier') && sprintPlan.toLowerCase().includes('graph centrality is not treated as authenticity'), 'ranking boundary');
expect('CP24 covers validation and reviewer handoff', sprintPlan.toLowerCase().includes('validation linkage') && sprintPlan.toLowerCase().includes('reviewer handoff'), 'validation/reviewer handoff');
expect('CP24 covers public route negative check', sprintPlan.includes('no public route exposes CP24 private retrieval data') && checklist.includes('No public CP24 route is introduced'), 'public route negative check');
expect('CP23 retrieval contract remains complete', cp23RetrievalContract.includes('Status: complete') && cp23RetrievalContract.includes('Prohibited Inferences'), 'CP23 retrieval contract');
expect('CP23 evidence route contract remains complete', cp23EvidenceContract.includes('Status: complete') && cp23EvidenceContract.includes('Evidence routes are private artifacts by default'), 'CP23 evidence contract');
expect('CP23 reviewer contract remains complete', cp23ReviewerContract.includes('Status: complete') && cp23ReviewerContract.includes('No action publishes content'), 'CP23 reviewer contract');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP24 graph-aware retrieval planning verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP24 graph-aware retrieval planning verification passed.');
