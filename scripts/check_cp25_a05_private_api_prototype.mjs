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
    fail(`Parse JSON: ${filePath}`, error.message);
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

runNodeScript('scripts/check_cp25_a04_audit_decision_ledger.mjs');

const controller = readText('apps/api/src/modules/private-content/private-content.controller.ts');
const service = readText('apps/api/src/modules/private-content/private-content.service.ts');
const dto = readText('apps/api/src/modules/private-content/private-content.dto.ts');
const openapi = readText('apps/api/src/modules/private-content/private-content.openapi.ts');
const mobileApi = readText('apps/mobile/src/services/privateContentApi.ts');
const shared = readText('packages/shared/src/private-content.ts');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP25_A05_PRIVATE_API_PROTOTYPE.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_ACCEPTANCE_CHECKLIST.md');
const manifest = readJson('data/review/cp25/audit-decision-ledger-manifest.json');

expect('Controller imports CP25 shared response types', controller.includes('PrivateCp25ReviewerActionResponse') && controller.includes('PrivateCp25WorkbenchStateResponse'), 'controller types');
expect('Controller imports CP25 request DTO and OpenAPI DTOs', controller.includes('PrivateCp25ReviewerActionRequestDto') && controller.includes('PrivateCp25ReviewerActionResponseDto') && controller.includes('PrivateCp25WorkbenchStateResponseDto'), 'controller DTOs');
expect('Private CP25 workbench GET route exists', controller.includes("@Get('reviewer-workbench/cp25')") && controller.includes("route: 'GET /api/private-content/reviewer-workbench/cp25'") === false, 'GET route');
expect('Private CP25 action POST route exists', controller.includes("@Post('reviewer-workbench/cp25/actions')") && controller.includes('createReviewerWorkbenchCp25Action'), 'POST route');
expect('No public CP25 controller route is introduced', !controller.includes("@Controller('public") && !controller.includes('/api/public') && !controller.includes("@Get('public") && !controller.includes("@Post('public"), 'no public route');

expect('DTO validates CP25 action request target and action', dto.includes('PrivateCp25ReviewerActionRequestDto') && dto.includes('queueItemId') && dto.includes('subjectType') && dto.includes('subjectId') && dto.includes('action') && dto.includes('fromStatus') && dto.includes('reviewerRole'), 'request fields');
expect('DTO validates CP25 affected refs', ['affectedSourceIds', 'affectedGraphNodeIds', 'affectedGraphEdgeIds', 'affectedVaultPackIds', 'affectedEvidenceRouteIds', 'affectedRouteItemIds', 'affectedCandidateIds', 'affectedRemediationIds'].every((term) => dto.includes(term)), 'affected refs');
expect('DTO includes boundary acknowledgement false fields', dto.includes('PrivateCp25BoundaryAcknowledgementDto') && dto.includes('privateOnly') && dto.includes('publicReleaseApproved') && dto.includes('publicSafeChangeRequested'), 'boundary DTO');

expect('OpenAPI documents CP25 private responses', openapi.includes('PrivateCp25WorkbenchStateResponseDto') && openapi.includes('PrivateCp25ReviewerActionResponseDto') && openapi.includes('GET /api/private-content/reviewer-workbench/cp25') && openapi.includes('POST /api/private-content/reviewer-workbench/cp25/actions'), 'OpenAPI DTOs');

expect('Service imports CP25 shared contracts', service.includes('PrivateCp25ReviewerActionRequest') && service.includes('PrivateCp25ReviewerActionResponse') && service.includes('PrivateCp25WorkbenchStateResponse'), 'service CP25 imports');
expect('Service reads CP25 generated artifacts', ['CP25_REVIEW_QUEUE_PATH', 'CP25_REMEDIATION_STATE_PATH', 'CP25_AUDIT_EVENTS_PATH', 'CP25_AUDIT_LEDGER_MANIFEST_PATH', 'CP25_TRANSITION_RULES_PATH'].every((term) => service.includes(term)), 'artifact paths');
expect('Service implements CP25 workbench state route contract', service.includes('async getReviewerWorkbenchCp25') && service.includes("checkpoint: 'CP25-A05'") && service.includes("route: 'GET /api/private-content/reviewer-workbench/cp25'"), 'GET service');
expect('Service implements CP25 action route contract', service.includes('async createReviewerWorkbenchCp25Action') && service.includes("route: 'POST /api/private-content/reviewer-workbench/cp25/actions'"), 'POST service');
expect('Service validates transitions and required notes', service.includes('cp25ValidateReviewerAction') && service.includes('transitionRules.allowedTransitions') && service.includes('missingRequiredNotes') && service.includes('invalidTransition'), 'validation logic');
expect('Service rejects unknown targets safely', service.includes('Unknown CP25 queueItemId') && service.includes('remediationId does not belong'), 'safe target failures');
expect('Service blocks public release and public-safe mutation', service.includes('publicReleaseApproved: false') && service.includes('publicSafeChangeRequested: false') && service.includes('Public-safe change requests are outside CP25') && service.includes('Public release approval is outside CP25'), 'public boundary');
expect('Service returns audit preview without persistence', service.includes('cp25-a05-audit-preview') && service.includes('auditEvent') && !service.includes('writeFile'), 'audit preview');

