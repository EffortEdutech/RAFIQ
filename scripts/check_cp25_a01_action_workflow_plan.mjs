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

function readText(filePath) {
  if (!existsSync(filePath)) {
    fail(`File exists: ${filePath}`, 'Missing.');
    return '';
  }
  pass(`File exists: ${filePath}`, 'Found.');
  return readFileSync(filePath, 'utf8');
}

function readJson(filePath) {
  const text = readText(filePath);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`Parse JSON: ${filePath}`, error instanceof Error ? error.message : String(error));
    return null;
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

runNodeScript('scripts/check_cp24_close_out.mjs');

const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_ACCEPTANCE_CHECKLIST.md');
const a01Doc = readText('docs/09_sprints/resource_audit_import_prototype/CP25_A01_ACTION_WORKFLOW_ARCHITECTURE_AND_CASE_MATRIX.md');
const cp23Reviewer = readText('docs/09_sprints/resource_audit_import_prototype/CP23_A04_REVIEWER_WORKFLOW_CONTRACT.md');
const handoff = readJson('data/retrieval/cp24/validation-handoff.json');

expect('A01 report records complete status', a01Doc.includes('Status: Complete') && a01Doc.includes('Status: complete'), 'complete status');
expect('A01 preserves private-only boundary', a01Doc.includes('CP25-A01 does not implement API, UI, database, or persistence changes') && a01Doc.includes('Public publication remains outside CP25'), 'private-only/no publication');
expect('A01 includes workflow architecture', a01Doc.includes('Case intake') && a01Doc.includes('Decision routing') && a01Doc.includes('Boundary verification'), 'workflow stages');
expect('A01 includes role matrix', ['technical_reviewer', 'knowledge_editor', 'scholar_reviewer', 'product_owner', 'admin', 'developer_private'].every((term) => a01Doc.includes(term)), 'roles');
expect('A01 includes action matrix', ['claim', 'request_technical_review', 'request_content_review', 'request_scholar_review', 'request_product_owner_review', 'request_remediation', 'approve_private', 'mark_public_candidate', 'reject', 'defer', 'retire'].every((term) => a01Doc.includes(`\`${term}\``)), 'actions');
expect('A01 includes state transition matrix', ['queued', 'in_review', 'technical_review', 'content_review', 'scholar_review', 'product_owner_review', 'remediation_required', 'resolved_private', 'approved_public_candidate', 'rejected', 'deferred', 'retired'].every((term) => a01Doc.includes(`\`${term}\``)), 'statuses');
expect('A01 requires notes for sensitive actions', a01Doc.includes('Notes are required') && a01Doc.includes('severity is `high` or `critical`') && a01Doc.includes('case includes escalation evidence'), 'notes policy');
expect('A01 includes CP24 fixture case matrix', (handoff?.routes ?? []).every((route) => a01Doc.includes(route.fixtureId)), '10 fixtures represented');
expect('A01 includes remediation state model', ['open', 'assigned', 'in_progress', 'blocked', 'resolved_private', 'deferred', 'rejected', 'retired'].every((term) => a01Doc.includes(`\`${term}\``)), 'remediation states');
expect('A01 includes audit event requirements', a01Doc.includes('Every reviewer action must create an audit event') && a01Doc.includes('public release approved flag set to false'), 'audit requirements');
expect('A01 includes public boundary rules', a01Doc.includes('CP25 actions cannot') && a01Doc.includes('mark a graph node public-safe') && a01Doc.includes('convert `approved_public_candidate` into release approval'), 'public boundary');
expect('A01 includes rollback and verifier plan', a01Doc.includes('Rollback Plan') && a01Doc.includes('Verifier Plan') && a01Doc.includes('node scripts\\check_cp24_close_out.mjs'), 'rollback/verifier');

