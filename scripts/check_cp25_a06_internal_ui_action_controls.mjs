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

runNodeScript('scripts/check_cp25_a05_private_api_prototype.mjs');

const reviewWorkbench = readText('apps/mobile/app/review-workbench.tsx');
const mobileApi = readText('apps/mobile/src/services/privateContentApi.ts');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP25_A06_INTERNAL_UI_ACTION_CONTROLS.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_ACCEPTANCE_CHECKLIST.md');

expect('Internal workbench imports CP25 shared contracts', ['PrivateCp25ReviewerAction', 'PrivateCp25ReviewerActionResponse', 'PrivateCp25ReviewQueueItem', 'PrivateCp25WorkbenchStateResponse'].every((term) => reviewWorkbench.includes(term)), 'CP25 types');
expect('Internal workbench imports TextInput for required notes', reviewWorkbench.includes('TextInput'), 'TextInput');
expect('Internal workbench calls private CP25 API helpers', reviewWorkbench.includes('getReviewerWorkbenchCp25') && reviewWorkbench.includes('createReviewerWorkbenchCp25Action'), 'private API helpers');
expect('Private API helpers target private CP25 routes', mobileApi.includes('/api/private-content/reviewer-workbench/cp25') && mobileApi.includes('/api/private-content/reviewer-workbench/cp25/actions'), 'private routes');
expect('No public CP25 route exists in mobile client or UI', !`${reviewWorkbench}\n${mobileApi}`.includes('/api/public') && !`${reviewWorkbench}\n${mobileApi}`.includes('/public-content/reviewer-workbench/cp25'), 'no public route');

expect('Private mode ribbon remains visible', reviewWorkbench.includes('PrivateModeRibbon') && reviewWorkbench.includes('<PrivateModeRibbon'), 'private ribbon');
expect('CP25 reviewer action section is visible', reviewWorkbench.includes('CP25 Reviewer Actions') && reviewWorkbench.includes('Private action workflow'), 'A06 section');
expect('Queue item selector exists', reviewWorkbench.includes('function Cp25QueueCard') && reviewWorkbench.includes('selectedCp25QueueItemId') && reviewWorkbench.includes('selectCp25QueueItem'), 'queue card selector');
expect('Action selector exists', reviewWorkbench.includes('ACTION_LABELS') && reviewWorkbench.includes('actionGrid') && reviewWorkbench.includes('onActionChange'), 'action selector');
expect('Required notes field is enforced', reviewWorkbench.includes('notesRequired') && reviewWorkbench.includes('Missing notes') && reviewWorkbench.includes('notes.trim().length === 0') && reviewWorkbench.includes('disabled={notesMissing || submitting}'), 'notes enforcement');
expect('Role and status display exists', reviewWorkbench.includes('Current status') && reviewWorkbench.includes('selectedQueueItem.assignedRole') && reviewWorkbench.includes('reviewerRole: selectedCp25QueueItem.assignedRole'), 'role/status');
expect('Remediation state display exists', reviewWorkbench.includes('remediationState') && reviewWorkbench.includes('Blocking') && reviewWorkbench.includes('blockingStatus'), 'remediation state');
expect('Audit preview is visible after action preview', reviewWorkbench.includes('Preview audit event') && reviewWorkbench.includes('Audit preview') && reviewWorkbench.includes('actionResult.auditEvent.auditEventId'), 'audit preview');
expect('Public boundary warning remains visible', reviewWorkbench.includes('Public release blocked') && reviewWorkbench.includes('cp25Payload.publicBoundary.message') && reviewWorkbench.includes('Public approved'), 'public boundary visible');
expect('Action request keeps public release false', reviewWorkbench.includes('boundaryAcknowledgement') && reviewWorkbench.includes('privateOnly: true') && reviewWorkbench.includes('publicReleaseApproved: false') && reviewWorkbench.includes('publicSafeChangeRequested: false'), 'boundary acknowledgement');
expect('UI keeps bounded selected refs', ['affectedSourceIds', 'affectedGraphNodeIds', 'affectedGraphEdgeIds', 'affectedVaultPackIds', 'affectedEvidenceRouteIds', 'affectedRouteItemIds', 'affectedCandidateIds', 'affectedRemediationIds'].every((term) => reviewWorkbench.includes(term)), 'bounded refs');

for (const term of [
  '# CP25-A06 - Internal UI Action Controls',
  'Status: Complete',
  'action selector',
  'required notes field',
  'audit preview',
  'public-release blocked',
  'node scripts\\check_cp25_a06_internal_ui_action_controls.mjs',
  'corepack pnpm build:mobile:web',
]) {
  expect(`A06 report includes ${term}`, report.includes(term), term);
}

expect('Sprint plan marks A06 complete or later', sprintPlan.includes('Status: CP25-A06 complete; CP25-A07 pending') || sprintPlan.includes('Status: CP25-A07 complete; CP25-A08 pending') || sprintPlan.includes('Status: CP25-A08 complete; CP25-A09 pending') || sprintPlan.includes('Status: CP25 complete; recommended next scope CP26'), 'sprint status');
expect('Sprint plan points to A06 report', sprintPlan.includes('CP25_A06_INTERNAL_UI_ACTION_CONTROLS.md'), 'A06 linked');
expect('Sprint plan recommends A07 through CP26 next', sprintPlan.includes('CP25-A07 - Audit Export And Remediation Review Proof') || sprintPlan.includes('CP25-A08 - Combined Verification') || sprintPlan.includes('CP25-A09 - Close-Out And Next Scope Decision') || sprintPlan.includes('CP26 - Live Snapshot Export And Refresh'), 'next checkpoint');
expect('Checklist marks A06 complete or later', checklist.includes('Status: CP25-A06 complete; CP25-A07 pending') || checklist.includes('Status: CP25-A07 complete; CP25-A08 pending') || checklist.includes('Status: CP25-A08 complete; CP25-A09 pending') || checklist.includes('Status: CP25 complete; recommended next scope CP26'), 'checklist status');
expect('Checklist A06 rows pass', ['CP25-A06-01', 'CP25-A06-02', 'CP25-A06-03', 'CP25-A06-04', 'CP25-A06-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'A06 rows pass');
expect('Checklist recommends A07 through CP26 next', checklist.includes('Start `CP25-A07 - Audit Export And Remediation Review Proof`') || checklist.includes('Start `CP25-A08 - Combined Verification`') || checklist.includes('Start `CP25-A09 - Close-Out And Next Scope Decision`') || checklist.includes('Start `CP26 - Live Snapshot Export And Refresh`'), 'next checkpoint');
expect('No env file path access introduced', !/['"]\.env/.test(`${reviewWorkbench}\n${mobileApi}\n${report}\n${sprintPlan}\n${checklist}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP25-A06 internal UI action controls verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP25-A06 internal UI action controls verification passed.');