expect('Mobile client exposes CP25 helpers', mobileApi.includes('getReviewerWorkbenchCp25') && mobileApi.includes('createReviewerWorkbenchCp25Action'), 'mobile helpers');
expect('Mobile client targets private CP25 routes', mobileApi.includes('/api/private-content/reviewer-workbench/cp25') && mobileApi.includes('/api/private-content/reviewer-workbench/cp25/actions'), 'mobile private routes');
expect('Mobile client imports CP25 shared response/request types', mobileApi.includes('PrivateCp25ReviewerActionRequest') && mobileApi.includes('PrivateCp25ReviewerActionResponse') && mobileApi.includes('PrivateCp25WorkbenchStateResponse'), 'mobile types');

expect('Shared CP25 routes remain private contracts', shared.includes("route: 'POST /api/private-content/reviewer-workbench/cp25/actions'") && shared.includes("route: 'GET /api/private-content/reviewer-workbench/cp25'"), 'shared routes');
expect('A04 manifest public-safe counts remain zero', manifest?.counts?.publicSafeCandidateCount === 0 && manifest?.counts?.publicSafeRouteItemCount === 0 && manifest?.publicReleaseApproved === false, 'manifest boundary');

for (const term of [
  '# CP25-A05 - Private API Prototype',
  'Status: Complete',
  '/api/private-content/reviewer-workbench/cp25',
  '/api/private-content/reviewer-workbench/cp25/actions',
  'No public route was introduced',
  'Invalid actions fail safely',
  'public-safe counts remain zero',
  'node scripts\\check_cp25_a05_private_api_prototype.mjs',
]) {
  expect(`A05 report includes ${term}`, report.includes(term), term);
}

expect('Sprint plan marks A05 complete or later', sprintPlan.includes('Status: CP25-A05 complete; CP25-A06 pending') || sprintPlan.includes('Status: CP25-A06 complete; CP25-A07 pending') || sprintPlan.includes('Status: CP25-A07 complete; CP25-A08 pending') || sprintPlan.includes('Status: CP25-A08 complete; CP25-A09 pending') || sprintPlan.includes('Status: CP25 complete; recommended next scope CP26'), 'sprint status');
expect('Checklist marks A05 complete or later', checklist.includes('Status: CP25-A05 complete; CP25-A06 pending') || checklist.includes('Status: CP25-A06 complete; CP25-A07 pending') || checklist.includes('Status: CP25-A07 complete; CP25-A08 pending') || checklist.includes('Status: CP25-A08 complete; CP25-A09 pending') || checklist.includes('Status: CP25 complete; recommended next scope CP26'), 'checklist status');
expect('Checklist A05 rows pass', ['CP25-A05-01', 'CP25-A05-02', 'CP25-A05-03', 'CP25-A05-04', 'CP25-A05-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'A05 rows pass');
expect('Checklist recommends A06 through CP26 next', checklist.includes('Start `CP25-A06 - Internal UI Action Controls`') || checklist.includes('Start `CP25-A07 - Audit Export And Remediation Review Proof`') || checklist.includes('Start `CP25-A08 - Combined Verification`') || checklist.includes('Start `CP25-A09 - Close-Out And Next Scope Decision`') || checklist.includes('Start `CP26 - Live Snapshot Export And Refresh`'), 'next checkpoint');
expect('No env file path access introduced', !/['"]\.env/.test(`${controller}\n${service}\n${dto}\n${openapi}\n${mobileApi}\n${report}\n${sprintPlan}\n${checklist}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP25-A05 private API prototype verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP25-A05 private API prototype verification passed.');