expect('CP24 handoff counts match A01 baseline', handoff?.summary?.evidenceRouteCount === 10 && handoff?.summary?.selectedRouteItemCount === 15 && handoff?.summary?.rejectedRouteItemCount === 59 && handoff?.summary?.escalationRouteItemCount === 13 && handoff?.summary?.remediationCount === 72 && handoff?.summary?.highOrCriticalRemediationCount === 18 && handoff?.summary?.publicSafeRouteItemCount === 0, JSON.stringify(handoff?.summary));
expect('A01 baseline records CP24 counts', ['CP24 fixtures | 10', 'Evidence routes | 10', 'Selected route items | 15', 'Review/rejected route items | 59', 'Escalation route items | 13', 'Remediation items | 72', 'High/critical remediation items | 18', 'Public-safe route items | 0'].every((term) => a01Doc.includes(term)), 'baseline table');
expect('A01 keeps approved_public_candidate non-release', a01Doc.includes('`approved_public_candidate` is not public release') && a01Doc.includes('mark_public_candidate') && a01Doc.includes('Candidate for later release-gate simulation only'), 'public candidate boundary');
expect('A01 aligns with CP23 reviewer contract', cp23Reviewer.includes('Every reviewer action must create an audit event') && cp23Reviewer.includes('No action publishes content') && cp23Reviewer.includes('State Transition Rules'), 'CP23 contract baseline');
expect('No env file path access introduced', !/['"]\.env/.test(`${sprintPlan}\n${checklist}\n${a01Doc}`), 'no .env path');

const sprintHasA01Complete = sprintPlan.includes('Status: CP25-A01 complete; CP25-A02 pending');
const sprintHasA02Complete = sprintPlan.includes('Status: CP25-A02 complete; CP25-A03 pending');
const sprintHasA03Complete = sprintPlan.includes('Status: CP25-A03 complete; CP25-A04 pending');
const sprintHasA04Complete = sprintPlan.includes('Status: CP25-A04 complete; CP25-A05 pending');
const sprintHasA05Complete = sprintPlan.includes('Status: CP25-A05 complete; CP25-A06 pending');
const sprintHasA06Complete = sprintPlan.includes('Status: CP25-A06 complete; CP25-A07 pending');
const sprintHasA07Complete = sprintPlan.includes('Status: CP25-A07 complete; CP25-A08 pending');
const sprintHasA08Complete = sprintPlan.includes('Status: CP25-A08 complete; CP25-A09 pending');
const sprintHasCp25Complete = sprintPlan.includes('Status: CP25 complete; recommended next scope CP26');
expect('Sprint plan is at or beyond A01 complete', sprintHasA01Complete || sprintHasA02Complete || sprintHasA03Complete || sprintHasA04Complete || sprintHasA05Complete || sprintHasA06Complete || sprintHasA07Complete || sprintHasA08Complete || sprintHasCp25Complete, sprintHasCp25Complete ? 'CP25 complete' : sprintHasA08Complete ? 'A08 complete' : sprintHasA07Complete ? 'A07 complete' : sprintHasA06Complete ? 'A06 complete' : sprintHasA05Complete ? 'A05 complete' : sprintHasA04Complete ? 'A04 complete' : sprintHasA03Complete ? 'A03 complete' : sprintHasA02Complete ? 'A02 complete' : 'A01 complete');
expect('Sprint plan points to A01 report', sprintPlan.includes('CP25_A01_ACTION_WORKFLOW_ARCHITECTURE_AND_CASE_MATRIX.md'), 'A01 linked');
expect('Sprint plan includes A02 checkpoint', sprintPlan.includes('CP25-A02 - Request, Response, And State Contracts'), 'A02 checkpoint');
const checklistHasA01Complete = checklist.includes('Status: CP25-A01 complete; CP25-A02 pending');
const checklistHasA02Complete = checklist.includes('Status: CP25-A02 complete; CP25-A03 pending');
const checklistHasA03Complete = checklist.includes('Status: CP25-A03 complete; CP25-A04 pending');
const checklistHasA04Complete = checklist.includes('Status: CP25-A04 complete; CP25-A05 pending');
const checklistHasA05Complete = checklist.includes('Status: CP25-A05 complete; CP25-A06 pending');
const checklistHasA06Complete = checklist.includes('Status: CP25-A06 complete; CP25-A07 pending');
const checklistHasA07Complete = checklist.includes('Status: CP25-A07 complete; CP25-A08 pending');
const checklistHasA08Complete = checklist.includes('Status: CP25-A08 complete; CP25-A09 pending');
const checklistHasCp25Complete = checklist.includes('Status: CP25 complete; recommended next scope CP26');
expect('Checklist is at or beyond A01 complete', checklistHasA01Complete || checklistHasA02Complete || checklistHasA03Complete || checklistHasA04Complete || checklistHasA05Complete || checklistHasA06Complete || checklistHasA07Complete || checklistHasA08Complete || checklistHasCp25Complete, checklistHasCp25Complete ? 'CP25 complete' : checklistHasA08Complete ? 'A08 complete' : checklistHasA07Complete ? 'A07 complete' : checklistHasA06Complete ? 'A06 complete' : checklistHasA05Complete ? 'A05 complete' : checklistHasA04Complete ? 'A04 complete' : checklistHasA03Complete ? 'A03 complete' : checklistHasA02Complete ? 'A02 complete' : 'A01 complete');
expect('Checklist A01 rows pass', ['CP25-A01-01', 'CP25-A01-02', 'CP25-A01-03', 'CP25-A01-04', 'CP25-A01-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'A01 rows pass');
expect(
  'Checklist includes a valid post-A01 next action',
  checklist.includes('Start `CP25-A02 - Request, Response, And State Contracts`') ||
    checklist.includes('Start `CP25-A03 - Review Queue And Remediation State Export`') ||
    checklist.includes('Start `CP25-A04 - Audit Event And Decision Ledger`') ||
    checklist.includes('Start `CP25-A05 - Private API Prototype`') ||
    checklist.includes('Start `CP25-A06 - Internal UI Action Controls`') ||
    checklist.includes('Start `CP25-A07 - Audit Export And Remediation Review Proof`') ||
    checklist.includes('Start `CP25-A08 - Combined Verification`') ||
    checklist.includes('Start `CP25-A09 - Close-Out And Next Scope Decision`') ||
    checklist.includes('Start `CP26 - Live Snapshot Export And Refresh`'),
  checklistHasCp25Complete ? 'CP26 next' : checklistHasA08Complete ? 'A09 next' : checklistHasA07Complete ? 'A08 next' : checklistHasA06Complete ? 'A07 next' : checklistHasA05Complete ? 'A06 next' : checklistHasA04Complete ? 'A05 next' : checklistHasA03Complete ? 'A04 next' : checklistHasA02Complete ? 'A03 next' : 'A02 next',
);

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP25-A01 action workflow planning verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP25-A01 action workflow planning verification passed.');
